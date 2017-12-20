var debounce = require('debounce');

export const initVideo = (debug) => {
    console.log('VIDEOOOOO');

    let wasmWorker = new Worker('wasm-worker.js');

    let video = document.querySelector("#videoElement");
    let objType = 'faceDetect';

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
        if (type == 'wasm')
            canvases.dummy.context.drawImage(wasm, 0, 0, imageData.width, imageData.height, 0, 0, Math.round(imageData.width/ canvases.scale), Math.round(imageData.height/canvases.scale));
        let message = {
            cmd: command,
            img: canvases.dummy.context.getImageData(0, 0, Math.round(imageData.width / canvases.scale), Math.round(imageData.height/canvases.scale))
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

    let characterPic = document.getElementById('characterPic');

    function updateCanvas(e, targetCanvas) {
        var secondaryCanvas = document.createElement("canvas"),
        secondaryCtx = secondaryCanvas.getContext("2d");

        secondaryCtx.drawImage(video, 0, 0, targetCanvas.canvas.width, targetCanvas.canvas.height);

        let fps = 1000 / (targetCanvas.startTime - targetCanvas.lastTime)
        if (fps) {
            targetCanvas.fpsArr.push(fps);
        }

        if (debug && canvases.wasm.fpsArr.length === 4 ) {
            targetCanvas.context.fps = Math.round((targetCanvas.fpsArr.reduce((a, b) => a + b) / targetCanvas.fpsArr.length) * 100) / 100;
            targetCanvas.fpsArr = [];
        }
        if (e.data.features) {
            if(debug) {
                secondaryCtx.strokeStyle = targetCanvas.color;
                secondaryCtx.lineWidth = 2;
                secondaryCtx.context.fillStyle = 'rgba(255,255,255,.5)';
                secondaryCtx.context.fillRect(0, 0, 90, 30)
                secondaryCtx.context.font = "normal 14pt Arial";
                secondaryCtx.context.fillStyle = targetCanvas.color;
                secondaryCtx.context.fillText(targetCanvas.context.fps + " fps", 5, 20);
                targetCanvas.lastTime = targetCanvas.startTime;
            }

            for (let i = 0; i < e.data.features.length; i++) {
                let rect = e.data.features[i];
                drawCharacter(secondaryCtx, rect, characterPic)
            }
        }
        targetCanvas.context.drawImage(secondaryCanvas, 0, 0, targetCanvas.canvas.width, targetCanvas.canvas.height);
    }

    function drawCharacter(canvasContext, rect, img) {
        canvasContext.drawImage(
            img, rect.x * canvases.scale, rect.y * canvases.scale,
            rect.width * canvases.scale, rect.height * canvases.scale);
        if (debug) {
            canvasContext.strokeRect(
                rect.x * canvases.scale, rect.y * canvases.scale,
                rect.width * canvases.scale, rect.height * canvases.scale);
        }
    }

    wasmWorker.onmessage = function (e) {
        if (e.data.msg == 'wasm') {
            canvases.ready = true
            setTimeout(detect, 2000);
        } else {
            updateCanvas(e, canvases.wasm);
            requestAnimationFrame((wasmTime) => {
                canvases.wasm.startTime = wasmTime;
                startWorker(canvases.wasm.context.getImageData(0, 0, canvases.wasm.canvas.width, canvases.wasm.canvas.height), objType, 'wasm')
            })
        }
    }

    window.onerror = function (event) {
        console.log(event)
    };
}
