
import { draw, percentage_to_px } from './drawing.js';
import { calculateBalltargetY } from './physics.js';
import { htmlUpdateNextWeight } from './ui_updates.js';
import { saveStateToLocalStorage, loadStateFromLocalStorage, resetSeesaw, randomDarkColor } from './state.js';
import { startFalling, updateTorque } from './threads/threadOperations.js';
import { continueSimulation, pauseSimulation  } from './actions.js';


//note: this system is assumed to have a square shape canvas (width=height)
//also, for ease of use, percentage of width-height is used for location unit 
//instead of raw pixel

export const canvas = document.getElementById('seasawCnvs');  //main canvas element
export const ctx = canvas.getContext('2d');   //for drawing objects in canvas
export const rect = canvas.getBoundingClientRect();   //for boundary px

export const LENGTH = canvas.width
export const HEIGHT = canvas.height

export const PLANK_LENGTH = 80;  //!!! CANVAS LENGTH IS 500px. 80% is 400px for seasaw plank, as expected in requirements.
export const PLANK_WIDTH = 5;

export let balls = []

export let ballCount = 0;

let isDragging = false;
let draggingBall = null

export let measures = {
    left_side: {weight: 0, potentialTorque: 0, netTorque: 0},
    right_side: {weight: 0, potentialTorque: 0, netTorque: 0},
    angle: 0,
    angularAcceleration: 0,
    angularVelocity: 0
}

export let isPaused;

//generate seperate thread for each falling ball
export let fallThreads = new Map();  //store currently working threads in a set  {'ball_id': 'worker'}
export let rotationThread;


//set functions so other files functions can mutate them
export function setMeasures(newMeasures) {
    measures = newMeasures;
}

export function setIsPaused(value) {
    isPaused = value;
}

export function setBalls(newBalls) {
    balls = newBalls;
}

export function setRotationThread(newThread) {
    rotationThread = newThread;
}

export function setBallCount(newBallCount) {
    ballCount = newBallCount;
}


function createNewBall(event) {
    const weight = Math.floor(Math.random() * 10) + 1;
    const r = 4 + weight/3;

    const radian = measures.angle * Math.PI / 180
    const maxMovablePoint = Math.abs(Math.cos(radian) * (PLANK_LENGTH/2))   //dynamic based on angle of plank

    balls.push({ 
        x: Math.min(50+maxMovablePoint, Math.max(50-maxMovablePoint, ((event.clientX - rect.left) / LENGTH) * 100)),
        y: 10,
        r: r,
        color:  randomDarkColor(),
        visible: true,
        falling: false,
        savedFallSpeed: 0,
        targetX: null,  
        targetY: null,
        weight: weight,
        d: null,
        onRightSide: null,
        id: ballCount++
    }); 

    htmlUpdateNextWeight();
}


export const pauseButton = document.getElementById("pause-button");
pauseButton.addEventListener("click", () => {
    if (!isPaused) {
        pauseSimulation();
    } else {
        continueSimulation();
    }
    isPaused = !isPaused;
});



canvas.addEventListener('mousedown', (event) => {
    // Canvas üzerindeki tıklama koordinatlarını al (piksel cinsinden)
    const clickX = event.clientX;
    const clickY = event.clientY;
    // Yakalanacak bir top aramak için düşmüş toplar arasında gezin
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        // Sadece düşmüş ve tahterevalli üzerindeki topları kontrol et
        if (!ball.falling) {
            // ADIM 3: Tıklama noktası ile topun merkezi arasındaki mesafeyi hesapla (Pisagor Teoremi)
            const distanceX = (clickX - rect.left) - percentage_to_px(ball.x);
            const distanceY = (clickY - rect.top) - percentage_to_px(ball.y);
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            const pxRadius = percentage_to_px(ball.r)

            if (distance <= pxRadius) {
                isDragging = true;  // Sürükleme başladı!
                draggingBall = ball;    

                ball.oldX = ball.x;
                ball.oldD = ball.d;
                ball.isBeingDragged = true;
                break; // Döngüyü sonlandır, çünkü bir top bulduk.
            }
        }
    }
});

// ball on mouse cursor
canvas.addEventListener('mousemove', (event) => {
    if (isDragging && draggingBall) {
        // Mouse'un X pozisyonunu % olarak al
        const mouseX_pct = ((event.clientX - rect.left) / LENGTH) * 100;
        const radian = measures.angle * Math.PI / 180;
        const cosAngle = Math.cos(radian);

        // Topun olması gereken YENİ 'd' değerini hesapla
        // Bu değeri SADECE GEÇİCİ olarak kullanacağız
        let newD = (mouseX_pct - 50) / cosAngle;

        // Tahterevallinin sınırlarını aşmasını engelle
        const maxD = PLANK_LENGTH / 2;
        newD = Math.max(-maxD, Math.min(maxD, newD));
        draggingBall.d = newD; 
        updateDroppedBallPositionY(draggingBall, measures.angle);

        draw();
    }
    else {
        let lastBallIndex = balls.length-1
        const radian = measures.angle * Math.PI / 180
        const maxMovablePoint = Math.abs(Math.cos(radian) * (PLANK_LENGTH/2))   //dynamic based on angle of plank
        balls[lastBallIndex].x = Math.min(50+maxMovablePoint, Math.max(50-maxMovablePoint, ((event.clientX - rect.left) / LENGTH) * 100));
        balls[lastBallIndex].y = 10;
        balls[lastBallIndex].visible = true;
        draw();
    }
});

canvas.addEventListener('mouseup', (event) => {
    // Eğer bir sürükleme işlemi aktifse...
    if (isDragging) {

        if(draggingBall.oldX <= 50) {
            measures.left_side.weight -= draggingBall.weight;
            measures.left_side.rawTorque -= draggingBall.rawTorque;
        }
        else {
            measures.right_side.weight -= draggingBall.weight;
            measures.right_side.rawTorque -= draggingBall.rawTorque;
        }

//        draggingBall.d = distanceToCenterFromBallTouchPoint(draggingBall.x, draggingBall.y, draggingBall.r);  //d is negative if ball is on the left arm of plank
    
        updateTorque(draggingBall);
        isDragging = false; // Sürükleme bitti!
        draggingBall.isBeingDragged = false;
        draggingBall = null; // Sürüklenen topu serbest bırak
    } else {
        if(!isPaused) {
            let lastBallIndex = balls.length-1
            balls[lastBallIndex].falling = true;
            calculateBalltargetY(balls[lastBallIndex], measures.angle)
            startFalling(balls[lastBallIndex])
            createNewBall(event)
            draw();
        } else {
            alert('First press continue please!')
        }
    }
});


// remove ball when leaves canvas
canvas.addEventListener('mouseleave', () => {
    balls[balls.length-1].visible = false;
    draw();
});


document.getElementById("reset-button").addEventListener("click", resetSeesaw);

//save and reload
window.addEventListener("beforeunload", saveStateToLocalStorage);
window.addEventListener("load", loadStateFromLocalStorage);
 
export function updateDroppedBallPositionY(ball, angleDegrees) {
    // Topun 'd' adresi henüz hesaplanmadıysa hiçbir şey yapma.
    if (!ball.d) {
        return;
    }

    const rad = angleDegrees * Math.PI / 180;

    const localX = ball.d;
    const localY = -(PLANK_WIDTH / 2 + ball.r);

    const globalX = localX * Math.cos(rad) - localY * Math.sin(rad);
    const globalY = localX * Math.sin(rad) + localY * Math.cos(rad);

    ball.x = 50 + globalX;
    ball.y = 50 + globalY;
}