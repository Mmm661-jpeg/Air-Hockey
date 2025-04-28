

const {PHYSICS,GAME_DIMENSIONS, initialGameState} = require('../utils/gameSettings')

const { MAX_SPEED, FRICTION, PADDLE_REBOUND, WALL_REBOUND, PADDLE_SPEED } = PHYSICS;
const {PADDLE_HEIGHT, PADDLE_WIDTH ,PUCK_RADIUS} = GAME_DIMENSIONS




 const movePlayer = (data) => 
    {
        const {direction,paddle} = data
        if(!direction)
        {
            return
        }
    
        let newX = paddle.x + Math.sign(direction) * PADDLE_SPEED;
        newX = Math.max(0, Math.min(1, newX));
    
        return {...paddle,x:newX}
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
    
    
    
       const updateGameState = (state) => {
    
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
            return {...initialGameState(),scores,gameOn:state.gameOn};
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

module.exports = {updateGameState,movePlayer}