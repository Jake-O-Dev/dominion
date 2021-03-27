const Player = require('./src/player')
const Card = require('./src/Card.js')
const CardType = require('./src/CardType')

//#region websocketserver
const port = 8000
const WebSocketServer = require('websocket').server;
const HTTP = require('http');

const server = HTTP.createServer()
server.listen(port)
console.log(`Listening on port ${port}`);

const wsServer = new WebSocketServer({
    httpServer: server
})

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + '-' + s4()
}
//#endregion

//#region vars & constans
const max_players = 5
var gameStarted = false
const clients = {}
const players = []
var shop = {}
//#endregion

//#region Methods
const getPlayers = () => players

const getShop = () => shop

const getActivePlayer = () => {
    return players.find((player) => player.isturn)
}

const broadcast = (obj) => {
    players.forEach((player) => {
        player.connection.send(JSON.stringify(obj))
    })
} 

const getPlayer = (connection) => {
    return players.find((player) => {return player.connection === connection})
}

const sendLobbyData = () => {
    const lobbyData = []
    players.forEach((player) => {
        lobbyData.push(player.getLobbyData())
    })
    broadcast({
            type: 'setplayers',
            players: lobbyData
        })
}

const updateShop = () => {
    broadcast({
        type: 'setshop',
        shop: shop
    })
}

const startGame = () => {
    gameStarted = true
    setNextInTurnorder()
    shop = Card.getDefaultShop()
    console.log("Starting game")
    players.forEach((player) => {
        player.setupPlayer()
    })
    setTurn()
}

const setTurn = () => {
    const activePlayer = getActivePlayer()
    if (activePlayer !== undefined) {
        broadcast({
            type: 'setturn',
            shop: shop,
            cards: activePlayer.getCardsObject(),
            coins: activePlayer.coins,
            purchases: activePlayer.purchases,
            actions: activePlayer.actions,
            turn: activePlayer.name,
            state: activePlayer.state,
        })
    } else {
        console.log("BIG FUCKING ERROR: setturn whilst no activeplayer");
    }
}

const setNextInTurnorder = () => {
    var target
    const player = getActivePlayer()
    if (player === undefined) {
        target = players[0]
    } else {
        index = players.indexOf(player)
        player.isturn = false
        player.state = 'WACHTING'
        if (index === players.length -1) {
            target = players[0]
        } else {
            target = players[index + 1]
        }
    }
    target.isturn = true
    target.state = 'ACTION'
}

const gameEndCheck = () => {
    // provinces empty
    if (shop['victory'][2][1] === 0) {
        return true
    }
    if (shop['action'].filter(entry => entry[1] === 0).length >= 3) {
        return true
    }
    return false
}

const getWinner = () => {
    const results = []
    players.forEach(player => results.push({name:player.name, points:player.getVictoryPoints()}))
    results.sort((a, b) => b.points - a.points)
    return results
}

//#endregion

