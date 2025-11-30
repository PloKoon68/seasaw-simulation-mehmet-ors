import { percentage_to_px } from './drawing.js';
import { PLANK_WIDTH, measures, fallThreads, ctx } from './main.js';


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

export function horizontalDistanceToPivot(ball) {
    const radian = measures.angle * Math.PI / 180;
    const dInPixel = percentage_to_px(ball.d)  //convert to pixel

    return dInPixel * Math.cos(radian) + Math.sin(radian) * (PLANK_WIDTH/2 + ball.r)
}

export function updateNetTorque() {
    const radian = measures.angle * Math.PI / 180;
    
    measures.right_side.netTorque = measures.right_side.potentialTorque * Math.cos(radian)
    measures.left_side.netTorque = measures.left_side.potentialTorque * Math.cos(radian)
}


export function distanceToCenterFromBallTouchPoint(bx, by, r) {
    const radian = measures.angle * Math.PI / 180   // get the current angle

    const dPerpendicularToPlankFromCenter = r + PLANK_WIDTH/2
    const dx = bx - dPerpendicularToPlankFromCenter * Math.sin(radian);
    const dy = by + dPerpendicularToPlankFromCenter * Math.cos(radian);   
    const d = Math.sqrt((dx - 50)**2 + (dy - 50)**2);  //returns positive anyway

    return dx < 50? -d: d;   //if on the left side of the plank, return negative d
}


export function calculateMaxPotentialTorque(ball) {
}