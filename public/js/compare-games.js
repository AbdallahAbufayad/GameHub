const API_KEY = "30778c23f4f34908a65b042d94443ba7";
const API_BASE_URL = "https://api.rawg.io/api/games";

const select = (selector) => document.querySelector(selector);

function showNotification(message) {
  let notif = select("#notification");
  let text = notif ? select("#error_text") : null;

  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notification";
    notif.setAttribute("role", "alert");
    notif.style.cssText =
      "position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);z-index:9999;width:90%;max-width:20rem;padding:0.75rem 1rem;border-radius:0.5rem;box-shadow:0 10px 30px rgba(0,0,0,0.4);display:none;opacity:0;transition:opacity 0.3s ease,transform 0.3s ease;text-align:center;";
    text = document.createElement("p");
    text.id = "error_text";
    text.style.cssText = "font-size:0.875rem;margin:0;text-align:center;";
    notif.appendChild(text);
    document.body.appendChild(notif);
  }

  if (!text) return;

  const isDark = localStorage.getItem("darkmode") !== "disabled";
  notif.style.backgroundColor = isDark ? "#10b981" : "#000000";
  text.style.color = isDark ? "#000000" : "#ffffff";

  text.innerHTML = message;
  notif.style.display = "block";
  requestAnimationFrame(() => {
    notif.style.opacity = "1";
    notif.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    notif.style.opacity = "0";
    notif.style.transform = "translateX(-50%) translateY(1rem)";
    setTimeout(() => {
      notif.style.display = "none";
    }, 300);
  }, 5000);
}

function createOptimizedImage(imageUrl, gameName, cardElement) {
  const img = document.createElement("img");
  img.src = imageUrl || "";
  img.alt = gameName || "Spel afbeelding";
  img.loading = "lazy";
  img.decoding = "async";

  img.onload = function () {
    if (cardElement) {
      setTimeout(() => {
        cardElement.classList.add("loaded");
      }, Math.random() * 100);
    }
  };

  img.onerror = function () {
    this.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23334155' width='400' height='400'/%3E%3Ctext fill='%2394a3b8' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
    if (cardElement) {
      cardElement.classList.add("loaded");
    }
  };

  return img;
}

function applyGlow(button, ratingBox) {
  button.classList.add(
    "ring-4",
    "ring-emerald-400",
    "shadow-[0_0_25px_rgba(16,185,129,0.6)]",
  );

  ratingBox.classList.add(
    "border-emerald-400",
    "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
  );
}

