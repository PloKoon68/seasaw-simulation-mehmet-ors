onmessage = function(e) {
    let { y, targetY, weight } = e.data;

    let fallSpeed = 0;
    let acceleration = weight * 0.01;

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log("eorker started")
    async function loop() {

        while (y < targetY) {
            fallSpeed += acceleration;
            y += fallSpeed;
            if(y > targetY) y = targetY
            postMessage({ y }); // send new vertical position to main thread
            console.log("sp: ", fallSpeed)
            await wait(20)
        }   
        console.log("final, sending: ", targetY)
        postMessage({ y: Math.round(targetY) }); 

    }

    loop();
    console.log("closed")
};
