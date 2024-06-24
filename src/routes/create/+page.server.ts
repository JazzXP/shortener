import { generateShortName } from '$lib/util';
import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals, fetch }) => {
		const data = await request.formData();
		let url = data.get('url')?.toString() ?? '';
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			error(400, 'URL must start with http:// or https://');
		}
		// Check link exists
		let ok = true;
		try {
			const resp = await fetch(url);
			url = resp.url;
			ok = resp.ok;
		} catch {
			ok = false;
		}
		if (!ok) {
			error(400, 'Invalid link');
		}
		return {
			success: true,
			url: generateShortName(url, locals.user)
		};
	}
};
