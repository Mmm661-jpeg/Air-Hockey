import { PHYSICS, GAME_DIMENSIONS } from "../utils/gameSettings";


export const botMove = (paddle2, puck, mode) =>
{



   if(mode === 1) //easy
   {
        return botModelEasy(paddle2,puck);
   }

   if(mode === 2)
   {
        return botModelMedium(paddle2,puck);
   }

   if(mode === 3)
   {
        return botModelHard(paddle2,puck);
   }
}


const botModelHard = (paddle2, puck) =>
{
    const { PADDLE_SPEED } = PHYSICS;
    let newX;

  
    if (Math.random() < 0.1) //10% chance do nothing per frame
    {
        newX = paddle2.x; 
        return { ...paddle2, x: newX };
    }

    const dist = puck.x - paddle2.x;

    newX = paddle2.x + Math.sign(dist) * PADDLE_SPEED * 1; //full speed



    newX = Math.max(0, Math.min(1, newX));

    return { ...paddle2, x: newX };
}

const botModelMedium = (paddle2,puck) =>
{
    const { PADDLE_SPEED } = PHYSICS;
    let newX;

  
    if (Math.random() < 0.4) //40% chance do nothing per frame
    {
        newX = paddle2.x; 
        return { ...paddle2, x: newX };
    }

    const dist = puck.x - paddle2.x;

   
    if (Math.random() < 0.05) //5% change move wrong direction
    {
        newX = paddle2.x - Math.sign(dist) * PADDLE_SPEED * 0.80; //5% extra slow +
    } 

    else {
        newX = paddle2.x + Math.sign(dist) * PADDLE_SPEED * 0.85; //15% slower
    }


    newX = Math.max(0, Math.min(1, newX));

    return { ...paddle2, x: newX };
}

const botModelEasy = (paddle2,puck) =>
{
    const { PADDLE_SPEED } = PHYSICS;
    let newX;

  
    if (Math.random() < 0.6) //60% chance do nothing per frame
    {
        newX = paddle2.x; 
        return { ...paddle2, x: newX };
    }

    const dist = puck.x - paddle2.x;

   
    if (Math.random() < 0.15) //15% change move wrong direction
    {
        newX = paddle2.x - Math.sign(dist) * PADDLE_SPEED * 0.6;
    } 

    else {
        newX = paddle2.x + Math.sign(dist) * PADDLE_SPEED * 0.8; //20% slower
    }


    newX = Math.max(0, Math.min(1, newX));

    return { ...paddle2, x: newX };
}