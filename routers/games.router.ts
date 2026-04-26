import { Router } from "express";
import {
  getGames,
  increaseCounter,
  decreaseCounter,
  getRecentGameswithPageSize,
  counter,
  getOrderdGamesByNameDes,
  getOrderdGamesByNameAsc,
  getOrderdGamesByRatingAsc,
  getOrderdGamesByRatingDes,
  getOrderdGamesByReleaseYearAsc,
  getOrderdGamesBySingleplayer,
  getOrderdGamesByMultiplayer,
  searchGame,
} from "../database";
import { Users, GamesApi, Results, Game } from "../types";

export function games() {
  const router: Router = Router();
  let previousBtnDisableValue = "";
  router.get("/", async (req, res) => {
    const themaName: string = res.locals.themaName;
    const previousBtn: string =
      typeof req.query.previous_btn === "string" ? req.query.previous_btn : "";
    const nextBtn: string =
      typeof req.query.next_btn === "string" ? req.query.next_btn : "";
    const search: string =
      typeof req.query.search === "string" ? req.query.search : "";

    let searchGame1: string =
      typeof req.query.searchGame === "string" ? req.query.searchGame : "";

    const sortfield: string =
      typeof req.query.sortfield === "string" ? req.query.sortfield : "name";

    let filterClassName = "";
    const clearField: string =
      typeof req.query.clearField === "string" ? req.query.clearField : "";

    let orderedGameswithPageSize: GamesApi = await getRecentGameswithPageSize();
    let orderdGamesByNameDes: GamesApi = await getOrderdGamesByNameDes();

    let orderdGamesByNameAsc: GamesApi = await getOrderdGamesByNameAsc();

    let orderdGamesByRatingDes: GamesApi = await getOrderdGamesByRatingDes();

    let orderdGamesByRatingAsc: GamesApi = await getOrderdGamesByRatingAsc();

    let orderdGamesByReleaseYearAsc: GamesApi =
      await getOrderdGamesByReleaseYearAsc();

    let orderdGamesBySingleplayer: GamesApi =
      await getOrderdGamesBySingleplayer();

    let orderdGamesByMultiplayer: GamesApi =
      await getOrderdGamesByMultiplayer();

    if (previousBtn === "clicked") {
      decreaseCounter();

      changeDisableValue();
    } else if (nextBtn === "clicked") {
      increaseCounter();

      changeDisableValue();
    }

    if (clearField === "clicked") searchGame1 = "";

    let allGames: GamesApi;
    let showAllGames: Results[];

    if (sortfield === "reviewCount" && search === "clicked") {
      searchGame1 = "";
      showAllGames = orderedGameswithPageSize.results.sort(
        (a, b) => b.ratings_count - a.ratings_count,
      );
    } else if (
      sortfield === "Name_alphabetically_A_Z" &&
      search === "clicked"
    ) {
      searchGame1 = "";
      showAllGames = orderdGamesByNameAsc.results;
    } else if (
      sortfield === "Name_alphabetically_Z_A" &&
      search === "clicked"
    ) {
      searchGame1 = "";
      showAllGames = orderdGamesByNameDes.results;
    } else if (sortfield === "ratingAsc" && search === "clicked") {
      searchGame1 = "";
      showAllGames = orderdGamesByRatingAsc.results;
    } else if (sortfield === "ratingDesc" && search === "clicked") {
      searchGame1 = "";
      showAllGames = orderdGamesByRatingDes.results;
    } else if (sortfield === "releaseYearAsc" && search === "clicked") {
      searchGame1 = "";
      showAllGames = orderdGamesByReleaseYearAsc.results;
    } else if (sortfield === "releaseYearDesc" && search === "clicked") {
      searchGame1 = "";
      showAllGames = orderedGameswithPageSize.results;
    } else if (sortfield === "singlePlayer" && search === "clicked") {
      searchGame1 = "";
      showAllGames = orderdGamesBySingleplayer.results;
    } else if (sortfield === "multiplayer" && search === "clicked") {
      searchGame1 = "";
      showAllGames = orderdGamesByMultiplayer.results;
    } else {
      if (searchGame1 !== "") {
        allGames = await searchGame(searchGame1);

        showAllGames = allGames.results;
      } else {
        showAllGames = orderedGameswithPageSize.results;
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
      filterClassName: filterClassName,
      showAllGames: showAllGames,
      previousBtnDisableValue: previousBtnDisableValue,
      sortfield: sortfield,
      searchGame: searchGame1,
    });
  });

  return router;
}
