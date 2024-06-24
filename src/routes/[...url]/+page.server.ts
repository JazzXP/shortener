import { initDB } from '$lib';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const db = initDB();
	const url = db.getLinkFromShortName(params.url);
	db.close();
	if (url) {
		redirect(301, url.url);
	}
	return {
		message: 'Error'
	};
};
