
//% color=#1D75B5 weight=100 icon="\uf2db" block="cyber:bot"
//% groups='["Basic Read/Write", "Servos", "Other"]'
namespace cyberbot{

    // commands
    export const HIGH          = 1
    export const LOW           = 2
    export const INPUT         = 3
    export const TOGGLE        = 4
    //const SETDIRS       = 5
    //const GETDIRS       = 6
    //const SETSTATES     = 7
    //const GETSTATES     = 8
    //const PAUSE         = 9
    export const PULSIN        = 10
    export const PULSOUT       = 11
    export const COUNT         = 12
    export const FREQOUT       = 13
    export const RCTIME        = 16
    //const SHIFTIN       = 17
    //const SHIFTOUT      = 18
    //const SEROUT        = 19
    //const SERIN         = 20
    export const SERVO_ANGLE   = 24
    export const SERVO_SPEED   = 25
    //const SERVO_SET     = 26
    export const SERVO_SETRAMP = 27
    export const SERVO_DISABLE = 28
    //const SERVO_DRIVE   = 34
    //const PING_ECHO     = 29
    //const SIRC          = 30
    //const IR_DETECT     = 31
    export const PWM_OUT       = 32
    //const QTI_READ      = 33
    //const HANDSHAKE     = 99
    //const PWR_LED_WARN  = 25
    //const PWR_BRN_DET   = 24
    
    //const PWR_LED_WARN  = 15
    //const PWR_BRN_DET   = 14    

    export const ADDRESS       = 93
    
    let isConnected = false;

    function connect(){

        while (true) {
            if (pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16LE) !== 0){
                 pins.digitalWritePin(DigitalPin.P8, 1)
                pause(10);
                pins.i2cWriteNumber(ADDRESS, 12, NumberFormat.UInt16LE);
                pause(10);
                isConnected = true;
                break;
            }
        }
    }


    function botDisable(): void{
            pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
            basic.pause(200);
            control.reset();
    }


    export function sendCommand(pin: number, cmd:number, s=0, d:number=null, f:number=null): void{
            if (isConnected === false){
                connect()
            }

            // build args and write
            let args = Buffer.fromArray([1, pin, 33, s]);
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
            console.log(args.toHex())
            pins.i2cWriteBuffer(ADDRESS, args);
            
            // build command and write
            pins.i2cWriteBuffer(ADDRESS, Buffer.fromArray([0,cmd]));

            // wait until prop is done
            let check = 1
            while (check !== 0){
                pins.i2cWriteNumber(ADDRESS, 0, NumberFormat.UInt8LE);
                check = pins.i2cReadNumber(ADDRESS, NumberFormat.UInt8LE);
            }   

        }

        function read_r(): number {
            pins.i2cWriteNumber(ADDRESS, 18, NumberFormat.UInt32LE)
            return pins.i2cReadBuffer(ADDRESS, 4)[3]
        }

        // change cmd param to dropdown with HIGH/LOW
        //% block="%p write digital %s"
        //% group="Basic Read/Write"
        //% weight=100
        export function writeDigital(pin: BotPin, state: State): void{
            sendCommand(pin, state, 0, null, null);
        }

        //% block="%pin write analog %f"
        //% group="Basic Read/Write"
        //% weight=94
        export function writeAnalog(pin: BotPin, f: number): void{
            sendCommand(pin, PWM_OUT, 0, f, null);
        }

        //% block="%pin read digital"
        //% group="Basic Read/Write"
        //% weight=98
        export function readDigital(pin: BotPin): number {
            sendCommand(pin, INPUT, 0, null, null)
            let result = read_r();
            if (result === 1){return 1;}
            else {return 0;}
        }

        //% block="%pin is high"
        //% group="Basic Read/Write"
        //% weight=96
        export function readDigitalBoole(pin: BotPin): boolean {
            sendCommand(pin, INPUT, 0, null, null)
            let result = read_r();
            if (result === 1){return true;}
            else {return false;}
        }

        //% block="%pin pulse out %d"
        //% group="Other"
        //% weight=100
        export function pulseOut(pin: BotPin, d: number): void{
            sendCommand(pin, PULSOUT, 0, d, null);
        }

        //% block="%pin pulse in %s"
        //% group="Other"
        //% weight=98
        export function pulseIn(pin: BotPin, s: number): number{
            sendCommand(pin, PULSIN, s, null, null);
            return read_r();
        }

        //% block="%pin pulse count %d"
        //% group="Other"
        //% weight=96
        export function pulseCount(pin: BotPin, d:number): number{
            sendCommand(pin, COUNT, 0, d, null);
            return read_r();
        }

        //% block="%pin rc time %s %d %f"
        //% group="Other"
        //% weight=95
        export function rcTime(pin: BotPin, s:number): number{
            sendCommand(pin, RCTIME, s, null, null);
            return read_r();
        }


        /**
        * Play a tone for a specific duration.
        * @param pin connected to the speaker, eg: BotPin.Pin22
        * @param frequency of the tone
        * @param duration of the tone in milliseconds, eg: 1000
        */
        //% block="%pin tone freq %f dur %d "
        //% pin.fieldEditor="gridpicker"
        //% group="Other"
        //% weight=102
        export function tone(pin: BotPin, frequency: number, duration: number): void{
            sendCommand(pin, FREQOUT, 0, duration, frequency);
        }


        //% block
        //% group="Other"
        //% weight=94
        export function irDetect(){
            //reconstruct the buffer that is sent here
        }


        //% block="%pin servo angle %v"
        //% group="Servos"
        //% weight=198
        export function servoAngle(pin: BotPin, angle:number=null):void{
            let cmd = SERVO_ANGLE;
            if (angle === null){cmd = SERVO_DISABLE;}
            sendCommand(pin, cmd, 0, angle, null);
        }

        /**
        * Set a servo's speed. 
        * @param pin The pin connected to the servo, eg: BotPin.Pin18
        * @param velocity The velocity of the servo from, eg: 0
        */
        //% block="%pin servo speed %velocity"
        //% velocity.min=-75 
        //% velocity.max=75
        //% group="Servos"
        //% weight=200
        export function servoSpeed(pin: BotPin, velocity:number = null): void{
            let cmd = SERVO_SPEED;
            if (velocity === null){cmd = SERVO_DISABLE};
            sendCommand(pin, cmd, 0, velocity, null);
        }

        //% block="%pin servo accelerate %acceleration"
        //% group="Servos"
        //% weight=196
        export function servoAccelerate(pin: BotPin, acceleration: number):void{
            sendCommand(pin, SERVO_SETRAMP, 0, acceleration, null)
        }

        //% block
        //% group="Other"
        export function detach(){
            while (true){
                readDigital(25);
            }
        }



}

enum BotPin{
    Pin0,
    Pin1,
    Pin2,
    Pin3,
    Pin4,
    Pin5, 
    Pin6, 
    Pin7, 
    Pin8, 
    Pin9, 
    Pin10, 
    Pin11, 
    Pin12, 
    Pin13, 
    Pin14, 
    Pin15, 
    Pin16, 
    Pin17, 
    Pin18, 
    Pin19,
    Pin20, 
    Pin21, 
    Pin22
}

enum State{
    High = 1,
    Low = 2
}

enum ServoPin{
    Pin16 = 16, 
    Pin17 = 17, 
    Pin18 = 18, 
    Pin19 = 19
}

enum NavDirection{
    Forward,
    Reverse,
    Left,
    Right
}