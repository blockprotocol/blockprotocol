import * as aws from "@aws-sdk/client-ses";
import { convert } from "html-to-text";
import nodemailer from "nodemailer";
import SESTransport from "nodemailer/lib/ses-transport";

import { mustGetEnvVar } from "../../util/api";
import { isProduction } from "../config";

const FROM_ADDRESS = "Block Protocol <noreply@blockprotocol.org>";

let nodemailerTransporter: nodemailer.Transporter<SESTransport.SentMessageInfo>;

const getTransporter =
  (): nodemailer.Transporter<SESTransport.SentMessageInfo> => {
    if (!nodemailerTransporter) {
      const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: mustGetEnvVar("BP_AWS_REGION"),
        credentials: {
          accessKeyId: mustGetEnvVar("BP_AWS_ACCESS_KEY_ID"),
          secretAccessKey: mustGetEnvVar("BP_AWS_SECRET_ACCESS_KEY"),
        },
      });

      nodemailerTransporter = nodemailer.createTransport({
        SES: { ses, aws },
        sendingRate: 10,
      });
    }
    return nodemailerTransporter;
  };

export const sendMail = async (params: {
  to: string;
  subject: string;
  html: string;
}) => {
  const { to, subject, html } = params;

  return getTransporter()
    .sendMail({
      from: FROM_ADDRESS,
      to,
      subject: `${isProduction ? "" : "[DEV SITE] "}${subject}`,
      text: convert(html),
      html,
    })
    .then(() => undefined);
};
