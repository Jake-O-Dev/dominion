const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Poacher extends ActionEffect {
    constructor() {
        super(1, 0, 1, 1)
    }

    func = (player, playedCard, resolve, reject) => {
        var amntempty = player.getShop()['action'].filter(c => c[1] === 0).length
        if (amntempty > 0) {
            player.askSelectUnknown(new Context(amntempty, amntempty, 'hand', [])).then(result => {
                const cards = result.map(card => player.heldCards.find(held => card.name === held.name))
                player.discardPile.push(...cards)
            }).catch(err => reject(err))
        }
        resolve(true)
    }

}

module.exports = Poacher