function resetGlow(leftBtn, rightBtn, leftBox, rightBox) {
  [leftBtn, rightBtn].forEach((btn) => {
    btn.classList.remove(
      "ring-4",
      "ring-emerald-400",
      "shadow-[0_0_25px_rgba(16,185,129,0.6)]",
    );
  });

  [leftBox, rightBox].forEach((box) => {
    box.classList.remove(
      "border-emerald-400",
      "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    );
  });
}

function checkWinner() {
  const leftBtn = select("#btn_left_game");
  const rightBtn = select("#btn_right_game");
  const leftRatingBox = select("#left_rating");
  const rightRatingBox = select("#right_rating");

  if (!leftBtn || !rightBtn || !leftRatingBox || !rightRatingBox) return;

  const leftRating = parseFloat(leftBtn.dataset.rating || "");
  const rightRating = parseFloat(rightBtn.dataset.rating || "");

  if (Number.isNaN(leftRating) || Number.isNaN(rightRating)) return;

  resetGlow(leftBtn, rightBtn, leftRatingBox, rightRatingBox);

  if (leftRating > rightRating) {
    applyGlow(leftBtn, leftRatingBox);
  } else if (rightRating > leftRating) {
    applyGlow(rightBtn, rightRatingBox);
  } else {
    applyGlow(leftBtn, leftRatingBox);
    applyGlow(rightBtn, rightRatingBox);
  }
}

function selectGame(game, sideButton, modal) {
  const leftGame = select("#btn_left_game");
  const rightGame = select("#btn_right_game");

  if (!leftGame || !rightGame || !sideButton || !modal) return;

  const newUrl = `url("${game.background_image}")`;

  if (
    leftGame.style.backgroundImage === newUrl ||
    rightGame.style.backgroundImage === newUrl
  ) {
    showNotification("Dit spel staat al in een van de vergelijkingsvakken");
    return;
  }

  let ratingField = null;
  let releaseDateField = null;
  let genreField = null;
  let platformField = null;

  if (sideButton.id.includes("left")) {
    ratingField = select("#left_rating");
    releaseDateField = select("#left_release");
    genreField = select("#left_genre");
    platformField = select("#left_platform");
  } else if (sideButton.id.includes("right")) {
    ratingField = select("#right_rating");
    releaseDateField = select("#right_release");
    genreField = select("#right_genre");
    platformField = select("#right_platform");
  }

  if (!ratingField || !releaseDateField || !genreField || !platformField) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");

  sideButton.style.backgroundImage = `url(${game.background_image})`;
  sideButton.style.backgroundSize = "cover";
  sideButton.style.backgroundPosition = "center";
  sideButton.classList.add("relative", "overflow-hidden");

  sideButton.innerHTML = "";

  const gameName = document.createElement("h2");
  gameName.classList.add("text-3xl", "font-bold", "text-white", "z-10", "text-center");
  gameName.textContent = game.name;

  ratingField.textContent = String(game.rating ?? "None found");
  releaseDateField.textContent = game.released || "None found";
  genreField.textContent = game?.genres?.[0]?.name || "None found";
  platformField.textContent =
    game?.platforms?.map((p) => p.platform?.name).filter(Boolean).join(", ") ||
    "None found";

  sideButton.dataset.rating = String(game.rating ?? "");
  sideButton.appendChild(gameName);

  checkWinner();
}

function renderModalResults(games, sideButton, gamesModalContainer, modal) {
  gamesModalContainer.innerHTML = "";

  if (!games || games.length === 0) {
    gamesModalContainer.innerHTML =
      '<p class="text-red-400 col-span-full text-center py-8 italic">Geen spellen gevonden. Probeer een andere zoekopdracht.</p>';
    return;
  }

  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add(
      "bg-zinc-900",
      "border-2",
      "border-zinc-700",
      "rounded-xl",
      "overflow-hidden",
      "cursor-pointer",
      "hover:border-emerald-400",
      "hover:scale-105",
      "transition-all",
      "duration-300",
      "group",
    );

    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("w-full", "h-32", "overflow-hidden", "bg-zinc-800");

    const img = createOptimizedImage(game.background_image, game.name, card);
    img.classList.add(
      "w-full",
      "h-full",
      "object-cover",
      "group-hover:opacity-80",
      "transition-opacity",
    );

    imgWrapper.appendChild(img);

    const info = document.createElement("div");
    info.classList.add("p-3");

    const name = document.createElement("p");
    name.classList.add("text-white", "font-semibold", "text-sm", "text-wrap");
    name.textContent = game.name;

    info.appendChild(name);
    card.appendChild(imgWrapper);
    card.appendChild(info);

    card.addEventListener("click", () =>
      selectGame(game, sideButton, modal),
    );

    gamesModalContainer.appendChild(card);
  });
}

async function searchGames(query, gamesModalContainer, modal, button) {
  gamesModalContainer.innerHTML =
    '<p class="text-zinc-400 col-span-full text-center py-8 italic animate-pulse">Zoeken...</p>';

  try {
    const response = await fetch(
      `${API_BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=12`,
    );
    const data = await response.json();
    renderModalResults(data.results, button, gamesModalContainer, modal);
  } catch (error) {
    console.error("Error searching games:", error);
    gamesModalContainer.innerHTML =
      '<p class="text-red-400 col-span-full text-center py-8 italic">Fout bij het laden van spellen. Probeer het opnieuw.</p>';
  }
}

function compareGamesButtons() {
  const leftGame = select("#btn_left_game");
  const rightGame = select("#btn_right_game");
  const sideButtons = [leftGame, rightGame].filter(Boolean);

  const gamesModal = select("#game_search_modal");
  const gamesModalContainer = select("#modal_games_container");
  const closeGamesModal = select("#close_modal_btn");
  const searchGamesBtn = select("#modal_search_btn");
  const searchInputEl = select("#modal_search_input");

  if (
    !gamesModal ||
    !gamesModalContainer ||
    !closeGamesModal ||
    !searchGamesBtn ||
    !searchInputEl ||
    sideButtons.length === 0
  ) {
    return;
  }

  let currentSideButton = null;

  closeGamesModal.addEventListener("click", () => {
    gamesModal.classList.add("hidden");
    gamesModal.classList.remove("flex");
  });

  searchGamesBtn.addEventListener("click", () => {
    const query = searchInputEl.value.trim();
    searchGames(query, gamesModalContainer, gamesModal, currentSideButton);
  });

  searchInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchInputEl.value.trim();
      searchGames(query, gamesModalContainer, gamesModal, currentSideButton);
    }
  });

  sideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentSideButton = button;
      searchInputEl.value = "";
      gamesModalContainer.innerHTML =
        '<p class="text-zinc-500 col-span-full text-center py-8 italic">Begin met zoeken om spellen te zien...</p>';
      gamesModal.classList.remove("hidden");
      gamesModal.classList.add("flex");
    });
  });
}

function initialize() {
  compareGamesButtons();
}

initialize();
