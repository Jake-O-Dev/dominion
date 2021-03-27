const CardType = require('./CardType')
const { VictoryEffect, ActionEffect, TreasureEffect } = require('./CardEffect')
const Cellar = require('./cardeffects/Cellar')
const ThroneRoom = require('./cardeffects/ThroneRoom')
const Harbinger = require('./cardeffects/Harbinger')
const Chapel = require('./cardeffects/Chapel')
const Vassal = require('./cardeffects/Vassal')
const Remodel = require('./cardeffects/Remodel')
const Workshop = require('./cardeffects/Workshop')
const Bureaucrat = require('./cardeffects/Bureaucrat')
const MoneyLender = require('./cardeffects/Moneylender')
const Militia = require('./cardeffects/Militia')
const Councilroom = require('./cardeffects/Councilroom')
const Mine = require('./cardeffects/Mine')
const Witch = require('./cardeffects/Witch')
const Gardens = require('./cardeffects/Gardens')
const Poacher = require('./cardeffects/Poacher')

class Card {
    //#region CARDS
    static UNKNOWN = () => new Card('Unknown', CardType.UNKNOWN, -1, undefined)

    // TREASURE
    static COPPER = () => new Card("Copper", CardType.TREASURE, 0, new TreasureEffect(1))
    static SILVER = () => new Card("Silver", CardType.TREASURE, 3, new TreasureEffect(2))
    static GOLD = () => new Card("Gold", CardType.TREASURE, 6, new TreasureEffect(3))

    // VICTORY
    static ESTATE = () => new Card("Estate", CardType.VICTORY, 2, new VictoryEffect(1))
    static DUCHY = () => new Card("Duchy", CardType.VICTORY, 5, new VictoryEffect(3))
    static PROVINCE = () => new Card("Province", CardType.VICTORY, 8, new VictoryEffect(6))
    static GARDENS = () => new Card("Gardens", CardType.VICTORY, 4, new Gardens())

    static CURSE = () => new Card("Curse", CardType.CURSE, 0, new VictoryEffect(-1))


    // ACTION
    // cost: 2
    static CELLAR = () => new Card("Cellar", CardType.ACTION, 2, new Cellar())
    static CHAPEL = () => new Card("Chapel", CardType.ACTION, 2, new Chapel())
    static MOAT = () => new Card("Moat", CardType.ACTIONREACTION, 2, new ActionEffect(2, 0, 0, 0))

    // cost: 3
    static MERCHANT = () => new Card("Merchant", CardType.ACTION, 3, new ActionEffect(1, 0, 1, 0))
    static VASSAL = () => new Card("Vassal", CardType.ACTION, 3, new Vassal())
    static VILLAGE = () => new Card("Village", CardType.ACTION, 3, new ActionEffect(1, 0, 2, 0))
    static WORKSHOP = () => new Card("Workshop", CardType.ACTION, 3, new Workshop())
    static HARBINGER = () => new Card("Harbinger", CardType.ACTION, 3, new Harbinger())
    static SMITHY = () => new Card("Smithy", CardType.ACTION, 3, new ActionEffect(3, 0, 0, 0))

    // cost: 4
    static THRONEROOM = () => new Card("Throneroom", CardType.ACTION, 4, new ThroneRoom())
    static REMODEL = () => new Card("Remodel", CardType.ACTION, 4, new Remodel())
    static BUREAUCRAT = () => new Card("Bureaucrat", CardType.ACTIONATTACK, 4, new Bureaucrat())
    static MILITIA = () => new Card("Militia", CardType.ACTIONATTACK, 4, new Militia())
    static MONEYLENDER = () => new Card("Moneylender", CardType.ACTION, 4, new MoneyLender())
    static POACHER = () => new Card("Poacher", CardType.ACTION, 4, new Poacher())

    // cost: 5
    static COUNCILROOM = () => new Card("Councilroom", CardType.ACTION, 5, new Councilroom())
    static FESTIVAL = () => new Card("Festival", CardType.ACTION, 5, new ActionEffect(0, 1, 2, 2))
    static LABORATORY = () => new Card("Laboratory", CardType.ACTION, 5, new ActionEffect(2, 0, 1, 0))
    static MARKET = () => new Card("Market", CardType.ACTION, 5, new ActionEffect(1, 1, 1, 1))
    static WITCH = () => new Card("Witch", CardType.ACTION, 5, new Witch())
    static MINE = () => new Card("Mine", CardType.ACTIONATTACK, 5, new Mine())


    // first edition
    static WOODCUTTER = () => new Card("Woodcutter", CardType.ACTION, 3, new ActionEffect(0, 1, 0, 2)) // 1e
    //#endregion

    constructor(name, type, cost, effect, src=name+".jpg") {
        this.name = name
        this.type = type
        this.cost = cost
        this.effect = effect
        this.src = src
    }

    // in shop niet de functie callen, maar functie sturen, dan in ShopCard "const card = arr[0]()"

    static getDefaultShop = () => {
        const defaultShop = {}
        defaultShop['victory'] = [
            [Card.ESTATE(), 10],
            [Card.DUCHY(), 10],
            [Card.PROVINCE(), 10],
        ]
        defaultShop['treasure'] = [
            [Card.COPPER(), -1],
            [Card.SILVER(), -1],
            [Card.GOLD(), -1],
        ]
        defaultShop['action'] = [
            [Card.CELLAR(), 10],
            [Card.MOAT(), 10],

            [Card.VILLAGE(), 10],
            [Card.MERCHANT(), 10],
            [Card.WORKSHOP(), 10],
            [Card.SMITHY(), 10],

            [Card.MILITIA(), 10],
            [Card.REMODEL(), 10],
            
            [Card.MINE(), 10],
            [Card.MARKET(), 10],
        ]
        return defaultShop
    }
}

module.exports = Card