export const sleep = async (
    timeout: number = 0,
    tick?: (current: number) => number
) => {
    return new Promise<void>((resolve) => {
        let timerId: NodeJS.Timeout;
        if (tick) {
            let interval = tick(timeout);
            let current = timeout;
            timerId = setInterval(() => {
                current = current - interval;
                tick(current);
            }, interval);
        }
        setTimeout(() => {
            clearInterval(timerId);
            resolve();
        }, timeout);
    });
};
