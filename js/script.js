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
    type = "normal", // "normal", "moving", "boost"
    color = "green" // default color
  ) {
    this.color = color;
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.type = type;
    this.velocity = { x: 3, y: 0 };
    this.id = platformIdCounter++; // Unique ID for each platform

    this.opacity = 1;
    this.startTime = null;
    this.markedForDeletion = false;
  }

  draw() {
    // Apply opacity only for boost type platforms
    if (this.type === "boost") {
      c.globalAlpha = this.opacity;
    }

    c.fillStyle = this.color;
    // Draw the platform at its actual position minus the scrollOffset
    c.fillRect(
      this.position.x,
      this.position.y - scrollOffset,
      this.width,
      this.height
    );

    // Reset globalAlpha to 1 after drawing this platform
    if (this.type === "boost") {
      c.globalAlpha = 1;
    }
  }

  update() {
    this.draw();

    if (this.type == "moving") {
      if (
        this.position.x <= 0 ||
        this.position.x + this.width >= canvas.width
      ) {
        this.velocity.x = -this.velocity.x;
      }

      this.position.x += this.velocity.x;
    }

    if (this.type == "boost") {
      if (this.startTime === null) {
        this.startTime = Date.now();
      }

      const elapsedTime = (Date.now() - this.startTime) / 1000; // Time in seconds

      if (elapsedTime < 1) {
        this.opacity = 1; // Full opacity for first second
      } else if (elapsedTime < 2) {
        this.opacity = 0.66; // 66% opacity for second second
      } else if (elapsedTime < 3) {
        this.opacity = 0.33; // 33% opacity for third second
      } else {
        this.opacity = 0; // Vanish
        this.markedForDeletion = true; // Mark for deletion
      }
    }
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

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw platforms
  platforms.forEach((platform) => {
    platform.update();
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
      if (platform.type === "boost") {
        jump(3);
      }

      currentPlatform = platform.id; // Set the current platform
      score.textContent = currentPlatform; // Increment score by 1

      // For stationary or moving platforms, reset velocity and allow regular jump
      player.velocity.y = 0; // Stop falling
      canJump = true; // Allow jumping again

      if (platform.type === "boost") {
        jump(3, true);
      }
    }
  });

  // generate new platforms as player climbs up
  if (platforms.length > 0) {
    // Ensure there's at least one platform before checking
    const lastPlatform = platforms[platforms.length - 1];
    if (lastPlatform.position.y - scrollOffset > -canvas.height / 2) {
      // Generate a new platform above the highest existing platform
      const newPlatformY = lastPlatform.position.y - 180;

      const {
        type: mainPlatformType,
        color: mainPlatformColor,
        spawnBoost,
      } = getNextPlatformConfig(platformIdCounter);

      const newMainPlatform = new Platform(
        Math.random() * (canvas.width - 100), // Random X position for the main platform
        newPlatformY,
        100, // Fixed width
        20, // Fixed height
        mainPlatformType,
        mainPlatformColor
      );
      platforms.push(newMainPlatform);

      // If a boost platform should accompany this main platform
      if (spawnBoost) {
        // Calculate a non-overlapping X position for the boost platform
        let boostX;

        // Try to place it to the right or left of the main platform
        if (
          newMainPlatform.position.x + newMainPlatform.width + 20 + boostWidth <
          canvas.width
        ) {
          // Enough space to the right
          boostX = newMainPlatform.position.x + newMainPlatform.width + 20;
        } else if (newMainPlatform.position.x - 20 - boostWidth > 0) {
          // Enough space to the left
          boostX = newMainPlatform.position.x - 20 - boostWidth;
        } else {
          // If no ideal space, just place it randomly but ensure it's within bounds
          boostX = Math.random() * (canvas.width - boostWidth);
        }

        const newBoostPlatform = new Platform(
          boostX,
          newPlatformY, // Same Y as the main platform
          50,
          20,
          "boost",
          "purple"
        );
        platforms.push(newBoostPlatform);
      }
    }
  }

  // Remove platforms that are below the visible area
  platforms = platforms.filter((platform) => {
    return (
      platform.position.y - scrollOffset < canvas.height &&
      !platform.markedForDeletion
    );
  });
}

// Call init initially to set up the game for the first time
init();
animate();

/* Helper functions */
function resetGame() {
  alert("Game Over! Resetting...");
  init();
}

function jump(n = 1, forcedJump = false) {
  if (!canJump && !forcedJump) return; // Prevent jumping if already in the air

  // Check if player is on ANY platform (including the ground)
  const isOnPlatform = platforms.some(
    (platform) =>
      player.position.x + player.width >= platform.position.x && // Check if player is on the left side of the platform
      player.position.x <= platform.position.x + platform.width && // Check if player is on the right side of the platform
      player.position.y + player.height <= platform.position.y && // Check if player is above the platform
      player.position.y + player.height + player.velocity.y >=
        platform.position.y // Check if player is falling onto the platform
  );

  if ((isOnPlatform && !forcedJump) || forcedJump) {
    player.velocity.y = -15 * n; // Jump only if on a platform
    canJump = false; // Prevent further jumps until the player lands on a platform again
  }
}

// Helper function to determine platform type and color based on platform count
function getNextPlatformConfig(idCounter) {
  let type = "normal";
  let color = "brown";
  let spawnBoost = false;

  // First 50 platforms (excluding ground, so ID 0-49)
  if (idCounter < 50) {
    type = "normal";
    color = "brown";
  }
  // Platforms 50 to 99 (IDs 50-99)
  else if (idCounter < 100) {
    if (Math.random() < 0.1) {
      // 1 in 10 chance for moving
      type = "moving";
      color = "blue";
    } else {
      type = "normal";
      color = "brown";
    }
  }
  // Platforms 100 onwards (IDs 100+)
  else {
    // Increase moving platform chance by 1% for every 50 platforms after ID 100
    let movingChance = 0.1 + Math.floor((idCounter - 100) / 50) * 0.01;
    movingChance = Math.min(movingChance, 0.5); // Cap at 50% chance
    if (Math.random() < movingChance) {
      type = "moving";
      color = "blue";
    } else {
      type = "normal";
      color = "brown";
    }
  }

  // Boost platform spawning logic (only for normal platforms from ID 100 onwards)
  // This flag indicates if a boost platform *should* accompany the main platform.
  if (idCounter >= 100 && type === "normal" && Math.random() < 0.15) {
    // 15% chance for boost on normal platforms
    spawnBoost = true;
  }

  return { type, color, spawnBoost };
}
