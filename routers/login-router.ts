import { Router } from "express";
import { Users } from "../types";
import { ObjectId } from "mongodb";
import { getUser } from "../database";
import bcrypt from "bcrypt";

let notification: string = "";
let loggedIn: boolean = false;

export function loginRoute(): Router {
  const loginRouter = Router();

  loginRouter.get("/", (req, res) => {
    const themaName: string = res.locals.themaName;

    if(res.locals.user){
      res.redirect("/profile");
    }

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
    const password: string = req.body.password;

    try {
      let currentUser: Users | undefined = await getUser(emailOrUsername);

      let userId: ObjectId | undefined = currentUser?._id;

      if (currentUser && currentUser.password) {
        if (
          (currentUser.username.toLowerCase() === emailOrUsername ||
            currentUser.email.toLowerCase()) &&
          (await bcrypt.compare(password, currentUser.password))
        ) {
          notification =
            "Je bent succesvol ingelogd! Je wordt direct doorgebracht naar de index pagina.";
          loggedIn = true;
          delete currentUser.password;
          req.session.user = currentUser;
          res.redirect("/profile");
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
