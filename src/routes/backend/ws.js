// import './websocket.js';
import { WebSocketServer } from 'ws';

// poor man's HMR, pending https://github.com/vitejs/vite/issues/7887
// @ts-expect-error
if (globalThis.__wss) globalThis.__wss.close();

const wss = new WebSocketServer({ port: 4567 });
globalThis.__wss = wss;

/** @type {Set<import('ws').WebSocket>} */
const connections = new Set();

wss.on('connection', (ws) => {
	connections.add(ws);

	ws.on('close', () => {
		connections.delete(ws);
	});
});

export const ready = new Promise((fulfil) => {
	wss.on('listening', () => {
		fulfil(undefined);
	});
});

/** @param {any} data */
export function broadcast(data) {
	for (const connection of connections) {
		connection.send(JSON.stringify(data));
	}
}
