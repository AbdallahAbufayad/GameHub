import { Router } from "express";
import {
  getGames,
  increaseCounter,
  decreaseCounter,
  getRecentGameswithPageSize,
  counter,
  getRecentGames,
} from "../database";
import { Users, GamesApi, Results, Game } from "../types";
import { getPaginationButtonState, sortByOwnedCount, takeTopResults } from "../methods";

export function home() {
  const router: Router = Router();
  let previousBtnDisableValue = "";

  router.get("/", async (req, res) => {
    const gamesOfApi: GamesApi = await getGames();
    const orderedGameswithPageSize: GamesApi =
      await getRecentGameswithPageSize();
    const recentGames: GamesApi = await getRecentGames();

    const themaName: string = res.locals.themaName;
    const previousBtn = req.query.previous_btn;
    const nextBtn = req.query.next_btn;

    if (previousBtn === "clicked") {
      decreaseCounter();
    } else if (nextBtn === "clicked") {
      increaseCounter();
    }

    const populareGames: Results[] = sortByOwnedCount(gamesOfApi.results);
    const pupulareGamesMostgames: Results[] = takeTopResults(populareGames, 5);
    const allrecentGames: Results[] = takeTopResults(recentGames.results, 5);

    let showAllGames: Results[] = orderedGameswithPageSize.results;
    previousBtnDisableValue = getPaginationButtonState(counter);

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

  return router;
}
