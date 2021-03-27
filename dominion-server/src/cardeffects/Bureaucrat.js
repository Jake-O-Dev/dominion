const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Bureaucrat extends ActionEffect {
    constructor() {
        super(0, 0, 0, 0)
        this.context = new Context(1, 1, 'shop', [{maxcost: 4}])
    }

    func = (player, playedCard, resolve, reject) => {
        player.drawPile.push(player.silver())
        player.getPlayers().filter(plr => plr.name !== player.name).forEach(plr => {
            const victoryCards = plr.heldCards.filter(card => card.type.group === 'victory')
            if (victoryCards.length > 0) {
                var selected
                if (victoryCards.length === 1) {
                    // auto select that one
                    selected = victoryCards[0]
                } else {
                    plr.askSelectUnknown(new Context(1,1,'hand', [{cardtypegroup: 'victory'}])).then(result => {
                        const card = player.heldCards.find(card => card.name === result[0].name)
                        if (card === undefined) {
                            console.log(player.heldCards);
                            console.log(selectedCards[0]);
                            reject("card was undefined")
                        }
                        selected = card
                    }).catch(err => {
                        selected = victoryCards[0]
                    })
                }
                plr.heldCards.splice(plr.heldCards.indexOf(selected), 1)
                plr.drawPile.push(selected)
            }
        })
        resolve(true)
    }

}

module.exports = Bureaucrat