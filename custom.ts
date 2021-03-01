

namespace functional{
    
    //% block
    export function connect(){
        while (true){
            let initialRead = pins.i2cReadBuffer(93, 1).toHex()
            if (initialRead != '00'){
                console.log('GO')
                pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
                pause(10)
                let mybuff = Buffer.fromHex('0c')
                pins.i2cWriteBuffer(93, mybuff)
                pause(10)
                break
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
            let a = Buffer.fromArray([1, p, q, s]);
            console.log("a = " + a.toHex())
            if (d != null){
                let b = Buffer.fromArray([Math.round(d)]);
                a = Buffer.concat([a,b]);
            }
            if (f != null){
                let b = Buffer.fromArray([Math.round(f)]);
                a = Buffer.concat([a,b]);
            }         
            try{
                pins.i2cWriteBuffer(93, a)
                let e = Buffer.fromArray([0,c])
                console.log("e = " + e.toHex())
                pins.i2cWriteBuffer(93, e)
                c = 0x01
                while ( c != 0x00){
                    let b = Buffer.fromArray([0x00])
                    pins.i2cWriteBuffer(93, b)
                    c = pins.i2cReadNumber(93, NumberFormat.Int8LE)
                    console.log(c)
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
            send(p, s)
            console.log("done")
        }

        //% block="%pin tone freq %f dur %d "
        export function tone(p: number, f: number, d: number): void{
            send_c(p, 13, 33, 0, d, f);
        }
}
