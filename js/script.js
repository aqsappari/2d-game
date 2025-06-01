let player;
let platforms = [];
const groundHeight = canvas.height - 50;
let currentPlatform = 0;
let scrollOffset = 0;
let platformIdCounter = 0;
let canJump = true;

class Player {
  constructor() {
    this.width = 30;
    this.height = 30;
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: groundHeight - this.height, // Start on top of the ground platform
    };
    this.velocity = { x: 0, y: 0 };
  }

  draw() {
    c.fillStyle = "red";
    // Draw the player at their actual position minus the scrollOffset
    c.fillRect(
      this.position.x,
      this.position.y - scrollOffset,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // go in loop when player goes out of bounds horizontally
    if (this.position.x + this.width < 0) {
      this.position.x = canvas.width;
    } else if (this.position.x > canvas.width) {
      this.position.x = -this.width;
    }

    // Apply gravity effect
    this.velocity.y += gravity;

    // if player fall off the screen, reset the game
    if (this.position.y - scrollOffset - 50 > canvas.height) {
      resetGame();
      return;
    }
  }
}

class Platform {
  constructor(
    x = 0, // default x position
    y = groundHeight, // default y position (ground level)
    width = canvas.width, // default width (full canvas width)
    height = 50, // default height (platform height)
    type = "stationary", // "stationary", "moving", "temporary"
    color = "green" // default color
  ) {
    this.color = color;
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.type = type;
    this.velocity = { x: 3, y: 0 };
    this.id = platformIdCounter++; // Unique ID for each platform
  }

  draw() {
    c.fillStyle = this.color;
    // Draw the platform at its actual position minus the scrollOffset
    c.fillRect(
      this.position.x,
      this.position.y - scrollOffset,
      this.width,
      this.height
    );
  }
}

function init() {
  platforms = []; // Ensure platforms array is empty before adding initial ones
  scrollOffset = 0; // Reset scroll offset
  currentPlatform = 0; // Reset current platform ID
  score.textContent = "0"; // Reset score display
  platformIdCounter = 0; // Reset platform ID counter
  canJump = true; // Reset jump state

  keys.left.isPressed = false;
  keys.right.isPressed = false;
  keys.up.isPressed = false;
  keys.click.isPressed = false;
  keys.touch.isPressed = false;
  keys.click.x = undefined;
  keys.click.y = undefined;
  keys.touch.x = undefined;
  keys.touch.y = undefined;

  platforms.push(new Platform()); // Add the ground platform (id 0)

  player = new Player(); // Recreate player object
}

function resetGame() {
  alert("Game Over! Resetting...");
  init();
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw platforms
  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  // apply scrolling effect
  if (
    player.position.y - scrollOffset < canvas.height - 180 &&
    player.velocity.y < 0
  ) {
    scrollOffset += player.velocity.y;
  }

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
    const dy =
      keys.click.y + scrollOffset - (player.position.y + player.height / 2); // Adjust click Y for scrollOffset
    const angle = Math.atan2(dy, dx);
    player.velocity.x = Math.cos(angle) * 5; // Adjust speed as needed

    jump(); // Jump if the click is pressed
  }

  // Handle touch input
  if (keys.touch.isPressed) {
    // Move player towards the touch position
    const dx = keys.touch.x - (player.position.x + player.width / 2);
    const dy =
      keys.touch.y + scrollOffset - (player.position.y + player.height / 2); // Adjust touch Y for scrollOffset
    const angle = Math.atan2(dy, dx);
    player.velocity.x = Math.cos(angle) * 5; // Adjust speed as needed

    jump(); // Jump if the touch is pressed
  }

  /* Collision detection with platforms */
  platforms.forEach((platform) => {
    // Collision detection logic remains the same, as it uses true player.position.y and platform.position.y
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0; // Stop falling if on the platform
      canJump = true; // Allow jumping again

      currentPlatform = platform.id; // Set the current platform
      score.textContent = currentPlatform; // Increment score by 1
    }
  });

  // generate new platforms as player climbs up
  if (platforms.length > 0) {
    // Ensure there's at least one platform before checking
    const lastPlatform = platforms[platforms.length - 1];
    if (lastPlatform.position.y - scrollOffset > -canvas.height / 2) {
      // Generate a new platform above the highest existing platform
      const newPlatformY = lastPlatform.position.y - 180;
      const newPlatform = new Platform(
        Math.random() * (canvas.width - 100),
        newPlatformY,
        100,
        20,
        "stationary",
        "brown"
      );
      platforms.push(newPlatform);
    }
  }

  // Remove platforms that are below the visible area
  platforms = platforms.filter((platform) => {
    return platform.position.y - scrollOffset < canvas.height;
  });
}

// Call init initially to set up the game for the first time
init();
animate();

function jump() {
  if (!canJump) return; // Prevent jumping if already in the air

  // Check if player is on ANY platform (including the ground)
  const isOnPlatform = platforms.some(
    (platform) =>
      player.position.x + player.width >= platform.position.x && // Check if player is on the left side of the platform
      player.position.x <= platform.position.x + platform.width && // Check if player is on the right side of the platform
      player.position.y + player.height <= platform.position.y && // Check if player is above the platform
      player.position.y + player.height + player.velocity.y >=
        platform.position.y // Check if player is falling onto the platform
  );

  if (isOnPlatform) {
    player.velocity.y = -15; // Jump only if on a platform
    canJump = false; // Prevent further jumps until the player lands on a platform again
  }
}
