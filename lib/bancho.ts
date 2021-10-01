import net from 'net';

module Bancho {
    let _socket: net.Socket | undefined;
    let write_lock = false;

    async function connect() {
        _socket = net.connect(13383, "127.0.0.1");
    }

    async function withSocketWriteLock<T>(f: (socket: net.Socket) => Promise<T>): Promise<T> {
        if (!_socket) {
            connect()
        }
        let retry_count = 0;
        while (write_lock) {
            await new Promise(r => setTimeout(r, 500));
            retry_count++
            if (retry_count >= 3) {
                throw new Error("Write lock was not released within 3 tries");
            }
        }
        write_lock = true;
        const v = f(_socket!);
        write_lock = false;
        return v;
    }

    async function receiveData(): Promise<Buffer> {
        if (!_socket) {
            connect()
        }
        return new Promise<Buffer>((resolve, _reject) => _socket!.on('data', data => {
            resolve(data)
        }))
    }

    export async function getUserCount(): Promise<number> {
        return await withSocketWriteLock(async (socket) => {
            const buffer = Buffer.alloc(2);
            buffer.writeUInt16LE(1); // Get user count

            socket.write(buffer);
            const response = await receiveData();
            const user_count = response.readUInt16LE();
            return user_count;
        });
    }
}
export default Bancho;