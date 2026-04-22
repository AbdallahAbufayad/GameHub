import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { GamesApi, Results, Users, Game } from "./types";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { compareRouter } from "./routers/compare.router";
import { guessRouter } from "./routers/guess.router";
import { profileRoute, PublicProfileRoute } from "./routers/profile-router";
import { ThemeMiddleware } from "./middleware/theme-middleware";
import { registerRoute } from "./routers/register-router";
import { loginRoute } from "./routers/login-router";
import { connect } from "./database";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);


const url: string = `https://api.rawg.io/api/games?key=30778c23f4f34908a65b042d94443ba7&dates=1969-01-01,2026-04-11`;

let gamesOfApi: GamesApi;
let recentGames: GamesApi;
let counter = 1;
let previousBtnDisableValue = "";

let notification: string = "";
let loggedIn = false;
let counterShowFilters = 1;

app.use(ThemeMiddleware.apply);

app.get("/", (req, res) => {
  const themaName: string = res.locals.themaName;

  res.render("index", {
    title: "Onze games",
    themaName: themaName,
    currentPage: "home",
  });
});

app.get("/home", async (req, res) => {
  const themaName: string = res.locals.themaName;
  const previousBtn = req.query.previous_btn;
  const nextBtn = req.query.next_btn;

  if (previousBtn === "clicked") {
    counter -= 1;
    changeDisableValue();
  } else if (nextBtn === "clicked") {
    counter += 1;
    changeDisableValue();
  }

  let populareGames: Results[] = gamesOfApi.results.sort(
    (a, b) => b.added_by_status["owned"] - a.added_by_status["owned"],
  );
  let pupulareGamesMostgames: Results[] = [];
  let allrecentGames: Results[] = [];

  let response0 = await fetch(
    `${url}&ordering=-released&page=${counter}&page_size=20`,
  );

  let allGames: GamesApi = await response0.json();
  let showAllGames: Results[] = allGames.results;

  for (let i = 0; i < 5; i++) {
    pupulareGamesMostgames.push(populareGames[i]);
  }

  for (let i = 0; i < 5; i++) {
    allrecentGames.push(recentGames.results[i]);
  }

  function changeDisableValue() {
    if (counter <= 1) previousBtnDisableValue = "disabled";
    else previousBtnDisableValue = "enabled";
  }

  changeDisableValue();

  res.render("home", {
    title: "GameHub",
    themaName: themaName,
    currentPage: "home",
    pupulareGamesMostgames: pupulareGamesMostgames,
    allrecentGames: allrecentGames,
    showAllGames: showAllGames,
    previousBtnDisableValue: previousBtnDisableValue,
  });
});

app.get("/games", async (req, res) => {
  const themaName: string = res.locals.themaName;
  const previousBtn: string =
    typeof req.query.previous_btn === "string" ? req.query.previous_btn : "";
  const nextBtn: string =
    typeof req.query.next_btn === "string" ? req.query.next_btn : "";
  const search: string =
    typeof req.query.search === "string" ? req.query.search : "";

  let searchGame: string =
    typeof req.query.searchGame === "string" ? req.query.searchGame : "";

  const sortfield: string =
    typeof req.query.sortfield === "string" ? req.query.sortfield : "name";

  let filterClassName = "";
  const clearField: string =
    typeof req.query.clearField === "string" ? req.query.clearField : "";

  if (previousBtn === "clicked") {
    counter -= 1;
    changeDisableValue();
  } else if (nextBtn === "clicked") {
    counter += 1;
    changeDisableValue();
  }

  if (clearField === "clicked") searchGame = "";

  let allGames: GamesApi;
  let showAllGames: Results[];

  if (sortfield === "reviewCount" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=-released&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results.sort(
      (a, b) => b.ratings_count - a.ratings_count,
    );
  } else if (sortfield === "TotalPersons" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=-released&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results.sort(
      (a, b) => b.added_by_status["owned"] - a.added_by_status["owned"],
    );
  } else if (sortfield === "Name_alphabetically_A_Z" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=name&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else if (sortfield === "Name_alphabetically_Z_A" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=-name&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else if (sortfield === "ratingAsc" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=rating&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else if (sortfield === "ratingDesc" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=-rating&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else if (sortfield === "releaseYearAsc" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=released&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else if (sortfield === "releaseYearDesc" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&ordering=-released&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else if (sortfield === "singlePlayer" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&tags=singleplayer&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else if (sortfield === "multiplayer" && search === "clicked") {
    searchGame = "";
    let response = await fetch(
      `${url}&tags=multiplayer&page=${counter}&page_size=50`,
    );
    allGames = await response.json();
    showAllGames = allGames.results;
  } else {
    if (searchGame !== "") {
      let response = await fetch(`${url}&search=${searchGame}`);
      allGames = await response.json();

      showAllGames = allGames.results;
    } else {
      let response = await fetch(
        `${url}&ordering=-released&page=${counter}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    }
  }

  function changeDisableValue() {
    if (counter <= 1) previousBtnDisableValue = "disabled";
    else previousBtnDisableValue = "enabled";
  }

  changeDisableValue();

  res.render("games", {
    title: "Games",
    themaName: themaName,
    currentPage: "games",
    filterClassName: filterClassName,
    showAllGames: showAllGames,
    previousBtnDisableValue: previousBtnDisableValue,
    sortfield: sortfield,
    searchGame: searchGame,
  });
});

app.get("/game-info/:id", async (req, res) => {
  const themaName: string = res.locals.themaName;
  const id: string = req.params.id;
  const url: string = `https://api.rawg.io/api/games/${id}?key=30778c23f4f34908a65b042d94443ba7`;

  const response = await fetch(url);
  const game: Game = await response.json();
  res.render("game-info", {
    themaName: themaName,
    title: game.name,
    currentPage: "games",
    game: game,
  });
});



app.use("/login", loginRoute())
app.use("/register", registerRoute());
app.use("/profile", profileRoute());
app.use("/public-profile", PublicProfileRoute());

app.get("/info", (req, res) => {
  const themaName: string = res.locals.themaName;

  res.render("info", {
    title: "Info",
    themaName: themaName,
    currentPage: "info",
  });
});

app.listen(app.get("port"), async () => {
  connect();

  const response = await fetch(`${url}`);

  const response1 = await fetch(`${url}&ordering=-released`);
  gamesOfApi = await response.json();
  recentGames = await response1.json();
  console.log("Server started on http://localhost:" + app.get("port"));
});
