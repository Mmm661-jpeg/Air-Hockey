

const {nanoid} = require('nanoid');

const {initialGameState} = require('./utils/gameSettings');

const {updateGameState,movePlayer} = require('./services/gameServices')

let rooms = {};
let waitingPlayers = []

const setupSocket = (io) =>
{


    io.on('connection', (socket) => { //listens for connection socket => is always latest connection
        console.log('new client connected on socket:', socket.id);
        console.log('Waiting:', waitingPlayers.length);


        if(waitingPlayers.length > 0) //if theres waiting players try join a match vs them.
        {
            const opponentId = waitingPlayers.shift();
            const opponentSocket =  io.sockets.sockets.get(opponentId);

            if(opponentSocket)
            {
                const roomId = `room_${nanoid()}`; // name room then create it
                rooms[roomId] = {
                    player1: opponentId,
                    player2: socket.id,
                    state: initialGameState(),
                    ready: {player1:false,player2:false},

                };

                 //place players in the room.
                socket.join(roomId);
                opponentSocket.join(roomId);

               

                io.to(roomId).emit('gameStart', { //tell the players the game has startedd
                    roomId,
                    player1: opponentId,
                    player2: socket.id,
                    ready: {player1:false,player2:false}
                });
            }
            else
            {
                waitingPlayers.push(socket.id); //if fails join queue
            }
        }
        else //else you becme waiting player.
        {
            waitingPlayers.push(socket.id);
        }
    
        

        socket.on('disconnect',()=>
        {
            console.log('Client disconnected:', socket.id);

            waitingPlayers = waitingPlayers.filter(id => id !== socket.id); //free up spots in 'waitingPlayers' as a player has disconnected

            for (const roomId in rooms) //cleanup room.
            {
                const room = rooms[roomId];

                if (room.player1 === socket.id || room.player2 === socket.id)
                {
                  const otherPlayer = room.player1 === socket.id ? room.player2 : room.player1;

                  if(otherPlayer)
                  {
                    io.to(otherPlayer).emit('Opponent has disconnected');
                  }
                
                  delete rooms[roomId];
                  break;
                }
            }
        
        });


        socket.on('playerReady',(data) =>
        {
            const roomId = findRoom(socket);

            if(!roomId)
            {
                return
            }

            let thePlayer = identifyPlayer(socket,roomId);

            rooms[roomId].ready[thePlayer] = data.ready

            io.to(roomId).emit('playerReady',{ready:rooms[roomId].ready})

            if(rooms[roomId].ready.player1 && rooms[roomId].ready.player2)
            {
                rooms[roomId].state.gameOn = true;

                rooms[roomId].ready = { player1: false, player2: false };

                io.to(roomId).emit('startGame',{state:rooms[roomId].state,ready:rooms[roomId].ready})
            }
        });


        socket.on('movePlayer',(data) =>
        {
            
            
            const roomId = findRoom(socket);

            if(roomId)
            {
                let thePlayer = identifyPlayer(socket,roomId);
                let newPaddle;

                if(thePlayer === 'player1')
                {
                    data.paddle = rooms[roomId].state.paddle1

                    newPaddle = movePlayer(data);
                    rooms[roomId].state.paddle1 = newPaddle
                }
                else
                {
                    data.paddle = rooms[roomId].state.paddle2;
                    newPaddle = movePlayer(data);

                    rooms[roomId].state.paddle2 = newPaddle
                }

                io.to(roomId).emit('movePlayer', {newPaddle:newPaddle, player:thePlayer});
            }
        });


        socket.emit('updateGame',()=>
        {
           
        });
    
    });


    setInterval(() => {

        for(const roomId in rooms)
        {
            if(rooms[roomId].state.gameOn)
            {
                const newState = updateGameState(rooms[roomId].state);
                rooms[roomId].state = newState;
                io.to(roomId).emit('updateGameState', {state: newState});

                console.log('state sent: ',newState)
            }

        }}, 1000/60);


    


    setInterval(() => {
        console.log(`Stats: ${waitingPlayers.length} waiting, ${Object.keys(rooms).length} active games`);
      }, 10000);



}


const findRoom = (socket) =>
{
    const roomId = Object.keys(rooms).find(id =>
        rooms[id].player1 === socket.id || rooms[id].player2 === socket.id);

    return roomId
}

const identifyPlayer = (socket,roomId) =>
{
    return socket.id === rooms[roomId].player1 ? 'player1':'player2'
    
}
 

    

module.exports = {setupSocket}