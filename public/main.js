var options;
var video, canvas, context;
var renderTimer;

class Camera {
    constructor() {
    }
    init(captureOptions) {
        var doNothing = function () { };

        options = captureOptions || {};

        options.fps = options.fps || 30;
        options.width = options.width || 640;
        options.height = options.height || 480;
        options.mirror = options.mirror || false;
        options.targetCanvas = options.targetCanvas || null; // TODO: is the element actually a <canvas> ?

        options.onSuccess = options.onSuccess || doNothing;
        options.onError = options.onError || doNothing;
        options.onNotSupported = options.onNotSupported || doNothing;
        options.onFrame = options.onFrame || doNothing;

        video = document.createElement("video");
        video.setAttribute('width', options.width);
        video.setAttribute('height', options.height);
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: false,
            }, function (stream) {
                options.onSuccess();

                if (video.mozSrcObject !== undefined) { // hack for Firefox < 19
                    video.mozSrcObject = stream;
                } else {
                    video.srcObject = stream;
                }

                canvas = options.targetCanvas || document.createElement("canvas");
                canvas.setAttribute('width', options.width);
                canvas.setAttribute('height', options.height);

                context = canvas.getContext('2d');

                // mirror video
                if (options.mirror) {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                }
            }, options.onError);
        } else {
            options.onNotSupported();
        }
    }

    start() {
        video.play();

        renderTimer = setInterval(function () {
            try {
                context.drawImage(video, 0, 0, video.width, video.height);
                options.onFrame(canvas);
            } catch (e) {
                // TODO
            }
        }, Math.round(1000 / options.fps));
    }

    pause() {
        if (renderTimer) clearInterval(renderTimer);
        video.pause();
    }

    stop() {
        pauseCapture();

        if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = null;
        } else {
            video.srcObject = null;
        }
    }
};

var asciiContainer = document.getElementById("ascii");
var capturing = false;

const camera = new Camera()
camera.init({
    width: 160,
    height: 120,
    fps: 30,
    mirror: true,

    onFrame(canvas) {
        ascii.fromCanvas(canvas, {
            contrast: 128,
            callback: (asciiString) => {
                asciiContainer.innerHTML = asciiString;
            }
        });
    },

    onSuccess() {
        document.getElementById("info").style.display = "none";

        const button = document.getElementById("button");
        button.style.display = "block";
        button.onclick = () => {
            if (capturing) {
                camera.pause();
                button.innerText = 'resume';
            } else {
                camera.start();
                button.innerText = 'pause';
            }
            capturing = !capturing;
        };
    },

    onError(error) {
        alert(error.message || error);
    },

    onNotSupported() {
        document.getElementById("info").style.display = "none";
        asciiContainer.style.display = "none";
        document.getElementById("notSupported").style.display = "block";
    }
});