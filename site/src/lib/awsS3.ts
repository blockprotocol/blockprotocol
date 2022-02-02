import { PassThrough } from "stream";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import mime from "mime-types";
import { mustGetEnvVar } from "../util/api";
import { isProduction } from "./config";

export const defaultBucket =
  process.env.BP_AWS_S3_BUCKET_NAME ?? "blockprotocol";

const getClient = () => {
  return new S3Client({
    region: mustGetEnvVar("BP_AWS_REGION"),
    credentials: {
      accessKeyId: mustGetEnvVar("BP_AWS_ACCESS_KEY_ID"),
      secretAccessKey: mustGetEnvVar("BP_AWS_SECRET_ACCESS_KEY"),
    },
  });
};

const checkFiletypeAllowed = async (
  extension: string | false,
  recordType: "image",
) => {
  const imageExts = ["jpg", "jpeg", "png", "gif", "svg"];
  const supportedMap = {
    image: imageExts,
  };
  const supported = supportedMap[recordType];
  if (!supported.find((ext) => ext === extension)) {
    throw new Error(
      `Please provide a file in one of ${supported.join(", ")} formats`,
    );
  }
};

export const uploadToS3 = async (
  filenameWithoutExtension: string,
  extension: string,
  stream: PassThrough,
  recordType: "image",
  Bucket?: string,
): Promise<{
  fullUrl: string;
  s3Key: string;
  s3Folder: string;
}> => {
  const client = getClient();
  await checkFiletypeAllowed(extension, recordType);

  let filename = `${filenameWithoutExtension}.${extension}`;
  if (!isProduction && !filename.startsWith("dev/")) {
    filename = `dev/${filename}`;
  }

  // AWS doesn't detect/apply SVG metadata properly
  let Metadata: any;
  let ContentType: string | undefined;
  if (extension.toLowerCase() === "svg") {
    Metadata = {
      "Content-Type": "image/svg+xml",
    };
    ContentType = "image/svg+xml";
  }
  const ACL = "public-read";

  const params = {
    Key: filename,
    Body: stream,
    ACL,
    Bucket: Bucket ?? defaultBucket,
    ContentType,
    Metadata,
  };

  const upload = new Upload({
    client,
    params,
  });

  // eslint-disable-next-line no-console
  let fullUrl;
  let key;
  try {
    const uploadResult = await upload.done();
    // the AWS lib-storage API is currently not returning the correct values, thus an older
    // version of the library is used, as well as this for getting the location.
    fullUrl = (uploadResult as any).Location as string;
    key = (uploadResult as any).Key as string;
  } catch (error) {
    throw new Error("Could not upload image.");
  }

  const s3Folder = filename
    .split(/(?=\/)/)
    .slice(0, -1)
    .join("");

  return {
    fullUrl,
    s3Key: key,
    s3Folder,
  };
};

export const checkSvg = (svgStream: NodeJS.ReadableStream) => {
  return new Promise<void>((resolve, reject) => {
    svgStream.on("data", (data: Buffer) => {
      if (
        data
          .toString()
          .match(
            /(script|entity|onerror|onload|onmouseover|onclick|onfocus|foreignObject|<a)/i,
          )
      ) {
        svgStream.pause();
        reject(new Error("SVG disallowed."));
      }
    });
    svgStream.on("end", () => {
      resolve();
    });
  });
};

/**
 * upload a file/blob to S3
 */
export const uploadFileStreamToS3 = async (
  filePassthrough: PassThrough,
  mimeType: string,
  filename: string,
  folder: string,
  recordType: "image",
): Promise<{
  fullUrl: string;
  s3Key: string;
}> => {
  const file = filePassthrough.pipe(new PassThrough());

  const extension = mime.extension(mimeType);
  if (!extension) {
    throw new Error(`Could not determine extension from file upload`);
  }
  if (extension === "svg") {
    const svgReader = filePassthrough.pipe(new PassThrough());

    await checkSvg(svgReader);
  }
  const { fullUrl, s3Key } = await uploadToS3(
    `${folder}/${filename}`,
    extension,
    file,
    recordType,
  );
  return {
    fullUrl,
    s3Key,
  };
};
