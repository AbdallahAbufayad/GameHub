import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { GamesApi, Results, Users, Game } from "./types";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { profileRouter } from "./routes/profile.router";
import { index } from "./routes/index.router";
import { home } from "./routes/home.router";
import { games } from "./routes/games.router";
import { gameInfo } from "./routes/game-info.router";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

//Mongo client
let client: MongoClient;
let userCollection: Collection<Users>;

const url: string = `https://api.rawg.io/api/games?key=30778c23f4f34908a65b042d94443ba7&dates=1969-01-01,2026-04-11`;

let gamesOfApi: GamesApi;
let recentGames: GamesApi;
let counter = 1;
let previousBtnDisableValue = "";

let notification: string = "";
let loggedIn = false;
let counterShowFilters = 1;

app.use("/", index());
app.use("/home", home());
app.use("/games", games());
app.use("/game-info", gameInfo());

app.get("/register", (req, res) => {
  const theme: boolean = req.query.theme === "light";
  const themaName: string = theme ? "light" : "dark";

  res.render("register", {
    title: "Registreren",
    themaName: themaName,
    notification: notification,
  });
});
app.get("/login", (req, res) => {
  const theme: boolean = req.query.theme === "light";
  const themaName: string = theme ? "light" : "dark";

  res.render("login", {
    title: "Inloggen",
    themaName: themaName,
    notification: notification,
    loggedIn: loggedIn,
  });
});
app.post("/login", async (req, res) => {
  const theme: boolean = req.query.theme === "light";
  const themaName: string = theme ? "light" : "dark";

  const emailOrUsername: string = req.body.email_username.toLowerCase();
  const password: string = btoa(req.body.password); //will be properly hashed after security class
  const cityName: string = req.body.cityName;
  const countryName: string = req.body.countryName;

  try {
    await client.connect();
    const allUsers: Users[] = await userCollection.find().toArray();

    const currentUser: Users | undefined = allUsers.find(
      (u) =>
        u.username.toLowerCase() === emailOrUsername ||
        u.email.toLowerCase() === emailOrUsername,
    );

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
  } finally {
    await client.close();
  }
});

app.post("/register", async (req, res) => {
  const theme: boolean = req.query.theme === "light";
  const themaName: string = theme ? "light" : "dark";

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
    await client.connect();

    let allUsers: Users[] = await userCollection.find().toArray();
    let userExists: boolean = allUsers.some(
      (u) =>
        u.email.toLowerCase() === email ||
        u.username.toLowerCase() === username,
    );

    if (password.length < 12) {
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

    await userCollection.insertOne(newUser);
    notification = "Gebruiker succesvol geregistreerd! Je kan nu inloggen.";
    res.render("register", {
      title: "Registreren",
      themaName: themaName,
      notification: notification,
    });
    return;
  } catch (e) {
    console.error("Something went wrong with the database.");
  } finally {
    await client.close();
  }
});
app.use(profileRouter);

app.get("/info", (req, res) => {
  const theme: boolean = req.query.themeHome === "light";
  const themaName: string = theme ? "light" : "dark";

  res.render("info", {
    title: "Info",
    themaName: themaName,
    currentPage: "info",
  });
});

app.get("/guess-the-game", (req, res) => {
  const theme: boolean = req.query.themeHome === "light";
  const themaName: string = theme ? "light" : "dark";

  res.render("guess-the-game", {
    title: "Raad Het Spel",
    themaName: themaName,
    currentPage: "guess-the-game",
  });
});

app.get("/compare-games", (req, res) => {
  const theme: boolean = req.query.themeHome === "light";
  const themaName: string = theme ? "light" : "dark";

  res.render("compare-games", {
    title: "Games Vergelijken",
    themaName: themaName,
    currentPage: "compare-games",
  });
});

app.listen(app.get("port"), async () => {
  //mongo client
  const uriMongo = process.env.MONGODB;

  if (!uriMongo) {
    throw new Error("MONGODB string not defined in .env!");
  }
  client = await MongoClient.connect(uriMongo);
  userCollection = client.db("users").collection("userinfo");

  const response = await fetch(`${url}`);

  const response1 = await fetch(`${url}&ordering=-released`);
  gamesOfApi = await response.json();
  recentGames = await response1.json();
  console.log("Server started on http://localhost:" + app.get("port"));
});
