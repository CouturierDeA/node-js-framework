import {
    ArgsInjectionOnConstructor,
    getArgumentInjectionsFromConstructor,
    getAutoWired,
    getMappingMeta
} from "./metadata";
import {DiContainer} from "../di/container";
import {CREATED_HOOK_KEY} from '../symbols';

export interface InstanceCreator<T> {
    instantiate: (di: DiContainer) => Promise<T>,
    constructorName: string
}

function selfish(target: unknown) {
    const cache = new WeakMap();
    const handler = {
        get(target, key) {
            const value = Reflect.get(target, key);
            if (typeof value !== 'function') {
                return value;
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind(target));
            }
            return cache.get(value);
        }
    };
    return new Proxy(target, handler);
}

export function instanceCreator<T extends { new(...args: any[]): {} }>(
    constructor: T,
    argumentsInjector?: (instance: T, key: string, args: ArgsInjectionOnConstructor<T>['args']) => void
): InstanceCreator<T> {
    const wires = getAutoWired(constructor);
    const mappings = getMappingMeta(constructor);
    const argInjections = getArgumentInjectionsFromConstructor(constructor)
        .filter((inj, index, self) => {
            return self.findIndex(s => s.propertyKey === inj.propertyKey) === index
        })

    const instantiate = async (di: DiContainer) => {
        const instance = new constructor() as T;
        const instanceProxy = selfish(instance);
        wires.forEach((wire, index) => {
            const {propertyKey, constructorName} = wire
            Object.defineProperty(instance, propertyKey, {
                get() {
                    return di.getInstance(constructorName)
                }
            })
        });
        mappings.forEach(mapping => {
            const {propertyKey} = mapping;
            instance[propertyKey] = instance[propertyKey].bind(instance)
        })
        if (argumentsInjector) {
            argInjections.forEach(inj => {
                const {propertyKey, args} = inj;
                argumentsInjector(instance, propertyKey, args)
            })
        }
        const createdHook: Function = Reflect.getOwnMetadata(CREATED_HOOK_KEY, constructor.prototype);
        await createdHook?.apply(instanceProxy, [instanceProxy]);

        return instanceProxy;
    }

    return {
        instantiate,
        constructorName: constructor.name
    }
}
