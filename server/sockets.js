

const nanoid = require('nanoid');
const initialGameState = require('./services/gameService');

let rooms = {};
let waitingPlayers = []

const setupSocket = (io) =>
{


    io.on('connection', (socket) => { //listens for connection socket => is always latest connection
        console.log('new client connected on socket:', socket.id);


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
                    state: initialGameState() 
                };

                 //place players in the room.
                socket.join(roomId);
                opponentSocket.join(roomId);

                io.to(roomId).emit('gameStart', { //tell the players the game has startedd
                    roomId,
                    player1: opponentId,
                    player2: socket.id
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


        socket.on('playerMove',(data)=>
        {
            const roomId = Object.keys(rooms).find(id =>
                rooms[id].player1 === socket.id || rooms[id].player2 === socket.id);

            if(roomId)
            {
                rooms[roomId].state = data;
                io.to(roomId).emit('updateGameState', {...data,lastUpdatedBy:socket.id});
            }
        })
    
    });


    setInterval(() => {
        console.log(`Stats: ${waitingPlayers.length} waiting, ${Object.keys(rooms).length} active games`);
      }, 60000);



}
 

    

module.exports = {setupSocket}