import {mixHeaders, Sandbox, serialize} from "../core/http-utils/http-utils";
import {OutgoingHttpHeaders} from "http";
import {Http2ServerRequest, Http2ServerResponse, ServerHttp2Stream} from "http2";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
type WrightStreamArgs = Parameters<ServerHttp2Stream['write']>
type OnStreamArgs = ArgumentTypes<ServerHttp2Stream['on']>

export class ResponseEntity {
    constructor(
        sandBox: Sandbox,
        req?: Http2ServerRequest,
        res?: Http2ServerResponse,
        stream?: ServerHttp2Stream,
    ) {
        this.sandBox = sandBox;
        this.req = req;
        this.res = res;
        this.stream = req?.stream || stream
        this.id = this.stream?.id
    }
    private sandBox: Sandbox;
    private req?: Http2ServerRequest;
    private res?: Http2ServerResponse;

    stream: ServerHttp2Stream;
    id: number;
    status = 200;
    body: any;
    headers: OutgoingHttpHeaders = {};
    released = false;

    addHeaders = (addHeaders: OutgoingHttpHeaders) => {
        const {headers} = this;
        this.headers = {
            ...headers,
            ...(addHeaders || {})
        }
        return this;
    }

    write = (...args: Partial<WrightStreamArgs>) => {
        const stream = this.stream || this.res;
        stream.write(...args)
    }

    on = (...args: OnStreamArgs) => {
        const stream = this.stream || this.res;
        stream.on(...args)
    }

    sendHeaders = (addHeaders?: OutgoingHttpHeaders) => {
        addHeaders && this.addHeaders(addHeaders);
        const {stream} = this
        if (!stream.headersSent) {
            stream.respond(this.headers);
        }
    }

    respondWithFile = async (path: string) => {
        await this.sandBox.respondWithFile(path);
        this.released = true;
    }

    releaseStream = (
        status?: number,
        data?: any,
        headers?: OutgoingHttpHeaders
    ) => {
        const {stream} = this;
        if (!stream.closed) {
            const serialized = serialize(data);
            !stream.headersSent && stream.respond(
                mixHeaders({
                    ':status': status,
                }, headers)
            )
            stream.end(serialized);
            this.released = true;
        }
    }
}
