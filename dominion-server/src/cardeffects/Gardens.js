const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Gardens extends ActionEffect {
    constructor() {
        super("")
    }

    calc = (player) => {
        const totalcards = []
        totalcards.push(...player.heldCards)
        totalcards.push(...player.discardPile)
        totalcards.push(...player.drawPile)
        return Math.floor(totalcards.length / 10)
    }

}

module.exports = Gardens