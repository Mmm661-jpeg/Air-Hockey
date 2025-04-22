

export const initialGameState = () => 
({
    paddle1: { x: 0.5, y: 0.9 },  // Player 1 (bottom)
    paddle2: { x: 0.5, y: 0.1 },  // Player 2 (top)
     puck: { 
        x: 0.5, y: 0.5, 
        xVel: (Math.random() - 0.5) * 0.015,
        yVel: (Math.random() < 0.5 ? -1 : 1) * 0.015,        
        radius: 0.02                
        },
        scores: { player1: 0, player2: 0 }
});
    

export const canvasDimensions = {
    CANVAS_HEIGHT: 500,
    CANVAS_WIDTH: 500
};


export const GAME_DIMENSIONS = {
    PADDLE_WIDTH: 0.2,
    PADDLE_HEIGHT: 0.04,
    PUCK_RADIUS: 0.02
};

export const PHYSICS = {
  MAX_SPEED: 0.025,        // Normalized units/frame
  PADDLE_SPEED: 0.025,     // Player movement speed
  FRICTION: 0.985,         // Puck slowdown per frame
  PADDLE_REBOUND: 1.5,     // Velocity multiplier on paddle hits
  WALL_REBOUND: 0.9        // Velocity multiplier on wall hits
};

  