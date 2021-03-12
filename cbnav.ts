
namespace cyberbot{

        let navlightIsOn = false;

        /**
         * Toggle the navigation lights.
         * The blinking indicates the rotational motion of the wheel when viewed from above.
         * @param control the lights
         */
        //% block="navigation light %control"
        //% subcategory="Navigation"
        //% control.shadow="toggleOnOff"
        //% weight=890
        //% group="Settings"
        export function navlightToggle(control: boolean): void{
            navlightIsOn = control;
        }

        let leftIsRunning = false;
        let rightIsRunning = false;

        function leftNavLight(speed:number){
            while (leftIsRunning){
                if (speed > 0){
                    for (let i = 2; i <= 6; i++){
                        if (!leftIsRunning){break}
                        led.toggle(4, i % 5)
                        pause(100)
                        led.toggle(4, i % 5)
                    }
                }
                else if (speed < 0){
                    for (let i = 7; i >= 3; i--){
                        if (!leftIsRunning){break}
                        led.toggle(4, i % 5)
                        pause(100)
                        led.toggle(4, i % 5)
                    }
                }
            }
            basic.clearScreen()
        }

        function rightNavLight(speed:number){
            while (rightIsRunning){
                if (speed < 0){
                    for (let i = 2; i <= 6; i++){
                        if (!rightIsRunning){break}
                        led.toggle(0, i % 5)
                        pause(100)
                        led.toggle(0, i % 5)
                    }
                }
                else if (speed > 0){
                    for (let i = 7; i >= 3; i--){
                        if (!rightIsRunning){break}
                        led.toggle(0, i % 5)
                        pause(100)
                        led.toggle(0, i % 5)
                    }
                }
            }
            basic.clearScreen()
        }

        let leftServo = ServoPin.Pin18
        let rightServo = ServoPin.Pin19
    
        /**
         * Choose the pins connected to each wheel's servo. 
         * @param leftPin is the pin number connected to the left wheel servo, eg: ServoPin.Pin18
         * @param rightPin is the pin number connected to the right wheel servo, eg: ServoPin.Pin19
         */
        //% block="set left wheel %leftPin set right wheel %rightPin"
        //% weight=1000
        //% subcategory="Navigation"
        //% inlineInputMode="external"
        //% group="Settings"
        export function setLeftServo(leftPin: ServoPin, rightPin: ServoPin): void{
            leftServo = leftPin;
            rightServo = rightPin;
        }


        let leftForwardSpeed = 75
        let rightForwardSpeed = -75
        let leftReverseSpeed = -75
        let rightReverseSpeed = 75

        /**
         * Calibrate the wheels' speeds for going forward and/or backward. 
         * Moving the sliders to the right makes the right wheel go faster.
         * Moving the sliders to the left makes the left wheel go faster
         * @param forwardAdjustment adjusts the wheels' speeds for when the bot goes forward
         * @param reverseAdjustment adjusts the wheels' speeds for when the bot goes in reverse
         */
        //% block="calibrate forward: %forwardAdjustment calibrate backward: %backwardAdjustment"
        //% forwardAdjustment.min=-15 forwardAdjustment.max=15
        //% reverseAdjustment.min=-15 reverseAdjustment.max=15
        //% inlineInputMode="external"
        //% weight=900
        //% subcategory="Navigation"
        //% group="Settings"
        export function calibrateWheelspeed(forwardAdjustment: number, reverseAdjustment: number): void{
            leftForwardSpeed -= forwardAdjustment;
            rightForwardSpeed -= forwardAdjustment;
            leftReverseSpeed += reverseAdjustment;
            rightReverseSpeed += reverseAdjustment;
        }

        

        // make wheels go vroom vroom
        
