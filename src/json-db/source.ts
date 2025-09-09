import {readFile, writeFile, watchFile, unwatchFile, Stats, readFileSync} from 'fs';
import {join} from 'path';

const dir = join(__dirname, '../../src/json-db', '/files')

export function read(fileName: string): Promise<string> {
    const path = join(dir, fileName);
    return new Promise((resolve, reject) => {
        readFile(path, 'utf8', (err, data: string) => {
            if (err) return reject(err);
            return resolve(data);
        })
    })
}

export function write(fileName: string, content): Promise<boolean> {
    const path = join(dir, fileName);
    return new Promise((resolve, reject) => {
        writeFile(path, content, err => {
            if (err) return reject(err);
            return resolve(true);
        })
    })
}

export function watch(fileName: string, callback: (curr: Stats, prev: Stats) => void) {
    const path = join(dir, fileName);
    watchFile(path, {persistent: false, interval: 0}, (curr: Stats, prev: Stats) => {
        callback(curr, prev);
    })
}

export function unwatch(fileName: string, callback: () => void) {
    const path = join(dir, fileName);
    unwatchFile(path, callback)
}

