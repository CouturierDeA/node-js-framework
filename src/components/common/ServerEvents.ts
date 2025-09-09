import EventEmitter from "events";
import { Component} from "../../framework/component";
import {ResponseEntity} from "../../framework/entities/ResponseEntity";

@Component()
export class ServerEvents extends EventEmitter {
    static connections = 0

    public emitData<T>(eventName: string, data?: T) {
        this.send({
            eventName,
            data: data || {}
        })
    }

    public async init(
        response: ResponseEntity,
        onInit?: (se: ServerEvents) => void,
        onClose?: (se: ServerEvents) => void,
    ): Promise<ResponseEntity> {
        ServerEvents.connections = ServerEvents.connections + 1
        console.info(`inited; connections  ${ServerEvents.connections}; stream id ${response.id}`)

        response.sendHeaders({
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
        });
        const dataListener = (event: {
            eventName: string,
            data: any
        }) => {
            response.write(`event: ${event.eventName}\n`)
            response.write(`id: ${response.id}\n`)
            response.write(`data: ${event.data ? JSON.stringify(event.data) : ''}\n`)
            response.write(`\n`)
        }

        this.addListener('data', dataListener);
        onInit?.(this);

        response.on('close', () => {
            if (ServerEvents.connections) {
                ServerEvents.connections = ServerEvents.connections - 1
            }
            this.removeListener('data', dataListener);
            onClose?.(this);
            console.info(`destroyed; connections  ${ServerEvents.connections}; stream id ${response.id}`);
        })

        return response
    }

    private send = <T = any>(event: { eventName: string; data: T }) => {
        this.emit('data', event)
    }
}
