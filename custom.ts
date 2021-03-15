
namespace cyberbot{

    // blank programs for each menu item
    let program1 = {
        action: () => basic.showString("Empty", 100),
        name: "Empty"
    }
    let program2 = {
        action: () => basic.showString("Empty", 100),
        name: "Empty"
    }
    let program3 = {
        action: () => basic.showString("Empty", 100),
        name: "Empty"
    }
    let program4 = {
        action: () => basic.showString("Empty", 100),
        name: "Empty"
    }
    let program5 = {
        action: () => basic.showString("Empty", 100),
        name: "Empty"
    }

    /**
     * Set a program as one of the menu items. 
     * Navigate through the menu by pressing button A and button B.
     * Select a program to run by pressing both button A and button B simultaneously.
     * This block utilizes on button pressed and on gesture, causing them to be disabled elsewhere.
     */
    //% block="save %menuItem as %name"
    //% weight=1001
    //% group="Menu"
    export function setProgram(menuItem: BotMenu, name: string, customFunction: () => void) {
        if (menuItem === BotMenu.Program1){
            program1.action = customFunction;
            program1.name = name;
        }
        if (menuItem === BotMenu.Program2){
            program2.action = customFunction;
            program2.name = name;
        }
        if (menuItem === BotMenu.Program3){
            program3.action = customFunction;
            program3.name = name;
        }
        if (menuItem === BotMenu.Program4){
            program4.action = customFunction;
            program4.name = name;
        }
        if (menuItem === BotMenu.Program5){
            program5.action = customFunction;
            program5.name = name;
        }
        useProgramMenu();
    }

    // execute a program
    function execute(menuItem: BotMenu): void{
        if (menuItem === BotMenu.Program1){program1.action();}
        else if (menuItem === BotMenu.Program2){program2.action();}
        else if (menuItem === BotMenu.Program3){program3.action();}
        else if (menuItem === BotMenu.Program4){program4.action();}
        else if (menuItem === BotMenu.Program5){program5.action();}
    }

    // show the name of a program
    function showName(menuItem: BotMenu): void{
        let name: string;
        if (menuItem === BotMenu.Program1){name = program1.name}
        else if (menuItem === BotMenu.Program2){name = program2.name}
        else if (menuItem === BotMenu.Program3){name = program3.name}
        else if (menuItem === BotMenu.Program4){name = program4.name}
        else if (menuItem === BotMenu.Program5){name = program5.name}
        basic.showString(name, 100)
    }

    // use the menu for the program
    function useProgramMenu(): void{
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
            pause(10)
            basic.clearScreen();
            led.plot(selection, 2)
        })

        input.onGesture(Gesture.LogoUp, function () {
            basic.clearScreen();
            showName(selection);
            basic.clearScreen();
            led.plot(selection, 2)
        })
         
    }


}

enum BotMenu{
    Program1,
    Program2,
    Program3,
    Program4,
    Program5
}
