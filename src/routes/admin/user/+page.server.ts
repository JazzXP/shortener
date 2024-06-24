import { initDB } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const db = initDB();
	const users = db.getUsers();
	db.close();
	return {
		users
	};
};
