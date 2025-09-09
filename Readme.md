# Custom Node.js Framework Prototype

This project is a prototype of a Node.js framework developed using TypeScript and decorators.
Inspired by frameworks like Java Spring and NestJS, it explores how to leverage decorators and metadata in TypeScript
to build a modular and extensible architecture.

The main goal was to experiment with decorating classes and methods, managing metadata,
and creating a structured approach to building server-side applications akin to popular frameworks.
The framework is built with minimal dependencies, ensuring a lightweight footprint.

Additionally, it includes support for Server Events API, enabling better real-time communication and interaction
between client and server.

Although this project is still in a rough, experimental stage with several architectural gaps and "leaking" abstractions,
it served as a valuable learning experience in designing and implementing such systems.

The code is a work-in-progress, with many areas for improvement and refinement.


1. install dependencies (if not installed)
``` bash
$ npm install 
```

2. Use existing, or generate a self-signed certificate. Here`s an example:

``` bash
mkdir -p cert
cd cert
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt

```

2. run tsc
``` bash
$ npm run compile 
```

3. open new terminal and serve app in dev mode (or use concurrently)
``` bash
$ npm run serve 
```
