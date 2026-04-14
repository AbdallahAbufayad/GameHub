// Shared game display and filtering functions
const games_container = document.querySelector("#games_container");
const btn_left = document.querySelector("#btn_left");
const btn_right = document.querySelector("#btn_right");
const popular_games = document.querySelector("#popular_games");
const recent_games = document.querySelector("#recent_games");
const searchinput1 = document.querySelector("#search_input");
const searchbtn = document.querySelector("#search_btn") ?? null;
const clear_btn = document.querySelector("#clear_btn");
const Rating_count = document.querySelector("#Rating_count");
const Number_of_People = document.querySelector("#Number_of_People");
const Alfabetisch_A_Z = document.querySelector("#Alfabetisch_A_Z");
const Alfabetisch_Z_A = document.querySelector("#Alfabetisch_Z_A");
const Rating_asc = document.querySelector("#Rating_asc");
const Rating_desc = document.querySelector("#Rating_desc");
const Release_Year_asc = document.querySelector("#Release_Year_asc");
const Release_Year_desc = document.querySelector("#Release_Year_desc");
const singleplayer = document.querySelector("#singleplayer");
const multiplayer = document.querySelector("#multiplayer");
const addToCollectionMenu = document.querySelector("#addToCollectionMenu");
const create_collection_btn = document.querySelector("#create_collection_btn");
const collection_filed = document.querySelector("#collection_filed");
const collection_name = document.querySelector("#collection_name");
const add_collection_btn = document.querySelector("#add_collection_btn");
const allCollectionsNames = document.querySelector("#allCollectionsNames");
const gameOfCollection = document.querySelector("#gameOfCollection");
const allGamesOfCollection = document.querySelector("#allGamesOfCollection");
const delete_collection_btn = document.querySelector("#delete_collection_btn");
const closegameOfCollectionMenu = document.querySelector(
  "#closegameOfCollectionMenu",
);
const modal_backdrop = document.querySelector("#modal_backdrop");
const searchForUsers = document.querySelector("#searchForUsers");
const txtOfPage = document.querySelector("#txtOfPage");
const loadingOverlay = document.querySelector("#loadingOverlay");

let page = 1;
let activeFilter = "default";
let lastResultCount = 10;
const API_KEY = "30778c23f4f34908a65b042d94443ba7";
const API_BASE_URL = "https://api.rawg.io/api/games";
const PAGE_SIZE = 20;

function showNotification(message) {
  let notif = document.querySelector("#notification");
  let text = notif ? document.querySelector("#error_text") : null;

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

function updatePaginationButtons() {
  if (!btn_left || !btn_right) return;

  btn_left.disabled = page <= 1;
  btn_right.disabled = lastResultCount < PAGE_SIZE;
}

// Optimized image loading to prevent main thread blocking
function createOptimizedImage(imageUrl, gameName, cardElement) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = gameName || "Game image";
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

// function to create game card
function createGameCard(game, showAddButton = true) {
  const div = document.createElement("div");
  const div1 = document.createElement("div");
  const img = createOptimizedImage(game.background_image, game.name, div);
  const p = document.createElement("p");
  const a = document.createElement("a");

  div1.appendChild(img);
  div1.className = "absolute inset-0";
  img.className = "w-full h-full object-cover";

  p.innerHTML = `${game.name}`;
  a.appendChild(p);
  a.href = `/game-info/${game.id}`;
  a.target = "_self";

  div.className =
    "relative w-full aspect-square rounded-xl overflow-hidden border-2 border-zinc-700 bg-zinc-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-zinc-800";
  a.className = "absolute inset-0 z-10";
  p.className =
    "absolute inset-x-0 bottom-0 p-4 text-center bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white font-bold text-base drop-shadow";

  div.appendChild(div1);
  div.appendChild(a);

  // this makes collection adding btn only in games page.
  if (showAddButton) {
    const button_select_game = document.createElement("button");
    button_select_game.innerHTML = "+";
    button_select_game.className =
      "absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-900/80 border border-white/30 text-white text-xl font-bold leading-8 text-center backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-slate-800";
    button_select_game.type = "button";

    localStorage.setItem(`gameImage_for_id:${game.id}`, game.background_image);
    localStorage.setItem(`gameName_for_id:${game.id}`, game.name);
    localStorage.setItem(`gameId_for_id:${game.id}`, game.id);

    button_select_game.addEventListener("click", async () => {
      const isLoggedIn = localStorage.getItem("loggedIn");

      if (isLoggedIn !== "true") {
        window.location.href = "/login";
        return;
      }

      if (!addToCollectionMenu) return;

      localStorage.setItem("currentId", game.id);
      const userId = localStorage.getItem("userId");
      await showCollection(userId);
      if (allCollectionsNames) {
        allCollectionsNames.style.display = "flex";
      }
      if (addToCollectionMenu) {
        addToCollectionMenu.style.display = "block";
        addToCollectionMenu.style.animation = "showInput 100ms linear forwards";
      }
      if (modal_backdrop) {
        modal_backdrop.style.display = "block";
      }
    });

    div.appendChild(button_select_game);
  }

  return div;
}

// load indicator function

function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
  }, 400);
}

