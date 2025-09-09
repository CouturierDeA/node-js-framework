// type THeaders<T = string> = {
//     [key: string]: T
// }
//
// class Response {
//     _body?: any
//     _headers?: THeaders
//
//     body(body: any) {
//         this._body = body;
//         return this;
//     }
//
//     headers(headers: Map<keyof THeaders, THeaders[keyof THeaders]>) {
//         this._headers = this.mapToObject(headers);
//         return this;
//     }
//
//     mapToObject(map: Map<any, any>) {
//         const obj = {};
//         for(let prop of map){
//             obj[prop[0]] = prop[1];
//         }
//         return obj;
//     }
//     // mapToObject2(map: Map<any, any>) {
//     //     return Array.from(map).reduce((obj, [key, value]) => (
//     //         Object.assign(obj, {[key]: value}) // Be careful! Maps can have non-String keys; object literals can't.
//     //     ), {});
//     // }
//
// }
//
// class ResponseEntity {
//     private _headers = new Map<keyof THeaders, THeaders[keyof THeaders]>()
//     private _body;
//     private _cookies = new Map<string, string>()
//
//     public header(key: keyof THeaders, value: THeaders[keyof THeaders]): ResponseEntity {
//         this._headers.set(key, value);
//         return this;
//     }
//
//     public headers(headers: THeaders): ResponseEntity {
//         Object.keys(headers).forEach(key => {
//             this.header(key, headers[key])
//         })
//         return this;
//     }
//
//     body(data): Response {
//         this._body = data;
//         return this.build()
//     }
//
//     build(): Response {
//         return new Response()
//             .headers(this._headers)
//             .body(this._body)
//     }
// }
//
// const entity = new ResponseEntity()
// entity.header('content-type', 'application/json')
// entity.headers({
//     'content-type': 'application/json'
// })
