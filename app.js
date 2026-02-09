const schools = [
  {
    id: "sunrise",
    name: "Sunrise Academy",
    city: "Lagos",
    type: "K-12",
    rating: 4.7,
    reviews: 214,
    highlights: "STEM-focused learning with modern labs and transport."
  },
  {
    id: "ridgeview",
    name: "Ridgeview Primary",
    city: "Abuja",
    type: "Primary",
    rating: 4.4,
    reviews: 132,
    highlights: "Inclusive curriculum, arts program, and parent portal."
  },
  {
    id: "coastal",
    name: "Coastal Heights College",
    city: "Port Harcourt",
    type: "Secondary",
    rating: 4.2,
    reviews: 98,
    highlights: "Top exam scores, career counseling, and sports academy."
  },
  {
    id: "bright",
    name: "Bright Minds Special School",
    city: "Ibadan",
    type: "Special needs",
    rating: 4.8,
    reviews: 76,
    highlights: "Therapy services, small class sizes, and assistive tech."
  }
];

const results = document.getElementById("school-results");
const nameInput = document.getElementById("search-name");
const cityInput = document.getElementById("search-city");
const ratingInput = document.getElementById("search-rating");
const useLocationButton = document.getElementById("use-location");
const ratingSchoolSelect = document.getElementById("rating-school");
const ratingForm = document.querySelector(".rating-form");
const registrationForm = document.getElementById("school-registration-form");
const notificationList = document.getElementById("notification-list");
const parentProfileForm = document.getElementById("parent-profile-form");
const parentCityInput = document.getElementById("parent-city");
let parentProfile = null;
const schoolRegistrations = [];

const renderSchools = (data) => {
  results.innerHTML = "";
  data.forEach((school) => {
    const card = document.createElement("div");
    card.className = "school-card";
    card.innerHTML = `
      <div class="rating-pill">${school.rating.toFixed(1)} ★ (${school.reviews} reviews)</div>
      <h3>${school.name}</h3>
      <div class="school-meta">
        <span>${school.city}</span>
        <span>•</span>
        <span>${school.type}</span>
      </div>
      <p>${school.highlights}</p>
      <button class="ghost" type="button">View profile</button>
    `;
    results.appendChild(card);
  });
};

const filterSchools = () => {
  const nameTerm = nameInput.value.toLowerCase();
  const cityTerm = cityInput.value.toLowerCase();
  const minRating = Number.parseFloat(ratingInput.value);

  const filtered = schools.filter((school) => {
    const matchesName = school.name.toLowerCase().includes(nameTerm);
    const matchesCity = school.city.toLowerCase().includes(cityTerm);
    const matchesRating = school.rating >= minRating;
    return matchesName && matchesCity && matchesRating;
  });

  renderSchools(filtered);
};

const populateRatingOptions = () => {
  ratingSchoolSelect.innerHTML = schools
    .map((school) => `<option value="${school.id}">${school.name}</option>`)
    .join("");
};

const renderNotifications = () => {
  if (!parentProfile) {
    notificationList.innerHTML = "<p class=\"fine-print\">Save your profile to receive notifications.</p>";
    return;
  }

  const relevant = schoolRegistrations
    .filter((item) => item.city.toLowerCase() === parentProfile.city.toLowerCase())
    .slice(-5)
    .reverse();

  if (relevant.length === 0) {
    notificationList.innerHTML = "<p class=\"fine-print\">No notifications yet.</p>";
    return;
  }

  notificationList.innerHTML = relevant
    .map(
      (item) => `
        <div class="notification-item">
          <strong>${item.name}</strong>
          <span>New school registered in ${item.city}</span>
          <span>${item.time}</span>
        </div>
      `
    )
    .join("");
};

[nameInput, cityInput, ratingInput].forEach((input) =>
  input.addEventListener("input", filterSchools)
);

useLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    cityInput.value = "";
    cityInput.placeholder = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    () => {
      cityInput.value = "Lagos";
      filterSchools();
    },
    () => {
      cityInput.value = "";
      cityInput.placeholder = "Unable to detect location";
    }
  );
});

ratingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedId = ratingSchoolSelect.value;
  const score = Number.parseInt(document.getElementById("rating-score").value, 10);
  const school = schools.find((item) => item.id === selectedId);
  if (!school) {
    return;
  }

  const totalScore = school.rating * school.reviews + score;
  school.reviews += 1;
  school.rating = totalScore / school.reviews;
  renderSchools(schools);
});

parentProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  parentProfile = {
    name: document.getElementById("parent-name").value.trim(),
    email: document.getElementById("parent-email").value.trim(),
    city: parentCityInput.value.trim()
  };
  renderNotifications();
});

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("school-name").value.trim();
  const city = document.getElementById("school-city").value.trim();
  const type = document.getElementById("school-type").value;
  const overview = document.getElementById("school-overview").value.trim();
  const address = document.getElementById("school-address").value.trim();

  if (!name || !city || !type || !address) {
    return;
  }

  const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  const newSchool = {
    id,
    name,
    city,
    type,
    rating: 0,
    reviews: 0,
    highlights: overview || "Newly registered school profile."
  };

  schools.unshift(newSchool);
  schoolRegistrations.push({
    name,
    city,
    time: new Date().toLocaleString()
  });

  renderSchools(schools);
  populateRatingOptions();
  renderNotifications();
  registrationForm.reset();
});

populateRatingOptions();
renderSchools(schools);
renderNotifications();