// Generic fetch function to reduce code duplication
async function fetchAndDisplayGames(url, sortFn = null) {
  if (!games_container) {
    return;
  }

  try {
    showLoading();
    games_container.innerHTML = "";
    const response = await fetch(url).then((res) => res.json());

    lastResultCount = response.results.length;
    updatePaginationButtons();

    const results = sortFn ? response.results.sort(sortFn) : response.results;

    // Check if we're on home page (popular_games only exists on home page)
    const isHomePage = popular_games !== null;

    setTimeout(() => {
      hideLoading();
      setTimeout(() => {
        results.forEach((game) => {
          games_container.appendChild(createGameCard(game, !isHomePage));
        });
      }, 100);
    }, 500);
  } catch (error) {
    //console.error("Error fetching games:", error);
    games_container.innerHTML =
      "<p style='color: red; padding: 20px;'>Error loading games. Please try again.</p>";
  }
}

async function fetchdata() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=-released&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function showCollection(userId) {
  if (!allCollectionsNames) return;

  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    const data = await response.json();

    allCollectionsNames.innerHTML = "";

    if (data.collection_more && data.collection_more.length !== 0) {
      for (let collectionname of data.collection_more) {
        const collection_btn = document.createElement("button");
        collection_btn.className =
          "w-full rounded-lg border border-emerald-500 bg-slate-800 px-3 py-2 text-left font-semibold text-white transition-all duration-300 hover:translate-x-1 hover:bg-emerald-500";
        collection_btn.innerHTML = collectionname.collectionName;

        const currentId = localStorage.getItem("currentId");
        let currentGameId = localStorage.getItem(`gameId_for_id:${currentId}`);

        let collection_Name = collectionname.collectionName;
        collection_btn.addEventListener("click", async () => {
          const currentId = localStorage.getItem("currentId");
          const game_id = localStorage.getItem(`gameId_for_id:${currentId}`);

          currentGameId = game_id;
          const game_Name = localStorage.getItem(
            `gameName_for_id:${currentId}`,
          );
          const game_Image = localStorage.getItem(
            `gameImage_for_id:${currentId}`,
          );

          await showCollections(
            userId,
            collection_Name,
            game_id,
            game_Name,
            game_Image,
          );

          if (addToCollectionMenu) {
            addToCollectionMenu.style.display = "none";
            addToCollectionMenu.style.animation = "";
          }
          if (modal_backdrop) {
            modal_backdrop.style.display = "none";
          }
        });

        if (!collectionname.allGames.find((g) => g.gameId === currentGameId)) {
          allCollectionsNames.appendChild(collection_btn);
        }
      }
    } else {
      const div = document.createElement("div");
      div.innerHTML = "There is no collections yet";
      div.style.color = "#a1a1aa";
      div.style.textAlign = "center";
      div.style.padding = "1rem";
      allCollectionsNames.appendChild(div);
    }
  } catch (error) {
    console.error("Error loading collections:", error);
  }
}

