/**
 * This file contains copied and pasted types from the
 * existing `openai` package.
 *
 * Directly importing these types would be preferable,
 * however when doing so the `typescript-json-schema` package
 * creates incorrect JSON schemas because it uses the value of
 * the `@type` JSDoc annotation, rather than the TS definition.
 *
 * @todo address this so these types become more maintainable
 * @see https://app.asana.com/0/0/1204004000163877/f
 */

/**
 *
 * @export
 * @interface ImagesResponseDataInner
 */
export interface ImagesResponseDataInner {
  /**
   *
   * @memberof ImagesResponseDataInner
   */
  url?: string;
  /**
   *
   * @memberof ImagesResponseDataInner
   */
  b64_json?: string;
}
/**
 *
 * @export
 * @interface ImagesResponse
 */
export interface ImagesResponse {
  /**
   *

   * @memberof ImagesResponse
   */
  created: number;
  /**
   *
   * @memberof ImagesResponse
   */
  data: Array<ImagesResponseDataInner>;
}
export declare const createImageRequestSizeEnum: {
  readonly _256x256: "256x256";
  readonly _512x512: "512x512";
  readonly _1024x1024: "1024x1024";
};
export declare type CreateImageRequestSizeEnum =
  (typeof createImageRequestSizeEnum)[keyof typeof createImageRequestSizeEnum];
export declare const createImageRequestResponseFormatEnum: {
  readonly Url: "url";
  readonly B64Json: "b64_json";
};
export declare type CreateImageRequestResponseFormatEnum =
  (typeof createImageRequestResponseFormatEnum)[keyof typeof createImageRequestResponseFormatEnum];
/**
 *
 * @export
 * @interface CreateImageRequest
 */
export interface CreateImageRequest {
  /**
   * A text description of the desired image(s). The maximum length is 1000 characters.
   * @memberof CreateImageRequest
   */
  prompt: string;
  /**
   * The number of images to generate. Must be between 1 and 10.
   * @memberof CreateImageRequest
   */
  n?: number | null;
  /**
   * The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`.
   * @memberof CreateImageRequest
   */
  size?: CreateImageRequestSizeEnum;
  /**
   * The format in which the generated images are returned. Must be one of `url` or `b64_json`.
   * @memberof CreateImageRequest
   */
  response_format?: CreateImageRequestResponseFormatEnum;
  /**
   * A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse. [Learn more](/docs/usage-policies/end-user-ids).
   * @memberof CreateImageRequest
   */
  user?: string;
}
/**
 * The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.  Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.
 * @export
 */
export declare type CreateCompletionRequestPrompt =
  | Array<any>
  | Array<number>
  | Array<string>
  | string;
/**
 * Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
 * @export
 */
export declare type CreateCompletionRequestStop = Array<string> | string;
/**
 *
 * @export
 * @interface CreateCompletionRequest
 */
