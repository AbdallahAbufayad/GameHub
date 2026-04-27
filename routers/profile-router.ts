import { Router } from "express";
import { Users } from "../types";
import { getDefaultUser } from "../methods";

export function profileRoute() {
  const profileRouter = Router();

  profileRouter.get("/", (req, res) => {
    const themaName: string = res.locals.themaName;

    //const user = await getUser();

    const user: Users = getDefaultUser();

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

  return profileRouter;
}

export function PublicProfileRoute() {
  const profileRouter = Router();

  profileRouter.get("/", (req, res) => {
    const themaName: string = res.locals.themaName;

    //const user = await getUser();

    const user: Users = getDefaultUser();

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

  return profileRouter;
}
