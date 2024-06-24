import { error, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const publicPaths = ['/login'];

const jwtPublicKey = path.resolve('') + '/keys/public-key.pem';

const isPathAllowed = (path: string) =>
	publicPaths.some((allowedPath) => path === allowedPath || path.startsWith(`${allowedPath}/`));

export const handle = async ({ event, resolve }) => {
	let user = null;
	if (event.cookies.get('user') != undefined && event.cookies.get('user') != null) {
		user = event.cookies.get('user') ?? '';
	}
	const token = event.cookies.get('jwt') ?? '';
	const url = new URL(event.request.url);
	if (!user && !isPathAllowed(url.pathname)) {
		redirect(302, '/login');
	}

	let admin = false;
	if (token) {
		const publicKey = fs.readFileSync(jwtPublicKey);
		try {
			const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as {
				user: string;
				admin?: boolean;
			};
			admin = payload.admin ?? false;
		} catch {
			error(401, 'Unauthorized');
		}
	}

	if (user) {
		event.locals.user = user;
		event.locals.admin = admin;
		event.locals.baseURL = `${url.protocol}//${url.host}`;

		if (url.pathname == '/login') {
			redirect(302, '/');
		}
	}

	const response = await resolve(event);

	return response;
};
