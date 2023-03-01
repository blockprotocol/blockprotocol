import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { TABS } from "../../components/pages/user/tabs";
import {
  UserPageComponent,
  UserPageProps,
} from "../../components/pages/user/user-page-component";
import { apiClient } from "../../lib/api-client";
import { excludeHiddenBlocks } from "../../lib/excluded-blocks";

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

const fetchUserProfileData = async (shortname: string) => {
  const [userResponse, blocksResponse, entityTypesResponse] = await Promise.all(
    [
      apiClient.getUser({
        shortname: shortname.replace("@", ""),
      }),
      apiClient.getUserBlocks({
        shortname: shortname.replace("@", ""),
      }),
      apiClient.getUserEntityTypes({
        shortname: shortname.replace("@", ""),
      }),
    ],
  );

  if (!userResponse.data?.user) {
    throw new Error("No user found");
  }

  return {
    blocks: excludeHiddenBlocks(blocksResponse.data?.blocks || []),
    entityTypes: entityTypesResponse.data?.entityTypes || [],
    user: userResponse.data.user,
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
    return {
      notFound: true,
    };
  }

  try {
    const { blocks, entityTypes, user } = await fetchUserProfileData(shortname);
    return {
      props: {
        blocks,
        entityTypes,
        user,
      },
      revalidate: 60,
    };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
};

const UserPage: NextPage<UserPageProps> = ({
  user: prerenderedUser,
  blocks: prerenderedBlocks,
  entityTypes: prerenderedEntityTypes,
}) => {
  const router = useRouter();

  const matchingTab = findTab(router.query["profile-tabs"]);

  const [{ user, blocks, entityTypes }, updateUserProfileData] = useState({
    user: prerenderedUser,
    blocks: prerenderedBlocks,
    entityTypes: prerenderedEntityTypes,
  });

  useEffect(() => {
    // Re-fetch data every time we come to this page in the client in case types/blocks have been changed
    // This may mean visual changes on a server render if the Vercel static page build is out of date
    void fetchUserProfileData(user.shortname!).then((userProfileData) => {
      updateUserProfileData(userProfileData);
    });
  }, [user.shortname]);

  // Protect against unlikely client-side navigation to a non-existing profile tab
  if (!matchingTab) {
    return <NextError statusCode={404} />;
  }

  return (
    <UserPageComponent
      user={user}
      blocks={blocks}
      entityTypes={entityTypes}
      activeTab={matchingTab!.value}
    />
  );
};

export default UserPage;
