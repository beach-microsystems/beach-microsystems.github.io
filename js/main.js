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

let tiltX = 0; // Left-right tilt (gamma)
let tiltY = 0; // Forward-backward tilt (beta)

// Listen for device orientation changes
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    if (event.gamma !== null && event.beta !== null) {
      tiltX = event.gamma; // Update left-right tilt
      tiltY = event.beta;  // Update forward-backward tilt
    } else {
      console.log("Device orientation values are not available.");
    }
  });
} else {
  console.log("DeviceOrientation is NOT supported on this device.");
}

function createFallingObject() {
  const object = document.createElement('img');
  object.src = 'path/to/your-image.svg'; // Replace with your SVG file path
  object.classList.add('falling-object');

  // Set initial position and size
  object.style.left = `${Math.random() * 100}vw`; // Random horizontal position
  object.style.width = `${20 + Math.random() * 30}px`; // Random size (20px to 50px)
  container.appendChild(object);

  // Physics-based fall and rotation setup
  const startTime = performance.now();
  const gravity = 500; // Pixels per second²
  const initialRotation = Math.random() * 360; // Random starting rotation (0-360 degrees)
  const rotationSpeed = Math.random() * 50 - 25; // Random speed (-25 to 25 degrees/sec)

  function animateFall(time) {
    const elapsed = (time - startTime) / 1000; // Convert to seconds

    // Adjust distance fallen based on gravity and tilt
    const baseDistanceY = 0.5 * gravity * Math.pow(elapsed, 2); // Base vertical distance
    const distanceY = baseDistanceY + tiltY * 5; // Adjusted vertical fall with forward-backward tilt
    const distanceX = (tiltX / 90) * window.innerWidth; // Adjust horizontal position relative to tilt

    const rotation = initialRotation + elapsed * rotationSpeed; // Smooth, continuous rotation

    // Apply translation (fall with tilt) and rotation
    object.style.transform = `translate(${distanceX}px, ${distanceY}px) rotate(${rotation}deg)`;

    // Stop when the object is out of the viewport
    if (distanceY < window.innerHeight + 100) {
      requestAnimationFrame(animateFall);
    } else {
      object.remove(); // Clean up once it leaves the screen
    }
  }

  requestAnimationFrame(animateFall);
}

// Start generating falling objects
const intervalId = setInterval(createFallingObject, 500); // Create an object every 500ms

// Stop the falling effect after 10 seconds (optional)
setTimeout(() => {
  clearInterval(intervalId); // Stops the interval
}, 10000); // 10000ms = 10 seconds

//setInterval(createFallingObject, 20); // Create a new object every 500ms

if (!window.DeviceOrientationEvent) {
  console.log('DeviceOrientation not supported. Default falling behavior applied.');
}
