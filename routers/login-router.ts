import { Router } from "express";
import { Users } from "../types";
import { ObjectId } from "mongodb";
import { getUser } from "../database";

let notification : string = "";
let loggedIn : boolean = false;

export function loginRoute(): Router {
  const loginRouter = Router();

  loginRouter.get("/", (req, res) => {
    const themaName: string = res.locals.themaName;

    res.render("login", {
      title: "Inloggen",
      themaName: themaName,
      notification: notification,
      loggedIn: loggedIn,
    });
  });

  loginRouter.post("/", async (req, res) => {
    const themaName: string = res.locals.themaName;

    const emailOrUsername: string = req.body.email_username.toLowerCase();
    const password: string = btoa(req.body.password); //will be properly hashed after security class
    const cityName: string = req.body.cityName;
    const countryName: string = req.body.countryName;

    try {
      let currentUser: Users | undefined = await getUser(emailOrUsername);

      let userId: ObjectId | undefined = currentUser?._id;

      if (currentUser) {
        if (
          (currentUser.username.toLowerCase() === emailOrUsername ||
            currentUser.email.toLowerCase()) &&
          currentUser.password === password
        ) {
          notification =
            "Je bent succesvol ingelogd! Je wordt direct doorgebracht naar de index pagina.";
          loggedIn = true;
          //localStorage.setItem("loggedIn", "true"); done with cookies
          //localStorage.setItem("userId", userId?); done with cookies later
          res.redirect("/login");
          return;
        } else {
          notification = "Het ingevoerde wachtwoord is verkeerd.";
          res.render("login", {
            title: "Inloggen",
            themaName: themaName,
            notification: notification,
            loggedIn: loggedIn,
          });
          return;
        }
      } else {
        notification = "Gebruiker niet gevonden. Maak eerst een account aan!";
        res.render("login", {
          title: "Inloggen",
          themaName: themaName,
          notification: notification,
          loggedIn: loggedIn,
        });
        return;
      }
    } catch (e) {
      console.error("Something went wrong with the database.");
    }
  });

  return loginRouter;
}
