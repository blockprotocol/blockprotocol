import {
  ExternalServiceMethod200Response,
  ExternalServiceMethodRequest,
} from "@local/internal-api-client";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { ValidationError } from "express-validator";

import { ApplicationId } from "../components/pages/wordpress/voting/applications";
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
import { RemoveAvatarResponse } from "../pages/api/me/remove-avatar.api";
import {
  ApiRevokeApiKeyBody,
  ApiRevokeApiKeyResponse,
} from "../pages/api/me/revoke-api-key.api";
import {
  ApiUpdateApiKeyBody,
  ApiUpdateApiKeyResponse,
} from "../pages/api/me/update-api-key.api";
import {
  ApiUpdatePreferredNameRequestBody,
  ApiUpdatePreferredNameResponse,
} from "../pages/api/me/update-preferred-name.api";
import { ApiUploadAvatarResponse } from "../pages/api/me/upload-avatar.api";
import {
  ApiSendLoginCodeRequestBody,
  ApiSendLoginCodeResponse,
} from "../pages/api/send-login-code.api";
import {
  ApiSetUsageLimitRequestBody,
  ApiSetUsageLimitResponse,
} from "../pages/api/set-usage-limit.api";
import {
  ApiSignupRequestBody,
  ApiSignupResponse,
} from "../pages/api/signup.api";
import {
  SubscribeEmailRequestBody,
  SubscribeEmailResponse,
} from "../pages/api/subscribe-email.api";
import {
  ApiEntityTypeCreateRequest,
  ApiEntityTypeCreateResponse,
} from "../pages/api/types/entity-type/create.api";
import {
  ApiEntityTypeByUrlGetQuery,
  ApiEntityTypeByUrlResponse,
} from "../pages/api/types/entity-type/get.api";
import {
  ApiQueryEntityTypesQuery,
  ApiQueryEntityTypesResponse,
} from "../pages/api/types/entity-type/query.api";
import {
  ApiEntityTypeUpdateRequest,
  ApiEntityTypeUpdateResponse,
} from "../pages/api/types/entity-type/update.api";
import {
  ApiPropertyTypeCreateRequest,
  ApiPropertyTypeCreateResponse,
} from "../pages/api/types/property-type/create.api";
import {
  ApiPropertyTypeByUrlGetQuery,
  ApiPropertyTypeByUrlResponse,
} from "../pages/api/types/property-type/get.api";
import {
  ApiQueryPropertyTypesQuery,
  ApiQueryPropertyTypesResponse,
} from "../pages/api/types/property-type/query.api";
import {
  ApiPropertyTypeUpdateRequest,
  ApiPropertyTypeUpdateResponse,
} from "../pages/api/types/property-type/update.api";
import { ApiUserByShortnameResponse } from "../pages/api/users/[shortname].api";
import { ApiBlocksByUserResponse } from "../pages/api/users/[shortname]/blocks/index.api";
import { ApiTypesByUserResponse } from "../pages/api/users/[shortname]/types/entity-type/index.api";
import {
  ApiVerifyEmailRequestBody,
  ApiVerifyEmailResponse,
} from "../pages/api/verify-email.api";
import { FRONTEND_URL } from "./config";

const BASE_URL = `${typeof window !== "undefined" ? "" : FRONTEND_URL}/api/`;

// eslint-disable-next-line no-console
console.log(`[api-client] BASE_URL: ${BASE_URL}, FRONTEND_URL: ${FRONTEND_URL}`);

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

