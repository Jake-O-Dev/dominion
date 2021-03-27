const Filter = require('./Filter')

class Context {
    constructor(amount, min, fromLocation, filters, msg) {
        this.amount = amount
        this.min = min
        this.fromLocation = fromLocation // 'hand', 'discard', 'draw', 'shop', 'trash'
        this.filters = filters // obj[], obj = Filter.constructor arg1
        this.msg = msg
    }

    checkCard = card => this.filters.every(filter => Filter.gen(filter).forEach(filter => filter(card)))

    checkCards = cards => cards.every(card => this.checkCard(card))
    
}

module.exports = Context