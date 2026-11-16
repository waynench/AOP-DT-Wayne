
// ==========================================
// MOBILE NAVBAR
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".Wayne-Kenzie-nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("active");
  });
});

document.addEventListener("click", function (event) {
  if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
    navLinks.classList.remove("active");
  }
});

window.addEventListener("scroll", function () {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
});


// ==========================================
// HERO SLIDER
// ==========================================

const hero = document.getElementById("hero");
const heroCounter = document.getElementById("heroCounter");

const heroImages = [
  "sekolah-1.png",
  "sekolah-2.png"
];

let currentHero = 0;

function changeHero(index) {
  currentHero = (index + heroImages.length) % heroImages.length;

  hero.style.backgroundImage =
    'linear-gradient(90deg, rgba(32,10,19,0.91), rgba(43,15,26,0.67) 48%, rgba(43,15,26,0.12)), url("' +
    heroImages[currentHero] + '")';

  heroCounter.textContent =
    "0" + (currentHero + 1) + " / 0" + heroImages.length;
}

document.getElementById("nextHero").addEventListener("click", function () {
  changeHero(currentHero + 1);
});

document.getElementById("prevHero").addEventListener("click", function () {
  changeHero(currentHero - 1);
});

// Initialize hero
changeHero(0);


// ==========================================
// HERO TOUCH / SWIPE SUPPORT
// ==========================================

let touchStartX = 0;

hero.addEventListener("touchstart", function (event) {
  touchStartX = event.changedTouches[0].screenX;
});

hero.addEventListener("touchend", function (event) {
  const difference = event.changedTouches[0].screenX - touchStartX;

  if (Math.abs(difference) > 50) {
    changeHero(currentHero + (difference < 0 ? 1 : -1));
  }
});


// ==========================================
// LIVE VOTE COUNT
// ==========================================

const voteAPI =
  "https://script.google.com/macros/s/AKfycbz5H5Pl8stphwzZgDJy6Hd1UKtM0oGERG1GQ7zcrlhL3icnmHW4gpbXWJPKI4fcU0YL/exec";

async function updateVoteCount() {
  const status = document.getElementById("voteStatus");

  try {
    const response = await fetch(voteAPI, {
      method: "GET",
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error("Unable to retrieve vote data.");
    }

    const data = await response.json();

    const votes1 = Number(data.paslon1) || 0;
    const votes2 = Number(data.paslon2) || 0;
    const total = votes1 + votes2;

    const percent1 = total ? (votes1 / total) * 100 : 0;
    const percent2 = total ? (votes2 / total) * 100 : 0;


    // UPDATE VOTE NUMBERS

    document.getElementById("vote1").textContent =
      votes1.toLocaleString("id-ID");

    document.getElementById("vote2").textContent =
      votes2.toLocaleString("id-ID");

    document.getElementById("totalVotes").textContent =
      total.toLocaleString("id-ID");


    // UPDATE PERCENTAGES

    document.getElementById("percent1").textContent =
      percent1.toFixed(1) + "%";

    document.getElementById("percent2").textContent =
      percent2.toFixed(1) + "%";


    // UPDATE PIE CHART

    const pieChart = document.getElementById("votePieChart");

    pieChart.style.setProperty(
      "--paslon1",
      (total ? percent1 : 50) + "%"
    );

    pieChart.setAttribute(
      "aria-label",
      `Paslon 01 memperoleh ${percent1.toFixed(1)} persen suara dan Paslon 02 memperoleh ${percent2.toFixed(1)} persen suara.`
    );


    // UPDATE LEADING CANDIDATE

    const card1 = document.getElementById("card1");
    const card2 = document.getElementById("card2");

    card1.classList.remove("leading");
    card2.classList.remove("leading");

    if (votes1 > votes2) {
      card1.classList.add("leading");
    } else if (votes2 > votes1) {
      card2.classList.add("leading");
    }


    // UPDATE STATUS

    status.textContent = "Vote data successfully updated.";

  } catch (error) {
    console.error(error);

    status.textContent =
      "Vote data is currently unavailable. Please check the connection.";
  }
}


// INITIALIZE LIVE VOTE COUNT

updateVoteCount();

setInterval(updateVoteCount, 5000);
