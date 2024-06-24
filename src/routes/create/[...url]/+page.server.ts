import type { PageServerLoad } from './$types';
import { generateShortName } from '$lib/util';

export const load: PageServerLoad = async ({ params, locals }) => {
	return generateShortName(params.url, locals.user);
};
