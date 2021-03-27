const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Witch extends ActionEffect {
    constructor() {
        super(2, 0, 0, 0)
    }

    func = (player, playedCard, resolve, reject) => {
        player.getPlayers().filter(plr => (plr.name !== player.name) && (!plr.hasMoat())).forEach(plr => {
            plr.discardPile.push(player.curse())
        })
        resolve(true)
    }

}

module.exports = Witch