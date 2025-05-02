
import { useEffect, useState } from "react"
import { connectSocket, getSocket } from "../../utils/socketManager.js"

import MultiGameComp from "./MultiGameComp.jsx";


function MultiMenuComp()
{
  
    const [connected, setConnected] = useState(false);
    const [showStartButton, setShowStartButton] = useState(false);
    const [playerReady,setPlayerReady] = useState(false);
    const [gameOn,setGameOn] = useState(false);

    const [firstState,setFirstState] = useState(null);


    useEffect(() => 
    {
        const socket = connectSocket();

        function onConnect() { setConnected(true); }
        function onGameStart(data) { setShowStartButton(true); console.log('Connected to room: ',data);}
        function onPlayerReady(data) {  console.log('Opponent has clicked ready: ', data); }
        function onRealStart(data) { setGameOn(true); setFirstState(data.state); console.log('The game is now on', data) }
      
        socket.on('connect', onConnect);
        socket.on('gameStart', onGameStart);
        socket.on('playerReady', onPlayerReady);
        socket.on('startGame', onRealStart);
      
        return () => {
          socket.off('connect', onConnect);
          socket.off('gameStart', onGameStart);
          socket.off('playerReady', onPlayerReady);
          socket.off('startGame', onRealStart);
        };

    }, []);
      



    const clickReady = () =>
    {
        const socket = getSocket();
        if(socket)
        {
            socket.emit('playerReady',{ready:true});

            setPlayerReady(true);
        }
       
    }



    return(
        <>

         {gameOn ? <MultiGameComp firstState={firstState}/>
        
        :
            <div className="flex flex-col align-center justify-between gap-3 p-8 bg-white rounded-lg shadow-xl w-96 h-100">
                <h1 className="text-2xl font-bold font-primary m-2">MultiPlayer</h1>

                <h2 className="text-xl font-bold font-primary">{showStartButton ? 'Waiting on opponent..':'Looking for opponents...'}</h2>

                <button 
                    className= {`px-6 py-3 bg-blue-${playerReady ? 200:500} text-white rounded-lg hover:bg-blue-600 transition font-primary`}
                    onClick={clickReady}
                    disabled={playerReady}>
                        Ready!
                </button>

          
            </div>
        }

        </>
    )
}

export default MultiMenuComp