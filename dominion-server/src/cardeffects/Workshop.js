const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Workshop extends ActionEffect {
    constructor() {
        super(0, 0, 0, 0)
        this.context = new Context(1, 1, 'shop', [{maxcost: 4}])
    }

    func = (player, playedCard, resolve, reject) => {
        player.askSelect(playedCard).then(result => {
            const entry = player.getShop()[result[0].type.group].find(e => e[0].name === result[0].name)
            if (entry === undefined) reject("Card is not in shop")
            else {
                const card = entry[0]
                if (player.getShop()[card.type.group][player.getShop()[card.type.group].indexOf(entry)][1] === 0) {
                    reject("Tried to gain card that was out of stock")
                } 
                player.getShop()[card.type.group][player.getShop()[card.type.group].indexOf(entry)][1] -= 1
                player.discardPile.push(card)
                resolve(true)
            }
        }).catch(err => reject(err))
    }

}

module.exports = Workshop