import {defineAutoWired, defineComponentDecorator, defineComponentInstanceCreator} from "../utils/metadata";
import {instanceCreator} from "../utils/instance-creator";
import {CREATED_HOOK_KEY} from '../symbols';

export type ComponentDecoratorOptions = {
    lazy?: boolean // Todo
}

export function Component(options?: ComponentDecoratorOptions) {
    return function Decorate<T extends { new(...args: any[]): {} }>(constructor: T) {
        defineComponentDecorator(constructor, options);
        defineComponentInstanceCreator(
            constructor,
            instanceCreator(constructor)
        )
    }
}

export function Created() {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata(CREATED_HOOK_KEY, target[propertyKey], target);
        target._$created = async function () {
            return target[propertyKey].call(...arguments);
        }
    };
}

export type AutowiredOptions = {
    constructorName: string,
    propertyKey: string,
}

export function Autowired() {
    return function (target: Object, propertyKey: string) {
        let type = Reflect.getMetadata('design:type', target, propertyKey);
        defineAutoWired(target.constructor, {
            constructorName: type.name,
            propertyKey
        })
    }
}
