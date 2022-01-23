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
import { ApiKeysResponse } from "../pages/api/me/apiKeys.api";

const BASE_URL = "/api/";

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

export const apiClient = {
  get,
  post,
  generateApiKey: (requestData: ApiGenerateApiKeyBody) =>
    apiClient.post<ApiGenerateApiKeyBody, ApiGenerateApiKeyResponse>(
      "me/generateApiKey",
      requestData,
    ),
  getUserApiKeys: () => apiClient.get<ApiKeysResponse>("me/apiKeys"),
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
};
