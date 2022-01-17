import axios from "axios";
import md5 from "md5";
import { mustGetEnvVar } from "../util/api";

const baseURL = "https://us15.api.mailchimp.com/3.0/lists/";

export const subscribeToMailchimp = async (params: {
  email: string;
}): Promise<void> => {
  const { email } = params;

  const mailchimpListID = mustGetEnvVar("MAILCHIMP_LIST_ID");
  const username = mustGetEnvVar("MAILCHIMP_API_USER");
  const password = mustGetEnvVar("MAILCHIMP_API_KEY");

  await axios
    .post(
      `${mailchimpListID}/members/`,
      {
        email_address: email,
        status: "subscribed",
      },
      {
        baseURL,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username,
          password,
        },
      },
    )
    .catch((error) => {
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

  const mailchimpListID = mustGetEnvVar("MAILCHIMP_LIST_ID");
  const username = mustGetEnvVar("MAILCHIMP_API_USER");
  const password = mustGetEnvVar("MAILCHIMP_API_KEY");

  await axios.patch(
    `${mailchimpListID}/members/${memberID}`,
    { merge_fields: fields },
    {
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username,
        password,
      },
    },
  );
};
