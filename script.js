const canvas = document.getElementById('seasawCnvs');  //main canvas element
const cheight = canvas.height
const cwidth = canvas.width

const ctx = canvas.getContext('2d');   //for drawing objects in canvas

const pHeight = (percentage) => {
    return percentage * cheight / 100;
}
const pWidth = (percentage) => {
    return percentage * cwidth / 100;
}

const pfillRectWith = (x, w, y, h) => {
    ctx.fillRect(pWidth(x), pHeight(y), pWidth(w), pHeight(h));
}

// Draw ground
ctx.fillStyle = '#0d8a41ff';
pfillRectWith(0, 100, 80, 20)



/*
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.fillText('Test text!', 200, 100);
*/

// Clear canvas (wipe everything)
//ctx.clearRect(50, 50, canvas.width, canvas.height);

