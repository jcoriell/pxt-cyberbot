
namespace cyberbot{
    
        //% block="left %lv right %rv time %d"
        //% subcategory="Navigation"
        export function servoSteering(lv:number, rv: number, d: number): void{
            let lspeed = lv
            let rspeed = -1*rv
            showServos(lspeed, rspeed)
            sendCommand(18, SERVO_SPEED, 0, lspeed);
            sendCommand(19, SERVO_SPEED, 0, rspeed);
            pause(d)
            sendCommand(18, SERVO_DISABLE, 0, null);
            sendCommand(19, SERVO_DISABLE, 0, null);
        }

        function showServos(left: number, right: number): void{
        //let empty = images.createImage(`. . . . .\n. . . . .\n# . . . #\n. . . . .\n. . . . .`)
            led.plot(0, 2)
            led.plot(4, 2)
            if (left > 0) {led.plot(0, 1)}
            if (left >= 60) {led.plot(0,0)}
            if (left < 0) {led.plot(0, 3)}
            if (left <= -60) {led.plot(0,4)}
            if (right < 0) {led.plot(4, 1)}
            if (right <= -60) {led.plot(4,0)}   
            if (right > 0) {led.plot(4, 3)}
            if (right >= 60) {led.plot(4,4)}
        }

        function servoLights(): void{
            
        }


        /**
        * Set a servo's speed. 
        * @param pin The pin connected to the servo, eg: BotPin.Pin18
        * @param velocity The velocity of the servo from, eg: 0
        */
        //% block="%pin servo speed %speed"
        //% speed.shadow="speedPicker"
        //% group="Servos"
        export function servoVelocity(pin: BotPin, speed:number = null): void{
            let cmd = SERVO_SPEED;
            let velocity = speed * 0.75
            if (speed === null){cmd = SERVO_DISABLE};
            sendCommand(pin, cmd, 0, speed, null);
        }

        
        /**
         * Forward at a certain speed for a duration. 
         * @param speed as the percentage of max speed
         * @param duration of time in seconds
         * @param leftPin Pin for left servo. eg: ServoPin.Pin18
         * @param rightPin Pin for left servo. eg: ServoPin.Pin19
         */
        //% block="Forward with speed %speed for duration %duration || %leftPin %rightPin"
        //% speed.min=0
        //% speed.max=100
        //% inlineInputMode=inline
        //% expandableArgumentMode="toggle"
        //%subcategory="Navigation"
        export function forward(speed: number, duration: number, leftPin?: ServoPin, rightPin?: ServoPin): void{
            let leftSpeed = -1 * (speed * 0.75)
            let rightSpeed = (speed * 0.75)
            sendCommand(leftPin, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightPin, SERVO_SPEED, 0, rightSpeed);
            pause(duration * 1000)
            sendCommand(leftPin, SERVO_DISABLE, 0, null);
            sendCommand(rightPin, SERVO_DISABLE, 0, null);
        }

        /**
         * Move the bot in a direction for a certain number of seconds. 
         * @param direction, eg: NavDirection.Forward
         * @param duration of time in seconds, eg: 1
         */
        //% block="go %direction for %duration seconds"
        //% speed.min=0
        //% speed.max=100
        //%subcategory="Navigation"
        export function nav(direction: NavDirection, duration: number): void{
            let leftSpeed: number;
            let rightSpeed: number;
            if (direction === NavDirection.Forward){
                leftSpeed = 75; 
                rightSpeed = -75;
            }
            else if (direction === NavDirection.Reverse){
                leftSpeed = -75; 
                rightSpeed = 75;
            }
            else if (direction === NavDirection.Left){
                leftSpeed = -75; 
                rightSpeed = -75;
            }
            else if (direction === NavDirection.Right){
                leftSpeed = 75; 
                rightSpeed = 75;
            }
            sendCommand(18, SERVO_SPEED, 0, leftSpeed);
            sendCommand(19, SERVO_SPEED, 0, rightSpeed);
            pause(duration * 1000)
            sendCommand(18, SERVO_DISABLE, 0, null);
            sendCommand(19, SERVO_DISABLE, 0, null);
        }
        // back  
        // left 
        // right 
        // stop 
        // navigation 

}