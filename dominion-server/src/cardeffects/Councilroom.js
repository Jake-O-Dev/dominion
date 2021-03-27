const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Councilroom extends ActionEffect {
    constructor() {
        super(4, 1, 0, 0)
    }

    func = (player, playedCard, resolve, reject) => {
        player.getPlayers().filter(plr => plr.name !== player.name).forEach(plr => plr.draw(3))
        resolve(true)
    }

}

module.exports = Councilroom