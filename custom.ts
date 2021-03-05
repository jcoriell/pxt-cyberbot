

namespace cyberbot{

    // commands
    const HIGH          = 1
    const LOW           = 2
    //const INPUT         = 3
    const TOGGLE        = 4
    //const SETDIRS       = 5
    //const GETDIRS       = 6
    //const SETSTATES     = 7
    //const GETSTATES     = 8
    //const PAUSE         = 9
    //const PULSIN        = 10
    const PULSOUT       = 11
    //const COUNT         = 12
    const FREQOUT       = 13
    //const RCTIME        = 16
    //const SHIFTIN       = 17
    //const SHIFTOUT      = 18
    //const SEROUT        = 19
    //const SERIN         = 20
    const SERVO_ANGLE   = 24
    const SERVO_SPEED   = 25
    //const SERVO_SET     = 26
    const SERVO_SETRAMP = 27
    const SERVO_DISABLE = 28
    //const SERVO_DRIVE   = 34
    //const PING_ECHO     = 29
    //const SIRC          = 30
    //const IR_DETECT     = 31
    const PWM_OUT       = 32
    //const QTI_READ      = 33
    //const HANDSHAKE     = 99
    //const PWR_LED_WARN  = 25
    //const PWR_BRN_DET   = 24
    
    //const PWR_LED_WARN  = 15
    //const PWR_BRN_DET   = 14    

    const ADDRESS         = 93
    
    let isConnected = false;

    function connect(){
        while (true) {
            if (pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16LE) !== 0){
                pins.digitalWritePin(DigitalPin.P8, 1)
                pause(10)
                pins.i2cWriteNumber(ADDRESS, 12, NumberFormat.UInt16LE)
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


    function sendCommand(pin: number, cmd:number, s=0, d:number=null, f:number=null): void{
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

        function read_r(){

        }

        // change cmd param to dropdown with HIGH/LOW
        //% block="pin %p write digital %s"
        export function writeDigital(pin: number, cmd: number): void{
            if (cmd > 1 || cmd < 0){cmd = TOGGLE;}
            else if (cmd === 0){cmd = LOW;}
            sendCommand(pin, cmd, 0, null, null);
        }

        //% block="pin %pin write analog %f"
        export function writeAnalog(pin: number, f: number): void{
            sendCommand(pin, PWM_OUT, 0, f, null);
        }

        function readDigital(){

        }

        //% block="pin %pin pulse out %d"
        export function pulseOut(pin: number, d: number): void{
            sendCommand(pin, PULSOUT, 0, d, null);
        }

        function pulseIn(){

        }

        function pulseCount(){

        }

        function rcTime(){

        }


        /**
        * Play a tone for a specific duration.
        * @param pin connected to the speaker, eg: 22
        * @param frequency of the tone
        * @param duration of the tone in milliseconds, eg: 1000
        */
        //% block="pin %pin tone freq %f dur %d "
        export function tone(pin: number, frequency: number, duration: number): void{
            sendCommand(pin, FREQOUT, 0, duration, frequency);
        }

        /// this one will have a beat length associated with it (quarter, half, whole, etc.)
        /**
        * Play a note. 
        * @param pin connected to the speaker, eg: 22
        * @param frequency of the tone
        * @param duration of the tone in milliseconds, eg: 1000
        */
        //% block="pin %pin tone freq %f dur %d "
        //% frequency.fieldEditor="note" frequency.defl="262"
        export function note(pin: number, frequency: number, duration: number): void{
            sendCommand(pin, FREQOUT, 0, duration, frequency);
        }

        function irDetect(){

        }


        //% block="pin %pin servo angle %v"
        export function servoAngle(pin: number, angle:number=null):void{
            let cmd = SERVO_ANGLE;
            if (angle === null){cmd = SERVO_DISABLE;}
            sendCommand(pin, cmd, 0, angle, null);
        }

        /**
        * Set a servo's speed. 
        * @param pin The pin connected to the servo, eg: 18
        * @param velocity The velocity of the servo from, eg: 0
        */
        //% block="pin %pin servo speed %velocity"
        //% velocity.min=-75 
        //% velocity.max=75
        export function servoSpeed(pin: number, velocity:number = null): void{
            let cmd = SERVO_SPEED;
            if (velocity === null){cmd = SERVO_DISABLE};
            sendCommand(pin, cmd, 0, velocity, null);
        }

        //% block="pin %pin servo accelerate %acceleration"
        export function servoAccelerate(pin: number, acceleration: number):void{
            sendCommand(pin, SERVO_SETRAMP, 0, acceleration, null)
        }

        function detach(){

        }



        //% block="left %lv right %rv time %d"
        export function servoSteering(lv:number, rv: number, d: number): void{
            let lspeed = -1 * lv
            let rspeed = rv
            sendCommand(18, SERVO_SPEED, 0, lspeed);
            sendCommand(19, SERVO_SPEED, 0, rspeed);
            pause(d)
            sendCommand(18, SERVO_DISABLE, 0, null);
            sendCommand(19, SERVO_DISABLE, 0, null);
        }

        // forward with speed as percent and duration in seconds (+ pin dropdown)
        /**
         * Forward at a certain speed for a duration. 
         * @param speed the percentage of max speed
         * @param duration of time in seconds
         * @param leftPin Pin for left servo. eg: BotPin.Pin18
         * @param rightPin Pin for left servo. eg: BotPin.Pin19
         */
        //% block="speed %speed duration %duration || %leftPin %rightPin"
        //% speed.min=0
        //% speed.max=100
        //% inlineInputMode=inline
        //% expandableArgumentMode="toggle"
        export function forward(speed:number, duration: number, leftPin?: BotPin, rightPin?: BotPin): void{
            let leftSpeed = -1 * (speed * 0.75)
            let rightSpeed = (speed * 0.75)
            sendCommand(leftPin, 25, 0, leftSpeed);
            sendCommand(rightPin, 25, 0, rightSpeed);
            pause(duration * 100)
            sendCommand(leftPin, 28, 0, null);
            sendCommand(rightPin, 28, 0, null);
        }
        // back  
        // left 
        // right 
        // stop 
        // navigation 

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
