
//% weight=100 color=#0fbc11 icon=""
namespace cyberbot {
    
    //%block="pin %p"
    export function newPin(p: number): Pin{
        return new Pin(p)
    }

    export class Pin {
        pA: number;
        pB: number;

        constructor(p = 27, q = 33){
            this.pA = p;
            this.pB = q;
        }

        private botDisable(): void{
            pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
            basic.pause(200);
            control.reset();
        }

        private send_c(c:number, s=0, d:any=null, f:any=null): void{
            let a = Buffer.fromArray([1, this.pA, this.pB, s]);
            if (d !== null){
                let b = Buffer.fromArray([Math.round(d)]);
                a.concat(b);
            }
            if (f !== null){
                let b = Buffer.fromArray([Math.round(f)]);
                a.concat(b);
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


    }
    
    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block
    export function foo(n: number,): void {
        // Add code here
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block
    export function fib(value: number): number {
        return value <= 1 ? value : fib(value -1) + fib(value - 2);
    }
}
