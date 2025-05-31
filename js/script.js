let player;
const platforms = [];
const groundHeight = canvas.height - 50; // Ground platform height
let currentPlatform = 0;

class Player {
  constructor() {
    this.width = 30;
    this.height = 30;
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: groundHeight - 20 - this.height, // Start on top of the ground platform
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

class Platform {
  constructor(
    x = 0, // default x position
    y = canvas.height - 50, // default y position (ground level)
    width = canvas.width, // default width (full canvas width)
    height = 50, // default height (platform height)
    type = "stationary", // "stationary", "moving", "temporary"
    color = "green", // default color
    id = 0 // default id for the platform
  ) {
    this.color = color;
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.type = type; // "stationary" or "moving"
    this.velocity = { x: 3, y: 0 };
    this.id = id; // Unique identifier for the platform
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

function init() {
  platforms.push(new Platform()); // Add the ground platform

  for (let i = 1; i <= 4; i++) {
    const platform = new Platform(
      Math.random() * (canvas.width - 100),
      groundHeight - 180 * i,
      100,
      20,
      "stationary",
      "brown",
      i
    );
    platforms.push(platform);
  }

  player = new Player();
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  /* Handle player movement on different interactions */

  // Handle keyboard input
  if (keys.left.isPressed || keys.right.isPressed || keys.up.isPressed) {
    if (keys.left.isPressed) {
      player.velocity.x = -5; // Move left
    }

    if (keys.right.isPressed) {
      player.velocity.x = 5; // Move right
    }
    if (keys.up.isPressed) {
      jump(); // Jump if the up key is pressed
    }
  } else {
    player.velocity.x = 0; // Stop horizontal movement when no keys are pressed
  }

  // Handle click input
  if (keys.click.isPressed) {
    // Move player towards the click position
    const dx = keys.click.x - (player.position.x + player.width / 2);
    const dy = keys.click.y - (player.position.y + player.height / 2);
    const angle = Math.atan2(dy, dx);
    player.velocity.x = Math.cos(angle) * 5; // Adjust speed as needed

    jump(); // Jump if the click is pressed
  }

  // Handle touch input
  if (keys.touch.isPressed) {
    // Move player towards the touch position
    const dx = keys.touch.x - (player.position.x + player.width / 2);
    const dy = keys.touch.y - (player.position.y + player.height / 2);
    const angle = Math.atan2(dy, dx);
    player.velocity.x = Math.cos(angle) * 5; // Adjust speed as needed

    jump(); // Jump if the touch is pressed
  }

  /* Collision detection with platforms */
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0; // Stop falling if on the ground

      if (currentPlatform == platform.id) return; // Already on this platform

      currentPlatform = platform.id; // Set the current platform
    }
  });
}

init();
animate();

function jump() {
  // return if player is still not on a platform
  if (
    player.position.y + player.height < groundHeight &&
    !platforms.some(
      (platform) =>
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width &&
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >=
          platform.position.y
    )
  ) {
    return;
  }

  player.velocity.y = -15; // Jump only if on the ground
}
