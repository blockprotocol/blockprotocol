// eslint-disable-next-line unicorn/import-style,react/no-typos -- this is okay in this definition file
import "react";

declare module "react" {
  // eslint-disable-next-line no-undef -- this is okay in this definition file
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    // needed for use of <style jsx> | <styled jsx global>
    jsx?: boolean | string;
    global?: boolean | string;
  }
}
