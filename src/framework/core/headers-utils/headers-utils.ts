// req.headers.host
import {IHeaderType} from "./d";
import {ServerResponse} from "http";
import {IncomingHttpHeaders} from "http2";
import {Http2ServerResponse} from "http2";
export function setHeader(res: Http2ServerResponse, header: IHeaderType, value: string) {
    res.setHeader(header, value);
}

export function setCustomHeader(res: ServerResponse, header: string, value: string) {
    res.setHeader(header, value);
}

export function parseHost(host?: string) {
    if (!host) return 'no-host-name-in-http-headers';
    const portOffset = host.indexOf(':');
    if (portOffset > -1) host = host.substr(0, portOffset);
    return host;
}

export function setCache(useCache: number, headers:IncomingHttpHeaders){

}