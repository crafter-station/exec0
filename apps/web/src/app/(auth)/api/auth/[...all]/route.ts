import { auth, toNextJsHandler } from "@exec0/auth";

export const { POST, GET } = toNextJsHandler(auth);
