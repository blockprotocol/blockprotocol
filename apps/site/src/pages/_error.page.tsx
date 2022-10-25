import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import _NextError, { ErrorProps } from "next/error.js";

const NextError = _NextError as unknown as typeof _NextError.default;

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  return <NextError statusCode={statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextError.getInitialProps(contextData);
};

export default CustomErrorComponent;
