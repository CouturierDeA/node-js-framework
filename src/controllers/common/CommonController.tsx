import {
    Controller,
    GetMapping,
    OptionsMapping,
    PathVariable, QueryParam,
    Response,
} from "../../framework/controller/controller";

import { join } from "node:path";

import GSX from "../../framework/gsx";

import {ResponseEntity} from "../../framework/entities/ResponseEntity";
import {GoTo, HtmlPage} from "../../templates/default";

const STATIC = join(__dirname, '../../../static')

@Controller({
    url: '/',
})
export class CommonController {
    @OptionsMapping('/**')
    serveOptions() {
    }

    @GetMapping(/(.*)\.(js|css|html|jpeg|jpg|png|svg|webp|gif)$/g)
    async getMime(
        @Response() res: ResponseEntity,
        @PathVariable() path: string
    ) {
        await res.respondWithFile(join(STATIC, path));
    }

    @GetMapping('/')
    async getMain() {
        return <HtmlPage title={'Starting page'}>
            <h1>Starting page</h1>
            <GoTo to={'/todo'}>Todo</GoTo>
            <GoTo to={'/test-multiple-query-params?test=1,2,3,4,5&id=6,7,8,9'}>Test query params</GoTo>
        </HtmlPage>
    }

    @GetMapping('/test-multiple-query-params')
    async todoPageView(
        @QueryParam() test?: number[],
        @QueryParam() id?: number[],
    ) {
        return <HtmlPage title={'Test multiple query params'}>
            <h3>Queries:</h3>
            <div>test { test?.join(',') }</div>
            <div>id { id?.join(',') }</div>
        </HtmlPage>
    }

    // @GetMapping('/')
    // async getMain(
    //     @Response() res: ResponseEntity,
    // ) {
    //     await res.respondWithFile('/static/index.html')
    // }

    // @Created()
    // async created() {
    //     await sleep(5_000, time => {
    //         console.log(`Waiting for asynchronous initialization of CommonController... ${time / 1000} s`)
    //         return 1000;
    //     })
    // }
}
