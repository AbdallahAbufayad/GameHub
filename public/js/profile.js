const collectioncontainer = document.querySelector("#collectioncontainer");
const collection_modal_backdrop = document.querySelector(
  "#collection_modal_backdrop",
);
const modal_body = document.querySelector("#modal_body");
const btn_close_modal = document.querySelector("#btn_close_modal");

async function main() {
  const res = await fetch("http://localhost:3000/profile/collection");
  const data = await res.json();
  const user = data.user;

  for (let userinfo of user.collection_more) {
    const collectionContainerOfGames = document.createElement("div");
    const btnCollectionName = document.createElement("button");
    const btnDeleteCollection = document.createElement("button");

    collectionContainerOfGames.classList.add(
      "collection",
      "relative",
      "flex",
      "items-center",
      "justify-between",
      "gap-3",
      "px-4",
      "py-3",
      "border-2",
      "border-emerald-500",
      "bg-zinc-800/90",
      "rounded-xl",
      "shadow-md",
      "hover:shadow-emerald-500/30",
      "hover:scale-[1.02]",
      "transition-all",
      "duration-300",
      "min-w-[220px]",
    );

    btnCollectionName.classList.add(
      "btn_collection",
      "text-emerald-400",
      "font-semibold",
      "tracking-wide",
      "text-sm",
      "uppercase",
      "hover:text-emerald-300",
      "transition-colors",
      "duration-200",
    );

    btnCollectionName.innerHTML = userinfo.collectionName;

    const openCollectionModal = () => {
      collection_modal_backdrop.style.display = "flex";
      modal_body.innerHTML = "";
      for (let game of userinfo.allGames) {
        const gameContainer = document.createElement("div");
        const gameImge = document.createElement("img");
        const btnDelteGame = document.createElement("button");

        gameContainer.classList.add("relative", "group", "m-4");
        gameImge.classList.add(
          "w-24",
          "h-24",
          "object-cover",
          "rounded-2xl",
          "border",
          "border-slate-300",
        );
        gameImge.src = game.gameImge;
        gameImge.alt = game.gameName;

        btnDelteGame.innerHTML = "X";
        btnDelteGame.classList.add(
          "delete-image-btn",
          "absolute",
          "top-3",
          "right-3",
          "flex",
          "items-center",
          "justify-center",
          "w-8",
          "h-8",
          "rounded-full",
          "bg-zinc-900/90",
          "text-red-400",
          "text-xl",
          "font-bold",
          "hover:bg-red-500",
          "hover:text-white",
          "transition-all",
          "duration-200",
          "shadow-md",
        );

        btnDelteGame.addEventListener("click", async (event) => {
          event.stopPropagation();
          const user = await fetch("http://localhost:3000/game-info/userid");
          const userId = await user.json();

          fetch("http://localhost:3000/profile/deletegame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId.userId,
              name: userinfo.collectionName,
              gameId: game.gameId,
            }),
          });

          location.reload();
        });

        gameContainer.appendChild(gameImge);
        gameContainer.appendChild(btnDelteGame);

        modal_body.appendChild(gameContainer);
      }
    };

    collectionContainerOfGames.addEventListener("click", () => {
      openCollectionModal();
    });

    btnCollectionName.addEventListener("click", (event) => {
      event.stopPropagation();
      openCollectionModal();
    });

    btnDeleteCollection.classList.add(
      "btn_delete_collection",
      "flex",
      "items-center",
      "justify-center",
      "w-8",
      "h-8",
      "rounded-full",
      "bg-zinc-700",
      "text-red-400",
      "text-lg",
      "font-bold",
      "hover:bg-red-500",
      "hover:text-white",
      "transition-all",
      "duration-200",
      "shadow-sm",
    );

    btnDeleteCollection.dataset.name = "delbtn";
    btnDeleteCollection.innerHTML = "X";

    btnDeleteCollection.addEventListener("click", async (event) => {
      event.stopPropagation();
      const user = await fetch("http://localhost:3000/game-info/userid");
      const userId = await user.json();

      fetch("http://localhost:3000/profile/deletecollection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.userId,
          name: userinfo.collectionName,
        }),
      });

      location.reload();
    });

    collectionContainerOfGames.appendChild(btnCollectionName);
    collectionContainerOfGames.appendChild(btnDeleteCollection);

    collectioncontainer.appendChild(collectionContainerOfGames);
  }

  btn_close_modal.addEventListener("click", () => {
    collection_modal_backdrop.style.display = "none";
  });
}

main();
