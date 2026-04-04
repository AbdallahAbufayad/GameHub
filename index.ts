import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { GamesApi, Results } from "./types";
import { count } from "console";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

const url: string = `https://api.rawg.io/api/games?key=30778c23f4f34908a65b042d94443ba7&dates=1969-01-01,${new Date().getFullYear()}-0${new Date().getMonth() + 1}-0${new Date().getDate()}`;

let gamesOfApi: GamesApi;
let recentGames: GamesApi;
let counter = 1;
let previousBtnDisableValue = "";
app.get("/", (req, res) => {
  const theme = req.query.theme === "light";
  const themaName = theme ? "light" : "dark";

  res.render("index", {
    title: "Onze games",
    themaName: themaName,
  });
});

app.get("/home", async (req, res) => {
  const theme = req.query.themeHome === "light";
  const themaName = theme ? "light" : "dark";
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
    pupulareGamesMostgames: pupulareGamesMostgames,
    allrecentGames: allrecentGames,
    showAllGames: showAllGames,
    previousBtnDisableValue: previousBtnDisableValue,
  });
});

app.listen(app.get("port"), async () => {
  const response = await fetch(`${url}`);

  const response1 = await fetch(`${url}&ordering=-released`);
  gamesOfApi = await response.json();
  recentGames = await response1.json();
  console.log("Server started on http://localhost:" + app.get("port"));
});
