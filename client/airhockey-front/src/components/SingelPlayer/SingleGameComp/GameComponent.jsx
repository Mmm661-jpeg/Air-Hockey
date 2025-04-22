

import { useEffect, useRef, useState } from "react";
import { canvasDimensions, GAME_DIMENSIONS } from "../../../utils/gameSettings";
import { initialGameState,movePlayer, updateGameState } from "../../../services/singlePlayerServices"
import { botMove } from "../../../services/botService";

function GameComponent({mode})
{
   
    const [gameIsOn,setGameIsOn] = useState(true);;

    const [gameState, setGameState] = useState(initialGameState);

    const {paddle1,paddle2,puck,scores} = gameState;


    const {PADDLE_HEIGHT, PADDLE_WIDTH} = GAME_DIMENSIONS

    const {CANVAS_HEIGHT,CANVAS_WIDTH } = canvasDimensions
    const canvasRef = useRef();



    const drawCanvas = () =>
    {
        const canvas = canvasRef.current;

        if(!canvas)
        {
            return
        }

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);


        const wallWidth = 10;

        ctx.fillStyle = "white";

        ctx.fillRect(0, 0, wallWidth, CANVAS_HEIGHT);

        ctx.fillRect(CANVAS_WIDTH - wallWidth, 0, wallWidth, CANVAS_HEIGHT);
  
    }

    const drawGameObj = () =>
    {
        const canvas = canvasRef.current;

        if(!canvas)
        {
            return
        }

        const ctx = canvas.getContext("2d");

        const puckX = puck.x * CANVAS_WIDTH;
        const puckY = puck.y * CANVAS_HEIGHT;
        const puckRadius = puck.radius * CANVAS_WIDTH;

        
        ctx.beginPath();
        ctx.arc(puckX, puckY, puckRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();


        const paddle1Width = PADDLE_WIDTH * CANVAS_WIDTH;
        const paddle1Height = PADDLE_HEIGHT * CANVAS_HEIGHT;
    
        ctx.fillStyle = "white";

        ctx.fillRect(
            paddle1.x * CANVAS_WIDTH - paddle1Width / 2,
            paddle1.y * CANVAS_HEIGHT - paddle1Height / 2,
            paddle1Width,
            paddle1Height
        );
    
 
        const paddle2Width = PADDLE_WIDTH * CANVAS_WIDTH;
        const paddle2Height = PADDLE_HEIGHT * CANVAS_HEIGHT;
    
        ctx.fillRect(
            paddle2.x * CANVAS_WIDTH - paddle2Width / 2,
            paddle2.y * CANVAS_HEIGHT - paddle2Height / 2,
            paddle2Width,
            paddle2Height
        );



    }

    const endGame = () =>
        {
            const canvas = canvasRef.current;
    
            if(!canvas)
            {
                return
            }
    
            const ctx = canvas.getContext("2d");
    
            ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    
    
            ctx.fillStyle = "white";
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", CANVAS_WIDTH/ 2, CANVAS_HEIGHT / 2);

            setGameIsOn(false);
        }



    const checkEndGame = (gameState) =>
    {
        const diff = Math.abs(gameState.scores.player1 - gameState.scores.player2);

        if(diff > 5)
        {
            endGame();
        }
    }

    const callMovePlayer = (event) =>
    {
        const left = 37;
        const right = 39;

        if(event.keyCode === left || event.key === "ArrowLeft")
        {
            setGameState(prev => ({...prev,paddle1:movePlayer(-1,prev.paddle1)}));
        }

        if(event.keyCode === right || event.key === "ArrowRight" )
        {
            setGameState(prev => ({...prev,paddle1:movePlayer(1,prev.paddle1)}));
        }
      
    }

    const callMoveBot = (mode) =>
    {
        setGameState(prev => ({...prev,paddle2:botMove(prev.paddle2,prev.puck,mode)}));
    
    }

    const callUpdatePuck = () =>
    {
        setGameState(prev => updateGameState(prev));

    }

    
 

    useEffect(() =>
    {
        const handleKeyDownEvent = (event) =>
        {
            callMovePlayer(event);
        }

        window.addEventListener("keydown",handleKeyDownEvent);

        return () =>
        {
            window.removeEventListener("keydown",handleKeyDownEvent);
        }

    },[])

    useEffect(() => 
    {
        if(gameIsOn)
        {
            const interval = setInterval(() => {

                drawCanvas();
                callUpdatePuck();
                callMoveBot(mode);
                drawGameObj();
                checkEndGame(gameState);
                
            }, 1000 / 45);

            return () => clearInterval(interval);
        }

    },[gameIsOn,gameState])



    return(
        <>
        <div className = 'flex flex-col min-h-screen items-center justify-between'>
            <h1 className = 'mt-5 mb-1 text-xl font-bold font-primary'>Bot score: {scores.player2} </h1>
            <canvas className="shadow-xl" ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
            <h1 className= 'mb-6 mt-2 text-xl font-bold font-primary'>Your score: {scores.player1} </h1>
        </div>
        </>
    )
}

export default GameComponent