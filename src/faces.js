var debounce = require('debounce');

export const initVideo = (debug) => {

    let wasmWorker = new Worker('wasm-worker.js');

    let video = document.querySelector("#videoElement");
    let objType = 'faceDetect';
    let characterPic = document.getElementById('characterPic');

    // check for getUserMedia support
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        // get webcam feed if available
        navigator.getUserMedia({ video: true }, handleVideo, () => console.log('error with webcam'));
        // setTimeout(detect, 8000)
    }

    document.addEventListener('DOMContentLoaded', function () {
        console.log('dom loaded')
    }, false);

    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }

    let canvases = {};
    canvases.running = false;
    canvases.ready = false;

    canvases.wasm = {};
    canvases.wasm.fps = 0;
    canvases.wasm.lastTime = +new Date;
    canvases.wasm.fpsArr = [];
    canvases.wasm.color = 'rgba(255, 0, 0, 1)';

    canvases.width = 320;
    canvases.height = 240;
    canvases.scale = 2;

    canvases.wasm.canvas = document.getElementById('wasm');
    canvases.wasm.context = canvases.wasm.canvas.getContext('2d');
    canvases.wasm.canvas.width = canvases.width;
    canvases.wasm.canvas.height = canvases.height;

    canvases.dummy = {};
    canvases.dummy.canvas = document.getElementById('dummy');
    canvases.dummy.context = canvases.dummy.canvas.getContext('2d');
    canvases.dummy.canvas.width = canvases.width;
    canvases.dummy.canvas.height = canvases.height;

    function detect(type) {
        if (!canvases.running) {
            canvases.running = true;
            startWorker(canvases.wasm.context.getImageData(0, 0, canvases.wasm.canvas.width, canvases.wasm.canvas.height), objType, 'wasm');
        }
    }

    function startWorker(imageData, command, type) {
        if (type === 'wasm')
            canvases.dummy.context.drawImage(wasm, 0, 0, imageData.width, imageData.height, 0, 0, Math.round(imageData.width/ canvases.scale), Math.round(imageData.height/canvases.scale));
        let message = {
            cmd: command,
            img: canvases.dummy.context.getImageData(
                0, 0, Math.round(imageData.width / canvases.scale),
                Math.round(imageData.height / canvases.scale))
        };
        if (type == 'wasm') wasmWorker.postMessage(message);
    }

    function selectObj(type) {
        if (type == 'face') {
            objType = 'faceDetect';
            document.getElementById('radio-face').checked = true;
            document.getElementById('radio-eyes').checked = false;
        }
        else {
            objType = 'eyesDetect';
            document.getElementById('radio-eyes').checked = true;
            document.getElementById('radio-face').checked = false;
        }
        return;
    }

    function updateCanvas(e, targetCanvas) {
        var canvasContext = targetCanvas.context;

        canvasContext.save(); // freeze draw

        canvasContext.drawImage(video, 0, 0, targetCanvas.canvas.width, targetCanvas.canvas.height);
        //canvasImageData = canvasContext.getImageData(
        //    0, 0, targetCanvas.width, targetCanvas.height);

        let fps = 1000 / (targetCanvas.startTime - targetCanvas.lastTime)
        if (fps) {
            targetCanvas.fpsArr.push(fps);
        }

        if (debug && canvases.wasm.fpsArr.length === 4 ) {
            canvasContext.fps = Math.round((targetCanvas.fpsArr.reduce((a, b) => a + b) / targetCanvas.fpsArr.length) * 100) / 100;
            targetCanvas.fpsArr = [];
        }
        console.log(e.data.features.length);
        if (e.data.features.length > 0) {
            if(debug) {
                canvasContext.strokeStyle = targetCanvas.color;
                canvasContext.lineWidth = 2;
                canvasContext.fillStyle = 'rgba(255,255,255,.5)';
                canvasContext.fillRect(0, 0, 90, 30)
                canvasContext.font = "normal 14pt Arial";
                canvasContext.fillStyle = targetCanvas.color;
                canvasContext.fillText(targetCanvas.context.fps + " fps", 5, 20);
                targetCanvas.lastTime = targetCanvas.startTime;
            }

            let rect;

            for (let i = 0; i < e.data.features.length; i++) {
                rect = e.data.features[i];
                drawCharacter(canvasContext, rect);
            }
        } else {
            hideCharacter();
        }

        canvasContext.restore();
    }

    function drawCharacter(canvasContext, rect) {
        characterPic.style.left = `${rect.x * canvases.scale}px`;
        characterPic.style.top = `${rect.y * canvases.scale}px`;
        characterPic.style.width = `${rect.width * canvases.scale}px`;
        characterPic.style.height = `${rect.height * canvases.scale}px`;
        characterPic.style.display = 'block';

        // next alternative implementation produces a flickering image
        // canvasContext.drawImage(
        //     characterPic, rect.x * canvases.scale, rect.y * canvases.scale,
        //     rect.width * canvases.scale, rect.height * canvases.scale);
        if (debug) {
            canvasContext.strokeRect(
                rect.x * canvases.scale, rect.y * canvases.scale,
                rect.width * canvases.scale, rect.height * canvases.scale);
        }
    }

    function hideCharacter() {
        characterPic.style.display = 'none';
    }

    wasmWorker.onmessage = function (e) {
        if (e.data.msg == 'wasm') {
            canvases.ready = true
            setTimeout(detect, 2000);
        } else {
            updateCanvas(e, canvases.wasm);
            requestAnimationFrame((wasmTime) => {
                canvases.wasm.startTime = wasmTime;
                startWorker(canvases.wasm.context.getImageData(0, 0, canvases.wasm.canvas.width, canvases.wasm.canvas.height), objType, 'wasm');
            })
        }
    }

    window.onerror = function (event) {
        console.log(event)
    };
}
