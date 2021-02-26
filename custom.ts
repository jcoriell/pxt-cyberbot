
//% weight=100 color=#0fbc11 icon=""
namespace oop {
    
    //%block="pin %p"
    export function newPin(p: number): Pin{
        return new Pin(p)
    }

    function init(){
        while (true) {​​​​​
            try {​​​​​
                pins.i2cReadBuffer(93, 1)
            }​​​​​ 
            catch (error) {​​​​​
                serial.writeLine("Error:");
                serial.writeLine(error);
                continue;
            }​​​​​
            finally {​​​​​
                pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
                basic.pause(10)
                let mybuff = Buffer.fromArray([12])
                pins.i2cWriteBuffer(93, mybuff)
                basic.pause(10)
                while (true) {​​​​​
                    try {​​​​​
                        let i2cBuffer = pins.i2cReadBuffer(93, 1,false)
                        serial.writeLine("NUMBER:")
                        serial.writeNumber(i2cBuffer.getNumber(NumberFormat.Int8LE, 0))
                    }​​​​​
                    catch (error){​​​​​
                        serial.writeLine("Error2:");
                        serial.writeLine(error);
                        continue;
                    }​​​​​
                    finally {​​​​​
                        break
                    }​​​​​
                }​​​​​
                break
            }​​​​​
        }​​​​​
    }

    export class Pin {
        pA: number;
        pB: number;

        constructor(p = 27, q = 33){
            this.pA = p;
            this.pB = q;
            init();
        }

        private botDisable(): void{
            pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
            basic.pause(200);
            control.reset();
        }

        private send_c(c:number, s=0, d:number=null, f:number=null): void{
            let a = Buffer.fromArray([1, this.pA, this.pB, s]);
            if (d !== null){
                let b = Buffer.fromArray([Math.round(d)]);
                Buffer.concat([a,b]);
                //a.concat(b);
            }
            if (f !== null){
                let b = Buffer.fromArray([Math.round(f)]);
                Buffer.concat([a,b]);
                //a.concat(b);
            }         
            try{
                pins.i2cWriteBuffer(93, a)
                let e = Buffer.fromArray([0,c])
                pins.i2cWriteBuffer(93, e)
                c = 0x01
                while ( c !== 0){
                    let b = Buffer.fromArray([0x00])
                    pins.i2cWriteBuffer(93, b)
                    c = pins.i2cReadNumber(93, NumberFormat.Int8LE)
                }
            }
            catch{
                this.botDisable()
            }

        }
        
        //% block="%pin write digital %s"
        public write_digital(s: number): void{
            if (s > 1 || s < 0){s = 4} 
            else if (s === 0){s = 2}
            this.send_c(s)
        }

        //% block="%pin tone freq %f dur %d "
        public tone(f: number, d: number): void{
            this.send_c(13, 0, d, f);
        }


    }  
}


namespace functional{
    
    //% block
    export function connect(){
        while (true) {​​​​​
            try {​​​​​
                pins.i2cReadBuffer(93, 1)
            }​​​​​ 
            catch (error) {​​​​​
                serial.writeLine("Error:");
                serial.writeLine(error);
                continue;
            }​​​​​
            finally {​​​​​
                pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
                basic.pause(10)
                let mybuff = Buffer.fromArray([12])
                pins.i2cWriteBuffer(93, mybuff)
                basic.pause(10)
                while (true) {​​​​​
                    try {​​​​​
                        let i2cBuffer = pins.i2cReadBuffer(93, 1,false)
                        serial.writeLine("NUMBER:")
                        serial.writeNumber(i2cBuffer.getNumber(NumberFormat.Int8LE, 0))
                    }​​​​​
                    catch (error){​​​​​
                        serial.writeLine("Error2:");
                        serial.writeLine(error);
                        continue;
                    }​​​​​
                    finally {​​​​​
                        break
                    }​​​​​
                }​​​​​
                break
            }​​​​​
        }​​​​​
    }

    function botDisable(): void{
            pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
            basic.pause(200);
            control.reset();
        }


    function send_c(p: number, c:number, q=33, s=0, d:number=null, f:number=null): void{
            let a = Buffer.fromArray([1, p, q, s]);
            if (d !== null){
                let b = Buffer.fromArray([Math.round(d)]);
                Buffer.concat([a,b]);
                //a.concat(b);
            }
            if (f !== null){
                let b = Buffer.fromArray([Math.round(f)]);
                Buffer.concat([a,b]);
                //a.concat(b);
            }         
            try{
                pins.i2cWriteBuffer(93, a)
                let e = Buffer.fromArray([0,c])
                pins.i2cWriteBuffer(93, e)
                c = 0x01
                while ( c !== 0){
                    let b = Buffer.fromArray([0x00])
                    pins.i2cWriteBuffer(93, b)
                    c = pins.i2cReadNumber(93, NumberFormat.Int8LE)
                }
            }
            catch{
                botDisable()
            }

        }

        //% block="%p write digital %s"
        export function write_digital(p: number, s: number): void{
            if (s > 1 || s < 0){s = 4} 
            else if (s === 0){s = 2}
            send_c(p, s)
        }
}
