import { measures, balls, fallThreads, rotationThread, setRotationThread } from '../main.js';
import { updateNetTorque } from '../physics.js';

import { htmlUpdateLeftWeight, htmlUpdateRightWeight, htmlUpdateLeftPotentialTorque, htmlUpdateRightPotentialTorque, htmlUpdateRotationParameters, htmlUpdateRotationIndicator } from '../ui_updates.js';
import { draw, percentage_to_px } from '../drawing.js';
import { playImpactSound, addLog } from '../actions.js';
import { calculateD, updateDroppedBallPosition, calculateBalltargetY, xValueLimit } from '../physics.js';
 

export function startFalling(ball, loadedFallSpeed) {
    const fallThread = new Worker('scripts/threads/fallThread.js');

    // Add threadto map, bonding it with relevant ball (with ball id)
    fallThreads.set(ball.id, fallThread);

    fallThread.postMessage({
        type: 'initial',
        targetY: ball.targetY,
        y: ball.y,
        loadedFallSpeed: loadedFallSpeed
    });

    fallThread.onmessage = function (e) {
        ball.y = e.data.y;   // update balls current position
        ball.savedFallSpeed = e.data.fallSpeed; //saving for load state
        ball.x = xValueLimit(ball.x, ball.r)  
        draw();

        if (e.data.done) {   // the moment ball has fallen and touches the plank
            playImpactSound(ball.weight);

            ball.falling = false;   //ball falled
           
            fallThread.terminate(); // close the thread
            fallThreads.delete(ball.id); // delte it from the set

            updateTorque(ball);
        }
    };
}
export function updateTorque(ball, isDragging) {

    if(isDragging) { //if this weight was a dragged dropped weight instead of a fallen weight, decrease it's last raw torque effect from it's previous side
        console.log("drag drop")
        if(ball.oldD > 0) {  //if ball was previously on right side
            console.log("sağddsaan çık")
            measures.right_side.weight -= ball.weight;
            measures.right_side.potentialTorque -= ball.potentialTorque; 
        } else {
            console.log("soldan çık")
            measures.left_side.weight -= ball.weight;
            measures.left_side.potentialTorque -= ball.potentialTorque;
        }
    }

    //torque calculation: d * w    
    ball.d = calculateD(ball.x, ball.y, ball.r);  //d is negative if ball is on the left arm of plank
    const potentialTorque = percentage_to_px(Math.abs(ball.d)) * ball.weight;   //in case angle is 0, this is the maximu torque this specific weight can apply
    ball.potentialTorque = potentialTorque;

    //update measures object
    if(ball.d > 0) {  //if ball is on right side
        measures.right_side.weight += ball.weight;
        measures.right_side.potentialTorque += potentialTorque; 
    } else {
        measures.left_side.weight += ball.weight;
        measures.left_side.potentialTorque += potentialTorque;
    }

    if(!isDragging) addLog(ball.weight, ball.d > 0? "right": "left", ball.d) //update in html
    htmlUpdateRightWeight();
    htmlUpdateRightPotentialTorque();
    htmlUpdateLeftWeight();
    htmlUpdateLeftPotentialTorque();


    if(rotationThread) {  //if the plank was on rotation during the ball touced the plank, update rotation parameters (measuers and balls)
        rotationThread.postMessage({
            type: 'update',
            measures: measures,
            balls: balls.slice(0, -1)
        })
    } else {
        startRotation()
    }
    //start rotating
}


export function startRotation(loadedAngularVelocity) {
    setRotationThread(new Worker('scripts/threads/rotationThread.js'));
    rotationThread.postMessage({
        measures: measures,
        balls: balls.slice(0, -1),
        type: 'initial',
        loadedAngularVelocity: loadedAngularVelocity
    });


    rotationThread.onmessage = function(e) {  //angle updated
        measures.angle = e.data.angle; // update ball position
        measures.angularAcceleration = e.data.angularAcceleration
        measures.angularVelocity = e.data.angularVelocity
        //update already dropped balls positions
        for(let i = 0; i < balls.length-1; i++) {   
            if(!balls[i].falling) {
                updateDroppedBallPosition(balls[i], measures.angle)
            }
        }

        //update falling balls target y and x limits
        if(measures.angle < 30 && measures.angle > -30) {
            for(let i = balls.length-1; i >= 0; i--) {
                if(balls[i].falling) { //last n balls are falling, update their targetY
                    calculateBalltargetY(balls[i], measures.angle);  //last balls targetY change
                    updateFallingBallTarget(balls[i])                //send new targetY value to fallingThread of that ball

                } 
            }
        }
        const lastInd = balls.length-1
        balls[lastInd].x = xValueLimit(balls[lastInd].x, balls[lastInd].r)  
        
        if(e.data.finished) {
            terminateRotationThread();
            
            htmlUpdateRotationIndicator()
            //angular velocity and acceleration becomes 0
            measures.angularVelocity = 0;
            measures.angularAcceleration = 0;
        }
        updateNetTorque(balls);  // update net tork values of right and left sde when angle is updated

        htmlUpdateRotationParameters();

        htmlUpdateRotationIndicator()

        draw();             
    };
}

export function terminateRotationThread() {
    if (rotationThread) {
            rotationThread.terminate();
            setRotationThread(null);
    }
}

export function terminateFallingThreads() {
    for (const [id, thread] of fallThreads.entries()) {
        thread.terminate(); // close the thread
        fallThreads.delete(id); // delte it from the set
    }
}

function updateFallingBallTarget(ball) {        // as the seasaw rotates durin gthe fall of the weight, the y destiny of the weighr should be updated
    const thread = fallThreads.get(ball.id);
    if (thread) {
        thread.postMessage({
            type: 'update',
            targetY: ball.targetY
        });
    }
}