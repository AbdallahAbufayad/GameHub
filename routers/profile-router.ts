import { Router } from "express";
import { getUser } from "../database";

export const profileRouter = Router();

profileRouter.get("/public-profile", (req, res) => {
  const themaName: string = res.locals.themaName;

  const user = getUser();

  res.render("public-profile", {
    title: "Publiek profiel",
    themaName: themaName,
    username: user.username,
    aboutMe: user.about_me,
    email: user.email,
    lvl: user.level,
    imageSrc: user.profile_picture,
    collections: user.collection_more,
    publicProfile: user.public_profile,
    currentPage: "profile",
  });
});

profileRouter.get("/profile", (req, res) => {
  const themaName: string = res.locals.themaName;

  const user = getUser();

  res.render("profile", {
    title: "Profiel",
    themaName: themaName,
    username: user.username,
    aboutMe: user.about_me,
    email: user.email,
    lvl: user.level,
    imageSrc: user.profile_picture,
    collections: user.collection_more,
    publicProfile: user.public_profile,
    currentPage: "profile",
  });
});
