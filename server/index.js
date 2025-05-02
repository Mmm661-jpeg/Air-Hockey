const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');


const {setupSocket} = require('./sockets');

const app = express();


const PORT = process.env.PORT || 8080;



app.use(cors());

app.use(express.static(path.join(__dirname, '../client/airhockey-front/dist')));

app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '../client/airhockey-front/dist', 'index.html'));
});


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


  