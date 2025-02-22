const sectors = [
  { color: "#FFBC03", text: "#333333", label: "$2.88" },
  { color: "#FF5A10", text: "#333333", label: "$3.88" },
  { color: "#FFBC03", text: "#333333", label: "$5.88" },
  { color: "#FF5A10", text: "#333333", label: "$8.88" },
  { color: "#FFBC03", text: "#333333", label: "$15.88" },
  { color: "#FF5A10", text: "#333333", label: "$88.88" },
  { color: "#FFBC03", text: "#333333", label: "$28.88" },
  { color: "#FF5A10", text: "#333333", label: "$58.88" },
];

// Updated probabilities (make sure they sum to 1)
const probabilities = [
  0.5,  // $2.88 (sector 1)
  0,    // $3.88 (sector 2)
  0,    // $5.88 (sector 3)
  0,    // $8.88 (sector 4)
  0,    // $15.88 (sector 5)
  0.5,  // $88.88 (sector 6)
  0,    // $28.88 (sector 7)
  0     // $58.88 (sector 8)
];

const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.991; // Adjust this value for different stopping speeds
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians

let spinButtonClicked = false;

// Function to get a random sector based on weighted probabilities
function getWeightedRandomSector() {
  const cumulativeProbabilities = [];
  let sum = 0;

  // Create cumulative probability distribution
  probabilities.forEach((prob, index) => {
    sum += prob;
    cumulativeProbabilities.push(sum); // Cumulative sum
  });

  const randomValue = Math.random(); // Generate random value between 0 and 1

  // Determine which sector corresponds to the random value
  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (randomValue <= cumulativeProbabilities[i]) {
      return i; // Return the index of the selected sector
    }
  }

  return cumulativeProbabilities.length - 1; // If rounding error, return the last sector
}

function getIndex() {
  return Math.floor(tot - (ang / TAU) * tot) % tot;
}

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 30px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    showPopup(finalSector.label); // Show popup with the prize
    spinButtonClicked = false;
    return;
  }

  angVel *= friction; // Apply friction to angular velocity
  if (angVel < 0.002) angVel = 0; // Stop the wheel when it slows down enough
  ang += angVel; // Update the angle
  ang %= TAU; // Keep the angle within a circle
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  sectors.forEach(drawSector);
  rotate();
  engine();
  spinEl.addEventListener("click", () => {
    if (!angVel) angVel = Math.random() * 0.2 + 0.25; // Random initial speed
    spinButtonClicked = true;

    const selectedSectorIndex = getWeightedRandomSector();
    const selectedAngle = (selectedSectorIndex * arc) - (PI / 2);
    angVel = Math.random() * 0.2 + 0.25; // Set spin speed
    ang = selectedAngle; // Set angle to start the spin near the selected sector
    rotate(); // Update the wheel immediately
  });
}
// Show the popup with the result
function showPopup(prize) {
  const resultPopup = document.createElement("div");
  resultPopup.style.position = "fixed";
  resultPopup.style.top = "50%";
  resultPopup.style.left = "50%";
  resultPopup.style.transform = "translate(-50%, -50%)";
  resultPopup.style.background = "linear-gradient(145deg, #ff8a00, #e52e71)";
  resultPopup.style.padding = "30px";
  resultPopup.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.2)";
  resultPopup.style.borderRadius = "15px";
  resultPopup.style.textAlign = "center";
  resultPopup.style.animation = "fadeIn 0.5s ease-out"; // Add fade-in animation
  resultPopup.style.zIndex = "1000";

  // Create an attractive title with larger text
  const resultText = document.createElement("h2");
  resultText.textContent = `Congratulations! You won:`;
  resultText.style.fontSize = "1.5em";
  resultText.style.fontWeight = "bold";
  resultText.style.color = "#fff";
  resultText.style.marginBottom = "10px";
  resultPopup.appendChild(resultText);

  // Create the prize text with emphasis
  const prizeText = document.createElement("h3");
  prizeText.textContent = prize;
  prizeText.style.fontSize = "2em";
  prizeText.style.fontWeight = "bold";
  prizeText.style.color = "#fff";
  prizeText.style.marginBottom = "20px";
  prizeText.style.textTransform = "uppercase";
  prizeText.style.letterSpacing = "1px";
  resultPopup.appendChild(prizeText);

  // Add a stylish close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.padding = "12px 24px";
  closeButton.style.backgroundColor = "#ff5c8f";
  closeButton.style.color = "#fff";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "8px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "1.1em";
  closeButton.style.transition = "0.3s ease";
  closeButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  closeButton.addEventListener("mouseover", () => {
    closeButton.style.backgroundColor = "#e52e71";
  });
  closeButton.addEventListener("mouseout", () => {
    closeButton.style.backgroundColor = "#ff5c8f";
  });
  closeButton.addEventListener("click", () => {
    resultPopup.remove(); // Remove popup when close button is clicked
  });
  resultPopup.appendChild(closeButton);

  // Add popup to the document body
  document.body.appendChild(resultPopup);

  // Optionally, add a background overlay to dim the rest of the screen
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999";
  document.body.appendChild(overlay);

  // Close popup and overlay when clicking outside
  overlay.addEventListener("click", () => {
    resultPopup.remove();
    overlay.remove();
  });
}

// Add fade-in animation keyframes for the popup
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;
document.head.appendChild(styleSheet);


init();
