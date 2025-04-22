
import { PHYSICS, GAME_DIMENSIONS } from "../utils/gameSettings";


const { MAX_SPEED, FRICTION, PADDLE_REBOUND, WALL_REBOUND, PADDLE_SPEED } = PHYSICS;
const {PADDLE_HEIGHT, PADDLE_WIDTH ,PUCK_RADIUS} = GAME_DIMENSIONS


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


export const movePlayer = (leftRight,paddle1) =>
{
    if(!leftRight)
    {
        return
    }

    let newX = paddle1.x + Math.sign(leftRight) * PADDLE_SPEED;
    newX = Math.max(0, Math.min(1, newX));

    return {...paddle1,x:newX}
}



  const handleWallCollisions = (puck, reboundFactor, scores) => 
{ 
    // Left/Right walls
    if (puck.x <= 0 || puck.x >= 1) {
      puck.xVel = -puck.xVel * reboundFactor;
      puck.x = Math.max(0, Math.min(1, puck.x)); // Prevent sticking
    }

    const goalScored = (puck.y - puck.radius <= 0) || (puck.y + puck.radius >= 1);

    if(goalScored)
    {
        if(puck.y - puck.radius <= 0)
        {
            scores.player1 +=1;
        }
        else
        {
            scores.player2 +=1;
        }

        return true;
    }
    else
    {
        return false;
    }
  
  };


  const handlePaddleCollisions = (puck, paddle1, paddle2, reboundFactor) => {
 
    [paddle1, paddle2].forEach(paddle => {
      if (
        puck.x + puck.radius > paddle.x - PADDLE_WIDTH / 2 &&
        puck.x - puck.radius < paddle.x + PADDLE_WIDTH /2 &&
        puck.y + puck.radius > paddle.y - PADDLE_HEIGHT /2 &&
        puck.y - puck.radius < paddle.y + PADDLE_HEIGHT/2
      ) 
      
      {
        // Calculate rebound angle based on hit position
        const hitOffset = (puck.x - paddle.x) / (PADDLE_WIDTH/2);
        puck.xVel = hitOffset * reboundFactor;

        const yDirection = puck.y < paddle.y ? -1 : 1;
        puck.yVel = yDirection * Math.abs(puck.yVel) * reboundFactor;
      }
    });
  };

  const clampVelocity = (puck, maxSpeed) => {
    const currentSpeed = Math.sqrt(puck.xVel**2 + puck.yVel**2);

    if (currentSpeed > maxSpeed && currentSpeed > 0) //extra 0 check to avoid error
    {
      const ratio = maxSpeed / currentSpeed;
      puck.xVel *= ratio;
      puck.yVel *= ratio;
    }
  };



  export const updateGameState = (state) => {

    const { puck, paddle1, paddle2, scores } = state; 

  
    
    // 1. Apply friction
    puck.xVel *= FRICTION;
    puck.yVel *= FRICTION;

    // 2. Update position
    puck.x += puck.xVel;
    puck.y += puck.yVel;
  
    // 3. Handle collisions
    const reset = handleWallCollisions(puck, WALL_REBOUND, scores);

    if(reset)
    {
        return {...initialGameState(),scores};
    }

    handlePaddleCollisions(puck, paddle1, paddle2, PADDLE_REBOUND);
  
    // 4. Clamp velocity
    clampVelocity(puck, MAX_SPEED);

    const MIN_Y_VEL = 0.005;

    if (Math.abs(puck.yVel) < MIN_Y_VEL)
    {
        puck.yVel = Math.sign(puck.yVel || (Math.random() < 0.5 ? 1 : -1)) * MIN_Y_VEL;
    }


    return { ...state, puck };
  };