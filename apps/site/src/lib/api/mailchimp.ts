import axios, { AxiosError, AxiosInstance } from "axios";
import md5 from "md5";

import { mustGetEnvVar } from "../../util/api";
import { User } from "./model/user.model";

let cachedMailchimpApi: AxiosInstance;

export interface MailchimpMember {
  id: string;
  email_address: string;
  merge_fields: {
    [k: string]: string;
  };
}

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
  merge_fields?: { [key: string]: any };
}): Promise<void> => {
  const { email, merge_fields } = params;

  const mailchimpApi = getMailchimpApi();

  const memberID = md5(email);

  return await mailchimpApi.put(`members/${memberID}`, {
    email_address: email,
    status: "subscribed",
    merge_fields,
  });
};

export const ensureUserIsMailchimpMember = async (params: {
  user: User;
}): Promise<void> => {
  const { user } = params;
  const { email } = user;

  const memberID = md5(email);

  await getMailchimpApi()
    .get(`members/${memberID}`)
    .then(() => {})
    .catch(async (error: AxiosError) => {
      if (error.response?.status === 404) {
        await subscribeToMailchimp({
          email,
          merge_fields: {
            SHORTNAME: user.shortname,
            PREFNAME: user.preferredName,
          },
        });
      } else {
        /** @todo: properly log error */
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });
};

export const getMember = async (params: {
  email: string;
}): Promise<MailchimpMember> => {
  const { email } = params;
  const memberID = md5(email);

  return await getMailchimpApi()
    .get(`members/${memberID}`)
    .then((res) => res.data);
};

export const updateMailchimpMemberInfo = async (params: {
  email: string;
  merge_fields: { [key: string]: any };
}): Promise<void> => {
  const { email, merge_fields } = params;
  const memberID = md5(email);

  await getMailchimpApi()
    .put(`members/${memberID}`, {
      status_if_new: "subscribed",
      merge_fields,
    })
    .catch((error: AxiosError) => {
      /** @todo: properly log error */
      // eslint-disable-next-line no-console
      console.log(error);
    });
};
