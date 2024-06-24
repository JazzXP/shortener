import { initDB } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = initDB();
	const links = db.getShortNamesForUser(locals.user);
	db.close();
	return {
		links
	};
};