async function showCollections(
  userId,
  collectionName,
  gameId,
  gameName,
  gameImage,
) {
  const response = await fetch(`http://localhost:3000/users/${userId}`);
  const data = await response.json();

  const currentlyPlayingCollection = data.collection_more.find((c) =>
    c.collectionName.includes("Momenteel aan het spelen"),
  );

  if (
    collectionName.includes("Momenteel aan het spelen") &&
    currentlyPlayingCollection.allGames.length >= 1
  ) {
    showNotification(
      "Je kan geen andere game toevoegen aan deze collectie. Verwijder eerst de vorige uit deze collectie.",
    );
    return;
  }

  if (!data.collection_more) {
    data.collection_more = [];
  }
  let collectionExists = false;
  for (let collection of data.collection_more) {
    if (collection.collectionName === collectionName) {
      collectionExists = true;
      // Check if game already exists in collection
      const gameExists = collection.allGames.some(
        (game) => game.gameId === gameId,
      );
      if (!gameExists) {
        collection.allGames.push({
          gameId: gameId,
          gameName: gameName,
          gameImge: gameImage,
        });
      }

      break;
    }
  }

  if (!collectionExists) {
    data.collection_more.push({
      collectionName: collectionName,
      allGames: [
        {
          gameId: gameId,
          gameName: gameName,
          gameImge: gameImage,
        },
      ],
    });
  }

  await fetch(`http://localhost:3000/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collection_more: data.collection_more }),
  });

  showNotification("Spel was successvol toegevoegd aan de collectie.");
}
///
if (create_collection_btn && collection_filed) {
  create_collection_btn.addEventListener("click", () => {
    collection_filed.style.display = "flex";
    collection_filed.style.animation = "showInput 100ms linear forwards";
  });
}

if (delete_collection_btn && addToCollectionMenu) {
  delete_collection_btn.addEventListener("click", () => {
    addToCollectionMenu.style.display = "none";
    addToCollectionMenu.style.animation = "";
    if (modal_backdrop) {
      modal_backdrop.style.display = "none";
    }
  });
}
if (add_collection_btn && collection_name) {
  add_collection_btn.type = "button";
  add_collection_btn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (addToCollectionMenu) {
      addToCollectionMenu.style.display = "none";
      addToCollectionMenu.style.animation = "";
    }
    if (collection_filed) {
      collection_filed.style.display = "none";
      collection_filed.style.animation = "";
    }
    if (modal_backdrop) {
      modal_backdrop.style.display = "none";
    }
    const userId = localStorage.getItem("userId");
    let currentId = localStorage.getItem("currentId");
    let game_id = localStorage.getItem(`gameId_for_id:${currentId}`);
    let game_Name = localStorage.getItem(`gameName_for_id:${currentId}`);
    let game_Image = localStorage.getItem(`gameImage_for_id:${currentId}`);
    await showCollections(
      userId,
      collection_name.value,
      game_id,
      game_Name,
      game_Image,
    );
    collection_name.value = "";
  });
}

async function filter_by_rating_count() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&page=${page}&page_size=${PAGE_SIZE}`,
    (a, b) => b.ratings_count - a.ratings_count,
  );
}

