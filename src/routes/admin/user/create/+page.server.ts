import { initDB } from '$lib';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const username = data.get('username');
		const password = data.get('password');
		const admin = data.get('admin');

		if (!username || !password) {
			return;
		}
		const db = initDB();

		db.addUser(username.toString(), password.toString(), admin !== null);
		db.close();
	}
};
