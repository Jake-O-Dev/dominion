const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Cellar extends ActionEffect {
    constructor() {
        super(0, 0, 1, 0)
        this.context = new Context(10000, 0, 'hand', [])
    }

    func = (player, card, resolve, reject) => {
        player.askSelect(card).then(result => {
            const helds = result.map(card => player.heldCards.find(held => held.name === card.name))
            if ((helds.length !== result.length) || helds.includes(undefined)) {
                console.log(result);
                console.log(helds);
                reject("result did not match heldcards")
            }
            helds.forEach(held => player.heldCards.splice(player.heldCards.indexOf(held), 1))
            player.discardPile.push(...helds)
            player.draw(helds.length)
            resolve(true)
        }).catch(err => reject(err))
    }
}

module.exports = Cellar