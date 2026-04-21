const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const logo = new Image();
logo.src = "logo.jpeg";

let uploadedImage = null;
let originalFileName = "download.png";

// 📍 Locations
const locations = [
  {
    name: "Chainpur Location",
    address: "FWHX+34X, Chainpur, Bihar 841508, India 🇮🇳",
    lat: "26.477313333333335°",
    lng: "83.94731166666666°",
    altitude: "71 meters"
  },
  {
    name: "Bhanpur Location",
    address: "FXH4+WR, Bhanpur, Bihar 841508, India 🇮🇳",
    lat: "26.479713333333333°",
    lng: "83.95671833333333°",
    altitude: "71 meters"
  }
];

// Dropdown
const select = document.getElementById("locationSelect");
locations.forEach((loc, i) => {
  const option = document.createElement("option");
  option.value = i;
  option.text = loc.name;
  select.appendChild(option);
});

// Upload Image
document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  originalFileName = file.name;

  const reader = new FileReader();
  reader.onload = function (event) {
    uploadedImage = new Image();
    uploadedImage.src = event.target.result;

    uploadedImage.onload = function () {
      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;
      ctx.drawImage(uploadedImage, 0, 0);
    };
  };
  reader.readAsDataURL(file);
});

// Generate Image
function generateImage() {
  if (!uploadedImage) return alert("Upload image first");

  ctx.drawImage(uploadedImage, 0, 0);

  const loc = locations[select.value];

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  const gmt = now.toUTCString().split(" ")[4];

  // 🔥 Dynamic overlay
  const boxHeight = canvas.height * 0.25;

  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

  const fontLarge = Math.floor(canvas.width * 0.035);
  const fontSmall = Math.floor(canvas.width * 0.025);

  ctx.fillStyle = "white";

  // Address
  ctx.font = `bold ${fontLarge}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(loc.address, canvas.width / 2, canvas.height - boxHeight + 40);

  // Left
  ctx.textAlign = "left";
  ctx.font = `${fontSmall}px Arial`;

  ctx.fillText("Latitude", 20, canvas.height - boxHeight + 80);
  ctx.fillText(loc.lat, 20, canvas.height - boxHeight + 110);

  ctx.fillText("Local " + time, 20, canvas.height - boxHeight + 140);
  ctx.fillText("GMT " + gmt, 20, canvas.height - boxHeight + 170);

  // Right
  const rightX = canvas.width - 260;

  ctx.fillText("Longitude", rightX, canvas.height - boxHeight + 80);
  ctx.fillText(loc.lng, rightX, canvas.height - boxHeight + 110);

  ctx.fillText("Altitude " + loc.altitude, rightX, canvas.height - boxHeight + 140);
  ctx.fillText(date, rightX, canvas.height - boxHeight + 170);

  // 🔥 LOGO (Responsive + Clean)
  const logoSize = canvas.width * 0.12;

  const x = canvas.width - logoSize - 20;
  const y = canvas.height - boxHeight - logoSize - 20;

  // Card background
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.beginPath();
  ctx.roundRect(x - 10, y - 10, logoSize + 20, logoSize + 50, 15);
  ctx.fill();

  // Border
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.stroke();

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // Logo
  ctx.drawImage(logo, x, y, logoSize, logoSize);

  // Reset shadow
  ctx.shadowColor = "transparent";

  // Text
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = `${fontSmall}px Arial`;
  ctx.fillText("GPS Map", x + logoSize / 2, y + logoSize + 20);
  ctx.fillText("Camera", x + logoSize / 2, y + logoSize + 40);
}

// Download (original filename)
function downloadImage() {
  const link = document.createElement("a");
  link.download = originalFileName;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

// ✅ Fix for roundRect (if not supported)
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
  };
}