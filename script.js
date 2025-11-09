const canvas = document.getElementById('seasawCnvs');  //main canvas element
const cheight = canvas.height
const cwidth = canvas.width

const ctx = canvas.getContext('2d');   //for drawing objects in canvas


ctx.fillStyle = 'red';
ctx.fillRect(cwidth * 0.6, cheight * 0.1, 50, 50 * cheight / cwidth);
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.fillText('Canvas Working!', 200, 100);