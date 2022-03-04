import React from "react";
import { NextPage, GetServerSideProps } from "next";

import { apiClient } from "../../lib/apiClient";

import {
  UserPageComponent,
  UserPageProps,
} from "../../components/pages/user/UserPageComponent";
import { TABS, TabValue } from "../../components/pages/user/Tabs";

type UserPageQueryParams = {
  profileTabs: string[];
  shortname: string;
};

export const getServerSideProps: GetServerSideProps<
  UserPageProps,
  UserPageQueryParams
> = async ({ params }) => {
  const { shortname, profileTabs } = params || {};

  if (typeof shortname !== "string" || !shortname?.startsWith("@")) {
    return { notFound: true };
  }

  const [blocksResponse, entityTypesResponse] = await Promise.all([
    apiClient.getUserBlocks({
      shortname: shortname.replace("@", ""),
    }),
    apiClient.getUserEntityTypes({
      shortname: shortname.replace("@", ""),
    }),
  ]);

  let initialActiveTab: TabValue = TABS[0].value;

  const matchingTab = TABS.find((tab) => tab.slug === profileTabs?.[0]);

  if (matchingTab) {
    initialActiveTab = matchingTab.value;
  }

  return {
    props: {
      blocks: blocksResponse.data?.blocks || [],
      entityTypes: entityTypesResponse.data?.entityTypes || [],
      initialActiveTab,
      user: {},
    },
  };
};

const UserPage: NextPage<UserPageProps> = ({
  user,
  blocks,
  entityTypes,
  initialActiveTab,
}) => {
  return (
    <UserPageComponent
      user={user}
      blocks={blocks}
      entityTypes={entityTypes}
      initialActiveTab={initialActiveTab}
    />
  );
};

export default UserPage;
