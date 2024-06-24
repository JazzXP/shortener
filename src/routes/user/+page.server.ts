import { initDB } from '$lib';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

type ErrorResp = {
	oldPassword?: string;
	password?: string;
	passwordConfirm?: string;
	match?: boolean;
	incorrect?: boolean;
	missing?: boolean;
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const pOld = form.get('oldPassword');
		const p1 = form.get('password');
		const p2 = form.get('passwordConfirm');

		if (!p1 || !p2 || p1.toString() !== p2.toString()) {
			return fail<ErrorResp>(400, {
				password: p1?.toString() ?? '',
				passwordConfirm: p2?.toString() ?? '',
				match: true
			});
		}
		if (pOld && p1 && p2 && p1.toString() === p2.toString()) {
			const resp = initDB().updatePassword(pOld.toString(), p1.toString(), locals.user);
			if (!resp.success) {
				return fail<ErrorResp>(400, { oldPassword: pOld.toString(), incorrect: true });
			}

			return { success: true };
		}
		return fail<ErrorResp>(400, { oldPassword: pOld?.toString() ?? '', missing: true });
	}
};
