import { Router } from "express";

export function resetPasswordRoute(): Router {
  const resetRouter = Router();

  resetRouter.get("/", (req, res) => {
    const themaName: string = res.locals.themaName;


    // TODO BY KHALED

    res.render("reset-password", {
      title: "Wachtwoord reset",
      themaName: themaName,
    });
  });

  return resetRouter;
}
