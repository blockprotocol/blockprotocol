import { ValidationError } from "express-validator";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "http://localhost:3000/api/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
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

export const apiClient = {
  get: <ResponseData = any>(
    url: string,
    config?: AxiosRequestConfig<ResponseData>,
  ): Promise<{
    data?: ResponseData;
    error?: AxiosError<{ errors: Partial<ValidationError>[] }>;
  }> =>
    axiosClient
      .get<ResponseData>(url, config)
      .then(({ data }) => ({ data }))
      .catch(handleAxiosError),
  post: <RequestData = any, ResponseData = any>(
    url: string,
    requestData?: RequestData,
    config?: AxiosRequestConfig<RequestData>,
  ): Promise<{
    data?: ResponseData;
    error?: AxiosError<{ errors: Partial<ValidationError>[] }>;
  }> =>
    axiosClient
      .post<ResponseData, AxiosResponse<ResponseData>, RequestData>(
        url,
        requestData,
        config,
      )
      .then(({ data }) => ({ data }))
      .catch(handleAxiosError),
};
