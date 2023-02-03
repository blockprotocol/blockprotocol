import { NextPage } from "next";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

import { useUser } from "../../context/user-context";
import { SerializedUser } from "../../lib/api/model/user.model";

export interface AuthWallPageContentProps {
  user: SerializedUser;
}

export type AuthWallPageContent<P = {}> = FunctionComponent<
  AuthWallPageContentProps & P
>;

const AuthWallWrapper = <P,>({
  Content,
  nextPageProps,
}: {
  Content: AuthWallPageContent<P>;
  nextPageProps: P;
}) => {
  const router = useRouter();
  const { user } = useUser();

  if (user === "loading" || !process.browser) {
    return null;
  }

  if (!user?.isSignedUp) {
    void router.push(`/login?redirectPath=${router.asPath}`);
    return null;
  }

  return <Content user={user} {...nextPageProps} />;
};

/**
 * We don’t know if a user is logged in during server-side-rendering, but we want
 * some pages to be available behind the auth wall. Once UserContext is populated
 * with the result of /api/me, we want to redirect guest users from to /.
 * use `withAuthWall` to enable this behavior.
 *
 * You can also get user object from Content props and thus avoid extra checks.
 */
export function withAuthWall<P = {}>(
  Content: AuthWallPageContent<P>,
): NextPage<P> {
  return (nextPageProps) => (
    <AuthWallWrapper<P> Content={Content} nextPageProps={nextPageProps} />
  );
}
