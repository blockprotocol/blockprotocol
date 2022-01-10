import { body as bodyValidator, validationResult } from "express-validator";
import { createBaseHandler } from "../../lib/handler/baseHandler";
import { User } from "../../lib/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiIsShortnameTakenBody = {
  shortname: string;
};

export type ApiIsShortnameTakenResponse = boolean;

export default createBaseHandler<
  ApiIsShortnameTakenBody,
  ApiIsShortnameTakenResponse
>()
  .use(bodyValidator("shortname").notEmpty().isString())
  .get(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, body } = req;
    const { shortname } = body;

    const isShortnameTaken = await User.isShortnameTaken(db, shortname);

    res.status(200).send(isShortnameTaken);
  });
