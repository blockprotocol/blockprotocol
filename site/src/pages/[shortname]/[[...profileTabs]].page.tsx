import React from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";

import { useRouter } from "next/router";
import Error from "next/error";
import { apiClient } from "../../lib/apiClient";

import {
  UserPageComponent,
  UserPageProps,
} from "../../components/pages/user/UserPageComponent";
import { TABS } from "../../components/pages/user/Tabs";

type UserPageQueryParams = {
  profileTabs: string[];
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

  const matchingTab = findTab(params?.profileTabs);
  if (!matchingTab) {
    return {
      notFound: true,
    };
  }

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

  if (userResponse.error || !userResponse.data) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: {
      blocks: blocksResponse.data?.blocks || [],
      entityTypes: entityTypesResponse.data?.entityTypes || [],
      user: userResponse.data.user,
    },
    revalidate: 60,
  };
};

const UserPage: NextPage<UserPageProps> = ({ user, blocks, entityTypes }) => {
  const router = useRouter();

  const matchingTab = findTab(router.query.profileTabs);

  // Protect against unlikely client-side navigation to a non-existing profile tab
  if (!matchingTab) {
    return <Error statusCode={404} />;
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
