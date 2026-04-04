//JS code for home page!
const body = document.querySelector("body");
const header = document.querySelector("header");
const logo = document.querySelector("#logo");
const nav_home = document.querySelector("#nav_home");
const nav_games = document.querySelector("#nav_games");
const nav_guess = document.querySelector("#nav_guess");
const nav_compare = document.querySelector("#nav_compare");
const nav_collections = document.querySelector("#nav_collections");
const nav_contact = document.querySelector("#nav_contact");
const currently_game = document.querySelector("#currently_game");
const div_popular_games = document.querySelector("#div_popular_games");
const div_recent_games = document.querySelector("#div_recent_games");
const div_all_games = document.querySelector("#div_all_games");
const slider = document.querySelector(".slider");
const user_avatar = document.querySelector("#user_avatar");

if (user_avatar) {
  user_avatar.parentElement.addEventListener("click", (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === "true") {
      window.location.href = "./profile.html?page=info";
    } else {
      window.location.href = "./login.html";
    }
  });
}

if (nav_collections) {
  nav_collections.addEventListener("click", (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === "true") {
      window.location.href = "./profile.html?page=collections";
    } else {
      window.location.href = "./login.html";
    }
  });
}

async function checkIfLoggedIn() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const userId = localStorage.getItem("userId");

  if (isLoggedIn === "true") {
    const currentUser = await fetchUserInfo(userId);

    if (currentUser.profile_picture && currentUser?.profile_picture != "") {
      user_avatar.src = currentUser.profile_picture;
    }
  }
}

async function fetchUserInfo(givenId) {
  const users = await fetch("http://localhost:3000/users")
    .then((res) => res.json())
    .then((res) => {
      return res;
    });

  let userInfo = {};

  users.forEach((user) => {
    if (user.id === givenId) {
      userInfo = user;
    }
  });

  return userInfo;
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
      currentGame.parentElement.href = `./game-info.html?id=${userCurrentlyPlaying.allGames[0].gameId}`;
    } else {
      disableLink();
    }
  } catch (err) {
    console.error("checkCurrentGame error:", err);
  }
}
