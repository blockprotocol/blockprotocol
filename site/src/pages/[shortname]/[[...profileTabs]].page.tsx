import React from "react";
import { NextPage, GetServerSideProps } from "next";

import { useRouter } from "next/router";
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

export const getServerSideProps: GetServerSideProps<
  Omit<UserPageProps, "activeTab">,
  UserPageQueryParams
> = async ({ params }) => {
  const { shortname } = params || {};

  if (typeof shortname !== "string" || !shortname.startsWith("@")) {
    return { notFound: true };
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
    return { notFound: true };
  }

  return {
    props: {
      blocks: blocksResponse.data?.blocks || [],
      entityTypes: entityTypesResponse.data?.entityTypes || [],
      user: userResponse.data.user,
    },
  };
};

const UserPage: NextPage<UserPageProps> = ({ user, blocks, entityTypes }) => {
  const router = useRouter();

  const activeTabSlug = router.query.profileTabs?.[0] ?? "";
  const matchingTab = TABS.find((tab) => tab.slug === activeTabSlug);

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
