import 'reflect-metadata'
import {RequestParams, routeMatcher} from "./core/route-matcher";
import {DiContainer} from "./di/container";
import {
    getComponentInstanceCreator, getControllerInstanceCreator, getControllerMeta,
} from "./utils/metadata";
import {RouteCreator} from "./router/route-creator";
import {RouteCtrl} from "./controller/controller/controller";
import {InstanceCreator} from "./utils/instance-creator";
import {MappingType} from "./controller/controller";
import {onHttp2Stream} from "./http2-server-listener";
import {
    Http2ServerRequest, Http2ServerResponse,
    IncomingHttpHeaders,
    ServerHttp2Stream,
} from "http2";

export interface RouteController {
    (sandbox: Sandbox, stream?: ServerHttp2Stream): Promise<any> | any
}

import {Sandbox} from "./core/http-utils/http-utils";

export interface DependencyComponent<T extends { new(...args: any[]): {} } = any> {
    constructor: T
}

export type CoreRoute<T> = {
    url: string | RegExp,
    method: string,
    executorName: keyof T | string
    executor: Function
    validator?: Function,
    type: MappingType
}

export type IRoute = CoreRoute<any>

export type DepKey = string // Todo: add ability to use Injection tokens

export class App {
    private routes: IRoute[] // Todo: move the creation of objects, as well as routing, to a separate component.
    private di = new DiContainer();
    private controllers = []
    private controllerInstances: RouteCtrl<any>[] = []
    private componentCreators: InstanceCreator<any>[] = []

    public onRequest = (
        req: Http2ServerRequest,
        res: Http2ServerResponse,
    ) => {
        const stream = req.stream || res.stream;
        if (!stream) {
            res.statusCode = 500
            res.end()
            return
        }
        return onHttp2Stream(req.stream, req, res, this, req.headers)
    }

    public onStream = (
        stream: ServerHttp2Stream,
        incomingHeaders?: IncomingHttpHeaders
    ) => {
        return onHttp2Stream(stream, undefined, undefined, this, incomingHeaders)
    }

    public routeMatcher(path: string, method: string): {
        executors?: RouteController[],
        requestParams: RequestParams,
    } {
        return routeMatcher<RouteController>(path, this.routes, method);
    }

    async init() {
        await this.initComponents()
        this.spawnControllers();
        await this.initRouter();
        return this;
    }

    useControllers(constructors: Function[]) {
        constructors.forEach(constructor => this.useController(constructor));
        return this;
    }

    useController(constructor: any) {
        this.controllers.push(constructor)
        return this;
    }

    useComponent(constructor: DependencyComponent['constructor']) {
        this.componentCreators.push(getComponentInstanceCreator(constructor))
        return this;
    }

    useComponents(constructors: Array<DependencyComponent['constructor']>) {
        constructors.forEach(constructor => this.useComponent(constructor));
        return this;
    }

    private spawnRouteController<T extends { new(...args: any[]): {} }>(controller: T) {
        const routeMeta = getControllerMeta(controller)
        const controllerCreator = getControllerInstanceCreator(controller)
        const routeCreator = new RouteCreator(controllerCreator, this.di, routeMeta)
        const routeCtrl: RouteCtrl<T> = routeCreator.createRouteController(controller as any)
        this.controllerInstances.push(routeCtrl);
    }

    private async initRouter() {
        const res = await Promise.all(
            this.controllerInstances.map(ctrl => ctrl.init())
        )
        this.routes = res.flatMap(r => r.routes);
        return this
    }

    private async initComponents() {
        await Promise.all(
            this.componentCreators.map(async (creator) => {
                const res = await creator.instantiate(this.di)
                this.di.setInstance(creator.constructorName, res)
                return res
            })
        )
    }

    private spawnControllers() {
        this.controllers.forEach(controller => this.spawnRouteController(controller))
    }
}
