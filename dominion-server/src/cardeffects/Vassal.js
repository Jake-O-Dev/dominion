const Context = require("../Context")
const { ActionEffect } = require('../CardEffect')

class Vassal extends ActionEffect {
    constructor() {
        super(0, 0, 0, 2)
    }

    func = (player, playedCard, resolve, reject) => {
        const temp = player.drawIntoArray(1)
        if ((temp !== undefined) && (temp[0] !== undefined)) {
            const card = temp[0]
            if (card.type.group === 'action') {
                player.askSelectUnknown(new Context(1, 0, 'extra', []), [card]).then(res => {
                    if (res.length = 1) {
                        card.effect.play(player).then(result => {
                            resolve(result)
                        }).catch(err => reject(err))
                    } else {
                        player.discardPile.push(card)
                        resolve(true)
                    }
                }, err => reject(err))
            } else {
                player.discardPile.push(card)
                resolve(true)
            }
        } else {
            console.log(temp);
            player.drawPile.push(...temp)
            reject("err: Failed to draw (Vassel)")
        }
    }

}

module.exports = Vassal