import { Router } from "express";
import { GamesApi, Results } from "../types";

type GamesRouterDependencies = {
  gamesApiUrl: string;
  getCounter: () => number;
  setCounter: (value: number) => void;
  getPreviousBtnDisableValue: () => string;
  setPreviousBtnDisableValue: (value: string) => void;
};

export function createGamesRouter(deps: GamesRouterDependencies): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const theme: boolean = req.query.themeGames === "light";
    const themaName: string = theme ? "light" : "dark";
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

    const filterClassName = "";
    const clearField: string =
      typeof req.query.clearField === "string" ? req.query.clearField : "";

    if (previousBtn === "clicked") {
      deps.setCounter(deps.getCounter() - 1);
      changeDisableValue();
    } else if (nextBtn === "clicked") {
      deps.setCounter(deps.getCounter() + 1);
      changeDisableValue();
    }

    if (clearField === "clicked") searchGame = "";

    let allGames: GamesApi;
    let showAllGames: Results[];

    if (sortfield === "reviewCount" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=-released&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results.sort(
        (a, b) => b.ratings_count - a.ratings_count,
      );
    } else if (sortfield === "TotalPersons" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=-released&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results.sort(
        (a, b) => b.added_by_status["owned"] - a.added_by_status["owned"],
      );
    } else if (sortfield === "Name_alphabetically_A_Z" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=name&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else if (sortfield === "Name_alphabetically_Z_A" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=-name&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else if (sortfield === "ratingAsc" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=rating&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else if (sortfield === "ratingDesc" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=-rating&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else if (sortfield === "releaseYearAsc" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=released&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else if (sortfield === "releaseYearDesc" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&ordering=-released&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else if (sortfield === "singlePlayer" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&tags=singleplayer&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else if (sortfield === "multiplayer" && search === "clicked") {
      searchGame = "";
      const response = await fetch(
        `${deps.gamesApiUrl}&tags=multiplayer&page=${deps.getCounter()}&page_size=50`,
      );
      allGames = await response.json();
      showAllGames = allGames.results;
    } else {
      if (searchGame !== "") {
        const response = await fetch(`${deps.gamesApiUrl}&search=${searchGame}`);
        allGames = await response.json();

        showAllGames = allGames.results;
      } else {
        const response = await fetch(
          `${deps.gamesApiUrl}&ordering=-released&page=${deps.getCounter()}&page_size=50`,
        );
        allGames = await response.json();
        showAllGames = allGames.results;
      }
    }

    function changeDisableValue() {
      if (deps.getCounter() <= 1) deps.setPreviousBtnDisableValue("disabled");
      else deps.setPreviousBtnDisableValue("enabled");
    }

    changeDisableValue();

    res.render("games", {
      title: "Games",
      themaName: themaName,
      filterClassName: filterClassName,
      showAllGames: showAllGames,
      previousBtnDisableValue: deps.getPreviousBtnDisableValue(),
      sortfield: sortfield,
      searchGame: searchGame,
    });
  });

  return router;
}
