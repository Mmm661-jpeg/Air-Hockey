


### If you want to understand and maybe implement your own version heres a breakdown of singlePlayerService.js :




**`leftftRight`**  will be a  **positive**  or negative number (`1`  or  `-1`)  
and informs us whether to move the paddle  **right or left**.

We first check if there was any movement at all; if not, we return early.

`PADDLE_SPEED`  is a constant (representing  how much the paddle can move per frame).

We calculate the new  `x`  value for the next frame by adding  or subtracting  `PADDLE_SPEED`.

	export  const  movePlayer  = (leftRight,paddle1) =>
	{
	if(!leftRight)
	{
	return
	}

	let  newX  =  paddle1.x  +  Math.sign(leftRight) *  PADDLE_SPEED;

	newX  =  Math.max(0, Math.min(1, newX));
	return {...paddle1,x:newX}

	}


We check if either the left wall or the right wall has the same `x` value as our puck (collision!)

We have a rebound factor which is also a constant and this adds speed after a collison:

`puck.xVel  =  -puck.xVel  *  reboundFactor; `

You will see this across the entire file: ` puck.x  =  Math.max(0, Math.min(1, puck.x));`

This keeps the puck/paddle inbound maximum is set to 1 and minimum is set to 0.

We have a goal if the ball goes through the bottom or top of the canvas and if there is a goal we add too the score.

	const  handleWallCollisions  = (puck, reboundFactor, scores) =>

	{

	// Left/Right walls

	if (puck.x  <=  0  ||  puck.x  >=  1) {

	puck.xVel  =  -puck.xVel  *  reboundFactor;

	puck.x  =  Math.max(0, Math.min(1, puck.x)); // Prevent sticking

	}

	  

	const  goalScored  = (puck.y  -  puck.radius  <=  0) || (puck.y  +  puck.radius  >=  1);

	  

	if(goalScored)

	{

	if(puck.y  -  puck.radius  <=  0)

	{

	scores.player1  +=1;

	}

	else

	{

	scores.player2  +=1;

	}

	  

	return  true;

	}

	else

	{

	return  false;

	}

	};


The **if** checks that the pucks rightside/leftside is within the bounds of the paddle (Left side of puck within the bounds of the left side of padddle etc). We also look at the y coordinates if the ball is above or under. 

Here we look at where the puck hit the paddle if it was too the left of our x ((x,y) is at center of paddle)  or the right. **const  hitOffset  = (puck.x  -  paddle.x) / (PADDLE_WIDTH/2);**

Then we apply this too our xVel (where x is set to go next) and also add a speed boost too it: **puck.xVel  =  hitOffset  *  reboundFactor;**

Here we look at the y. If the puck y value is less than the paddles that means we are hitting the lower side, so this should bounce down not up: **const yDirection = puck.y < paddle.y ? -1 : 1;** 




	const  handlePaddleCollisions  = (puck, paddle1, paddle2, reboundFactor) => {

	[paddle1, paddle2].forEach(paddle  => {

	if (

	puck.x  +  puck.radius  >  paddle.x  -  PADDLE_WIDTH  /  2  &&

	puck.x  -  puck.radius  <  paddle.x  +  PADDLE_WIDTH  /2  &&

	puck.y  +  puck.radius  >  paddle.y  -  PADDLE_HEIGHT  /2  &&

	puck.y  -  puck.radius  <  paddle.y  +  PADDLE_HEIGHT/2

	)

	{

	// Calculate rebound angle based on hit position

	const  hitOffset  = (puck.x  -  paddle.x) / (PADDLE_WIDTH/2);

	puck.xVel  =  hitOffset  *  reboundFactor;

	  

	const  yDirection  =  puck.y  <  paddle.y  ?  -1  :  1;

	puck.yVel  =  yDirection  *  Math.abs(puck.yVel) *  reboundFactor;

	}

	});

	};

	  

	const  clampVelocity  = (puck, maxSpeed) => {

	const  currentSpeed  =  Math.sqrt(puck.xVel**2  +  puck.yVel**2);

	  

	if (currentSpeed  >  maxSpeed  &&  currentSpeed  >  0) //extra 0 check to avoid error

	{

	const  ratio  =  maxSpeed  /  currentSpeed;

	puck.xVel  *=  ratio;

	puck.yVel  *=  ratio;

	}

	};


Illustration:

	With Radius (Correct)
	       _____
	     /       \
	    (    •    )  ← puck.radius visible
	     \ _____ /
	       ↓
	▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
	
	
	Without Radius (Incorrect)
	       •
	       ↓
	▔▔▔▔▔▔▔▔▔▔▔

Reason we use **clampVelocity** is that we dont want too high speeds. 

First we calculate the current speed: 

	Y-Axis (Vertical)
	   ↑
	   |       ↗ Diagonal (xVel=1, yVel=1 → speed=√2)
	   |     / 
	   |   /  
	   | /    
	   +——————→ X-Axis (Horizontal)
	  /|
	 / |
	   | 
	   |  

Then we check that it does not exceed max speed. And then we slow it while keeping its direction the same.

	const  clampVelocity  = (puck, maxSpeed) => {

	const  currentSpeed  =  Math.sqrt(puck.xVel**2  +  puck.yVel**2);

	  

	if (currentSpeed  >  maxSpeed  &&  currentSpeed  >  0) //extra 0 check to avoid error

	{

	const  ratio  =  maxSpeed  /  currentSpeed;

	puck.xVel  *=  ratio;

	puck.yVel  *=  ratio;

	}

	};


This makes sure the ball never moves just horizontally. If the y.vel is not headed up or down we force it.


	const  MIN_Y_VEL  =  0.005;

	  

	if (Math.abs(puck.yVel) <  MIN_Y_VEL)

	{

	puck.yVel  =  Math.sign(puck.yVel  || (Math.random() <  0.5  ?  1  :  -1)) *  MIN_Y_VEL;

	}

