import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextErrorComponent, { ErrorProps } from "next/error";

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
