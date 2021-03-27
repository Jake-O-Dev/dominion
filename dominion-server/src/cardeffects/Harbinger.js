const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Harbinger extends ActionEffect {
    constructor() {
        super(1, 0, 1, 0)
        this.context = new Context(1, 0, 'discard', [])
    }

    func = (player, playedCard, resolve, reject) => {
        player.askSelect(playedCard).then(result => {
            const card = player.discardPile.find(card => card.name === result[0].name)
            if (card === undefined) {
                console.log(player.discardPile);
                console.log(result[0]);
                reject("Card is undefined. Harbinger")
            }
            player.discardPile.splice(player.discardPile.indexOf(card), 1)
            player.heldCards.push(card)
            resolve(true)
        }).catch(err => reject(err))
    }
}

module.exports = Harbinger