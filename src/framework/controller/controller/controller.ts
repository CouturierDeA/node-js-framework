import {CoreRoute} from "../../app";
import {
    defineControllerInstanceCreator,
    defineControllerMeta
} from "../../utils/metadata";
import {instanceCreator} from "../../utils/instance-creator";
import {setupExecutorArguments} from "../controller";

export function ControllerDecorator(
    options?: {
        url?: string
    }
) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        defineControllerMeta(constructor, {
            url: options?.url || ''
        })
        defineControllerInstanceCreator(constructor, instanceCreator(
            constructor,
            (instance, propertyKey, args) => {
                const exec = (instance[propertyKey] as Function).bind(instance);
                instance[propertyKey] = setupExecutorArguments<T>(instance, propertyKey, exec, args)
            }
        ))
        return constructor;
    }
}


export type ControllerDecoratorOptions<T> = {}

export type RouteCtrlInitialized<T> = {
    routes: CoreRoute<T>[],
    ctrlInstance: {},
}

export type RouteCtrl<T> = {
    init: () => Promise<RouteCtrlInitialized<T>>,
    router: CoreRoute<T>[],
    name: string,
    constructor: T,
    url: string
}
