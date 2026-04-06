const btn_filter_container = document.querySelector("#btn_filter_container");
const filter_container = document.querySelector("#filter_container");

btn_filter_container.addEventListener("click", () => {
  if (filter_container.classList.contains("filter_container_show")) {
    filter_container.classList.remove("filter_container_show");
    filter_container.classList.add("filter_container_hide");
    setTimeout(() => {
      filter_container.style.display = "none";
      filter_container.classList.add("hidden");
    }, 300);
  } else {
    filter_container.classList.remove("hidden");
    filter_container.style.display = "flex";
    filter_container.classList.remove("filter_container_hide");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        filter_container.classList.add("filter_container_show");
      });
    });
  }
});
