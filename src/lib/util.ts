import { initDB } from './db';

export const generateShortName = (url: string, user: string) => {
	const db = initDB();
	const shortName = db.generateShortName(url, user);
	db.close();
	return {
		shortName: shortName,
		url
	};
};
