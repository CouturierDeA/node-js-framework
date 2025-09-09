import {
    ServerHttp2Stream,
    constants,
    Http2SecureServer,
    Http2ServerRequest,
    Http2ServerResponse, IncomingHttpHeaders
} from "http2";
// https://apiko.com/blog/node-js-multi-threading-process/
const {HTTP2_HEADER_PATH, HTTP2_HEADER_METHOD, HTTP_STATUS_OK, HTTP_STATUS_NO_CONTENT} = constants;

import {
    handleApiError,
    respondWithFile,
    Sandbox,
} from "./core/http-utils/http-utils";
import {ApiException} from "./exceptions/exceptions";
import {OutgoingHttpHeaders} from "http";
import {App} from "./app";
import {RequestEntity} from "./entities/RequestEntity";
import {ResponseEntity} from "./entities/ResponseEntity";
import {methodType} from "./controller/controller";

export const onHttp2Stream = async (
    streamParam: ServerHttp2Stream | undefined,
    req: Http2ServerRequest | undefined,
    res: Http2ServerResponse | undefined,
    app: App<Http2SecureServer>,
    commonHeaders?: IncomingHttpHeaders
) => {
    const path = req?.url || commonHeaders[HTTP2_HEADER_PATH] as string;
    const reqMethod = req?.method || commonHeaders[HTTP2_HEADER_METHOD]
    const method: methodType = Array.isArray(reqMethod) ? reqMethod[0] as methodType : reqMethod as methodType;
    const stream = streamParam || req.stream || res.stream;
    let sharedResponse: ResponseEntity;
    try {
        const {executors, requestParams} = app.routeMatcher(path, method);
        // Todo: избавиться от Sandbox - все это можно положить в RequestEntity и ResponseEntity
        const sandbox: Sandbox = {
            ...requestParams,
            stream,
            respondWithFile: (reqPath: string) => respondWithFile(stream, req, res, reqPath),
            getBodySafe: null,
            incomingHeaders: commonHeaders,
            method,
            mixHeaders: null,
            request: null,
            response: null,
            commonHeaders
        }
        const request = new RequestEntity(sandbox, req, res, stream, commonHeaders, path, method)
        const response = new ResponseEntity(sandbox, req, res, stream)
        sandbox.request = request
        sandbox.response = response
        sharedResponse = response;
        sandbox.getBodySafe = (sandbox.request as any).getBody;

        sandbox.mixHeaders = (headers: OutgoingHttpHeaders) => {
            response.addHeaders(headers)
            return response.headers
        }

        if (!executors || !executors.length) {
            handleApiError(stream, req, res, method, ApiException.notFound('Not Found'), path, response.headers);
            return
        }

        try {
            let result;
            for await (let executor of executors) {
                result = await executor(sandbox, stream);
            }
            const isResponseEntity = result instanceof ResponseEntity;

            if (!stream.closed && !isResponseEntity) {
                const status = typeof result !== 'undefined' ? HTTP_STATUS_OK : HTTP_STATUS_NO_CONTENT
                response.releaseStream(
                    status,
                    result,
                    response.headers
                )
            }

            if (isResponseEntity && response.released) {
                response.releaseStream(
                    response.status,
                    response.body,
                    response.headers
                )
            }

        } catch (e) {
            handleApiError(stream, req, res, method, e, path, response.headers);
        }
    } catch (e) {
        console.error(e)
        handleApiError(stream, req, res, method, e, path, sharedResponse?.headers);
    }
}
