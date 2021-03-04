

namespace cyberbot{

    
    //% block
    export function connect(){
        while (true) {
            if (pins.i2cReadNumber(93, NumberFormat.UInt16LE) !== 0){
                pins.digitalWritePin(DigitalPin.P8, 1)
                pause(10)
                pins.i2cWriteNumber(93, 12, NumberFormat.UInt16LE)
                pause(10)
                break
            }
        }
    }


    function botDisable(): void{
            pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
            basic.pause(200);
            control.reset();
        }


    function send_c(p: number, c:number, q=33, s=0, d:number=null, f:number=null): void{
            // build args and write
            let args = Buffer.fromArray([1, p, q, s]);
            if (d !== null){
                let duration = pins.createBuffer(4)
                duration.setNumber(NumberFormat.UInt16LE, 0, Math.round(d))
                args = Buffer.concat([args, duration]);
            }
            if (f !== null){
                let freq = pins.createBuffer(4)
                freq.setNumber(NumberFormat.UInt16LE, 0, Math.round(f))
                args = Buffer.concat([args,freq]);
            }   
            pins.i2cWriteBuffer(93, args);
            
            // build command and write
            let command = Buffer.fromArray([0,c]);
            pins.i2cWriteBuffer(93, command);

            // wait until prop is done
            let check = 1
            while ( check !== 0){
                pins.i2cWriteNumber(93, 0, NumberFormat.UInt8LE);
                check = pins.i2cReadNumber(93, NumberFormat.UInt8LE);
            }   

        }

        //% block="%p write digital %s"
        export function write_digital(p: number, s: number): void{
            if (s > 1 || s < 0){s = 4} 
            else if (s === 0){s = 2}
            send_c(p, s)
        }

        //% block="%pin tone freq %f dur %d "
        export function tone(p: number, f: number, d: number): void{
            send_c(p, 13, 33, 0, d, f);
        }
}
