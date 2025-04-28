# Air-Hocket

This is a air-hockey game (also called Pong) with a singleplayer and multiplayer mode. Built using a React client and a Node.js server.

## Features

- 🎮 **Multiplayer Mode**: Play against other players online with real-time 1v1 matches using WebSockets
- 🤖 **Single Player**: Practice against AI with 3 difficulty levels
- 🏓 **Physics Engine**: Realistic puck movement and collisions
- 🔌 **WebSocket Integration** - Low-latency multiplayer with Socket.IO
- ⚡ **60FPS Gameplay**: Smooth animation using requestAnimationFrame

## Installation

Clone the repository:

    git clone https://github.com/Mmm661-jpeg/Air-Hockey

Install dependecies:

Server:

    cd server
    npm install express socket.io nanoid cors

Client:

    cd client
    cd airhockey-front
    npm install socket.io-client react

##

***If you would like too create your own version, feel free to read the other ReadMe's nested inside project at:***


- [MultiPlayer ReadMe](client/airhockey-front/src/components/MultiPlayer/mpReadMe.md)
- [SinglePlayer Services ReadMe](client/airhockey-front/src/services/spReadMe.md)



