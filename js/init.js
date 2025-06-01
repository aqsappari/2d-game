const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const score = document.querySelector("score");

canvas.width = 600;
canvas.height = innerHeight - 20;

// adjust canvas width and height to fit the screen in smaller screens
if (canvas.width > innerWidth) {
  canvas.width = innerWidth;
}
if (canvas.height > innerHeight) {
  canvas.height = innerHeight;
}

const gravity = 0.5;
const keys = {
  left: { isPressed: false },
  right: { isPressed: false },
  up: { isPressed: false },

  click: { x: undefined, y: undefined, isPressed: false },
  touch: { x: undefined, y: undefined, isPressed: false },
};
