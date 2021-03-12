
namespace cyberbot{

    let program1 = () => basic.showString("Empty");
    let program2 = () => basic.showString("Empty");
    let program3 = () => basic.showString("Empty");
    let program4 = () => basic.showString("Empty");
    let program5 = () => basic.showString("Empty");

    /**
     * A simple event taking a function handler
     */
    //% block="set %menuItem"
    //% weight=1001
    export function setProgram(menuItem: BotMenu, customFunction: () => void) {
        if (menuItem === BotMenu.Program1){program1 = customFunction;}
        if (menuItem === BotMenu.Program2){program2 = customFunction;}
        if (menuItem === BotMenu.Program3){program3 = customFunction;}
        if (menuItem === BotMenu.Program4){program4 = customFunction;}
        if (menuItem === BotMenu.Program5){program5 = customFunction;}
    }

    //% block="execute %menuItem"
    export function execute(menuItem: BotMenu):void{
        if (menuItem === BotMenu.Program1){program1();}
        if (menuItem === BotMenu.Program2){program2();}
        if (menuItem === BotMenu.Program3){program3();}
        if (menuItem === BotMenu.Program4){program4();}
        if (menuItem === BotMenu.Program5){program5();}
    }

    //% block="use program menu"
    export function useProgramMenu(): void{
        let selection = 0
        led.plot(selection, 2)
       
    
        input.onButtonPressed(Button.A, function () {
            selection -= 1;
            if (selection < 0) {selection = 0}
            basic.clearScreen()
            led.plot(selection, 2)
        })

        input.onButtonPressed(Button.B, function () {
            selection += 1;
            if (selection > 4) {selection = 4}
            basic.clearScreen()
            led.plot(selection, 2)
        })

        input.onButtonPressed(Button.AB, function () {
            basic.clearScreen();
            execute(selection);
            basic.clearScreen();
            led.plot(selection, 2)
        })
         
    }

    //% block="use program menu 2"
    export function useProgramMenu2(): void{
        let selection = 0
        led.plot(selection, 2)
        while (true) {
            if (input.buttonIsPressed(Button.AB)) {
                basic.clearScreen();
                execute(selection);
                basic.clearScreen();
                led.plot(selection, 2)
            }
            else if (input.buttonIsPressed(Button.A)) {
                selection -= 1;
                if (selection < 0) {selection = 0}
                basic.clearScreen()
                led.plot(selection, 2)
            } 
            else if (input.buttonIsPressed(Button.B)) {
                selection += 1;
                if (selection > 4) {selection = 4}
                basic.clearScreen()
                led.plot(selection, 2)
            } 

            pause(250)
        }
        
    }


}

enum BotMenu{
    Program1,
    Program2,
    Program3,
    Program4,
    Program5
}
