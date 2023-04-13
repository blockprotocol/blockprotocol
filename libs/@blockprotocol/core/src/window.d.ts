import { CoreHandler } from "./core-handler";

declare global {
  interface Window {
    bpCoreInstanceMap: WeakMap<HTMLElement, CoreHandler>;
  }
}

export {};
