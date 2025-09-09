import {IncomingHttpHeaders, ServerResponse} from "http";

const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const COOKIE_DELETE = (host: IHost, expires = UNIX_EPOCH, path = '/', domain = '') => `=deleted; Expires=${expires}; Path=${path}; Domain=${host}`;

export type ICookieName = string;
export type ICookieValue = string;
export type IHost = IncomingHttpHeaders['host'];

export function parseCookies(headers?: IncomingHttpHeaders): any {
    const {cookie} = headers;
    let rc = cookie;
    let cookies = {};
    rc && rc.split(';').forEach((cookie) => {
        let parts = cookie.split('=');
        cookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return cookies
}

export const prepareCookie = (
    host: IHost,
    name: ICookieName,
    val: ICookieValue,
    httpOnly: boolean = false,
    expires: string = COOKIE_EXPIRE,
    path: string = '/'
) => {
    let cookie = `${name}=${val}; Expires=${expires}; Path=${path}; Domain=${host}`;
    if (httpOnly) cookie += '; HttpOnly';
    return cookie;
}
export const sendCookie = (res: ServerResponse, preparedCookies: string[]) => {
    !res.headersSent && res.setHeader('Set-Cookie', preparedCookies);
}

export function prepareDeleteCookie(host: IHost, name: ICookieName, expires = UNIX_EPOCH, path = '/') {
    return `${name}=deleted; Expires=${expires}; Path=${path}; Domain=${host}`
}
