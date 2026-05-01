/// <reference types="vite/client" />

// Node `process` is provided at runtime by the Worker via nodejs_compat,
// but the type package isn't installed. Declare a minimal shim.
declare const process: {
  env: Record<string, string | undefined>;
};

// TanStack Start runtime modules — types not bundled in this template.
declare module "@tanstack/react-start" {
  export const createServerFn: any;
  export const createMiddleware: any;
  export const createServerOnlyFn: any;
  export const createIsomorphicFn: any;
}

declare module "@tanstack/react-start/server" {
  export const getRequest: any;
  export const getRequestHeader: any;
  export const getRequestHeaders: any;
  export const getRequestIP: any;
  export const getRequestHost: any;
  export const getRequestUrl: any;
  export const setResponseHeader: any;
  export const setResponseHeaders: any;
  export const setResponseStatus: any;
  export const getCookies: any;
  export const getCookie: any;
  export const setCookie: any;
  export const deleteCookie: any;
  export const useSession: any;
  export const getSession: any;
  export const updateSession: any;
  export const clearSession: any;
  export const getValidatedQuery: any;
}



// react-resizable-panels v2 doesn't export Group/Separator under those
// names — alias the actual exports so the legacy shadcn import compiles.
declare module "react-resizable-panels" {
  export const PanelGroup: any;
  export const Panel: any;
  export const PanelResizeHandle: any;
  export const Group: any;
  export const Separator: any;
}
