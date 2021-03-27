const Card = require('./Card')
const CardType = require('./CardType')

class Player {

    static defaultCards = () => [
        Card.COPPER(),
        Card.COPPER(),
        Card.COPPER(),
        Card.COPPER(),
        Card.COPPER(),
        Card.COPPER(),
        Card.COPPER(),
        Card.ESTATE(),
        Card.ESTATE(),
        Card.ESTATE(),
    ]

    static defaultActions = 1
    static defaultPurchases = 1
    static defaultCoins = 0
    static defaultDraw = 5

    constructor(connection, name, getPlayers, getShop) {
        this.connection = connection
        this.name = name

        this.ready = false
        this.isturn = false
        this.state = "LOBBY"

        this.getPlayers = getPlayers
        this.getShop = getShop

        this.discardPile = []
        this.drawPile = []
        this.heldCards = []
        this.playedCards = []
        this.trashed = []

        this.resolve = undefined
        this.reject = undefined

        this.actions = 0
        this.purchases = 0
        this.coins = 0

        this.silver = Card.SILVER
        this.curse = Card.CURSE
    }

    save = () => {
        return {
            cardsObject: {
                heldCards: this.heldCards.map(c => c),
                drawSize: this.drawPile.size,
                discardSize: this.discardPile.size,
                playedCards: this.playedCards.map(c => c),
                discardPile: this.discardPile.map(c => c),
                trashed: this.trashed.map(c => c),
            },
            drawPile: this.drawPile,
            stats: this.getState()
        }
    }

    load = (save) => {
        this.setCardsObject(save.cardsObject, save.drawPile)
        this.setState(save.stats)
    }

    getLobbyData = () => {return {
        name: this.name,
        ready: this.ready,
        isturn: this.isturn,
        state: this.state
    }}

    setupPlayer = () => {
        this.drawPile = Player.defaultCards()
        this.shuffleDraw()
        this.actions = Player.defaultActions
        this.purchases = Player.defaultPurchases
        this.coins = Player.defaultCoins
        this.draw(Player.defaultDraw)
    }

    actionToBuy = () => {
        var silvers = 0
        var merchants = 0
        this.heldCards.forEach((card) => {
            if (card.type.group === CardType.TREASURE.group) {
                this.coins += card.effect.heldCurrency
                if (card.name === 'Silver') silvers += 1
                
            }
        }, this)
        this.playedCards.forEach(card => {
            if (card.name === 'Merchant') merchants += 1
        })
        this.coins += Math.min(silvers, merchants) * 1
        this.state = 'BUY'
    }

    postRoundCleanup = () => {
        // for (var i = this.heldCards.length; i > 0; i--) {
        //     this.discardPile.push(this.heldCards.pop())
        // }
        this.discardPile.push(...this.playedCards)
        this.playedCards = []
        this.discardPile.push(...this.heldCards)
        this.heldCards = []
        this.actions = Player.defaultActions
        this.purchases = Player.defaultPurchases
        this.coins = Player.defaultCoins
        this.draw(Player.defaultDraw)
    }

    getCardsObject = () => {
        return {
            heldCards: this.heldCards,
            drawSize: this.drawPile.length,
            discardSize: this.discardPile.length,
            playedCards: this.playedCards,
            discardPile: this.discardPile,
            trashed: this.trashed
        }
    }

    setCardsObject = (obj, drawPile = undefined) => {
        this.heldCards = obj.heldCards
        this.playedCards = obj.playedCards
        this.discardPile = obj.discardPile
        this.trashed = obj.trashed
        if (drawPile !== undefined) {
            this.drawPile = drawPile
        }
    }

    getRoundStats = () => {
        return {
            purchases: this.purchases,
            coins: this.coins,
            actions: this.actions,
        }
    }

    shuffleDraw = () => {
        for (var i = this.drawPile.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.drawPile[i];
            this.drawPile[i] = this.drawPile[j];
            this.drawPile[j] = temp;
        }
    }

    draw = (n) => {
        for (var i = 0; i < n; i++) {
            if (this.drawPile.length === 0) {
                if (this.discardPile.length === 0) return
                this.drawPile.push(...this.discardPile)
                this.discardPile = []
                this.shuffleDraw()
            }
            this.heldCards.push(this.drawPile.pop())
        }
    }

    drawIntoArray = (n) => {
        const ret = []
        for (var i = 0; i < n; i++) {
            if (this.drawPile.length === 0) {
                if (this.discardPile.length === 0) return
                this.drawPile.push(...this.discardPile)
                this.discardPile = []
                this.shuffleDraw()
            }
            ret.push(this.drawPile.pop())
        }
        return ret
    }

    getVictoryPoints = () => {
        var points = 0
        const allcards = []
        allcards.push(...this.discardPile, ...this.heldCards, ...this.drawPile)
        allcards.filter(card => card.type.group === 'victory').forEach(card => points += card.effect.calc())
        return points
    }

    getDefaultState = () => { return {
        actions: defaultActions,
        purchases: defaultPurchases,
        coins: defaultCoins
    }}

    setState = (state) => {
        this.actions = state.actions
        this.purchases = state.purchases
        this.coins = state.coins
    }

    getState = () => { return {
        actions: this.actions,
        purchases: this.purchases,
        coins: this.coins
    }}

    getReactionCards = () => this.heldCards.filter(card => card.type.name === 'actionreaction')

    hasMoat = () => this.getReactionCards().find(card => card.name === 'Moat') !== undefined

    askSelect = (card, extra = []) => {
        if (this.resolve !== undefined) console.log("BIG ERROR: 2 promises overlapping");
        const cards = this.getCardsObject()
        if (card.effect.context.fromLocation === 'extra') {
            cards['drawPile'] = extra
        }
        return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
            this.connection.send(JSON.stringify({
                type: 'ask-select',
                context: card.effect.context,
                cards: cards,
                cardname: card.name,
            }))
        }).then(result => {
            this.resolve = undefined
            this.reject = undefined
            return result
        })
    }

    askSelectUnknown = (context, extra = []) => {
        if (this.resolve !== undefined) return
        const cards = this.getCardsObject()
        if (context.fromLocation === 'extra') {
            cards['extra'] = extra
        }
        return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
            this.connection.send(JSON.stringify({
                type: 'ask-select',
                context: context,
                cards: cards,
                card: Card.UNKNOWN().name,
            }))
        }).then(result => {
            this.resolve = undefined
            this.reject = undefined
            return result
        })
    }
}

module.exports = Player