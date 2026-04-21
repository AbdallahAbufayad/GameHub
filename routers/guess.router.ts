import { Router } from "express";

export const guessRouter = Router();

guessRouter.get("/guess-the-game", (req, res) => {
  const themaName: string = res.locals.themaName;

  res.render("guess-the-game", {
    title: "Raad Het Spel",
    themaName: themaName,
    currentPage: "guess-the-game",
  });
});