export interface CreateCompletionRequest {
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them.
   * @memberof CreateCompletionRequest
   */
  model: string;
  /**
   *
   * @memberof CreateCompletionRequest
   */
  prompt?: CreateCompletionRequestPrompt | null;
  /**
   * The suffix that comes after a completion of inserted text.
   * @memberof CreateCompletionRequest
   */
  suffix?: string | null;
  /**
   * The maximum number of [tokens](/tokenizer) to generate in the completion.  The token count of your prompt plus `max_tokens` cannot exceed the model\'s context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
   * @memberof CreateCompletionRequest
   */
  max_tokens?: number | null;
  /**
   * What [sampling temperature](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277) to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.  We generally recommend altering this or `top_p` but not both.
   * @memberof CreateCompletionRequest
   */
  temperature?: number | null;
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  We generally recommend altering this or `temperature` but not both.
   * @memberof CreateCompletionRequest
   */
  top_p?: number | null;
  /**
   * How many completions to generate for each prompt.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
   * @memberof CreateCompletionRequest
   */
  n?: number | null;
  /**
   * Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message.
   * @memberof CreateCompletionRequest
   */
  stream?: boolean | null;
  /**
   * Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.  The maximum value for `logprobs` is 5. If you need more than this, please contact us through our [Help center](https://help.openai.com) and describe your use case.
   * @memberof CreateCompletionRequest
   */
  logprobs?: number | null;
  /**
   * Echo back the prompt in addition to the completion
   * @memberof CreateCompletionRequest
   */
  echo?: boolean | null;
  /**
   *
   * @memberof CreateCompletionRequest
   */
  stop?: CreateCompletionRequestStop | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model\'s likelihood to talk about new topics.  [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
   * @memberof CreateCompletionRequest
   */
  presence_penalty?: number | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model\'s likelihood to repeat the same line verbatim.  [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
   * @memberof CreateCompletionRequest
   */
  frequency_penalty?: number | null;
  /**
   * Generates `best_of` completions server-side and returns the \"best\" (the one with the highest log probability per token). Results cannot be streamed.  When used with `n`, `best_of` controls the number of candidate completions and `n` specifies how many to return – `best_of` must be greater than `n`.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
   * @memberof CreateCompletionRequest
   */
  best_of?: number | null;
  /**
   * Modify the likelihood of specified tokens appearing in the completion.  Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this [tokenizer tool](/tokenizer?view=bpe) (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.  As an example, you can pass `{\"50256\": -100}` to prevent the <|endoftext|> token from being generated.
   * @memberof CreateCompletionRequest
   */
  logit_bias?: object | null;
  /**
   * A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse. [Learn more](/docs/usage-policies/end-user-ids).
   * @memberof CreateCompletionRequest
   */
  user?: string;
}

/**
 *
 * @export
 * @interface CreateCompletionResponseUsage
 */
export interface CreateCompletionResponseUsage {
  /**
   *
   * @memberof CreateCompletionResponseUsage
   */
  prompt_tokens: number;
  /**
   *
   * @memberof CreateCompletionResponseUsage
   */
  completion_tokens: number;
  /**
   *
   * @memberof CreateCompletionResponseUsage
   */
  total_tokens: number;
}
/**
 *
 * @export
 * @interface CreateCompletionResponseChoicesInnerLogprobs
 */
export interface CreateCompletionResponseChoicesInnerLogprobs {
  /**
   *
   * @memberof CreateCompletionResponseChoicesInnerLogprobs
   */
  tokens?: Array<string>;
  /**
   *
   * @memberof CreateCompletionResponseChoicesInnerLogprobs
   */
  token_logprobs?: Array<number>;
  /**
   *
   * @memberof CreateCompletionResponseChoicesInnerLogprobs
   */
  top_logprobs?: Array<object>;
  /**
   *
   * @memberof CreateCompletionResponseChoicesInnerLogprobs
   */
  text_offset?: Array<number>;
}
/**
 *
 * @export
 * @interface CreateCompletionResponseChoicesInner
 */
export interface CreateCompletionResponseChoicesInner {
  /**
   *
   * @memberof CreateCompletionResponseChoicesInner
   */
  text?: string;
  /**
   *
   * @memberof CreateCompletionResponseChoicesInner
   */
  index?: number;
  /**
   *
   * @memberof CreateCompletionResponseChoicesInner
   */
  logprobs?: CreateCompletionResponseChoicesInnerLogprobs | null;
  /**
   *
   * @memberof CreateCompletionResponseChoicesInner
   */
  finish_reason?: string;
}
/**
 *
 * @export
 * @interface CreateCompletionResponse
 */
export interface CreateCompletionResponse {
  /**
   *
   * @memberof CreateCompletionResponse
   */
  id: string;
  /**
   *
   * @memberof CreateCompletionResponse
   */
  object: string;
  /**
   *
   * @memberof CreateCompletionResponse
   */
  created: number;
  /**
   *
   * @memberof CreateCompletionResponse
   */
  model: string;
  /**
   *
   * @memberof CreateCompletionResponse
   */
  choices: Array<CreateCompletionResponseChoicesInner>;
  /**
   *
   * @memberof CreateCompletionResponse
   */
  usage?: CreateCompletionResponseUsage;
}
