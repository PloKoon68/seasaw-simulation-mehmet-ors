let fallSpeed = 0;
const gravityAcceleration = 10;   //gravity acceleration
const loopPeriod = 20;   //20ms

let dynamicTargetY;

onmessage = function(e) {
    dynamicTargetY = e.data.targetY;   //targetY may update during fall (if plank is keep rotating at the same tim)
    if(e.data.type === 'initial')  {  //only staty the thread starts
        let y = e.data.y;
        //if loaded saved state, continue with last fallSpeed
        if(e.data.loadedFallSpeed) loadedFallSpeed = e.data.loadedFallSpeed

        loop(y);
    }
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
console.log("ch")
async function loop(y) {
    while (true) {

        if(y > dynamicTargetY) {
            y = dynamicTargetY
            postMessage({ y: dynamicTargetY, done: true, fallSpeed: fallSpeed }); // send new vertical position to main thread
            break;
        }
        fallSpeed += gravityAcceleration * (loopPeriod/1000);
        y += fallSpeed;        postMessage({ y }); // send new vertical position to main thread
        await wait(loopPeriod)
    }   

}

	
