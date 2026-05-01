const changeProfilePicButton = document.querySelector("#change_pic");
const shareProfile = document.querySelector("#share-profile");
const publicProfileLink = document.querySelector("#public-profile-link").href;

shareProfile.addEventListener("click", (e) => {
  e.preventDefault();
  navigator.clipboard.writeText(publicProfileLink);
  showNotification("Publieke profiel link successvol gekopieerd.");
});

changeProfilePicButton.addEventListener("change", () => {
  const picture = changeProfilePicButton.files[0];
  const maxFileSize = 102000;
  if (!picture) {
    return;
  } else if (!picture.type.startsWith("image/")) {
    showNotification(
      "Geef ons alstublieft een foto bestand: (jpg, png, gif, etc.)",
    );
    return;
  } else if (picture.size > maxFileSize) {
    showNotification(
      "Het bestand is te groot. Alstublieft geef ons een kleiner bestand.",
    );
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("profile_pic").src = reader.result;
    changeProfilePicFetch(reader.result);
  };
  reader.readAsDataURL(picture);
});

async function changeProfilePicFetch(encodedImg) {
  const res = await fetch("/profile/picture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: encodedImg }),
  });
  if (res.ok) {
    window.location.reload();
  }
}
