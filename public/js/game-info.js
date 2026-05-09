const add_to_collection_btn = document.querySelector("#add_to_collection_btn");
const addToCollectionMenu = document.querySelector("#addToCollectionMenu");
const allCollectionsNames = document.querySelector("#allCollectionsNames");
const modal_backdrop = document.querySelector("#modal_backdrop");
const delete_collection_btn = document.querySelector("#delete_collection_btn");
const create_collection_btn = document.querySelector("#create_collection_btn");
const add_collection_btn = document.querySelector("#add_collection_btn");
const collection_filed = document.querySelector("#collection_filed");
const collection_name = document.querySelector("#collection_name");
const scroll_to_reviews_btn = document.querySelector("#scroll_to_reviews_btn");
const review_container = document.querySelector("#review_container");
const addToCollectionTitle = addToCollectionMenu?.querySelector("h3");

const isLightTheme = document.body.classList.contains("theme-light");

const applyCollectionMenuTheme = () => {
  if (!addToCollectionMenu) return;

  addToCollectionMenu.style.backgroundColor = isLightTheme
    ? "rgba(255, 255, 255, 0.96)"
    : "rgba(15, 23, 42, 0.95)";
  addToCollectionMenu.style.borderColor = isLightTheme ? "#cbd5e1" : "#10b981";
  addToCollectionMenu.style.boxShadow = isLightTheme
    ? "0 24px 60px rgba(148, 163, 184, 0.28)"
    : "0 24px 60px rgba(15, 23, 42, 0.45)";

  if (addToCollectionTitle) {
    addToCollectionTitle.style.color = isLightTheme ? "#059669" : "#10b981";
  }

  if (delete_collection_btn) {
    delete_collection_btn.style.color = isLightTheme ? "#ef4444" : "#f87171";
  }

  if (create_collection_btn) {
    create_collection_btn.style.backgroundColor = isLightTheme ? "#059669" : "#10b981";
    create_collection_btn.style.color = isLightTheme ? "#ffffff" : "#ffffff";
  }

  if (collection_name) {
    collection_name.style.backgroundColor = isLightTheme ? "#f8fafc" : "#1e293b";
    collection_name.style.color = isLightTheme ? "#0f172a" : "#ffffff";
    collection_name.style.borderColor = isLightTheme ? "#94a3b8" : "#10b981";
  }

  if (allCollectionsNames) {
    allCollectionsNames.style.color = isLightTheme ? "#0f172a" : "#e2e8f0";
  }
};

applyCollectionMenuTheme();

if (scroll_to_reviews_btn && review_container) {
  scroll_to_reviews_btn.addEventListener("click", () => {
    review_container.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (add_to_collection_btn) {
  add_to_collection_btn.addEventListener("click", async () => {
    if (!addToCollectionMenu) return;

    applyCollectionMenuTheme();

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
}

if (delete_collection_btn && addToCollectionMenu) {
  delete_collection_btn.addEventListener("click", () => {
    addToCollectionMenu.style.display = "none";
    addToCollectionMenu.style.animation = "";
    if (modal_backdrop) {
      modal_backdrop.style.display = "none";
    }
    if (collection_filed) {
      collection_filed.style.display = "none";
    }
  });
}

if (create_collection_btn && collection_filed) {
  create_collection_btn.addEventListener("click", () => {
    collection_filed.style.display = "flex";
    collection_filed.style.animation = "showInput 100ms linear forwards";
  });
}

if (add_collection_btn && collection_name) {
  add_collection_btn.addEventListener("click", async () => {
    const user = await fetch("http://localhost:3000/game-info/userid");
    const userId = await user.json();

    const pathParts = window.location.pathname.split("/");
    const gameId = pathParts[pathParts.length - 1];

    const url = `https://api.rawg.io/api/games/${gameId}?key=30778c23f4f34908a65b042d94443ba7`;
    const response = await fetch(url);
    const currentGame = await response.json();

    fetch("http://localhost:3000/game-info/addToCollection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId.userId,
        newCollection: {
          collectionName: collection_name.value,
          allGames: [
            {
              gameId: gameId,
              gameName: currentGame.name,
              gameImge: currentGame.background_image,
            },
          ],
        },
      }),
    });

    collection_name.value = "";
    collection_filed.style.display = "none";

    if (addToCollectionMenu) {
      addToCollectionMenu.style.display = "none";
      addToCollectionMenu.style.animation = "";
    }
    if (modal_backdrop) {
      modal_backdrop.style.display = "none";
    }

    showNotification("Collectie aangemaakt en spel toegevoegd!");
  });
}

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