const deleteMethod = <ResponseData = any, RequestParams = any>(
  url: string,
  config: AxiosRequestConfig<RequestParams> = {},
): Promise<{
  data?: ResponseData;
  error?: ApiClientError;
}> =>
  axiosClient
    .delete<ResponseData>(url, config)
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
  delete: deleteMethod,
  externalServiceMethod: (requestData: ExternalServiceMethodRequest) =>
    apiClient.post<
      ExternalServiceMethodRequest,
      ExternalServiceMethod200Response
    >("external-service-method", requestData),
  generateApiKey: (requestData: ApiGenerateApiKeyBody) =>
    apiClient.post<ApiGenerateApiKeyBody, ApiGenerateApiKeyResponse>(
      "me/generate-api-key",
      requestData,
    ),
  revokeApiKey: (requestData: ApiRevokeApiKeyBody) =>
    apiClient.post<ApiRevokeApiKeyBody, ApiRevokeApiKeyResponse>(
      "me/revoke-api-key",
      requestData,
    ),
  updateApiKey: (requestData: ApiUpdateApiKeyBody) =>
    apiClient.post<ApiUpdateApiKeyBody, ApiUpdateApiKeyResponse>(
      "me/update-api-key",
      requestData,
    ),
  getUserApiKeys: () => apiClient.get<ApiKeysResponse>("me/api-keys"),
  uploadAvatar: (requestData: FormData) =>
    apiClient.post<FormData, ApiUploadAvatarResponse>(
      "me/upload-avatar",
      requestData,
    ),
  removeAvatar: () =>
    apiClient.delete<RemoveAvatarResponse>("me/remove-avatar"),
  updatePreferredName: (requestData: ApiUpdatePreferredNameRequestBody) =>
    apiClient.put<
      ApiUpdatePreferredNameRequestBody,
      ApiUpdatePreferredNameResponse
    >("me/update-preferred-name", requestData),
  getUser: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiUserByShortnameResponse>(`users/${shortname}`),
  getUserBlocks: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiBlocksByUserResponse>(`users/${shortname}/blocks`),
  getUserEntityTypes: ({ shortname }: { shortname: string }) =>
    apiClient.get<ApiTypesByUserResponse>(
      `users/${shortname}/types/entity-type`,
    ),
  getEntityTypes: ({ latestOnly }: ApiQueryEntityTypesQuery) =>
    apiClient.get<ApiQueryEntityTypesResponse>(
      `types/entity-type/query?latestOnly=${latestOnly}`,
    ),
  getEntityTypeByUrl: ({ baseUrl, versionedUrl }: ApiEntityTypeByUrlGetQuery) =>
    apiClient.get<ApiEntityTypeByUrlResponse>(
      `types/entity-type/get?${
        baseUrl ? `baseUrl=${baseUrl}` : `versionedUrl=${versionedUrl}`
      }`,
    ),
  createEntityType: (requestData: ApiEntityTypeCreateRequest) =>
    apiClient.post<ApiEntityTypeCreateRequest, ApiEntityTypeCreateResponse>(
      "types/entity-type/create",
      requestData,
    ),
  updateEntityType: (requestData: ApiEntityTypeUpdateRequest) =>
    apiClient.put<ApiEntityTypeUpdateRequest, ApiEntityTypeUpdateResponse>(
      `types/entity-type/update`,
      requestData,
    ),
  getPropertyTypes: ({ latestOnly }: ApiQueryPropertyTypesQuery) =>
    apiClient.get<ApiQueryPropertyTypesResponse>(
      `types/property-type/query?latestOnly=${latestOnly}`,
    ),
  getPropertyTypeByUrl: ({
    baseUrl,
    versionedUrl,
  }: ApiPropertyTypeByUrlGetQuery) =>
    apiClient.get<ApiPropertyTypeByUrlResponse>(
      `types/property-type/get?${
        baseUrl ? `baseUrl=${baseUrl}` : `versionedUrl=${versionedUrl}`
      }`,
    ),
  createPropertyType: (requestData: ApiPropertyTypeCreateRequest) =>
    apiClient.post<ApiPropertyTypeCreateRequest, ApiPropertyTypeCreateResponse>(
      "types/property-type/create",
      requestData,
    ),
  updatePropertyType: (requestData: ApiPropertyTypeUpdateRequest) =>
    apiClient.put<ApiPropertyTypeUpdateRequest, ApiPropertyTypeUpdateResponse>(
      `types/property-type/update`,
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
  subscribeEmailWP: ({ email }: { email: string }) =>
    apiClient.put<SubscribeEmailRequestBody, SubscribeEmailResponse>(
      "subscribe-email",
      {
        email,
        merge_fields: {
          ECO_WP: "Yes",
        },
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
    apiClient.put<SubscribeEmailRequestBody, SubscribeEmailResponse>(
      "vote-application",
      {
        email,
        merge_fields: {
          [vote]: "Yes",
          ...(other ? { WISH_EA: other } : {}),
        },
      },
    ),
  setUsageLimit: (requestData: ApiSetUsageLimitRequestBody) =>
    apiClient.post<ApiSetUsageLimitRequestBody, ApiSetUsageLimitResponse>(
      "set-usage-limit",
      requestData,
    ),
};
