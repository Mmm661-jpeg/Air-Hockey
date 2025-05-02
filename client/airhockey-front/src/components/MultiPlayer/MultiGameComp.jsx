

import { useEffect, useState,useRef, useCallback } from "react";
import { getSocket } from "../../utils/socketManager.js"

import { canvasDimensions, GAME_DIMENSIONS } from '../../utils/gameSettings.js' //use server dimensions eventually.

function MultiGameComp({firstState})
{
    const [currentState,setCurrentState] = useState(firstState);
    const { paddle1, paddle2, puck, scores, gameOn } = currentState;

    const {CANVAS_HEIGHT,CANVAS_WIDTH } = canvasDimensions
    const {PADDLE_HEIGHT, PADDLE_WIDTH} = GAME_DIMENSIONS

    const canvasRef = useRef();
    const socketRef = useRef(null);


    const drawGame = useCallback(()=> //less re-renders
    {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const wallWidth = 10;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, wallWidth, CANVAS_HEIGHT);
        ctx.fillRect(CANVAS_WIDTH - wallWidth, 0, wallWidth, CANVAS_HEIGHT);

        const puckX = puck.x * CANVAS_WIDTH;
        const puckY = puck.y * CANVAS_HEIGHT;
        const puckRadius = puck.radius * CANVAS_WIDTH;
        ctx.beginPath();
        ctx.arc(puckX, puckY, puckRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();


        const drawPaddle = (paddle) =>
        {
            const paddleWidth = PADDLE_WIDTH * CANVAS_WIDTH;
            const paddleHeight = PADDLE_HEIGHT * CANVAS_HEIGHT;
            ctx.fillRect(
                paddle.x * CANVAS_WIDTH - paddleWidth / 2,
                paddle.y * CANVAS_HEIGHT - paddleHeight / 2,
                paddleWidth,
                paddleHeight
            );
        };


        drawPaddle(paddle1);
        drawPaddle(paddle2); 

        if (!gameOn) {
            ctx.fillStyle = "white";
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        }

    },[paddle1, paddle2, puck, gameOn, CANVAS_WIDTH, CANVAS_HEIGHT]);


    const movePlayer = useCallback((event) =>
    {
        const left = 37;
        const right = 39;

        if(event.keyCode === left || event.key === "ArrowLeft")
        {
            socketRef.current.emit('movePlayer',{direction:-1});
        }
        
        if(event.keyCode === right || event.key === "ArrowRight" )
        {
            socketRef.current.emit('movePlayer',{direction:1});
        }

    },[]);


    useEffect(() => 
    {
        const socket = getSocket();
        socketRef.current = socket;

        socket.on('updateGameState', (data) => 
        {
            setCurrentState(data.state);
        });


        window.addEventListener("keydown", movePlayer);

        let animationFrameId;
        const gameLoop = () => {
            drawGame();
            animationFrameId = requestAnimationFrame(gameLoop); //60fps 
        };

        gameLoop();

        return () => {
            window.removeEventListener("keydown", movePlayer);
            socket.off('updateGameState');
            cancelAnimationFrame(animationFrameId); //id used for cancel
        };

    }, [drawGame, movePlayer]);




    return(
        <>
         <div className = 'flex flex-col min-h-screen items-center justify-between'>
            <h1 className = 'mt-5 mb-1 text-xl font-bold font-primary'> Player2 Score: {scores.player2} </h1>
            <canvas className="shadow-xl" ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
            <h1 className= 'mb-6 mt-2 text-xl font-bold font-primary'> Player1 score: {scores.player1} </h1>
        </div>
        </>
    )
}

export default MultiGameComp