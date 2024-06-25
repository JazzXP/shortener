import { initDB } from '$lib';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = initDB();
	const links = db.getShortNamesForUser(locals.user);
	db.close();
	return {
		links
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const db = initDB();
		const link = (await request.formData()).get('link');
		if (link) db.deleteLink(link.toString(), locals.user);
	}
};
