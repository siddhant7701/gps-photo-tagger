const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const logo = new Image();
logo.src = "logo.jpeg"; // your logo file
let uploadedImage = null;

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

// Load dropdown
const select = document.getElementById("locationSelect");
locations.forEach((loc, i) => {
  let option = document.createElement("option");
  option.value = i;
  option.text = loc.name;
  select.appendChild(option);
});

// Upload Image
document.getElementById("upload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    uploadedImage = new Image();
    uploadedImage.src = event.target.result;

    uploadedImage.onload = function() {
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

  // Bottom Overlay
  const boxHeight = 200;
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

  ctx.fillStyle = "white";

  // Address
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(loc.address, canvas.width / 2, canvas.height - 150);

  // Left
  ctx.textAlign = "left";
  ctx.font = "20px Arial";

  ctx.fillText("Latitude", 20, canvas.height - 110);
  ctx.fillText(loc.lat, 20, canvas.height - 85);

  ctx.fillText("Local " + time, 20, canvas.height - 55);
  ctx.fillText("GMT " + gmt, 20, canvas.height - 30);

  // Right
  ctx.fillText("Longitude", canvas.width - 260, canvas.height - 110);
  ctx.fillText(loc.lng, canvas.width - 260, canvas.height - 85);

  ctx.fillText("Altitude " + loc.altitude, canvas.width - 260, canvas.height - 55);
  ctx.fillText(date, canvas.width - 260, canvas.height - 30);

  // LOGO + TEXT (BOTTOM RIGHT LIKE REAL APP)
const logoWidth = 80;
const logoHeight = 80;

const x = canvas.width - logoWidth - 20;
const y = canvas.height - boxHeight - logoHeight - 20;

ctx.fillStyle = "rgba(0,0,0,0.6)";
ctx.fillRect(x - 10, y - 10, logoWidth + 20, logoHeight + 50);

ctx.drawImage(logo, x, y, logoWidth, logoHeight);

ctx.fillStyle = "white";
ctx.font = "bold 16px Arial";
ctx.textAlign = "center";

ctx.fillText(
  "GPS Map",
  x + logoWidth / 2,
  y + logoHeight + 20
);

ctx.font = "14px Arial";

ctx.fillText(
  "Camera",
  x + logoWidth / 2,
  y + logoHeight + 40
);
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "geo-tagged.png";
  link.href = canvas.toDataURL();
  link.click();
}