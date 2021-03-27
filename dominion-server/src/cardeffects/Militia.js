const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Militia extends ActionEffect {
    constructor() {
        super(0, 0, 0, 2)
    }

    func = (player, playedCard, resolve, reject) => {
        player.getPlayers().filter(plr => plr.name !== player.name).forEach(plr => {
            if (!plr.hasMoat()){
                const len = plr.heldCards.length - 3
                if (len > 0) {
                    plr.askSelectUnknown(new Context(len, len, 'extra', [], "Discard down to 3 cards. If you cancel 3 random cards will be selected."), plr.heldCards).then(result => { 
                        const cards = result.map(card => plr.heldCards.find(held => held.name === card.name))
                        cards.forEach(card => plr.heldCards.splice(plr.heldCards.indexOf(card),1))
                        plr.discardPile.push(...cards)
                    }).catch(err => {
                        console.log(err);
                        while (plr.heldCards.length > 3) {
                            var i = Math.floor(Math.random() * plr.heldCards.length)
                            plr.discardPile.push(plr.heldCards[i])
                            plr.heldCards.splice(i, 1)
                        }
                    })
                }
            }
        })
        resolve(true)
    }

}

module.exports = Militia