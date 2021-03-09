
namespace cyberbot{

        let leftIsRunning = false;
        let rightIsRunning = false;

        function leftServoIndicator(speed:number){
            while (leftIsRunning){
                if (speed > 0){
                    for (let i = 0; i <= 4; i++){
                        led.toggle(4, i)
                        pause(100)
                        led.toggle(4, i)
                    }
                }
                else if (speed < 0){
                    for (let i = 4; i >= 0; i--){
                        led.toggle(4, i)
                        pause(100)
                        led.toggle(4, i)
                    }
                }
            }
        }

        function rightServoIndicator(speed:number){
            while (rightIsRunning){
                if (speed < 0){
                    for (let i = 0; i <= 4; i++){
                        led.toggle(0, i)
                        pause(100)
                        led.toggle(0, i)
                    }
                }
                else if (speed > 0){
                    for (let i = 4; i >= 0; i--){
                        led.toggle(0, i)
                        pause(100)
                        led.toggle(0, i)
                    }
                }
            }
        }


        let leftServo = ServoPin.Pin18
        let rightServo = ServoPin.Pin19
    
        //% block="set left servo %pin"
        //% weight=1000
        //%subcategory="Navigation"
        export function setLeftServo(pin: ServoPin): void{
            leftServo = pin;
        }

        //% block="set right servo %pin"
        //% weight=1000
        //%subcategory="Navigation"
        export function setRightServo(pin: ServoPin): void{
            rightServo = pin;
        }

        
        /**
        * Move the bot in a direction for a certain number of seconds. 
        * @param direction, eg: NavDirection.Forward
        * @param duration of time in seconds, eg: 1
        */
        //% block="go %direction for %duration seconds"
        //% subcategory="Navigation"
        export function navDuration(direction: NavDirection, duration: number): void{
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
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);
            pause(duration * 1000)
            stop()
        }

        /**
        * Set the bot on a path. It will not stop unless told to stop. 
        * @param direction, eg: NavDirection.Forward
        */
        //% block="go %direction"
        //%subcategory="Navigation"
        export function navForever(direction: NavDirection): void{
            leftIsRunning = false;
            rightIsRunning = false;
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
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);
            leftIsRunning = true;
            rightIsRunning = true;
            control.inBackground(function () {
                leftServoIndicator(leftSpeed);
            })
            control.inBackground(function () {
                rightServoIndicator(rightSpeed);
            })
            pause(10)
        }

        /**
        * Set the bot on a path at a certain percent of full speed. 
        * @param direction, eg: NavDirection.Forward
        * @param speed is percentage of full speed, eg: 100
        */
        //% speed.min=0
        //% speed.max=100
        //% speed.shadow="speedPicker"
        //% block="go %direction at %speed \\% full speed"
        //% subcategory="Navigation"
        //% weight=35
        export function navSpeed(direction: NavDirection, speed: number): void{
            if (speed > 100){speed = 100;}
            if (speed < 0){speed = 0;}
            let leftSpeed: number;
            let rightSpeed: number;
            if (direction === NavDirection.Forward){
                leftSpeed = speed * 0.75; 
                rightSpeed = speed * -0.75;
            }
            else if (direction === NavDirection.Reverse){
                leftSpeed = speed * -0.75; 
                rightSpeed = speed * 0.75;
            }
            else if (direction === NavDirection.Left){
                leftSpeed = speed * -0.75; 
                rightSpeed = speed * -0.75;
            }
            else if (direction === NavDirection.Right){
                leftSpeed = speed * 0.75; 
                rightSpeed = speed * 75;
            }
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);

            pause(10)
        }


        /**
         * Drive by specifying how fast each wheel should spin and for how long.
         * @param leftSpeed is a percentage of the left wheel's full speed, eg: 100
         * @param rightSpeed is a percentage of the right wheel's full speed, eg: 100
         * @param time is time in seconds, eg: 1 
         */
        //% block="drive with | left wheel at %leftSpeed \\%  full speed, | right wheel at %rightSpeed \\% full speed, | for %time seconds"
        //% subcategory="Navigation"
        //% weight=25
        //% leftSpeed.min=-100 leftSpeed.max=100 leftSpeed.shadow="speedPicker"
        //% rightSpeed.min=-100 rightSpeed.max=100 rightSpeed.shadow="speedPicker"
        export function precisionDrive(leftSpeed:number, rightSpeed: number, time: number): void{
            leftSpeed = leftSpeed * 0.75
            rightSpeed = rightSpeed * -0.75
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);
            pause(time*1000)
            sendCommand(leftServo, SERVO_DISABLE, 0, null);
            sendCommand(rightServo, SERVO_DISABLE, 0, null);
        }

        /**
        * Stop the left servo and the right servo. 
        */
        //% block="stop"
        //% subcategory="Navigation"
        //% weight=0
        export function stop(): void{
            sendCommand(leftServo, SERVO_DISABLE, 0, null);
            sendCommand(rightServo, SERVO_DISABLE, 0, null);
            leftIsRunning = false;
            rightIsRunning = false;
        }



        /**
        * Set a servo's speed. 
        * @param pin The pin connected to the servo, eg: BotPin.Pin18
        * @param velocity The velocity of the servo from, eg: 0
        
        //% block="%pin servo speed %speed"
        //% speed.shadow="speedPicker"
        //% group="Servos"
        export function servoVelocity(pin: BotPin, speed:number = null): void{
            let cmd = SERVO_SPEED;
            let velocity = speed * 0.75
            if (speed === null){cmd = SERVO_DISABLE};
            sendCommand(pin, cmd, 0, speed, null);
        }

        */

}