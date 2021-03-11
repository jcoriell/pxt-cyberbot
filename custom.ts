
namespace cyberbot{

    let program1: () => void;
    let program2: () => void;
    let program3: () => void;

    /**
     * A simple event taking a function handler
     */
    //% block="set %menuItem"
    //% weight=1001
    export function setProgram(menuItem: BotMenu, customFunction: () => void) {
        if (menuItem === BotMenu.Program1){program1 = customFunction;}
        if (menuItem === BotMenu.Program2){program2 = customFunction;}
        if (menuItem === BotMenu.Program3){program3 = customFunction;}
    }

    //% block="execute %menuItem"
    export function execute(menuItem: BotMenu):void{
        if (menuItem === BotMenu.Program1){program1();}
        if (menuItem === BotMenu.Program2){program2();}
        if (menuItem === BotMenu.Program3){program3();}
    }

}

enum BotMenu{
    Program1,
    Program2,
    Program3
}
