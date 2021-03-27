class Filter {
    static gen = (obj) => {
        const filters = []
        if (obj.cardtypegroup !== undefined) {
            filters.push((card) => card.type.group === obj.cardtypegroup)
        }
        if (obj.cardtypename !== undefined) {
            filters.push((card) => card.type.name === obj.cardtypename)
        }
        if (obj.maxcost !== undefined) {
            filters.push(card => card.cost <= obj.maxcost)
        }
        if (obj.name !== undefined) {
            filters.push(card => card.name === obj.name)
        }
        return filters
    }

    static getCardList = (ctxt, cards, shop, playCard) => {
        const checkCard = (card) => {return ctxt.filters.every(obj => Filter.gen(obj).every(filter => filter(card)))}
        var tempCardList = []
        switch (ctxt.fromLocation) {
            case 'hand':
                tempCardList = cards.heldCards.map(card => [card, false])
                break;
        
            case 'discard':
                tempCardList = cards.discardPile.map(card => [card, false])
                break;
    
            case 'shop':
                shop['victory'].forEach(slot => tempCardList.push([slot[0], false]))
                shop['treasure'].forEach(slot => tempCardList.push([slot[0], false]))
                shop['action'].forEach(slot => tempCardList.push([slot[0], false]))
                break;

            case 'extra':
                tempCardList = cards.extra.map(card => [card, false])
                break;
    
            default:
                tempCardList = []
        }
        console.log(playCard.name);
        const pc = tempCardList.find(card => card.name === playCard)
        console.log(pc);
        if (pc !== undefined) {
            tempCardList.splice(tempCardList.indexOf(pc), 1)
        }
        return tempCardList.filter(card => checkCard(card[0]))
    }

    static filterFalse = (cardList) => {
        return cardList.filter(arr => arr[1]).map(arr => arr[0])
    }

    static isValid = (cardList, context) => {
        const filterCheck = cardList.every(card => context.filters.every(obj => Filter.gen(obj).every(filter => filter(card))))
        const lengthCheck = (cardList.length <= context.amount) && (cardList.length >= context.min)
        return filterCheck && lengthCheck
    } 
}

module.exports = Filter