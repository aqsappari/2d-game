// allow user to control the player with arrow keys
addEventListener("keydown", ({ key }) => {
  switch (key) {
    // left movement
    case "ArrowLeft":
      keys.left.isPressed = true;
      break;

    case "a":
      keys.left.isPressed = true;
      break;

    // right movement
    case "ArrowRight":
      keys.right.isPressed = true;
      break;

    case "d":
      keys.right.isPressed = true;
      break;

    // jump movement
    case "ArrowUp":
      keys.up.isPressed = true;
      break;

    case "w":
      keys.up.isPressed = true;
      break;

    case " ":
      keys.up.isPressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    // left movement
    case "ArrowLeft":
      keys.left.isPressed = false;
      break;

    case "a":
      keys.left.isPressed = false;
      break;

    // right movement
    case "ArrowRight":
      keys.right.isPressed = false;
      break;

    case "d":
      keys.right.isPressed = false;
      break;

    // jump movement
    case "ArrowUp":
      keys.up.isPressed = false;
      break;

    case "w":
      keys.up.isPressed = false;
      break;

    case " ":
      keys.up.isPressed = false;
      break;
  }
});

// allow user to control the player with click events
addEventListener("mousedown", (event) => {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  keys.click.x = x;
  keys.click.y = y;
  keys.click.isPressed = true;
});

addEventListener("mousemove", (event) => {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  keys.click.x = x;
  keys.click.y = y;
});

addEventListener("mouseup", () => {
  keys.click.isPressed = false;
});

// allow user to control the player with touch events
addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  const x = touch.clientX - canvas.getBoundingClientRect().left;
  const y = touch.clientY - canvas.getBoundingClientRect().top;

  keys.touch.x = x;
  keys.touch.y = y;
  keys.touch.isPressed = true;
});

addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  const x = touch.clientX - canvas.getBoundingClientRect().left;
  const y = touch.clientY - canvas.getBoundingClientRect().top;

  keys.touch.x = x;
  keys.touch.y = y;
});

addEventListener("touchend", (event) => {
  keys.touch.isPressed = false;
});
