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
