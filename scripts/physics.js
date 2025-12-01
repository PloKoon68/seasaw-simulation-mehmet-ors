import { percentage_to_px } from './drawing.js';
import { PLANK_WIDTH, PLANK_LENGTH, measures } from './main.js';


export let track = null

export function calculateBalltargetY(ball, angle) {    // called for each ball when the rotation thread updates the angle
    const radian = angle * Math.PI / 180;
    const newTargetY = 50 + (Math.tan(radian) * (ball.x - 50)) - ((PLANK_WIDTH/2 + ball.r) / Math.cos(radian)) 
    ball.targetY = newTargetY
}

export function updateDroppedBallPosition(ball, angle) {    // called for each ball when the rotation thread updates the angle
    const radian = angle * Math.PI / 180;

    const newY = ball.d * Math.sin(radian) - (ball.r + PLANK_WIDTH/2) * Math.cos(radian) + 50;
    const newX = ball.d * Math.cos(radian) + (ball.r + PLANK_WIDTH/2) * Math.sin(radian) + 50;
    ball.y = newY
    ball.x = newX
}

export function calculateDPointInPixels(ball) {
    const radian = measures.angle * Math.PI / 180;

    return percentage_to_px(ball.d * Math.cos(radian) + Math.sin(radian) * (PLANK_WIDTH/2 + ball.r))
}

export function updateNetTorque(balls) {
    /*
    const radian = measures.angle * Math.PI / 180;
    
    measures.right_side.netTorque = measures.right_side.potentialTorque * Math.cos(radian)
    measures.left_side.netTorque = measures.left_side.potentialTorque * Math.cos(radian)
    */
    let rightNetTorque = 0;
    let leftNetTorque = 0;
    for(let i = 0; i < balls.length-1; i++) {
        if(balls[i].d > 0) rightNetTorque += percentage_to_px(balls[i].x - 50) * balls[i].weight //positive d meaning ball is on right side
        else leftNetTorque +=  percentage_to_px(50 - balls[i].x) * balls[i].weight
    }
    let netTorque = rightNetTorque - leftNetTorque;
    console.log("right: ", rightNetTorque)
    measures.right_side.netTorque = rightNetTorque;
    measures.left_side.netTorque = leftNetTorque;
    measures.systemNetTorque = netTorque;
}


export function calculateD(bx, by, r) {  //ball.d value which is the perpendicular distance of ball touch point to the center of seasaw
    const radian = measures.angle * Math.PI / 180   // get the current angle

    const dPerpendicularToPlankFromCenter = r + PLANK_WIDTH/2
    const dx = bx - dPerpendicularToPlankFromCenter * Math.sin(radian);
    const dy = by + dPerpendicularToPlankFromCenter * Math.cos(radian);   
    const d = Math.sqrt((dx - 50)**2 + (dy - 50)**2);  //returns positive anyway

    return dx < 50? -d: d;   //if on the left side of the plank, return negative d
}

export function isBallOnRightSide(ball) { //true if ball on right side, false if on left side
    const radian = measures.angle * Math.PI / 180;

    const ballTouchPointX = ball.x - (ball.r * Math.sin(radian))  //the x point where the weight touches on plank
    const upperSideCenterOfPlank = 50 + ((PLANK_WIDTH/2) * Math.sin(radian));   //center of the upper side of the seesaw
    return ballTouchPointX > upperSideCenterOfPlank;
}

export function xValueLimit(x, r) {
    const radian = measures.angle * Math.PI / 180
    const xMovableLimit = Math.cos(radian) * (PLANK_LENGTH/2)
    const plankWidhExtention = Math.sin(radian) * ((PLANK_WIDTH/2) + r)
    
    const leftLimit = 50 - xMovableLimit + plankWidhExtention
    const rightLimit = 50 + xMovableLimit + plankWidhExtention
      //dynamic based on angle of plank
    return Math.min(rightLimit, Math.max(leftLimit, x));
}
