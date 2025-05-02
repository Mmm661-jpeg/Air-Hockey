const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const {setupSocket} = require('./sockets');

const app = express();


const PORT = 5000;



app.use(cors());


const server = http.createServer(app);
const io = new Server(server,{cors:
    {
        origin: '*',
    }
});




app.get("/",(req,res)=>res.send("Air hockey server is on"));


server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });


  setupSocket(io); //manages websockets


  app.use(express.static(path.join(__dirname, '../client/airhockey-front/dist')));