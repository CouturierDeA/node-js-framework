import {Sandbox} from "../core/http-utils/http-utils";
import {ControllerDecorator} from './controller/controller'
import {
    ArgsInjectionOnConstructor,
    defineArgumentInjections,
    defineArgumentInjectionsOnConstructor,
    defineMappingMeta,
} from "../utils/metadata";
import {ApiException} from '../exceptions/exceptions';
import {getParamNames} from '../utils/getParamNames';
import {qsToJson, stringToJson} from "../dto/Serializable";

export const Controller = ControllerDecorator;
export type MappingType = 'executor' | 'middleware'

export interface ApplyMappingOptions {
    url: string | RegExp
    method: string,
    type: MappingType
}

export function RequestMiddleware(url: string, method: methodType | '*') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: method, type: 'middleware'
        })
    };
}

function applyMapping(target: any, propertyKey: string, descriptor: PropertyDescriptor, options: ApplyMappingOptions) {
    defineMappingMeta(
        target.constructor,
        propertyKey,
        options
    )
}

export type methodType = 'GET' | 'POST' | 'PUT' | 'UPDATE' | 'DELETE' | 'HEADERS' | 'OPTIONS'

export function RequestMapping(url: string | RegExp, method: methodType) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method, type: 'executor'
        })
    };
}

export function GetMapping(url: string | RegExp) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: "GET", type: 'executor'
        })
    };
}

export function PostMapping(url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: "POST", type: 'executor'
        })
    };
}

export function OptionsMapping(url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: "OPTIONS", type: 'executor'
        })
    };
}

export function HeadersMapping(url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: "HEADERS", type: 'executor'
        })
    };
}

export function PutMapping(url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: "PUT", type: 'executor'
        })
    };
}

export function PatchMapping(url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: "PATCH", type: 'executor'
        })
    };
}

export function PathVariable(key?: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        const serializer = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex]
        const keyName: string = key || Object.values(getParamNames(target[propertyKey]))[parameterIndex] || 'path'
        addArgInjector(
            target,
            propertyKey,
            parameterIndex,
            new ArgumentsInjector<Sandbox>(async (sandBox) => {
                return serializer(sandBox.params[keyName]);
            }));
    }
}

export function QueryParam(key?: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        const keyName: string = key || Object.values(getParamNames(target[propertyKey]))[parameterIndex]
        addArgInjector(
            target,
            propertyKey,
            parameterIndex,
            new ArgumentsInjector<Sandbox>(async (sandBox) => {
                return sandBox.query[keyName];
            }));
    }
}

export function QueryParams(options?: { key?: string, serializer?: StringConstructor | NumberConstructor }) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        const {key, serializer} = options || {};
        const defaultSerializer = serializer || String;
        const serialize = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
        const keyName: string = key || Object.values(getParamNames(target[propertyKey]))[parameterIndex]
        addArgInjector(
            target,
            propertyKey,
            parameterIndex,
            new ArgumentsInjector<Sandbox>(async (sandBox) => {
                let qs = sandBox.query[keyName]
                if (!qs) return qs;

                if (serialize.name !== 'Array') {
                    throw ApiException.internal(`QueryParams must be of array type, got ${serialize.name}`)
                }
                return qs ? new serialize(...qs?.map(q => defaultSerializer(q))) : qs;
            }));
    }
}


export function IncomingHeaders() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        addArgInjector(
            target,
            propertyKey,
            parameterIndex,
            new ArgumentsInjector<Sandbox>(async (sandBox) => {
                return sandBox.request.headers
            }));
    }
}


export function DeleteMapping(url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        applyMapping(target, propertyKey, descriptor, {
            url, method: 'DELETE', type: 'executor'
        })
    };
}

function addArgInjector<T>(target: any, propertyKey: string, parameterIndex: number, argInjector: ArgumentsInjector<T>) {
    defineArgumentInjections(
        target, propertyKey, parameterIndex, argInjector
    )
    defineArgumentInjectionsOnConstructor(target, propertyKey, parameterIndex, argInjector)
}

export type ArgumentInjectionsType<T> = {
    [key: string]: ArgumentsInjector<T>
}

export function setupExecutorArguments<T>(target: any, propertyKey: string, executor: (...args: any[]) => Promise<any>, args: ArgsInjectionOnConstructor<T>['args']): Function {
    let argumentInjections = args
    return async (...args: any[]) => {
        const sandbox = args[0];
        const injectionKeys = Object.keys(argumentInjections || {});
        const injectionResults = await Promise.all(
            injectionKeys.map((index) => argumentInjections[index].inject(sandbox))
        )
        const newArgs = [...args];
        injectionKeys.forEach((injectionArgumentKey, injectionArgumentIndex) => {
            newArgs[injectionArgumentKey] = injectionResults[injectionArgumentIndex];
        })

        return executor(...newArgs)
    }
}

function getRequestBody<T extends object>(serializer: (stream: string) => T = qsToJson) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        addArgInjector(
            target,
            propertyKey,
            parameterIndex,
            new ArgumentsInjector<Sandbox>(async (sandBox) => {
                let raw = await sandBox.getBodySafe();
                if (serializer) {
                    raw = await serializer(raw);
                }
                const dto = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
                if (dto) {
                    return new dto(raw);
                }
                return raw;
            }));
    }
}

export function RequestBody<T extends object>() {
    return getRequestBody<T>(stringToJson)
}

export function FormBody<T extends object>() {
    return getRequestBody<T>(qsToJson)
}

export function Request<T extends any>() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        addArgInjector(
            target,
            propertyKey,
            parameterIndex,
            new ArgumentsInjector<Sandbox>(async (sandBox) => {
                return sandBox.request
            }));
    }
}

export function Response() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        addArgInjector(
            target,
            propertyKey,
            parameterIndex,
            new ArgumentsInjector<Sandbox>(async (sandBox) => sandBox.response));
    }
}

export class ArgumentsInjector<T> {
    constructor(
        executor: (sandBox: T) => Promise<any>
    ) {
        this.inject = async (sandBox: T) => {
            return await executor(sandBox)
        }
    }

    inject: (sandBox: T) => Promise<any>
}
