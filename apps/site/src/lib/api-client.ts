import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { ValidationError } from "express-validator";

import { ApplicationId } from "../components/pages/wordpress/voting/applications";
import {
  SignupNotifyRequestBody,
  SignupNotifyResponse,
} from "../pages/api/signup-notify.api";
import {
  SubscribeEmailRequestBody,
  SubscribeEmailResponse,
} from "../pages/api/subscribe-email.api";
import { ApiUserByShortnameResponse } from "../pages/api/users/[shortname].api";
import { ApiBlocksByUserResponse } from "../pages/api/users/[shortname]/blocks/index.api";
import {
  VoteApplicationRequestBody,
  VoteApplicationResponse,
} from "../pages/api/vote-application.api";
import { FRONTEND_URL } from "./config";

const getBaseUrl = () => {
  const isServer = typeof window === "undefined";
  return `${isServer ? FRONTEND_URL : ""}/api/`;
};

const axiosClient = axios.create({
  withCredentials: true,
});

// Axios interceptors are designed to mutate the request config in place.
/* eslint-disable no-param-reassign */
axiosClient.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();

  if (typeof window === "undefined") {
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypassToken) {
      config.headers = config.headers || {};
      config.headers["x-vercel-protection-bypass"] = bypassToken;
    }
  }

  return config;
});
/* eslint-enable no-param-reassign */

axiosRetry(axiosClient, { retries: 0 });

export type ApiClientError = AxiosError<{
  errors?: Partial<ValidationError & { code?: string }>[];
}>;

const parseErrorMessageAndCodeFromAxiosError = (error: ApiClientError) => {
  const firstValidationError = error.response?.data.errors?.find(
    ({ msg }) => !!msg,
  );

  return {
    message:
      firstValidationError?.msg ?? error.response?.statusText ?? error.message,
    code:
      firstValidationError?.code ?? error.code ?? `${error.response?.status}`,
  };
};

const handleAxiosError = (
  axiosError: ApiClientError,
): { error: ApiClientError } => {
  const error = {
    ...axiosError,
    ...parseErrorMessageAndCodeFromAxiosError(axiosError),
  };
  return { error };
};

const get = <ResponseData = any, RequestParams = any>(
  url: string,
  config: AxiosRequestConfig<RequestParams> = {},
): Promise<{
  data?: ResponseData;
  error?: ApiClientError;
}> =>
  axiosClient
    .get<ResponseData>(url, config)
    .then(({ data }) => ({ data }))
    .catch(handleAxiosError);

const post = <RequestData = any, ResponseData = any>(
  url: string,
  requestData?: RequestData,
  config?: AxiosRequestConfig<RequestData>,
): Promise<{
  data?: ResponseData;
  error?: ApiClientError;
}> =>
  axiosClient
    .post<ResponseData, AxiosResponse<ResponseData>, RequestData>(
      url,
      requestData,
      config,
    )
    .then(({ data }) => ({ data }))
    .catch(handleAxiosError);

const put = <RequestData = any, ResponseData = any>(
  url: string,
  requestData?: RequestData,
  config?: AxiosRequestConfig<RequestData>,
): Promise<{
  data?: ResponseData;
  error?: ApiClientError;
}> =>
  axiosClient
    .put<ResponseData, AxiosResponse<ResponseData>, RequestData>(
      url,
      requestData,
      config,
    )
    .then(({ data }) => ({ data }))
    .catch(handleAxiosError);

export const apiClient = {
  get,
  post,
  put,
  getUser: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiUserByShortnameResponse>(`users/${shortname}`),
  getUserBlocks: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiBlocksByUserResponse>(`users/${shortname}/blocks`),
  subscribeEmailWP: ({
    email,
    signupLocation,
    referrer,
  }: {
    email: string;
    signupLocation?: string;
    referrer?: string;
  }) =>
    apiClient.put<SubscribeEmailRequestBody, SubscribeEmailResponse>(
      "subscribe-email",
      {
        email,
        ...(signupLocation ? { signupLocation } : {}),
        ...(referrer ? { referrer } : {}),
      },
    ),
  signupNotify: ({
    email,
    signupLocation,
    referrer,
  }: {
    email: string;
    signupLocation?: string;
    referrer?: string;
  }) =>
    apiClient.post<SignupNotifyRequestBody, SignupNotifyResponse>(
      "signup-notify",
      {
        email,
        ...(signupLocation ? { signupLocation } : {}),
        ...(referrer ? { referrer } : {}),
      },
    ),
  submitApplicationVote: ({
    email,
    vote,
    other,
  }: {
    email: string;
    vote: ApplicationId;
    other?: string;
  }) =>
    apiClient.put<VoteApplicationRequestBody, VoteApplicationResponse>(
      "vote-application",
      {
        email,
        vote,
        ...(other ? { other } : {}),
      },
    ),
};
