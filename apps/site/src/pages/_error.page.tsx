import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import RawNextError, { ErrorProps } from "next/error.js";

const NextError = RawNextError as unknown as typeof RawNextError.default;

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  return <NextError statusCode={statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextError.getInitialProps(contextData);
};

export default CustomErrorComponent;
