// Minimal ambient declarations to satisfy the TS server when Next/React types
// are not yet available (e.g. before running `pnpm install`/`npm install`).
// Remove this file after installing dependencies so proper types are used.

declare module "next/image" {
  import * as React from "react";
  const Image: React.FC<any>;
  export default Image;
}

declare module "next/link" {
  import * as React from "react";
  const Link: React.FC<any>;
  export default Link;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
