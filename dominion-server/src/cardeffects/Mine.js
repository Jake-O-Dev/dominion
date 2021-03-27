const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Mine extends ActionEffect {
    constructor() {
        super(0, 0, 0, 0)
        this.context = new Context(1,1,'hand',[{cardtypegroup:"treasure"}])
    }

    func = (player, playedCard, resolve, reject) => {
        player.askSelect(playedCard).then(result => {
            const card = player.heldCards.find(card => card.name === result[0].name)
            const maxcost = card.cost + 3
            player.trashed.push(...player.heldCards.splice(player.heldCards.indexOf(card), 1))
            return player.askSelectUnknown(new Context(1, 1, 'shop', [{maxcost: maxcost, cardtypegroup: "treasure"}]))
        }).then(result => {
                const newcard = player.getShop()['treasure'].find(e => e[0].name === result[0].name)
                player.heldCards.push(newcard[0])
                resolve(true)
        }).catch(err => reject(err))
    }

}

module.exports = Mine