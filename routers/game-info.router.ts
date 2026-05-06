import { Router } from "express";
import { Game, Users } from "../types";
import { addReview, getAllUsers, addToCollection } from "../database";
import { ObjectId } from "mongodb";
import strict from "node:assert/strict";

export function gameInfo() {
  const router: Router = Router();

  router.get("/userid", async (req, res) => {
    if (req.session.user?._id === undefined) return;

    res.type("application/json");
    res.json({ userId: req.session.user?._id.toString() });
  });

  router.get("/:id", async (req, res) => {
    const theme = req.query.theme === "light";
    const themaName = theme ? "light" : "dark";
    const id: string = req.params.id;
    const url: string = `https://api.rawg.io/api/games/${id}?key=30778c23f4f34908a65b042d94443ba7`;

    const response = await fetch(url);
    const game: Game = await response.json();
    const allUsers: Users[] = await getAllUsers();
    let reviewCount = 0;

    for (let user of allUsers) {
      for (let userrv of user.reviews) {
        if (userrv.gameId === req.params.id) {
          reviewCount += 1;
        }
      }
    }

    /*
    const res1 = await fetch(
      "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCLA2ozIXRi4bj1JChJ9V-uVMCRa6g6Llc",
      {
        method: "POST",
        body: JSON.stringify({
          q: game.description_raw,
          target: "nl",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res1.json();
    game.description_raw = data.data.translations[0].translatedText;*/

    res.render("game-info", {
      themaName: themaName,
      title: game.name,
      game: game,
      allUsers,
      gameId: req.params.id,
      reviewCount,
    });
  });

  router.post("/addToCollection", async (req, res) => {
    const { userId, newCollection } = req.body;
    await addToCollection(userId, newCollection);

    res.send("collection added successfully");
  });

  router.post("/:id", async (req, res) => {
    const reviewtxt: string = req.body.reviewtxt;
    const reviewrating: string = req.body.reviewrating;

    if (req.session.user?._id === undefined) return;
    await addReview(
      reviewtxt,
      parseInt(reviewrating),
      req.params.id,
      req.session.user?._id.toString(),
    );

    res.redirect(`/game-info/${req.params.id}`);
  });

  return router;
}
