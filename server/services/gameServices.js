

const initialGameState = () =>
{
    const initGamestate = 
    {
        paddle1: { x: 0.5, y: 0.9 },
        paddle2: { x: 0.5, y: 0.1 },
        puck: { x: 0.5, y: 0.5, xVel: 0, yVel: 0 },
        scores: { player1: 0, player2: 0 }
    }

    return initGamestate;
}

module.exports = {initialGameState}