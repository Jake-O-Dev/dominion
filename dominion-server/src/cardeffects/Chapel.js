const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Chapel extends ActionEffect {
    constructor() {
        super(0, 0, 0, 0)
        this.context = new Context(4, 0, 'hand', [])
    }

    func = (player, playedCards, resolve, reject) => {
        player.askSelect(playedCards).then(result => {
            const cards = result.map(c => player.heldCards.find(card => card.name === c.name))
            if (cards === undefined) {
                console.log(player.heldCards);
                console.log(result);
                reject("cards was undefined")
            }
            cards.forEach(c => player.heldCards.splice(player.discardPile.indexOf(c), 1))
            player.trashed.push(...cards)
            resolve(true)
        }).catch(err => reject(err))
    }
}

module.exports = Chapel