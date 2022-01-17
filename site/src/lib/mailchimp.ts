import axios, { AxiosError, AxiosInstance } from "axios";
import md5 from "md5";
import { mustGetEnvVar } from "../util/api";

let cachedMailchimpApi: AxiosInstance;

const getMailchimpApi = (): AxiosInstance => {
  const mailchimpListID = mustGetEnvVar("MAILCHIMP_LIST_ID");
  const username = mustGetEnvVar("MAILCHIMP_API_USER");
  const password = mustGetEnvVar("MAILCHIMP_API_KEY");

  cachedMailchimpApi =
    cachedMailchimpApi ||
    axios.create({
      baseURL: `https://us15.api.mailchimp.com/3.0/lists/${mailchimpListID}/`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username,
        password,
      },
    });

  return cachedMailchimpApi;
};

export const subscribeToMailchimp = async (params: {
  email: string;
}): Promise<void> => {
  const { email } = params;

  const mailchimpApi = getMailchimpApi();

  const memberID = md5(email);

  await mailchimpApi
    .put(`members/${memberID}`, {
      email_address: email,
      status: "subscribed",
    })
    .catch(async (error: AxiosError) => {
      /** @todo: properly log error */
      // eslint-disable-next-line no-console
      console.log(error);
    });
};

export const updateMailchimpMemberInfo = async (params: {
  email: string;
  fields: { [key: string]: any };
}): Promise<void> => {
  const { email, fields } = params;
  const memberID = md5(email);

  await getMailchimpApi()
    .put(`members/${memberID}`, {
      merge_fields: fields,
    })
    .catch((error: AxiosError) => {
      /** @todo: properly log error */
      // eslint-disable-next-line no-console
      console.log(error);
    });
};
