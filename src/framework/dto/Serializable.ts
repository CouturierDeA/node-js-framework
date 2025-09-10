import querystring from 'node:querystring';

export function qsToJson<T>(stream: string) {
    return querystring.parse(stream) as T;
}

export function stringToJson<T>(stream: string) {
    return JSON.parse(stream) as T;
}

export function jsonToString<T>(stream: T) {
    return JSON.stringify(stream);
}
