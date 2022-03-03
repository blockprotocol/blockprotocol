import { NextPage } from "next";
import { useRouter } from "next/router";
import { VoidFunctionComponent } from "react";
import { useUser } from "../../context/UserContext";
import { SerializedUser } from "../../lib/api/model/user.model";

export interface AuthWallPageContentProps {
  user: SerializedUser;
}

export type AuthWallPageContent =
  VoidFunctionComponent<AuthWallPageContentProps>;

const AuthWallWrapper: VoidFunctionComponent<{
  Content: AuthWallPageContent;
}> = ({ Content }) => {
  const router = useRouter();
  const { user } = useUser();

  if (user === "loading" || !process.browser) {
    return null;
  }

  if (!user?.isSignedUp) {
    void router.push(`/login?redirectPath=${router.asPath}`);
    return null;
  }

  return <Content user={user} />;
};

/**
 * We don’t know if a user is logged in during server-side-rendering, but we want
 * some pages to be available behind the auth wall. Once UserContext is populated
 * with the result of /api/me, we want to redirect guest users from to /.
 * use `withAuthWall` to enable this behavior.
 *
 * You can also get user object from Content props and thus avoid extra checks.
 */
export const withAuthWall = (Content: AuthWallPageContent): NextPage => {
  return () => <AuthWallWrapper Content={Content} />;
};
