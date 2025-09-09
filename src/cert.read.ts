import {readFileSync} from 'fs';
import {join} from 'path'

export function getCredentials() {
    const privateKey = readFileSync(join(__dirname, '../cert/server.key'), 'utf8');
    const certificate = readFileSync(join(__dirname, '../cert/server.crt'), 'utf8');
    return  {key: privateKey, cert: certificate};
}
