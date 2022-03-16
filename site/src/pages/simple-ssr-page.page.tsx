import { NextPage, GetServerSideProps } from "next";

interface SimpleSsrPageProps {
  message: string;
}

export const getServerSideProps: GetServerSideProps<
  SimpleSsrPageProps
> = async () => {
  return {
    props: { message: "hello world" },
  };
};

const SimpleSsrPage: NextPage<SimpleSsrPageProps> = ({ message }) => {
  return <div>{message}</div>;
};

export default SimpleSsrPage;
