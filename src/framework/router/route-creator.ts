import { join } from 'path';
import {CoreRoute} from "../app";
import {getMappingMeta} from "../utils/metadata";
import {RouteCtrl} from "../controller/controller/controller";
import {InstanceCreator} from "../utils/instance-creator";
import {DiContainer} from "../di/container";

export class RouteCreator<T> {
    constructor(
        controllerCreator: InstanceCreator<T>,
        di: DiContainer,
        options?: { url?: string }
    ) {
        this.controllerCreator = controllerCreator;
        this.di = di;
        this.options = options;
    }
    controllerCreator: InstanceCreator<T>;
    di: DiContainer;
    options?: { url?: string };

    createRouteController = <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const name = constructor.name
        const {options} = this;

        let parentUrl = join(options?.url)
        const meta = getMappingMeta<T>(constructor)

        const router: CoreRoute<T>[] = meta.map(metaI => {
            const {propertyKey, options} = metaI;
            const {url} = options
            const isRegExp = url instanceof RegExp;
            let combinedUrl = isRegExp ? url : join(parentUrl, url);

            return {
                ...options,
                url: combinedUrl,
                validator: (url: string) => url && url.startsWith(parentUrl),
                executorName: propertyKey,
                executor: () => {
                    throw `Unsupported Yet ${name} ${propertyKey}`
                }
            }
        })

        const routeCtrl: RouteCtrl<T> = {
            router,
            name,
            constructor,
            url: parentUrl as string,
            init: async () => {
                const ctrlInstance = await this.controllerCreator.instantiate(this.di);
                routeCtrl.router.forEach(routeI => {
                    const {executorName} = routeI;
                    routeI.executor = (ctrlInstance as any)[executorName] as Function;
                })
                return {
                    routes: routeCtrl.router,
                    ctrlInstance: ctrlInstance,
                }
            }
        }
        return routeCtrl
    }
}
