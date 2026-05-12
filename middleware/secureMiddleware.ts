import { NextFunction, Request, Response } from "express";
import { getRecentUserInfo } from "../database";
import { Users } from "../types";

export async function secureMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user?._id) {
    return res.redirect("/login");
  }

  const currentUserInfo = await getRecentUserInfo(String(req.session.user._id));

  if (!currentUserInfo) {
    return req.session.destroy(() => res.redirect("/login"));
  }

  req.session.user = currentUserInfo;
  res.locals.user = currentUserInfo;
  console.log(req.session.user);
  next();
}