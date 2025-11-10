onmessage = function(e) {
    let { y, targetY, weight } = e.data;

    let fallSpeed = 0;
    let acceleration = weight * 0.1;

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log("eorker started")
    async function loop() {
        /*
        if (y < targetY) {
            fallSpeed += acceleration;
            y += fallSpeed;
            console.log("eorking")
            postMessage({ y }); // send new vertical position to main thread
        } else {
            postMessage({ y: targetY, done: true }); // reached target
        }
        */
        while (y < targetY) {
            fallSpeed += acceleration;
            y += fallSpeed;
            console.log("eorking: ", y)
            postMessage({ y }); // send new vertical position to main thread
            await wait(20)
        }   

    }

    loop();
    console.log("closed")
};