        /**
        * Set the bot on a path. It will not stop unless told to stop 
        * @param direction, eg: NavDirection.Forward
        */
        //% block="go %direction"
        //% subcategory="Navigation"
        //% group="Directional"
        //% weight=200
        export function nav(direction: NavDirection): void{
            leftIsRunning = false;
            rightIsRunning = false;
            stopWheels();
            let leftSpeed: number;
            let rightSpeed: number;
            if (direction === NavDirection.Forward){
                leftSpeed = leftForwardSpeed; 
                rightSpeed = rightForwardSpeed;
            }
            else if (direction === NavDirection.Reverse){
                leftSpeed = leftReverseSpeed; 
                rightSpeed = rightReverseSpeed;
            }
            else if (direction === NavDirection.Left){
                leftSpeed = leftReverseSpeed; 
                rightSpeed = rightForwardSpeed;
            }
            else if (direction === NavDirection.Right){
                leftSpeed = leftForwardSpeed; 
                rightSpeed = rightReverseSpeed;
            }
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);
            leftIsRunning = true;
            rightIsRunning = true;
            if (navlightIsOn){
                control.inBackground(() => leftNavLight(leftSpeed));
                control.inBackground(() => rightNavLight(rightSpeed));
            }
            pause(10);
        }


        /**
        * Move the bot in a direction for a certain number of seconds 
        * @param direction, eg: NavDirection.Forward
        * @param duration of time in seconds, eg: 1
        */
        //% block="go %direction for %duration seconds"
        //% subcategory="Navigation"
        //% group="Directional"
        //% weight=100
        export function navWithDuration(direction: NavDirection, duration: number): void{
            let leftSpeed: number;
            let rightSpeed: number;
            if (direction === NavDirection.Forward){
                leftSpeed = leftForwardSpeed; 
                rightSpeed = rightForwardSpeed;
            }
            else if (direction === NavDirection.Reverse){
                leftSpeed = leftReverseSpeed; 
                rightSpeed = rightReverseSpeed;
            }
            else if (direction === NavDirection.Left){
                leftSpeed = leftReverseSpeed; 
                rightSpeed = rightForwardSpeed;
            }
            else if (direction === NavDirection.Right){
                leftSpeed = leftForwardSpeed; 
                rightSpeed = rightReverseSpeed;
            }
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);
            pause(duration * 1000)
            stopWheels()
        }



        /**
        * Set the bot on a path at a certain percent of full speed
        * @param direction, eg: NavDirection.Forward
        * @param speed is percentage of full speed, eg: 100
        */
        //% speed.min=0
        //% speed.max=100
        //% block="go %direction at %speed \\% full speed"
        //% subcategory="Navigation"
        //% weight=35
        //% group="Directional"
        export function navWithSpeed(direction: NavDirection, speed: number): void{
            if (speed > 100){speed = 100;}
            if (speed < 0){speed = 0;}
            let leftSpeed: number;
            let rightSpeed: number;
            if (direction === NavDirection.Forward){
                leftSpeed = speed * leftForwardSpeed/100; 
                rightSpeed = speed * rightForwardSpeed/100;
            }
            else if (direction === NavDirection.Reverse){
                leftSpeed = speed * leftReverseSpeed/100; 
                rightSpeed = speed * rightReverseSpeed/100;
            }
            else if (direction === NavDirection.Left){
                leftSpeed = speed * leftReverseSpeed/100; 
                rightSpeed = speed * rightForwardSpeed/100;
            }
            else if (direction === NavDirection.Right){
                leftSpeed = speed * leftForwardSpeed/100; 
                rightSpeed = speed * rightReverseSpeed/100;
            }
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);

            pause(10)
        }

        /**
        * Stop the left and right wheels' servos. 
        */
        //% block="stop wheels"
        //% subcategory="Navigation"
        //% weight=0
        //% group="Directional"
        export function stopWheels(): void{
            sendCommand(leftServo, SERVO_DISABLE, 0, null);
            sendCommand(rightServo, SERVO_DISABLE, 0, null);
            leftIsRunning = false;
            rightIsRunning = false;
            pause(50);
        }


        /**
         * Drive by specifying how fast each wheel should spin and for how long
         * @param leftSpeed is a percentage of the left wheel's full speed, eg: 100
         * @param rightSpeed is a percentage of the right wheel's full speed, eg: 100
         * @param time is time in seconds, eg: 1 
         */
        //% block="set left wheel power %leftSpeed set right wheel power %rightSpeed drive for duration (sec) $time"
        //% subcategory="Navigation"
        //% weight=25
        //% leftSpeed.min=-100 leftSpeed.max=100 leftSpeed.shadow="speedPicker"
        //% rightSpeed.min=-100 rightSpeed.max=100 rightSpeed.shadow="speedPicker"
        //% inlineInputMode="external"
        //% group="Controlled"
        export function precisionDrive(leftSpeed:number, rightSpeed: number, time: number): void{
            leftSpeed = leftSpeed 
            rightSpeed = -1 * rightSpeed
            sendCommand(leftServo, SERVO_SPEED, 0, leftSpeed);
            sendCommand(rightServo, SERVO_SPEED, 0, rightSpeed);
            pause(time*1000)
            sendCommand(leftServo, SERVO_DISABLE, 0, null);
            sendCommand(rightServo, SERVO_DISABLE, 0, null);
        }

}

