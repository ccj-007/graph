import { option } from './option'
const myCanvas = document.getElementById('myCanvas');
const ctx = myCanvas.getContext("2d");
const dpr = window.devicePixelRatio
ctx.width = myCanvas.style.width * dpr
ctx.height = myCanvas.style.height * dpr

// 坐标系转换

function requestAnimation() {
    requestAnimationFrame(requestAnimation);
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 100, 100);
}

requestAnimation();