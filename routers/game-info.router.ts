import { Router } from "express";
import { Game } from "../types";
import { error } from "node:console";

export function gameInfo() {
  const router: Router = Router();

  router.get("/:id", async (req, res) => {
    const theme = req.query.theme === "light";
    const themaName = theme ? "light" : "dark";
    const id: string = req.params.id;
    const url: string = `https://api.rawg.io/api/games/${id}?key=30778c23f4f34908a65b042d94443ba7`;

    const response = await fetch(url);
    const game: Game = await response.json();
    res.render("game-info", {
      themaName: themaName,
      title: game.name,
      game: game,
    });
  });

  return router;
}
