import { query as queryValidator, validationResult } from "express-validator";

import {
  baseHandlerOptions,
  createBaseHandler,
} from "../../lib/api/handler/base-handler";
import { User } from "../../lib/api/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiIsShortnameTakenQueryParams = {
  shortname: string;
};

export type ApiIsShortnameTakenResponse = boolean;

export default createBaseHandler<null, ApiIsShortnameTakenResponse>()
  .use(queryValidator("shortname").notEmpty().isString())
  .get(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatErrors(...errors.array()));
    }

    const { db, query } = req;
    const { shortname } = query as ApiIsShortnameTakenQueryParams;

    const isShortnameTaken = await User.isShortnameTaken(db, shortname);

    res.status(200).send(isShortnameTaken);
  })
  .handler(baseHandlerOptions);