//#region onmessage 
wsServer.on('request', (req) => {
    var userID = getUniqueID()
    console.log('New connection from ' + req.origin + '. Gave id: ' + userID + ".");

    const connection = req.accept(null, req.origin)
    clients[userID] = connection;

    connection.on('message', (msg) => {
        if (msg.type === 'utf8') {
            const data = JSON.parse(msg.utf8Data)
            //#endregion
            console.log("PACKET: " + data.type);
            if (data.type === 'login') {
                if (!gameStarted) {
                    if ((players.length < max_players) && (data.name !== '')) {
                        if (players.length === 0 || !players.some((player) => {return player.name === data.name})) {
                            players.push(new Player(connection, data.name, getPlayers, getShop))
                            connection.send(JSON.stringify({
                                type: 'login-return',
                                status: 'approved',
                                name: data.name
                            }))
                            console.log("Added player: " + data.name);
                            sendLobbyData()
                        } else {
                            connection.send(JSON.stringify({
                                type: 'login-return',
                                status: 'denied',
                                text: 'Name already exists.'
                            }))
                            console.log("Denied login: Name already exists.")
                        }
                    } else {
                        connection.send(JSON.stringify({
                            type: 'login-return',
                            status: 'denied',
                            text: 'Game is full.'
                        }))
                        console.log("Denied login: Game is full.")
                    }
                } else {
                    connection.send(JSON.stringify({
                        type: 'login-return',
                        status: 'denied',
                        text: 'Game has started.'
                    }))
                    console.log("Denied login: Game has started.")
                }
            }
            if (data.type === 'toggle-ready') {
                const player = getPlayer(connection)
                if (player !== undefined) {
                    if (!gameStarted) {
                        player.ready = !player.ready
                        sendLobbyData()
                        if ((players.length > 1) & (players.every((player) => {return player.ready === true}))) {
                            startGame()
                        }
                    } else {
                        console.log("ERROR: Got 'toggle-ready' whilst game has already started. " + player.name);
                    } 
                } else {
                    console.log("ERROR: Got 'toggle-ready' from undefined Player.");
                }
            }
            if (data.type === 'get-shop') {
                const player = getPlayer(connection)
                if (player !== undefined) {
                    connection.send(JSON.stringify({
                        type: 'setshop',
                        shop: shop
                    }))
                } else {
                    console.log("ERROR: Got 'get-shop'-request from undefined Player.")
                }
            }
            if (data.type === 'purchase') {
                const player = getPlayer(connection)
                if (player !== undefined) {
                    if (shop[data.group][data.key][1] !== 0) {
                        if (shop[data.group][data.key][0].cost <= player.coins) {
                            if (player.purchases > 0) {
                                if (shop[data.group][data.key][1] > 0) {
                                    shop[data.group][data.key][1] -= 1
                                }

                                player.discardPile.push(shop[data.group][data.key][0])

                                player.purchases -= 1
                                player.coins -= shop[data.group][data.key][0].cost

                                broadcast({
                                    type: 'purchase',
                                    player: player.name,
                                    purchases: player.purchases,
                                    coins: player.coins,
                                    card: shop[data.group][data.key][0],
                                    shop: shop,
                                })
                                updateShop()
                            } else {
                                console.log("Attempted purchase without any buys left.");
                            }
                        } else {
                            console.log("Attempted purchase of too expensive item.");
                        }
                    } else {
                        console.log("Attempted purchase of out of stock item.")
                    }
                } else {
                    console.log("ERROR: Got 'purchase'-request from undefined Player.")
                }
            }
            if (data.type === 'play') {
                const player = getPlayer(connection) 
                if (player !== undefined) {
                    if (player === getActivePlayer()) {
                        if (player.actions > 0) {
                            const card = player.heldCards[data.key]
                            if (card !== undefined) {
                                const save = player.save()
                                player.actions -= 1
                                player.heldCards.splice(data.key, 1)
                                player.playedCards.push(card)
                                if (card.type.group == CardType.ACTION.group) {
                                    card.effect.play(player, card).then(res => {
                                        if (res) {
                                            broadcast({
                                                type: 'play',
                                                cards: player.getCardsObject(),
                                                stats: player.getRoundStats(),
                                            })
                                        } else {
                                            player.load(save)
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                        player.load(save)
                                        player.connection.send(JSON.stringify({
                                            type: 'update-cards-stats',
                                            cards: player.getCardsObject(),
                                            stats: player.getRoundStats(),
                                        }))
                                    })
                                }
                            } else {
                                console.log("ERROR: Player played undefined card");
                            }
                        }
                    }
                }
            }
            if (data.type === 'buy-done') {
                const player = getPlayer(connection) 
                if (player !== undefined) {
                    if (player === getActivePlayer()) {
                        player.postRoundCleanup()
                        if (gameEndCheck()) {
                            const results = getWinner()
                            broadcast({
                                type: 'game-over',
                                results: results
                            })
                        } else {
                            setNextInTurnorder()
                            setTurn()
                        }
                    }
                }
            }
            if (data.type === 'action-done') {
                const player = getPlayer(connection) 
                if (player !== undefined) {
                    if (player === getActivePlayer()) {
                        player.actionToBuy()
                        connection.send(JSON.stringify({
                            type: 'action-done',
                            state: player.state
                        }))
                        setTurn()
                    }
                }
            }
            if (data.type === 'select-asked') {
                const player = getPlayer(connection) 
                if (player !== undefined) {
                    if (player.resolve !== undefined) {
                        if (data.status === 'approved') {
                            player.resolve(data.response)
                        } else {
                            player.reject("'select-ask' was rejected.")
                            player.reject = undefined
                            player.resolve = undefined
                        }
                    } else {
                        console.log("ERROR: Player was never 'select-asked'.");
                        
                    }
                }
            }
        }
    })
})