import { body as bodyValidator, validationResult } from "express-validator";
import {
  createAuthenticatedHandler,
  AuthenticatedApiRequest,
} from "../../lib/handler/authenticatedHandler";
import { BaseApiResponse } from "../../lib/handler/baseHandler";
import { SerializedUser } from "../../lib/model/user.model";
import { formatErrors } from "../../util/api";

export type ApiPutMeRequestBody = {
  shortname: string;
  preferredName: string;
};

export type ApiMeResponse = {
  user: SerializedUser;
};

export default createAuthenticatedHandler<undefined, ApiMeResponse>(false)
  .use(
    bodyValidator("shortname").isString().notEmpty(),
    bodyValidator("preferredName").isString().notEmpty(),
  )
  .post(
    async (
      req: AuthenticatedApiRequest & { body: ApiPutMeRequestBody },
      res: BaseApiResponse<ApiMeResponse>,
    ) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(formatErrors(...errors.array()));
      }

      const { db, user, body } = req;

      const { shortname, preferredName } = body;

      if (user.shortname && user.shortname !== shortname) {
        return res.status(400).json(
          formatErrors({
            msg: "Cannot update shortname of user",
            param: "shortname",
            value: shortname,
          }),
        );
      }

      /** @todo: validate shortname for correct characters */

      await user.update(db, { shortname, preferredName });

      res.status(200).json({ user: user.serialize() });
    },
  );
