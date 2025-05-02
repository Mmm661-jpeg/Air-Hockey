import { useState } from "react"


import GameComponent2 from "../SingleGameComp/GameComp2.jsx";


function SingleMenuComponent()
{
    const[pressedPlay,setPressedPlay] = useState(false);
    const [mode,setMode] = useState(1);

    const theModes = {
        easy: 1,
        medium: 2,
        hard: 3
    };

    return(<>

        {pressedPlay ? <GameComponent2 mode={mode}/>
        
        :
            <div className="flex flex-col align-center justify-between gap-3 p-8 bg-white rounded-lg shadow-xl w-96 h-100">
            <h1 className="text-2xl font-bold font-primary m-2">SinglePlayer</h1>
            <div className="flex flex-col align-center gap-2">
                
                <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-primary"
                onClick={()=>setPressedPlay(prev=>!prev)}>
                    Play!
                </button>

                <button 
                 className= {`px-6 py-3 bg-blue-200 text-white rounded-lg hover:bg-blue-600 transition font-primary ${ mode === theModes.easy ? 'bg-green-500 hover:bg-green-600':'bg-blue-200 hoover:bg-blue-300'}`}
                 onClick={()=>setMode(theModes.easy)}>
                    Easy
                </button>

                <button
                 className= {`px-6 py-3 bg-blue-200 text-white rounded-lg hover:bg-blue-600 transition font-primary ${ mode === theModes.medium ? 'bg-yellow-500 hover:bg-yellow-600':'bg-blue-200 hoover:bg-blue-300'}`}
                 onClick={()=>setMode(theModes.medium)}>
                    Medium
                </button>

                <button
                 className= {`px-6 py-3 bg-blue-200 text-white rounded-lg hover:bg-blue-600 transition font-primary ${ mode === theModes.hard ? 'bg-red-500 hover:bg-red-600':'bg-blue-200 hoover:bg-blue-300'}`}
                 onClick={()=>setMode(theModes.hard)}>
                    Hard
                </button>
            </div>
            </div>
        }


        
    </>)
}

export default SingleMenuComponent