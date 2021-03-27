const Context = require('./Context')
const Filter = require('./Filter')


class CardEffect {
    constructor() {
        this.draw = 0
        this.purchases = 0
        this.actions = 0
        this.coins = 0
        this.heldCurrency = 0
        this.inDeckVictory = 0
        this.context = undefined
    }
}

class ActionEffect extends CardEffect {
    constructor (draw, purchases, actions, coins) {
        super()
        this.draw = draw
        this.purchases = purchases
        this.actions = actions
        this.coins = coins
    }

    apply = (player) => {
        if (player === undefined) {
            console.log("ERROR: unapply called with undefined player");
        } else {
            if (this.draw > 0) {
                player.draw(this.draw)
            }
            player.purchases += this.purchases
            player.actions += this.actions
            player.coins += this.coins
        }
    }

    play = (player, card) => {
        return new Promise((resolve, reject) => {
            this.apply(player)
            this.func(player, card, resolve, reject)
        })
    }

    func = (player, card, resolve, reject) => {
        resolve(true)
    }
}


class TreasureEffect extends CardEffect {
    constructor (heldCurrency) {
        super()
        this.heldCurrency = heldCurrency
    }
}

class VictoryEffect extends CardEffect {
    constructor (inDeckVictory) {
        super()
        this.inDeckVictory = inDeckVictory
    }

    calc = (player) => {
        return this.inDeckVictory
    }
}

module.exports = {ActionEffect, TreasureEffect, VictoryEffect}