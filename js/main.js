var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    //  Toggle between adding and removing the "active" class,
    // to highlight the button that controls the panel
    this.classList.toggle("active");

    // Toggle between hiding and showing the active panel
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

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

//snow effect attempt
const container = document.querySelector('.falling-container');
const totalObjects = 30; // Total number of images to drop
const objects = []; // Array to store all created objects
let tiltX = 0; // Left-right tilt (gamma)
let tiltY = 0; // Forward-backward tilt (beta)

// Create and drop all objects
function initializeObjects() {
  for (let i = 0; i < totalObjects; i++) {
    const object = document.createElement('img');
    object.src = 'https://raw.githubusercontent.com/beach-microsystems/hosting/refs/heads/main/x1%20nodrop.svg?token=GHSAT0AAAAAAC2XLU5ETNVQWPEQ4D6PAEE2ZZ772RA'; // Replace with your SVG file path
    object.classList.add('falling-object');

    // Set random initial position and size
    object.style.position = 'absolute';
    object.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    object.style.top = `${Math.random() * 100}vh`; // Random vertical position
    object.style.width = `${30 + Math.random() * 100}px`; // Random size
    container.appendChild(object);

    objects.push(object); // Store the object for later movement
  }
}

// Gyroscope-based movement
function moveObjects() {
  objects.forEach((object) => {
    // Get current position
    const currentX = parseFloat(object.style.left) || 0;
    const currentY = parseFloat(object.style.top) || 0;

    // Update position based on tilt
    const newX = currentX + tiltX * 0.5; // Adjust horizontal movement sensitivity
    const newY = currentY + tiltY * 0.5; // Adjust vertical movement sensitivity

    // Keep objects within bounds
    object.style.left = `${Math.max(0, Math.min(newX, window.innerWidth))}px`;
    object.style.top = `${Math.max(0, Math.min(newY, window.innerHeight))}px`;
  });

  requestAnimationFrame(moveObjects); // Continuously update positions
}

// Listen for device orientation changes
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    if (event.gamma !== null && event.beta !== null) {
      tiltX = event.gamma; // Left-right tilt (gamma)
      tiltY = event.beta;  // Forward-backward tilt (beta)
    }
  });
} else {
  console.log('DeviceOrientation is NOT supported on this device.');
}

// Initialize the objects and start the movement loop
initializeObjects();
moveObjects();
