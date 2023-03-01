import passport from "passport";

import { User as UserModel } from "../model/user.model";
import { connectToDatabase } from "../mongodb";

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}

type SerializedPassportUser = {
  userId: string;
};

export type PassportRequestExtensions = {
  user?: UserModel;
  login(user: UserModel, done: (err: any) => void): void;
  login(user: UserModel, options: any, done: (err: any) => void): void;
  logout(done: (err: any) => void): void;
};

passport.serializeUser<SerializedPassportUser>((user, done) =>
  done(null, { userId: user.id }),
);

passport.deserializeUser<SerializedPassportUser>(
  async (serializedUser, done) => {
    const { db } = await connectToDatabase();

    const user = await UserModel.getById(db, serializedUser);

    // sets the 'user' field on the Express request object
    /** @todo: pass error instead of null when user isn't found */
    done(null, user);
  },
);

export const passportMiddleware = [passport.initialize(), passport.session()];
