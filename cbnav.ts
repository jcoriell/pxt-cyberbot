
namespace cyberbot{
    
        

        //% block="left %lv right %rv time %d"
        //% group="Navigation"
        export function servoSteering(lv:number, rv: number, d: number): void{
            let lspeed = -1 * lv
            let rspeed = rv
            sendCommand(18, SERVO_SPEED, 0, lspeed);
            sendCommand(19, SERVO_SPEED, 0, rspeed);
            pause(d)
            sendCommand(18, SERVO_DISABLE, 0, null);
            sendCommand(19, SERVO_DISABLE, 0, null);
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
        //% group="Navigation"
        export function forward(speed: number, duration: number, leftPin?: ServoPin, rightPin?: ServoPin): void{
            let leftSpeed = -1 * (speed * 0.75)
            let rightSpeed = (speed * 0.75)
            sendCommand(leftPin, 25, 0, leftSpeed);
            sendCommand(rightPin, 25, 0, rightSpeed);
            pause(duration * 1000)
            sendCommand(leftPin, 28, 0, null);
            sendCommand(rightPin, 28, 0, null);
        }

        /**
         * Move the bot in a direction for a certain number of seconds. 
         * @param direction, eg: NavDirection.Forward
         * @param duration of time in seconds, eg: 1
         */
        //% block="go %direction for %duration seconds"
        //% speed.min=0
        //% speed.max=100
        //% group="Navigation"
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
            sendCommand(18, 25, 0, leftSpeed);
            sendCommand(19, 25, 0, rightSpeed);
            pause(duration * 1000)
            sendCommand(18, 28, 0, null);
            sendCommand(19, 28, 0, null);
        }
        // back  
        // left 
        // right 
        // stop 
        // navigation 

}