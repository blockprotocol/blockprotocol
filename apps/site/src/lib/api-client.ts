import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { ValidationError } from "express-validator";

import {
  ApiBlockCreateRequest,
  ApiBlockCreateResponse,
} from "../pages/api/blocks/create.api";
import {
  ApiLoginWithLoginCodeRequestBody,
  ApiLoginWithLoginCodeResponse,
} from "../pages/api/login-with-login-code.api";
import { ApiKeysResponse } from "../pages/api/me/api-keys.api";
import {
  ApiGenerateApiKeyBody,
  ApiGenerateApiKeyResponse,
} from "../pages/api/me/generate-api-key.api";
import {
  ApiSendLoginCodeRequestBody,
  ApiSendLoginCodeResponse,
} from "../pages/api/send-login-code.api";
import {
  ApiSignupRequestBody,
  ApiSignupResponse,
} from "../pages/api/signup.api";
import {
  ApiTypeUpdateRequest,
  ApiTypeUpdateResponse,
} from "../pages/api/types/[id]/update.api";
import {
  ApiTypeCreateRequest,
  ApiTypeCreateResponse,
} from "../pages/api/types/create.api";
import { ApiUserByShortnameResponse } from "../pages/api/users/[shortname].api";
import { ApiBlocksByUserResponse } from "../pages/api/users/[shortname]/blocks/index.api";
import { ApiTypeByUserAndTitleResponse } from "../pages/api/users/[shortname]/types/[title].api";
import { ApiTypesByUserResponse } from "../pages/api/users/[shortname]/types/index.api";
import {
  ApiVerifyEmailRequestBody,
  ApiVerifyEmailResponse,
} from "../pages/api/verify-email.api";
import { FRONTEND_URL } from "./config";

const BASE_URL = `${typeof window !== "undefined" ? "" : FRONTEND_URL}/api/`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
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
  /** @todo: report unexpected server errors to sentry or equivalent */
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
  generateApiKey: (requestData: ApiGenerateApiKeyBody) =>
    apiClient.post<ApiGenerateApiKeyBody, ApiGenerateApiKeyResponse>(
      "me/generate-api-key",
      requestData,
    ),
  getUserApiKeys: () => apiClient.get<ApiKeysResponse>("me/api-keys"),
  getUser: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiUserByShortnameResponse>(`users/${shortname}`),
  getUserBlocks: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiBlocksByUserResponse>(`users/${shortname}/blocks`),
  getUserEntityTypes: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiTypesByUserResponse>(`users/${shortname}/types`),
  getEntityTypeByUserAndTitle: ({
    title,
    shortname,
  }: {
    title: string;
    shortname: string;
  }) =>
    apiClient.get<ApiTypeByUserAndTitleResponse>(
      `users/${shortname}/types/${title}`,
    ),
  createEntityType: (requestData: ApiTypeCreateRequest) =>
    apiClient.post<ApiTypeCreateRequest, ApiTypeCreateResponse>(
      "types/create",
      requestData,
    ),
  updateEntityType: (requestData: ApiTypeUpdateRequest, entityTypeId: string) =>
    apiClient.put<ApiTypeUpdateRequest, ApiTypeUpdateResponse>(
      `types/${entityTypeId}/update`,
      requestData,
    ),
  signup: (requestData: ApiSignupRequestBody) =>
    post<ApiSignupRequestBody, ApiSignupResponse>("signup", requestData),
  verifyEmail: (requestData: ApiVerifyEmailRequestBody) =>
    apiClient.post<ApiVerifyEmailRequestBody, ApiVerifyEmailResponse>(
      "verify-email",
      requestData,
    ),
  sendLoginCode: (requestData: ApiSendLoginCodeRequestBody) =>
    apiClient.post<ApiSendLoginCodeRequestBody, ApiSendLoginCodeResponse>(
      "send-login-code",
      requestData,
    ),
  loginWithLoginCode: (requestData: ApiLoginWithLoginCodeRequestBody) =>
    apiClient.post<
      ApiLoginWithLoginCodeRequestBody,
      ApiLoginWithLoginCodeResponse
    >("login-with-login-code", requestData),
  publishBlockFromNPM: (requestData: ApiBlockCreateRequest) =>
    apiClient.post<ApiBlockCreateRequest, ApiBlockCreateResponse>(
      "blocks/create",
      requestData,
    ),
};
