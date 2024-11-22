var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    // Skip "Internal" and "External" buttons
    if (this.classList.contains("internal-external")) return;

    this.classList.toggle("active");
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

  // Fade out and move the image slightly
  dustImage.style.opacity = 0;
  dustImage.style.transform = 'translateY(-50px) rotate(20deg)';

  // Remove the image from the DOM after animation
   setTimeout(() => {
     dustImage.remove();

     // Re-enable scrolling if all dust is cleared
     if (dustOverlay.children.length === 0) {
       preventScrolling(false);
     }
   }, 300);
 }

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
