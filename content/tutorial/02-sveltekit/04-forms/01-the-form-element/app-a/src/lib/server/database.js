// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map();

export function getTodos(userid) {
	return db.get(userid);
}

export function createTodo(userid, description) {
	if (!db.has(userid)) {
		db.set(userid, []);
	}

	db.get(userid).push({
		id: crypto.randomUUID(),
		description,
		done: false
	});
}

export function updateTodo(userid, todoid, description) {
	const todos = db.get(userid);
	const todo = todos.find((todo) => todo.id === todoid);

	todo.description = description;
}

export function markTodo(userid, todoid) {
	const todos = db.get(userid);
	const todo = todos.find((todo) => todo.id === todoid);

	todo.done = false;
}

export function markDone(userid, todoid) {
	const todos = db.get(userid);
	const todo = todos.find((todo) => todo.id === todoid);

	todo.done = true;
}

export function deleteTodo(userid, todoid) {
	const todos = db.get(userid);
	const index = todos.findIndex((todo) => todo.id === todoid);

	todos.splice(index, 1);
}
