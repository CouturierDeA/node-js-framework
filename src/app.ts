import { createSecureServer, SecureServerOptions } from 'http2';
import { getCredentials } from './cert.read';
import { init } from './app.init';
import dns from 'dns';
// sets 127.0.0.1 as default host instead of localhost
dns.setDefaultResultOrder('ipv4first');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const run = async (port = 4000) => {
    const secureServerOptions: SecureServerOptions = {
        ...getCredentials(),
        allowHTTP1: true,
    };
    const app = await init();

    const server = createSecureServer(
        secureServerOptions
        // (req, res) => app.onRequest(req, res)
    );
    server.on('stream', (stream, headers) => {
        app.onStream(stream, headers);
    });

    server.listen(port, () => {
        require('dns').lookup(
            require('os').hostname(),
            function (err, add, fam) {
                console.log(`Networking server address https://${add}:${port}`);
            }
        );
        console.log(`Server started on https://localhost:${port}`);
    });

    return {
        app,
        server,
    };
};

(async function () {
    await run();
})();
