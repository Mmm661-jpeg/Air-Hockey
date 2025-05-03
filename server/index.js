const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');


const {setupSocket} = require('./sockets');

const app = express();
const server = http.createServer(app);


const PORT = process.env.PORT || 8080;



app.use(cors());

const distPath = path.join(__dirname, '../client/dist');

app.use(express.static(path.join(__dirname, distPath)));

app.get('/{*any}', (req, res) => {
res.sendFile(path.join(__dirname, distPath, 'index.html'));
});


const io = new Server(server,{cors:
    {
        origin: '*',
    }
});





server.listen(PORT, '0.0.0.0' ,() => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });


  setupSocket(io); //manages websockets


  