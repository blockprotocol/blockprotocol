import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";

import { TABS } from "../../components/pages/user/tabs";
import {
  UserPageComponent,
  UserPageProps,
} from "../../components/pages/user/user-page-component";
import { SerializedUser } from "../../context/user-context";
import { excludeHiddenBlocks } from "../../lib/excluded-blocks";
import { getAllBlocksByUser, getStaticUser } from "../../lib/hub-data";

type UserPageQueryParams = {
  "profile-tabs": string[];
  shortname: string;
};

const findTab = (rawProfileTabs: string[] | string | undefined) => {
  const activeTabSlug = rawProfileTabs?.[0] ?? "";
  return TABS.find((tab) => tab.slug === activeTabSlug);
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  Omit<UserPageProps, "activeTab">,
  UserPageQueryParams
> = async ({ params }) => {
  const shortname = params?.shortname;
  if (typeof shortname !== "string" || !shortname.startsWith("@")) {
    return { notFound: true };
  }

  const matchingTab = findTab(params?.["profile-tabs"]);
  if (!matchingTab) {
    return { notFound: true };
  }

  const cleanShortname = shortname.replace(/^@/, "");
  const staticUser = getStaticUser({ shortname: cleanShortname });

  if (!staticUser) {
    return { notFound: true, revalidate: 60 };
  }

  const blocks = excludeHiddenBlocks(
    await getAllBlocksByUser({ shortname: cleanShortname }),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const user: SerializedUser = {
    id: staticUser.shortname,
    isSignedUp: true,
    shortname: staticUser.shortname,
    preferredName: staticUser.preferredName,
    userAvatarUrl: staticUser.userAvatarUrl ?? null,
  };

  return {
    props: {
      blocks,
      user,
    },
    revalidate: 60,
  };
};

const UserPage: NextPage<UserPageProps> = ({ user, blocks }) => {
  const router = useRouter();

  const matchingTab = findTab(router.query["profile-tabs"]);

  if (!matchingTab) {
    return <NextError statusCode={404} />;
  }

  return (
    <UserPageComponent
      user={user}
      blocks={blocks}
      activeTab={matchingTab.value}
    />
  );
};

export default UserPage;
