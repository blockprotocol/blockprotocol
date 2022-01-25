import { NextPage } from "next";
import { useRouter } from "next/router";

type EntityTypePageQueryParams = {
  shortname: string;
  title: string;
};

const EntityTypePage: NextPage = () => {
  const router = useRouter();

  const { shortname, title } = router.query as EntityTypePageQueryParams;

  return (
    <div>
      <p>{shortname}</p>
      <p>{title}</p>
    </div>
  );
};

export default EntityTypePage;
