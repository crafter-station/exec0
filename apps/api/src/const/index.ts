// Polyfills for Node.js environment to mimic browser-like globals
export const JS_POLYFILLS = `
const _nf = require('node-fetch');
const fetch = globalThis.fetch || _nf;
const Headers = globalThis.Headers || _nf.Headers;
const Request = globalThis.Request || _nf.Request;
const Response = globalThis.Response || _nf.Response;
const URL = globalThis.URL || require('url').URL;
const URLSearchParams = globalThis.URLSearchParams || require('url').URLSearchParams;
const TextEncoder = globalThis.TextEncoder || require('util').TextEncoder;
const TextDecoder = globalThis.TextDecoder || require('util').TextDecoder;
const Buffer = globalThis.Buffer || require('buffer').Buffer;
const btoa = globalThis.btoa || ((s) => Buffer.from(s, 'binary').toString('base64'));
const atob = globalThis.atob || ((s) => Buffer.from(s, 'base64').toString('binary'));
const crypto = globalThis.crypto || require('crypto');
const AbortController = globalThis.AbortController || require('abort-controller').AbortController;
const AbortSignal = globalThis.AbortSignal || require('abort-controller').AbortSignal;
const FormData = globalThis.FormData || require('form-data');
const setTimeout = globalThis.setTimeout;
const setInterval = globalThis.setInterval;
const clearTimeout = globalThis.clearTimeout;
const clearInterval = globalThis.clearInterval;
`;
