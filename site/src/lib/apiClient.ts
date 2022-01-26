import { ValidationError } from "express-validator";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import {
  ApiSendLoginCodeRequestBody,
  ApiSendLoginCodeResponse,
} from "../pages/api/sendLoginCode.api";
import {
  ApiSignupRequestBody,
  ApiSignupResponse,
} from "../pages/api/signup.api";
import {
  ApiVerifyEmailRequestBody,
  ApiVerifyEmailResponse,
} from "../pages/api/verifyEmail.api";
import {
  ApiLoginWithLoginCodeRequestBody,
  ApiLoginWithLoginCodeResponse,
} from "../pages/api/loginWithLoginCode.api";
import {
  ApiGenerateApiKeyBody,
  ApiGenerateApiKeyResponse,
} from "../pages/api/me/generateApiKey.api";
import { ApiTypesByUserResponse } from "../pages/api/users/[shortname]/types/index.api";
import { ApiBlocksByUserResponseResponse } from "../pages/api/users/[shortname]/blocks/index.api";
import { ApiUserByShortnameResponseResponse } from "../pages/api/users/[shortname].api";
import { ApiKeysResponse } from "../pages/api/me/apiKeys.api";
import { ApiBlocksByUserResponse } from "../pages/api/users/[shortname]/blocks/index.api";
import { ApiTypesByUserResponse } from "../pages/api/users/[shortname]/types/index.api";
import { ApiTypeByUserAndTitleResponse } from "../pages/api/users/[shortname]/types/[title].api";
import {
  ApiTypeCreateRequest,
  ApiTypeCreateResponse,
} from "../pages/api/types/create.api";
import {
  ApiTypeUpdateRequest,
  ApiTypeUpdateResponse,
} from "../pages/api/types/[id]/update.api";
import { FRONTEND_URL } from "./config";

const BASE_URL = `${FRONTEND_URL}/api/`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const handleAxiosError = (
  error: AxiosError,
): { error: AxiosError<{ errors: Partial<ValidationError>[] }> } => {
  /** @todo: stop special casing unauthorized errors */
  if (error.response?.status === 401 || error.response?.data.errors) {
    return { error };
  }
  throw error;
};

export type ApiClientError = AxiosError<{ errors: Partial<ValidationError>[] }>;

const get = <ResponseData = any, RequestParams = any>(
  url: string,
  requestParams?: RequestParams,
): Promise<{
  data?: ResponseData;
  error?: ApiClientError;
}> =>
  axiosClient
    .get<ResponseData>(url, {
      params: requestParams,
    })
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
      "me/generateApiKey",
      requestData,
    ),
  getUserApiKeys: () => apiClient.get<ApiKeysResponse>("me/apiKeys"),
  getUser: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiUserByShortnameResponseResponse>(`users/${shortname}`),
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
      "verifyEmail",
      requestData,
    ),
  sendLoginCode: (requestData: ApiSendLoginCodeRequestBody) =>
    apiClient.post<ApiSendLoginCodeRequestBody, ApiSendLoginCodeResponse>(
      "sendLoginCode",
      requestData,
    ),
  loginWithLoginCode: (requestData: ApiLoginWithLoginCodeRequestBody) =>
    apiClient.post<
      ApiLoginWithLoginCodeRequestBody,
      ApiLoginWithLoginCodeResponse
    >("loginWithLoginCode", requestData),
  getUser: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiUserByShortnameResponseResponse>(`users/${shortname}`),
  getUserBlocks: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiBlocksByUserResponseResponse>(`users/${shortname}/blocks`),
  getUserEntityTypes: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiTypesByUserResponse>(`users/${shortname}/types`),
};
