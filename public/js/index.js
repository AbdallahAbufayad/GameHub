const btn_MusicMatch = document.querySelector("#btn_MusicMatch");
const btn_LegoMaster = document.querySelector("#btn_LegoMaster");
const btn_GameHub = document.querySelector("#btn_GameHub");
const notification = document.querySelector("#notification");
const error_text = document.querySelector("#error_text");
const body = document.querySelector("body");
const Projects = document.querySelector(".Projects");
const Choose_a_project = document.querySelector(".Choose_a_project");

btn_MusicMatch.addEventListener("click", () => {
  showNotification("We konden je niet brengen naar MusicMatch");
});

btn_LegoMaster.addEventListener("click", () => {
  showNotification("We konden je niet brengen naar LegoMaster");
});
btn_GameHub.addEventListener("click", async () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const userId = localStorage.getItem("userId");

  if (isLoggedIn === "true") {
    window.location.href = "/home.html";
    const currentUser = await fetchUserInfo(userId);

    if (currentUser.profile_picture && currentUser?.profile_picture != "") {
      user_avatar.src = currentUser.profile_picture;
    }
  } else {
    window.location.href = "login.html";
  }
});

//Useful function.
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

checkCurrentGame();

checkIfLoggedIn();
