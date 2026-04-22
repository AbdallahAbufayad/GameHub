import { Router } from "express";
import { Users } from "../types";
import { checkIfUserExists, registerUser } from "../database";

let notification: string = "";
let loggedIn: boolean = false;

export function registerRoute(): Router {
  const registerRouter = Router();

  registerRouter.get("/", (req, res) => {
    const themaName: string = res.locals.themaName;

    res.render("register", {
      title: "Registreren",
      themaName: themaName,
      notification: notification,
    });
  });

  registerRouter.post("/", async (req, res) => {
    const themaName: string = res.locals.themaName;

    registerUser;

    const email: string = req.body.email.toLowerCase();
    const username: string = req.body.username.toLowerCase();
    const password: string = btoa(req.body.password); //will be properly hashed after security class

    if (email === null || username === null || password === null) {
      notification = "Je moet alle velden invullen.";
      res.render("register", {
        title: "Registreren",
        themaName: themaName,
        notification: notification,
      });
      return;
    }

    const newUser: Users = {
      email: email,
      username: username,
      password: password,
      level: 0,
      about_me: "",
      profile_picture: "",
      public_profile: false,
      collection_more: [
        {
          collectionName: "Wenslijst",
          allGames: [],
        },
        {
          collectionName: "Favorieten",
          allGames: [],
        },
        {
          collectionName: "Te spelen",
          allGames: [],
        },
        {
          collectionName: "Momenteel aan het spelen",
          allGames: [],
        },
        {
          collectionName: "Afgespeeld",
          allGames: [],
        },
      ],
    };

    try {
      let userExists: boolean = await checkIfUserExists(email, username);

      if (req.body.password.length < 12) {
        notification = "Uw wachtwoord moet minstens 12 karakters bevatten.";
        res.render("register", {
          title: "Registreren",
          themaName: themaName,
          notification: notification,
        });
        return;
      }

      if (userExists) {
        notification = "Deze gebruikersnaam of e-mail bestaat al.";
        res.render("register", {
          title: "Registreren",
          themaName: themaName,
          notification: notification,
        });
        return;
      }

      registerUser(newUser);
      notification = "Gebruiker succesvol geregistreerd! Je kan nu inloggen.";
      res.render("register", {
        title: "Registreren",
        themaName: themaName,
        notification: notification,
      });
      return;
    } catch (e) {
      console.error("Er ging iets mis.");
    }
  });

  return registerRouter;
}
