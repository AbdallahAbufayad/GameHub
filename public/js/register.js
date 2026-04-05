const passwordCheckbox = document.querySelector("#show_password").addEventListener("change", (e) => showPassword(e));

function showPassword(e) {
  let password =
    document.querySelector("input[type='password']") ||
    document.querySelectorAll("input[type='text']")[1];

  if (e.srcElement.checked) {
    password.type = "text";
  } else {
    password.type = "password";
  }
}