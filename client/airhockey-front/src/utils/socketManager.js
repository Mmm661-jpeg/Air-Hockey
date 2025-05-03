
import { io } from "socket.io-client";



const PORT = process.env.PORT || 8080;


let socket;

export const connectSocket = () => {
    if (!socket) {
        socket = io(`http://localhost:${PORT}`);
    }
    return socket;
};


export const getSocket = () => {return socket}
