let pointerSpeed = { x: 0, y: 0, magnitude: 0 }; // Track pointer velocity
let lastPointerPosition = { x: 0, y: 0 }; // Track last pointer position

// Track pointer movement to calculate speed
document.addEventListener("pointermove", (event) => {
  const currentPointerPosition = { x: event.clientX, y: event.clientY };

  if (lastPointerPosition.x || lastPointerPosition.y) {
    const deltaX = currentPointerPosition.x - lastPointerPosition.x;
    const deltaY = currentPointerPosition.y - lastPointerPosition.y;

    // Calculate pointer speed
    pointerSpeed.x = deltaX;
    pointerSpeed.y = deltaY;
    pointerSpeed.magnitude = Math.sqrt(deltaX ** 2 + deltaY ** 2) || 0.1; // Avoid division by zero
  }

  lastPointerPosition = currentPointerPosition;
});


let lastTimestamp = 0; // Tracks last timestamp
document.querySelectorAll(".accordion").forEach((button) => {
  button.addEventListener("click", function () {
    if (this.classList.contains("internal-external")) return;

    this.classList.toggle("active");
    const panel = this.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});

const songs = [
  { id: "hn", name: "Human Nature", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "gin", name: "Gin", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "bb", name: "b.Bass", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "pn", name: "Paranoi", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "az", name: "Alwayz", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "island", name: "Island", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "tw", name: "Twice", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "kissout", name: "Kissout", src: "https://files.cargocollective.com/c1989710/KISSOUT-MASTER-24-441.mp3" },
  { id: "crow", name: "Crow", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  { id: "ko", name: "KO", src: "https://files.cargocollective.com/c1989710/KO-MASTER-24-441.mp3" },
  // Add new songs here
];

const songContainer = document.querySelector(".internal-container");

// Generate buttons for all songs
songs.forEach((song, index) => {
  songContainer.innerHTML += `
    <audio id="${song.id}" controlslist="nodownload" controls preload="auto" style="display:none">
      <source src="${song.src}" type="audio/mpeg">
    </audio>
    <button id="${song.id}-play-pause" class="song-button" onclick="togglePlay('${song.id}')">
      <span class="song-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="song-name">${song.name}</span>
    </button>
  `;
});

function togglePlay(songId) {
  songs.forEach((song) => {
    const audio = document.getElementById(song.id);
    const button = document.getElementById(`${song.id}-play-pause`);

    if (song.id === songId) {
      if (audio.paused) {
        audio.play();
        songname(song.name); // Update "Now Playing" header
      } else {
        audio.pause();
        document.getElementById("singer").innerHTML = "@_╳"; // Reset header when paused
      }
    } else {
      audio.pause(); // Stop all other songs
      audio.currentTime = 0; // Reset time for all other songs
    }
  });
}

// Update "Now Playing" text
function songname(name) {
  const singerElement = document.getElementById("singer");
  singerElement.innerHTML = `@⌗╳ now playing... ${name}`;
}

// Dust Pile
const dustOverlay = document.getElementById('dust-overlay');
const totalDustImages = 50; // Number of dust images
const dustImageSrc = 'https://raw.githubusercontent.com/beach-microsystems/hosting/refs/heads/main/x1%20nodrop.svg?token=GHSAT0AAAAAAC2XLU5ETNVQWPEQ4D6PAEE2ZZ772RA'; // Replace with the path to your image

// Disable scrolling when the overlay is active
function preventScrolling(enable) {
  if (enable) {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
  } else {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }
}

function createDustPile() {
  for (let i = 0; i < totalDustImages; i++) {
    const dustImage = document.createElement('img');
    dustImage.src = dustImageSrc;
    dustImage.classList.add('dust-image');

    // Randomly size and position the images
    const size = Math.random() * 100 + 30; // Random size between 30px and 80px
    const offsetX = Math.random() * 130; // Spread horizontally within 200px
    const offsetY = Math.random() * 100; // Spread vertically within 200px

    dustImage.style.width = `${size}px`;
    dustImage.style.height = `${size}px`;
    dustImage.style.left = `${offsetX}px`;
    dustImage.style.top = `${offsetY}px`;

    // Add interaction to clear the dust on pointer events
    dustImage.addEventListener('pointerdown', clearDust);
    dustOverlay.appendChild(dustImage);
  }
}

function clearDust(event) {
  const dustImage = event.target;

  if (!dustImage.classList.contains("dust-image")) return;

  const pointerX = event.clientX;
  const pointerY = event.clientY;

  const dustRect = dustImage.getBoundingClientRect();
  const dustCenterX = dustRect.left + dustRect.width / 2;
  const dustCenterY = dustRect.top + dustRect.height / 2;

  const offsetX = dustCenterX - pointerX;
  const offsetY = dustCenterY - pointerY;
  const magnitude = Math.sqrt(offsetX ** 2 + offsetY ** 2) || 1;

  const speedFactor = 15;
  const mass = Math.random() * 2 + 0.5;
  let velocityX = (offsetX / magnitude) * (pointerSpeed.magnitude * speedFactor) / mass;
  let velocityY = (offsetY / magnitude) * (pointerSpeed.magnitude * speedFactor) / mass;

  if (!dustImage.style.left) {
    dustImage.style.left = `${dustRect.left}px`;
  }
  if (!dustImage.style.top) {
    dustImage.style.top = `${dustRect.top}px`;
  }

  const animateDust = () => {
    const friction = 0.995;
    const drag = 0.05;
    velocityX -= velocityX * drag;
    velocityY -= velocityY * drag;

    const currentLeft = parseFloat(dustImage.style.left);
    const currentTop = parseFloat(dustImage.style.top);

    dustImage.style.left = `${currentLeft + velocityX}px`;
    dustImage.style.top = `${currentTop + velocityY}px`;

    const newRect = dustImage.getBoundingClientRect();
    if (
      newRect.right < 0 ||
      newRect.bottom < 0 ||
      newRect.left > window.innerWidth ||
      newRect.top > window.innerHeight
    ) {
      dustImage.remove(); // Remove the image only when off-screen
      return;
    }

    requestAnimationFrame(animateDust);
  };

  requestAnimationFrame(animateDust);
}

dustOverlay.addEventListener("pointerdown", (event) => {
  if (event.target.classList.contains("dust-image")) {
    clearDust(event);
  }
});

// Prevent scrolling when interacting with dust on mobile
dustOverlay.addEventListener('touchstart', (event) => {
  event.preventDefault();
}, { passive: false });

dustOverlay.addEventListener('touchmove', (event) => {
  event.preventDefault();
}, { passive: false });

// Initialize the dust pile
createDustPile();
preventScrolling(true);

dustOverlay.addEventListener('pointermove', (event) => {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);

  elements.forEach((element) => {
    if (element.classList.contains('dust-image')) {
      clearDust({ target: element });
    }
  });
});

// Scoped logic for "Internal" and "External"
const internalButton = document.querySelector('.internal-external:nth-of-type(1)');
const externalButton = document.querySelector('.internal-external:nth-of-type(2)');
const internalPanel = internalButton.nextElementSibling;
const externalPanel = externalButton.nextElementSibling;

function toggleInternalExternal(clickedButton, clickedPanel, otherButton, otherPanel) {
  const isActive = clickedPanel.style.display === "block";

  // Collapse the other panel
  otherPanel.style.display = "none";
  otherButton.classList.remove("active");

  // Toggle the clicked panel
  if (isActive) {
    clickedPanel.style.display = "none"; // Collapse if already open
    clickedButton.classList.remove("active");
  } else {
    clickedPanel.style.display = "block"; // Expand if closed
    clickedButton.classList.add("active");
  }
}

// Add event listeners for "Internal" and "External"
internalButton.addEventListener("click", () => {
  toggleInternalExternal(internalButton, internalPanel, externalButton, externalPanel);
});

externalButton.addEventListener("click", () => {
  toggleInternalExternal(externalButton, externalPanel, internalButton, internalPanel);
});

// Update the pointer move listener to track speed and direction
dustOverlay.addEventListener("pointermove", (event) => {
  lastPointerPosition = { x: event.clientX, y: event.clientY };
  lastTimestamp = event.timeStamp;
});


let isPointerDown = false; // Track if the pointer is actively down

dustOverlay.addEventListener("pointerdown", (event) => {
  isPointerDown = true; // Pointer is actively down
});

dustOverlay.addEventListener("pointerup", () => {
  isPointerDown = false; // Reset pointer state
});

dustOverlay.addEventListener("pointermove", (event) => {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);

  elements.forEach((element) => {
    if (element.classList.contains("dust-image")) {
      // Move the dust image with the pointer
      clearDust({ target: element, clientX: event.clientX, clientY: event.clientY });
    }
  });

  // Ensure overlay doesn't block interactions when no dust images remain
  if (dustOverlay.querySelectorAll(".dust-image").length === 0) {
    dustOverlay.style.pointerEvents = "none";
  }
});


// Add touch support
dustOverlay.addEventListener("pointerdown", (event) => {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  elements.forEach((element) => {
    if (element.classList.contains("dust-image")) {
      clearDust({ target: element, clientX: event.clientX, clientY: event.clientY });
    }
  });
});

// Ensure pointer-events is enabled when there are dust images
if (dustOverlay.querySelectorAll(".dust-image").length === 0) {
  dustOverlay.style.pointerEvents = "none";
}




// console debug click test
