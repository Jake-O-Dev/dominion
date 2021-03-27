const { VictoryEffect, ActionEffect, TreasureEffect} = require('./CardEffect')

class CardType {

    static UNKNOWN = new CardType("unknown", 'unknown', undefined)

    static VICTORY = new CardType("victory", "victory", "Victory", VictoryEffect)
    static CURSE = new CardType("curse", "victory", "Curse", VictoryEffect)

    static TREASURE = new CardType("treasure", "treasure", "Treasure", TreasureEffect)

    static ACTION = new CardType("action", "action", "Action", ActionEffect)
    static ACTIONREACTION = new CardType("actionreaction", "action", "Action - Reaction", ActionEffect)
    static ACTIONATTACK = new CardType("actionattack", "action", "Action - Attack", ActionEffect)

    constructor(name, group, display, effectClass) {
        this.name = name
        this.group = group
        this.display = display
        this.effectClass = effectClass
    }
}

module.exports = CardType