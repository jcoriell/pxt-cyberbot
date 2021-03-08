
namespace cyberbot{
        /**
        * Play a note. 
        * @param pin connected to the speaker, eg: BotPin.Pin22
        * @param frequency of the tone, eg: Note.C5
        * @param beatLength length of beat, eg: BeatFraction.Quarter
        */
        //% block="%pin play|note %note=device_note|for %duration=device_beat"
        //% frequency.fieldEditor="note" frequency.defl="262"
        //%subcategory="Sound"
        export function note(pin: BotPin, frequency: number, duration: number): void{
            sendCommand(pin, FREQOUT, 0, duration, frequency);
        }
}