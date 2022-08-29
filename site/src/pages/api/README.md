# Adding an API route?

You should be aware of the following:

## Input validation, error formatting

You can use `bodyValidator` to validate the request body.

You can use `formatErrors` to format errors in a standard way.

## Environment variables

Vercel environment variables in lambdas are NOT prefixed,
e.g. `process.env.VERCEL`, **not** `process.env.NEXT_PUBLIC_VERCEL`

## File system

The API routes run on Vercel-deployed lambdas.

The ONLY file system writes allowed are to `/tmp`.

If you are writing files or running commands that unpack files,
you probably want to set the working directory and any program cache directories to somewhere in `/tmp`.

Note that many commands are not available. You probably have to use equivalents from `npm`.
