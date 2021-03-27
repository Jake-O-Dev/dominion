const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class MoneyLender extends ActionEffect {
    constructor() {
        super(0, 0, 0, 0)
        this.context = new Context(1, 1, 'hand', [{name:"Copper"}])
    }

    func = (player, playedCard, resolve, reject) => {
        player.askSelect(playedCard).then(result => {
            const card = player.heldCards.find(card => card.name === result[0].name)
            if (card === undefined) {
                console.log(player.heldCards);
                console.log(result);
                reject("card was undefined")
            }
            if (card.name !== "Copper") {
                reject("did not get a copper card")
            }
            player.heldCards.splice(player.discardPile.indexOf(card), 1)
            player.trashed.push(card)
            player.coins += 3
            resolve(true)
        }).catch(err => reject(err))
    }
}

module.exports = MoneyLender