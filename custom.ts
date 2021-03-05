

namespace cyberbot{

    //const COMMAND       = 0
    //const PIN1          = 1
    //const PIN2          = 2
    //const STATE         = 3
    //const ARG1          = 4
    //const ARG2          = 8
    //const ARG3          = 12
    //const ARG4          = 16
    //const ARG5          = 20
    //const RETVAL        = 24
    //const STRBUF        = 28

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
    //const PULSOUT       = 11
    //const COUNT         = 12
    const FREQOUT       = 13
    //const RCTIME        = 16
    //const SHIFTIN       = 17
    //const SHIFTOUT      = 18
    //const SEROUT        = 19
    //const SERIN         = 20
    //const SERVO_ANGLE   = 24
    const SERVO_SPEED   = 25
    //const SERVO_SET     = 26
    //const SERVO_SETRAMP = 27
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

    export function connect(){
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

        //% block="pin %p write digital %s"
        export function writeDigital(pin: number, cmd: number): void{
            if (cmd > 1 || cmd < 0){cmd = TOGGLE;}
            else if (cmd === 0){cmd = LOW;}
            sendCommand(pin, cmd, 0, null, null);
        }

        //% block="pin %pin write analogue %f"
        export function writeAnalog(pin: number, f: number): void{
            sendCommand(pin, PWM_OUT, 0, f, null);
        }

        function readDigital(){

        }

        function pulseOut(){

        }

        function pulseIn(){

        }

        function pulseCount(){

        }

        function rcTime(){

        }

        //% block="pin %pin tone freq %f dur %d "
        export function tone(pin: number, frequency: number, duration: number): void{
            sendCommand(pin, FREQOUT, 0, duration, frequency);
        }

        function irDetect(){

        }

        function servoAngle(){
            
        }

        //% block="pin %pin servo speed %velocity"
        export function servoSpeed(pin: number, velocity:number = null): void{
            let cmd = SERVO_SPEED;
            if (velocity === null){cmd = SERVO_DISABLE};
            sendCommand(pin, cmd, 0, velocity, null);
        }

        function servoAccelerate(){

        }

        function detach(){

        }

}
