import {extname} from "path";

import {
    Http2ServerRequest,
    Http2ServerResponse,
    IncomingHttpHeaders,
    ServerHttp2Stream,
} from "http2";
import {ApiException} from "../../exceptions/exceptions";
import {OutgoingHttpHeaders} from "http";
import {RequestEntity} from "../../entities/RequestEntity";
import {ResponseEntity} from "../../entities/ResponseEntity";
import {promises} from "fs";
import {sanitizePath} from "../../utils";

export interface Sandbox<T = ServerHttp2Stream> {
    route: string | RegExp
    params: object
    query: object
    getBodySafe?: () => Promise<any>
    respondWithFile?: (reqPath: string) => Promise<number>
    mixHeaders: (headers: OutgoingHttpHeaders) => OutgoingHttpHeaders
    stream: T,
    commonHeaders: OutgoingHttpHeaders
    request: RequestEntity
    response: ResponseEntity
    incomingHeaders: IncomingHttpHeaders
    method: string
}

export const serializer = {
    'number': (num: number) => num.toString(),
    'string': (str: string) => str,
    'boolean': (bool: boolean) => JSON.stringify(bool),
    'object': (data: object) => JSON.stringify(data),
    'undefined': (data: undefined) => data,
}

export const serialize = (data: any) => {
    const dataType = typeof data;
    const exec = serializer[dataType] || serializer.undefined
    return exec(data)
}

export const mimeTypes = {
    // Text files
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.xml': 'application/xml',
    '.yaml': 'text/yaml',
    '.md': 'text/markdown',

    // Image files
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/vnd.microsoft.icon',
    '.tiff': 'image/tiff',
    '.heif': 'image/heif',
    '.heic': 'image/heic',

    // Video files
    '.mp4': 'video/mp4',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.flv': 'video/x-flv',
    '.wmv': 'video/x-ms-wmv',
    '.mpeg': 'video/mpeg',
    '.ogv': 'video/ogg',

    // Audio files
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
    '.m4a': 'audio/mp4',
    '.opus': 'audio/opus',

    // Font files
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',

    // Archive files
    '.zip': 'application/zip',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    '.bz2': 'application/x-bzip2',
    '.rar': 'application/vnd.rar',
    '.7z': 'application/x-7z-compressed',

    // Application files
    '.pdf': 'application/pdf',
    '.epub': 'application/epub+zip',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.ods': 'application/vnd.oasis.opendocument.spreadsheet',

    // JSON files
    '.json': 'application/json',
    '.jsonp': 'application/javascript',

    // Miscellaneous files
    '.wasm': 'application/wasm',
    '.dat': 'application/octet-stream',
    '.bin': 'application/octet-stream',
    '.exe': 'application/x-msdownload',
    '.apk': 'application/vnd.android.package-archive',
    '.bat': 'application/x-msdownload',
    '.msi': 'application/x-msdownload',
    '.dmg': 'application/x-apple-diskimage',
    // Others
    '.torrent': 'application/x-bittorrent',
    '.xhtml': 'application/xhtml+xml',
    '.yml': 'text/yaml',
}

export const mixHeaders = (headers, addHeaders?) => {
    return {
        ...headers,
        ...(addHeaders || {})
    }
}

export function handleApiError(
    stream: ServerHttp2Stream,
    req: Http2ServerRequest | undefined,
    res: Http2ServerResponse | undefined,
    reqMethod: string,
    exception: ApiException | NodeJS.ErrnoException,
    path,
    addHeaders: OutgoingHttpHeaders
) {
    const {message} = exception;
    let status = (exception as ApiException).status || 500

    const headers = mixHeaders({
        ":status": status,
    }, addHeaders)
    stream.respond(headers);
    stream.end(serialize({
        message
    }));
}

export function parseBody(stream: ServerHttp2Stream) {
    return new Promise<string>((resolve, reject) => {
        let chunks = [];
        stream.on('data', function (chunk) {
            chunks.push(chunk);
        });
        stream.on('end', function () {
            const body = chunks.toString();
            resolve(body);
        });
        stream.on('error', function (err) {
            reject(err)
        });
    })
}

export async function respondWithFile(
    stream: ServerHttp2Stream,
    req: Http2ServerRequest | undefined,
    res: Http2ServerResponse | undefined,
    unsafePath: string,
): Promise<number> {
    const reqPath = sanitizePath(unsafePath);
    const mime = extname(reqPath);
    const contentType = mimeTypes[mime];
    const notFound = `cant find file ${reqPath}`;
    return new Promise((resolve, reject) => {
        const rejection = () => reject(ApiException.notFound(notFound));
        if (!reqPath) rejection();
        if (!stream) {
            promises.readFile(reqPath)
                .then(res.end)
                .catch(rejection)
            return;
        }
        stream.respondWithFile(reqPath, {
            'content-type': contentType
        }, {
            onError: rejection
        });
        stream.on('finish', () => {
            resolve(1)
        })
    })
}
