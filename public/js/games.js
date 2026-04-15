const btn_filter_container = document.querySelector("#btn_filter_container");
const filter_container = document.querySelector("#filter_container");

btn_filter_container.addEventListener("click", () => {
  if (filter_container.classList.contains("opacity-100")) {
    filter_container.classList.remove(
      "opacity-100",
      "scale-100",
      "translate-y-0",
    );
    filter_container.classList.add("opacity-0", "scale-95", "-translate-y-2");
    setTimeout(() => {
      filter_container.style.display = "none";
      filter_container.classList.add("hidden");
    }, 300);
  } else {
    // filter_container.classList.remove("hidden");
    filter_container.style.display = "flex";
    filter_container.classList.remove(
      "opacity-0",
      "scale-95",
      "-translate-y-2",
    );
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
