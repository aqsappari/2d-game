const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 600;
canvas.height = innerHeight - 20;

// adjust canvas width and height to fit the screen in smaller screens
if (canvas.width > innerWidth) {
  canvas.width = innerWidth; // Subtracting 20 for some padding
}
if (canvas.height > innerHeight) {
  canvas.height = innerHeight; // Subtracting 20 for some padding
}

const gravity = 0.5;

class Player {
  constructor() {
    this.width = 30;
    this.height = 30;
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height - 200,
    };
    this.velocity = { x: 0, y: 1 };
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // go in loop when player goes out of bounds
    if (this.position.x + this.width < 0) {
      this.position.x = canvas.width;
    } else if (this.position.x > canvas.width) {
      this.position.x = -this.width;
    }

    // apply gravity
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity; // Apply gravity if not on the ground
    } else {
      this.velocity.y = 0; // Stop falling when hitting the ground
    }
  }
}

let player;
let keys = {
  left: { isPressed: false },
  right: { isPressed: false },
  up: { isPressed: false },

  click: { x: undefined, y: undefined, isPressed: false },
  touch: { x: undefined, y: undefined, isPressed: false },
};
function init() {
  player = new Player();
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();

  if (keys.left.isPressed) {
    player.velocity.x = -5; // Move left
  } else if (keys.right.isPressed) {
    player.velocity.x = 5; // Move right
  } else {
    player.velocity.x = 0; // Stop moving when no key is pressed
  }

  if (keys.up.isPressed) {
    if (player.position.y + player.height >= canvas.height) {
      player.velocity.y = -15; // Jump only if on the ground
    }
  }

  if (keys.click.isPressed) {
    // Move player towards the click position
    const dx = keys.click.x - (player.position.x + player.width / 2);
    const dy = keys.click.y - (player.position.y + player.height / 2);
    const angle = Math.atan2(dy, dx);
    player.velocity.x = Math.cos(angle) * 5; // Adjust speed as needed

    if (player.position.y + player.height >= canvas.height) {
      player.velocity.y = -15; // Jump only if on the ground
    }
  }

  if (keys.touch.isPressed) {
    // Move player towards the touch position
    const dx = keys.touch.x - (player.position.x + player.width / 2);
    const dy = keys.touch.y - (player.position.y + player.height / 2);
    const angle = Math.atan2(dy, dx);
    player.velocity.x = Math.cos(angle) * 5; // Adjust speed as needed

    if (player.position.y + player.height >= canvas.height) {
      player.velocity.y = -15; // Jump only if on the ground
    }
  }
}

init();
animate();

// allow user to control the player with arrow keys
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.left.isPressed = true;
      break;
    case "ArrowRight":
      keys.right.isPressed = true;
      break;
    case "ArrowUp":
      keys.up.isPressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.left.isPressed = false;
      break;
    case "ArrowRight":
      keys.right.isPressed = false;
      break;
    case "ArrowUp":
      keys.up.isPressed = false;
      break;
  }
});

// allow user to control the player with WASD keys
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.left.isPressed = true;
      break;
    case "d":
      keys.right.isPressed = true;
      break;
    case "w":
      keys.up.isPressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.left.isPressed = false;
      break;
    case "d":
      keys.right.isPressed = false;
      break;
    case "w":
      keys.up.isPressed = false;
      break;
  }
});

// allow user to control the player with click events
canvas.addEventListener("mousedown", (event) => {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  keys.click.x = x;
  keys.click.y = y;
  keys.click.isPressed = true;
});

canvas.addEventListener("mouseup", () => {
  keys.click.isPressed = false;
});

// allow user to control the player with touch events
canvas.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  const x = touch.clientX - canvas.getBoundingClientRect().left;
  const y = touch.clientY - canvas.getBoundingClientRect().top;

  keys.touch.x = x;
  keys.touch.y = y;
  keys.touch.isPressed = true;
});

canvas.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  const x = touch.clientX - canvas.getBoundingClientRect().left;
  const y = touch.clientY - canvas.getBoundingClientRect().top;

  keys.touch.x = x;
  keys.touch.y = y;
});

canvas.addEventListener("touchend", (event) => {
  keys.touch.isPressed = false;
});
