const canvasContainer = document.querySelector(".canvasContainer");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const score = document.querySelector("#score");
const main = document.querySelector("main");

canvas.width = 600;
canvas.height = innerHeight - 30;

canvasContainer.style.width = canvas.width;
canvasContainer.style.height = innerHeight;

// adjust canvas width and height to fit the screen in smaller screens
if (canvas.width > innerWidth) {
  canvas.width = innerWidth;
  canvasContainer.style.width = canvas.width;
}
if (canvas.height > innerHeight) {
  canvas.height = innerHeight;
  canvasContainer.style.height = innerHeight;
}

score.style.display = "none";

const gravity = 0.5;
const keys = {
  left: { isPressed: false },
  right: { isPressed: false },
  up: { isPressed: false },

  click: { x: undefined, y: undefined, isPressed: false },
  touch: { x: undefined, y: undefined, isPressed: false },
};

function init() {}
