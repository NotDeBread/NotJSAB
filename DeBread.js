const DeBread = {
    /**
    * Rounds a number to the specified decimal place.
    * @param num The number to round.
    * @param decimalPlaces The decimal place to round to.
    */
    round(num, decimalPlaces = 0) {
        return Math.round(num * (Math.pow(10, decimalPlaces))) / (Math.pow(10, decimalPlaces))
    },

    /**
    * Returns a random color.
    */
    randomColor() {
        return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    },

    /**
    * Returns a random number.
    * @param min The minimum amount the number can be.
    * @param max The maximum amount amount the number can be.
    * @param decimalPlaces The amount of decimal places.
    */
    randomNum(min = 0, max = 1, decimalPlaces = 0) {
        return DeBread.round((Math.random() * (max - min)) + min, decimalPlaces)
    },

    /**
    * Applies a shake effect to an element.
    * (This uses the CSS transform property so it will override an y current CSS transformations.)
    * @param element The element to shake.
    * @param interval The interval of the shake.
    * @param intensity The intensity of the shake.
    * @param time How long the shake lasts (ms).
    * @param rotate If to involve rotation in the shake.
    * @param rotateIntensity The intensity of the rotation in the shake.
    */
    shake(element, interval, intensityX, intensityY, time, rotate = false, rotateIntensity = 0) {
        let shakeInterval = setInterval(() => {
            if(rotate) {
                doge(element).style.setProperty('transform',`translateX(${DeBread.randomNum(-intensityX, intensityX)}px) translateY(${DeBread.randomNum(-intensityY, intensityY)}px) rotate(${DeBread.randomNum(-rotateIntensity, rotateIntensity)}deg)`)
            } else {
                doge(element).style.setProperty('transform',`translateX(${DeBread.randomNum(-intensityX, intensityX)}px) translateY(${DeBread.randomNum(-intensityY, intensityY)}px)`)
            }
        }, interval);
        setTimeout(() => {
            clearInterval(shakeInterval)
            doge(element).style.setProperty('transform',`none`)
        }, time);
    },

    /**
    * Plays a sound.
    * @param sound The file path of the audio.
    * @param volume The volume to play the sound at.
    */
    playSound(sound, volume = 1) {
        let audio = new Audio(sound)
        audio.volume = volume
        audio.play()
    }
}

/**
* Shortened document.getElementById.
* (From library "DeBread")
* @param id The ID of the element.
*/
function doge(id) {
    return document.getElementById(id)
}