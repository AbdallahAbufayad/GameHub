const btn_filter_container = document.querySelector("#btn_filter_container");
const filter_container = document.querySelector("#filter_container");
const filter_close = document.querySelector("#filter_close");
const body = document.body;

const closeFilter = () => {
  filter_container.classList.remove(
    "opacity-100",
    "scale-100",
    "translate-y-0",
  );
  filter_container.classList.add("opacity-0", "scale-95", "-translate-y-2");
  body.classList.remove("filter-open");
  setTimeout(() => {
    filter_container.style.display = "none";
    filter_container.classList.add("hidden");
  }, 300);
};

btn_filter_container.addEventListener("click", () => {
  if (filter_container.classList.contains("opacity-100")) {
    closeFilter();
  } else {
    filter_container.style.display = "flex";
    filter_container.classList.remove(
      "opacity-0",
      "scale-95",
      "-translate-y-2",
    );
    body.classList.add("filter-open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        filter_container.classList.add(
          "opacity-100",
          "scale-100",
          "translate-y-0",
        );
      });
    });
  }
});

if (filter_close) {
  filter_close.addEventListener("click", () => {
    closeFilter();
  });
}

// === Pagination ===
const btnLeft = document.querySelector("#btn_left");
const btnRight = document.querySelector("#btn_right");
const gamesContainer = document.querySelector("#games_container");


if (btnLeft) btnLeft.disabled = true;
let currentPage = 0;

async function loadGamesPage(direction) {
  if (direction === "prev") currentPage = Math.max(0, currentPage - 1);
  if (direction === "next") currentPage += 1;

  const params = new URLSearchParams();
  params.set("page", currentPage);

  const activeSortfield = document.querySelector("input[name='sortfield']:checked");
  if (activeSortfield) params.set("sortfield", activeSortfield.value);

  const res = await fetch(`/games/games-partial?${params}`);
  const { showAllGames, isFirstPage, isLastPage } = await res.json();

  gamesContainer.innerHTML = showAllGames.map(game => `
    <div class="game-card animate-fade-in relative w-full aspect-square">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover" alt="${game.name}" src="${game.background_image}" loading="lazy" decoding="async">
      </div>
      <a class="absolute inset-0 z-10" href="/game-info/${game.id}" target="_self" aria-label="Ga naar ${game.name}">
        <p class="game-card-title absolute inset-x-0 bottom-0 p-4 text-center text-white font-bold text-base drop-shadow">${game.name}</p>
      </a>
    </div>
  `).join("");

  btnLeft.disabled = isFirstPage;
  btnRight.disabled = isLastPage;
}

btnLeft?.addEventListener("click", () => loadGamesPage("prev"));
btnRight?.addEventListener("click", () => loadGamesPage("next"));