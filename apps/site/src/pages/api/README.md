# Adding an API route?

You should be aware of the following:

## File name

You must name your file `[something].api.ts` for it to be recognised as an API endpoint.

## Input validation, error formatting

You can use `bodyValidator` to validate the request body.

You can use `formatErrors` to format errors in a standard way.

## File uploads

1.  use the `multipartUploads` middleware
1.  ensure you disable `bodyParser` by adding this to your API file:

```typescript
export const config = {
  api: {
    bodyParser: false,
  },
};
```

## Environment variables

Vercel environment variables in lambdas are NOT prefixed,
e.g. `process.env.VERCEL`, **not** `process.env.NEXT_PUBLIC_VERCEL`

## File system

The API routes run on Vercel-deployed lambdas.

The ONLY file system writes allowed are to `/tmp`.

If you are writing files or running commands that unpack files,
you probably want to set the working directory and any program cache directories to somewhere in `/tmp`.

Note that many commands are not available. You probably have to use equivalents from `npm`.
