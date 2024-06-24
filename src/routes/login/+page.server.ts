import { initDB } from '$lib';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
const jwtPrivateKey = path.resolve('') + '/keys/private-key.pem';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		if (!username || !password) {
			error(400, 'Invalid data');
		}
		const db = initDB();
		const resp = db.validateUser(username.toString(), password.toString());
		db.close();

		if (!resp) {
			error(401, 'Unauthorised');
		}
		const privateKey = fs.readFileSync(jwtPrivateKey);
		cookies.set('user', resp.username, { path: '/' });
		const token = jwt.sign({ user: resp.username, admin: resp.admin }, privateKey, {
			algorithm: 'RS256',
			expiresIn: '1d'
		});
		cookies.set('jwt', token, {
			httpOnly: true,
			path: '/'
		});
		redirect(302, '/');
	}
};
