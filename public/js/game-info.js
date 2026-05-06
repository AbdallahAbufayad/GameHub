const add_to_collection_btn = document.querySelector("#add_to_collection_btn");
const addToCollectionMenu = document.querySelector("#addToCollectionMenu");
const allCollectionsNames = document.querySelector("#allCollectionsNames");
const modal_backdrop = document.querySelector("#modal_backdrop");
const delete_collection_btn = document.querySelector("#delete_collection_btn");
const create_collection_btn = document.querySelector("#create_collection_btn");
const add_collection_btn = document.querySelector("#add_collection_btn");
const collection_filed = document.querySelector("#collection_filed");
const collection_name = document.querySelector("#collection_name");

if (add_to_collection_btn) {
  add_to_collection_btn.addEventListener("click", async () => {
    if (!addToCollectionMenu) return;

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
