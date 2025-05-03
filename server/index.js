require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');





const {setupSocket} = require('./sockets');

const app = express();
const server = http.createServer(app);


const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'production';

const allowedOrigins = [process.env.ALLOWED_ORIGIN_LOCAL, process.env.ALLOWED_ORIGIN_PRODUCTION];

const ourOrigin =  ENV === 'production' ? allowedOrigins[1] : allowedOrigins[0];


app.use(cors(
    {
        origin: ourOrigin,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
));

if(ENV !== 'dev')
{
    const distPath = path.join(__dirname, 'client');
    console.log('Serving static files from:', distPath);



    app.use(express.static(path.join(distPath)));

    app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
    });

}
else
{
    console.log('Files not served stat we are in development');
}



const io = new Server(server,{cors:
    {
        origin: ourOrigin,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
});





server.listen(PORT, '0.0.0.0' ,() => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });


  setupSocket(io); //manages websockets


  