

namespace cyberbot{

    let isConnected = false;

    export function connect(){
        while (true) {
            if (pins.i2cReadNumber(93, NumberFormat.UInt16LE) !== 0){
                pins.digitalWritePin(DigitalPin.P8, 1)
                pause(10)
                pins.i2cWriteNumber(93, 12, NumberFormat.UInt16LE)
                pause(10)
                isConnected = true;
                break
            }
        }
    }


    function botDisable(): void{
            pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
            basic.pause(200);
            control.reset();
    }


    function sendCommand(pin: number, cmd:number, q=33, s=0, d:number=null, f:number=null): void{
            if (isConnected === false){
                connect()
            }
            // build args and write
            let args = Buffer.fromArray([1, pin, q, s]);
            if (d !== null){
                let duration = pins.createBuffer(4)
                duration.setNumber(NumberFormat.Int32LE, 0, Math.round(d))
                args = Buffer.concat([args, duration]);
            }
            if (f !== null){
                let freq = pins.createBuffer(4)
                freq.setNumber(NumberFormat.Int32LE, 0, Math.round(f))
                args = Buffer.concat([args,freq]);
            }   
            pins.i2cWriteBuffer(93, args);
            
            // build command and write
            pins.i2cWriteBuffer(93, Buffer.fromArray([0,cmd]));

            // wait until prop is done
            let check = 1
            while (check !== 0){
                pins.i2cWriteNumber(93, 0, NumberFormat.UInt8LE);
                check = pins.i2cReadNumber(93, NumberFormat.UInt8LE);
            }   

        }

        //% block="pin %p write digital %s"
        export function writeDigital(pin: number, cmd: number): void{
            if (cmd > 1 || cmd < 0){cmd = 4} 
            else if (cmd === 0){cmd = 2}
            sendCommand(pin, cmd)
        }

        //% block="pin %pin servo speed %velocity"
        export function servoSpeed(pin: number, velocity:number = null): void{
            let cmd = 25;
            if (velocity === null){cmd = 28};
            sendCommand(pin, cmd, 33, 0, velocity);
        }

        //% block="pin %pin tone freq %f dur %d "
        export function tone(pin: number, f: number, d: number): void{
            sendCommand(pin, 13, 33, 0, d, f);
        }
}
