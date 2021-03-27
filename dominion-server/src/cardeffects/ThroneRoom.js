const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class ThroneRoom extends ActionEffect {
    constructor() {
        super(0, 0, 0, 0)
        this.context = new Context(1, 1, 'hand', [{cardtypegroup: 'action'}])
    }

    func = (player, playedCard, resolve, reject) => {
        player.askSelect(playedCard).then(result => { 
            const card = player.heldCards.find(card => card.name === result[0].name)
            if (card === undefined) {
                console.log(player.heldCards);
                console.log(result);
                reject("Selected cards and player cards did not match.")
            }
            
            player.heldCards.splice(player.heldCards.indexOf(card), 1)
            player.playedCards.push(card)
            card.effect.play(player, card).then(result => {
                if (result) {
                    player.playedCards.push(card)
                    return card.effect.play(player, card)
                } else {
                    return false
                }
            }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        }).catch(err => reject(err))
    }
}

module.exports = ThroneRoom