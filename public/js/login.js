const loggedInRedirect = document.querySelector("#logged-in-redirect");

if(loggedInRedirect != null){
    setTimeout(() => {
        window.location.href = "./home"
    }, 1000);
}