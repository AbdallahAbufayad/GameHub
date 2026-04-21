import { Router } from "express";

export const compareRouter = Router();

compareRouter.get("/compare-games", (req, res) => {
  const themaName: string = res.locals.themaName;

  res.render("compare-games", {
    title: "Games Vergelijken",
    themaName: themaName,
    currentPage: "compare-games",
  });
});
