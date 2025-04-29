## Few notes on how the MultiPlayerGameComp works


We first receive the first game in the menu when both players are ready. We input this as a prop inside of our component so that the fist render can be made/drawn. 

We then setup our useStates,imports and refs and destruct when needed.

### UseCallback(()=>)

In react usually what happens is that the methods/functions get rebuilt on every render. This may lead to further unnecessary renders and in a game we want to minimize renders and only rebuild the function when needed. So we gather all the functions under respective usecallbacks.


### requestAnimationFrame

Our server send the game back to us in 60fps, most browsers 're-render' at about the same rate. When we request animation frame we are asking the browser too manage the re-rendering for us at this rate (drawing).

So in our gameloop:

        const gameLoop = () => {
            drawGame();
            animationFrameId = requestAnimationFrame(gameLoop); //60fps 
        };

We are telling the browser to run gameLoop just before its natural re-render (at around 60fps) which is the same frame rate server expects. We save the animationId so that it can be used for stopping this loop.


### UseEffect(()=>)

In our useffect we have [drawGame, movePlayer] as dependencies these are 2 methods that are inside UseCallback so this means that the useeffect is triggered when or if these 2 methods are rebuilt (somethings changes like paddle1 x value).


### Sockets:

We get our socket (connected to earlier) through the getSocket method, we then store it in socketRef because we want to acces it without causing re-renders and we also want to use the same socket across the component without losing it or re-calling it.

We .emit through the 'movePlayer' "channel" (send data) and we mount a listener:

         socket.on('updateGameState', (data) => 
        {
            setCurrentState(data.state);
        });

That listens to the 'updateGameState' channel and sets the state when it receives a new state from server.

