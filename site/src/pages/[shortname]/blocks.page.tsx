import React from "react";
import { NextPage, GetServerSideProps } from "next";

import { apiClient } from "../../lib/apiClient";

import {
  UserPageComponent,
  UserPageProps,
} from "../../components/pages/user/UserPageComponent";

type UserPageQueryParams = {
  shortname: string;
};

export const getServerSideProps: GetServerSideProps<
  UserPageProps,
  UserPageQueryParams
> = async ({ params }) => {
  const { shortname } = params || {};

  if (typeof shortname !== "string" || !shortname?.startsWith("@")) {
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
      user: userResponse.data?.user,
      blocks: blocksResponse.data?.blocks || [],
      entityTypes: entityTypesResponse.data?.entityTypes || [],
    },
  };
};

const UserBlocksPage: NextPage<UserPageProps> = ({
  user,
  blocks,
  entityTypes,
}) => {
  return (
    <UserPageComponent
      user={user}
      blocks={blocks}
      entityTypes={entityTypes}
      initialActiveTab="blocks"
    />
  );
};

export default UserBlocksPage;
