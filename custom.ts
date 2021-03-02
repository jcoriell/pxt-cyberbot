

namespace functional{
    
    //% block
    export function connect(){
        while (true) {
            if (pins.i2cReadNumber(93, NumberFormat.UInt16LE) != 0) {
                pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
                pause(10)
                pins.i2cWriteNumber(93, 12, NumberFormat.UInt16LE)
                pause(10)
                while (true) {
                    if (pins.i2cReadNumber(93, NumberFormat.UInt16LE) != 0) {
                        console.log("second reading num: " + pins.i2cReadNumber(93, NumberFormat.UInt16LE))
                        console.log("second reading hex:" + pins.i2cReadBuffer(93, 8).toHex())
                        break
                    }
                }
                break
                pause(10)
            }
        }
    }

    function botDisable(): void{
            pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
            basic.pause(200);
            control.reset();
            console.log("disabled")
        }


    function send_c(p: number, c:number, q=33, s=0, d:number=null, f:number=null): void{
            let args = Buffer.fromArray([1, p, q, s]);
            console.log("args = " + args.toHex())
            if (d != null){
                let duration = pins.createBuffer(4)
                duration.setNumber(NumberFormat.UInt16LE, 0, Math.round(d))
                args = Buffer.concat([args, duration]);
            }
            if (f != null){
                let freq = pins.createBuffer(4)
                freq.setNumber(NumberFormat.UInt16LE, 0, Math.round(f))
                args = Buffer.concat([args,freq]);
            }         
            try{
                let command = pins.createBuffer(2)
                command.setNumber(NumberFormat.UInt8LE, 1, c)

                pins.i2cWriteBuffer(93, args)
                pins.i2cWriteBuffer(93, command)
                
                let check = '0001'
                while ( check != '0000'){
                    let b = Buffer.fromHex('0000')
                    pins.i2cWriteBuffer(93, b)
                    check = pins.i2cReadBuffer(93, 2).toHex()
                }
            }
            catch{
                botDisable()
            }

        }

        function send(p: number, c:number, q=33, s=0, d:number=null, f:number=null): void{
            let a = Buffer.fromArray([1, p, q, s]);
            console.log("a = " + a.toHex())
            pins.i2cWriteBuffer(93, a)

            let e = Buffer.fromArray([0,c])
            pins.i2cWriteBuffer(93, e)
            console.log(e.toHex())

            pause(10)
            
            pins.i2cWriteNumber(93, 0, NumberFormat.Int8LE)
    
        }

        //% block="%p write digital %s"
        export function write_digital(p: number, s: number): void{
            if (s > 1 || s < 0){s = 4} 
            else if (s === 0){s = 2}
            send_c(p, s)
            console.log("done")
        }

        //% block="%pin tone freq %f dur %d "
        export function tone(p: number, f: number, d: number): void{
            send_c(p, 13, 33, 0, d, f);
        }
}