async function filter_by_number_of_people() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&page=${page}&page_size=${PAGE_SIZE}`,
    (a, b) => b.added_by_status["owned"] - a.added_by_status["owned"],
  );
}

async function filter_by_name_Alfabetisch_A_Z() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=name&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function filter_by_name_Alfabetisch_Z_A() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=-name&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function filter_by_Rating_asc() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=rating&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function filter_by_Rating_desc() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=-rating&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function filter_by_Release_Year_asc() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=released&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function filter_by_Release_Year_desc() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=-released&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function filter_by_singleplayer() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&tags=singleplayer&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function filter_by_multiplayer() {
  await fetchAndDisplayGames(
    `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&tags=multiplayer&page=${page}&page_size=${PAGE_SIZE}`,
  );
}

async function sort_popular_games() {
  if (!popular_games) return;

  try {
    popular_games.innerHTML = "";
    const response = await fetch(`${API_BASE_URL}?key=${API_KEY}`).then((res) =>
      res.json(),
    );

    const sortedData = response.results.sort(
      (a, b) => b.added_by_status["owned"] - a.added_by_status["owned"],
    );

    sortedData.slice(0, 5).forEach((game) => {
      popular_games.appendChild(createGameCard(game, false));
    });
  } catch (error) {
    console.error("Error loading popular games:", error);
  }
}

async function sort_recent_games() {
  if (!recent_games) return;

  try {
    recent_games.innerHTML = "";
    const response = await fetch(
      `${API_BASE_URL}?key=${API_KEY}&dates=1969-01-01,2026-12-02&ordering=-released`,
    ).then((res) => res.json());

    const sortedData = response.results.sort((a, b) =>
      b.released.localeCompare(a.released),
    );

    sortedData.slice(0, 5).forEach((game) => {
      recent_games.appendChild(createGameCard(game, false));
    });
  } catch (error) {
    console.error("Error loading recent games:", error);
  }
}

function loadCurrentView() {
  const filterMap = {
    singleplayer: filter_by_singleplayer,
    multiplayer: filter_by_multiplayer,
    release_asc: filter_by_Release_Year_asc,
    release_desc: filter_by_Release_Year_desc,
    rating_count: filter_by_rating_count,
    people: filter_by_number_of_people,
    Alfabetisch_A_Z: filter_by_name_Alfabetisch_A_Z,
    Alfabetisch_Z_A: filter_by_name_Alfabetisch_Z_A,
    Rating_asc: filter_by_Rating_asc,
    rating_desc: filter_by_Rating_desc,
  };

  const filterFn = filterMap[activeFilter] || fetchdata;
  filterFn();
}

async function checkIfLoggedIn() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const userId = localStorage.getItem("userId");
  const user_avatar = document.querySelector("#user_avatar");

  if (isLoggedIn === "true" && user_avatar) {
    try {
      const currentUser = await fetchUserInfo(userId);
      if (currentUser.profile_picture) {
        user_avatar.src = currentUser.profile_picture;
      }
    } catch (error) {}
  }
}

async function fetchUserInfo(givenId) {
  try {
    const users = await fetch("http://localhost:3000/users").then((res) =>
      res.json(),
    );
    return users.find((user) => user.id === givenId) || {};
  } catch (error) {
    return {};
  }
}

checkIfLoggedIn();

// load games without needing to click on the search btn.
async function performSearch() {
  if (!games_container) return;

  if (searchinput1.value === "") {
    txtOfPage.innerHTML = "All Games";
    fetchdata();
  } else {
    try {
      if (btn_right) btn_right.disabled = true;
      if (btn_left) btn_left.disabled = true;

      if (searchForUsers.checked) {
        games_container.innerHTML = "";
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        let userIsFound = false;

        txtOfPage.innerHTML = "All Users";

        for (let user of data) {
          if (
            user.username
              .toLowerCase()
              .includes(searchinput1.value.toLowerCase())
          ) {
            userIsFound = true;
            const div = document.createElement("div");
            const div1 = document.createElement("div");
            const img = createOptimizedImage(
              user.profile_picture,
              user.username,
              div,
            );
            const p = document.createElement("p");
            const a = document.createElement("a");

            div1.appendChild(img);
            div1.className = "absolute inset-0";
            img.className = "w-full h-full object-cover";

            p.innerHTML = `${user.username}`;
            a.appendChild(p);
            a.href = `/public-profile?id=${user.id}`;
            a.target = "blank";

            div.className =
              "relative w-full aspect-square rounded-xl overflow-hidden border-2 border-zinc-700 bg-zinc-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-zinc-800";
            a.className = "absolute inset-0 z-10";
            p.className =
              "absolute inset-x-0 bottom-0 p-4 text-center bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white font-bold text-base drop-shadow";

            div.appendChild(div1);
            div.appendChild(a);
            games_container.appendChild(div);
          }
        }

        if (!userIsFound) {
          games_container.innerHTML =
            "<p style='color: red; padding: 20px;'>User was not found. Please try another one</p>";
        }
      } else {
        txtOfPage.innerHTML = "All Games";
        games_container.innerHTML = "";
        const response = await fetch(
          `${API_BASE_URL}?key=${API_KEY}&search=${searchinput1.value}`,
        ).then((res) => res.json());

        if (response.results.length === 0) {
          games_container.innerHTML =
            "<p style='color: red; padding: 20px;'>Game was not found. Please try another one</p>";
        }

        const isHomePage = popular_games !== null;

        response.results.forEach((game) => {
          games_container.appendChild(createGameCard(game, !isHomePage));
        });
      }
    } catch (error) {
      console.error("Error searching games:", error);
      games_container.innerHTML =
        "<p style='color: red; padding: 20px;'>Error searching games. Please try again.</p>";
    }
  }
}

// Search button click
if (searchbtn != null) {
  searchbtn.addEventListener("click", performSearch);
}

// Handle search input and clear button
if (searchinput1) {
  let searchTimeout;

  // Initially hide clear button if input is empty
  if (clear_btn) {
    clear_btn.style.display =
      searchinput1.value.trim() === "" ? "none" : "block";
  }

  searchinput1.addEventListener("input", () => {
    // Update clear button visibility
    if (clear_btn) {
      clear_btn.style.display =
        searchinput1.value.trim() === "" ? "none" : "block";
    }

    // Debounced search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch();
    }, 500); // Wait 500ms after user stops typing
  });

  // Handle clear button click
  if (clear_btn) {
    clear_btn.addEventListener("click", () => {
      searchinput1.value = "";
      clear_btn.style.display = "none";
      searchinput1.focus();
      page = 1;
      if (games_container) {
        txtOfPage.innerHTML = "All Games";
        fetchdata();
      }
    });
  }
}

function addFilterListener(element, filterName, filterFunction) {
  if (!element) return;

  element.addEventListener("click", (event) => {
    if (event.target.checked) {
      page = 1;
      activeFilter = filterName;
      filterFunction();
    } else {
      page = 1;
      activeFilter = "default";
      fetchdata();
    }
  });
}

addFilterListener(Rating_count, "rating_count", filter_by_rating_count);
addFilterListener(Number_of_People, "people", filter_by_number_of_people);
addFilterListener(
  Alfabetisch_A_Z,
  "Alfabetisch_A_Z",
  filter_by_name_Alfabetisch_A_Z,
);
addFilterListener(
  Alfabetisch_Z_A,
  "Alfabetisch_Z_A",
  filter_by_name_Alfabetisch_Z_A,
);
addFilterListener(Rating_asc, "Rating_asc", filter_by_Rating_asc);
addFilterListener(Rating_desc, "rating_desc", filter_by_Rating_desc);
addFilterListener(Release_Year_asc, "release_asc", filter_by_Release_Year_asc);
addFilterListener(
  Release_Year_desc,
  "release_desc",
  filter_by_Release_Year_desc,
);
addFilterListener(singleplayer, "singleplayer", filter_by_singleplayer);
addFilterListener(multiplayer, "multiplayer", filter_by_multiplayer);

// Pagination
if (btn_right) {
  btn_right.addEventListener("click", (e) => {
    e.preventDefault();
    page++;
    loadCurrentView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (btn_left) {
  btn_left.addEventListener("click", (e) => {
    e.preventDefault();
    if (page > 1) {
      page--;
      loadCurrentView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

if (games_container) {
  fetchdata();
}

if (popular_games) {
  sort_popular_games();
}

if (recent_games) {
  sort_recent_games();
}

// Close modal when clicking the backdrop
if (modal_backdrop) {
  modal_backdrop.addEventListener("click", () => {
    if (addToCollectionMenu) {
      addToCollectionMenu.style.display = "none";
      addToCollectionMenu.style.animation = "";
    }
    modal_backdrop.style.display = "none";
  });
}

async function checkCurrentGame() {
  const currentGame = document.querySelector("#current_game");
  if (!currentGame) return;

  const disableLink = () => {
    currentGame.parentElement.removeAttribute("href");
    currentGame.parentElement.style.cursor = "default";
    currentGame.parentElement.style.pointerEvents = "none";
  };

  try {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const userId = localStorage.getItem("userId");

    if (isLoggedIn !== "true" || !userId) {
      disableLink();
      return;
    }

    const userInfo = await fetchUserInfo(userId);

    if (!userInfo || !Array.isArray(userInfo.collection_more)) {
      disableLink();
      return;
    }

    const userCurrentlyPlaying = userInfo.collection_more.find((c) => {
      const name = c.collectionName.toLowerCase();
      return name.includes("currently playing") || name.includes("momenteel");
    });

    if (
      userCurrentlyPlaying &&
      userCurrentlyPlaying.allGames &&
      userCurrentlyPlaying.allGames.length > 0
    ) {
      currentGame.innerHTML = userCurrentlyPlaying.allGames[0].gameName;
      currentGame.parentElement.href = `/game-info/${userCurrentlyPlaying.allGames[0].gameId}`;
    } else {
      disableLink();
    }
  } catch (err) {
    console.error("checkCurrentGame error:", err);
  }
}

checkCurrentGame();

updatePaginationButtons();
