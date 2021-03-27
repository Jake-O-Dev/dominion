const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Remodel extends ActionEffect {
    constructor() {
        super(0, 0, 0, 0)
        this.context = new Context(1, 1, 'hand', [])
    }

    func = (player, playedCard, resolve, reject) => {
        player.askSelect(playedCard).then(result => {
            const card = player.heldCards.find(card => card.name === result[0].name)
            if (card === undefined) {
                console.log(player.heldCards);
                console.log(result[0]);
                reject("card was undefined")
            }
            player.heldCards.splice(player.heldCards.indexOf(card), 1)
            player.trashed.push(card)
            const maxcost = card.cost + 2
            return player.askSelectUnknown(new Context(1, 1, 'shop', [{maxcost: maxcost}]))
        }).then(result => {
                const entry = player.getShop()[result[0].type.group].find(e => e[0].name === result[0].name)
                if (entry === undefined) reject("Card is not in shop")
                else {
                    const addCard = entry[0]
                    if (player.getShop()[addCard.type.group][player.getShop()[addCard.type.group].indexOf(entry)][1] === 0) {
                        reject("Tried to gain card that was out of stock")
                    }
                    player.getShop()[addCard.type.group][player.getShop()[addCard.type.group].indexOf(entry)][1] -= 1
                    player.heldCards.push(addCard)
                    resolve(true)
                }
        }).catch(err => reject(err))
    }
}

module.exports = Remodel