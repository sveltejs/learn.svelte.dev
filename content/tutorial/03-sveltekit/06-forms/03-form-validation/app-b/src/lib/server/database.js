// Dans une vraie application, cette donnée serait dans une base de données,
// plutôt qu'en mémoire. Mais pour le moment, nous allons tricher.
const db = new Map();

export function getTodos(userid) {
	if (!db.get(userid)) {
		db.set(userid, [
			{
				id: crypto.randomUUID(),
				description: 'Apprendre SvelteKit',
				done: false
			}
		]);
	}

	return db.get(userid);
}

export function createTodo(userid, description) {
	if (description === '') {
		throw new Error('une tâche doit avoir une description');
	}

	const todos = db.get(userid);

	if (todos.find((todo) => todo.description === description)) {
		throw new Error('les tâches doivent être uniques');
	}

	todos.push({
		id: crypto.randomUUID(),
		description,
		done: false
	});
}

export function deleteTodo(userid, todoid) {
	const todos = db.get(userid);
	const index = todos.findIndex((todo) => todo.id === todoid);

	if (index !== -1) {
		todos.splice(index, 1);
	}
}
