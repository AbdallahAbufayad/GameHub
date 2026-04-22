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

      changeDisableValue();
    } else if (nextBtn === "clicked") {
      increaseCounter();
      changeDisableValue();
    }

    let populareGames: Results[] = gamesOfApi.results.sort(
      (a, b) => b.added_by_status["owned"] - a.added_by_status["owned"],
    );
    let pupulareGamesMostgames: Results[] = [];
    let allrecentGames: Results[] = [];

    let showAllGames: Results[] = orderedGameswithPageSize.results;

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

  return router;
}
