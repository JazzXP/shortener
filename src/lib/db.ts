import fs from 'fs';
import path from 'path';
import sql from 'better-sqlite3';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const defaultFilename = path.normalize(`${process.cwd()}/db/db.sqlite`);

export const dbExists = (filename: string = defaultFilename) =>
	fs.existsSync(path.dirname(filename));

export const initDB = (filename: string = defaultFilename) => {
	if (!dbExists(filename)) {
		fs.mkdirSync(path.dirname(filename), { recursive: true });
	}
	const newFile = !fs.existsSync(filename);
	const db = sql(filename);
	db.pragma('journal_mode = WAL');
	db.pragma('foreign_keys = ON');
	if (newFile) {
		console.log('Creating db');
		db.exec(`
      CREATE TABLE IF NOT EXISTS urls (shortName TEXT PRIMARY KEY, url TEXT);
      CREATE TABLE IF NOT EXISTS users(username TEXT PRIMARY KEY, password TEXT, admin INTEGER);
      CREATE TABLE IF NOT EXISTS user_urls(
        username TEXT,
        shortName TEXT,
        FOREIGN KEY(username) REFERENCES users,
        FOREIGN KEY(shortName) REFERENCES urls,
        PRIMARY KEY (username, shortName)
      );
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
      INSERT INTO users (username, password, admin) VALUES ('admin', '${bcrypt.hashSync('admin', 10)}', 1);
    `);
	}

	const changeSettings = (settings: Record<string, string>) => {
		const settingsStatement = db.prepare(
			'INSERT OR UPDATE INTO settings (key, value) VALUES = (?, ?)'
		);
		Object.entries(settings).forEach(([k, v]) => settingsStatement.run(k, v));
	};

	const close = () => db.close();

	const getUsers = () => {
		return db
			.prepare<never[], { username: string; admin: number }>('SELECT username, admin FROM users')
			.all();
	};

	const addUser = (username: string, password: string, admin: boolean) => {
		db.prepare<[string, string, number], never>(
			'INSERT INTO users (username, password, admin) VALUES (?, ?, ?)'
		).run(username, bcrypt.hashSync(password, 10), admin ? 1 : 0);
	};

	const validateUser = (username: string, password: string) => {
		const resp = db
			.prepare<
				[string],
				{ username: string; password: string; admin: number }
			>('SELECT username, password, admin FROM users WHERE username = ?')
			.get(username);
		if (bcrypt.compareSync(password, resp?.password ?? '')) {
			return {
				username: resp!.username,
				admin: resp!.admin
			};
		}
		return null;
	};

	const getPartialShortNames = (hashed: string) =>
		db
			.prepare<
				string,
				{ shortName: string; url: string }
			>('SELECT shortName, url FROM urls WHERE shortName LIKE ?')
			.all(`${hashed}%`);

	const getShortNamesForUser = (username: string) =>
		db
			.prepare<
				string,
				{ shortName: string; url: string }
			>('SELECT u.shortName, u.url FROM urls u, user_urls uu WHERE uu.shortName = u.shortName AND uu.username = ?')
			.all(username);

	const addShortName = (url: string, shortName: string) => {
		return db
			.prepare<[string, string], never>('INSERT INTO urls (url, shortName) VALUES (?, ?)')
			.run(url, shortName);
	};

	const addUserToExisting = (shortName: string, username: string) =>
		db
			.prepare<
				[string, string],
				never
			>('INSERT OR IGNORE INTO user_urls (shortName, username) VALUES (?, ?)')
			.run(shortName, username);

	const generateShortName = (url: string, user: string) => {
		const minLength = parseInt(process.env.MIN_LENGTH ?? '4', 10);
		const hasher = crypto.createHash('sha512');
		const hashed = hasher.update(url).digest().toString('base64url');
		const allVals = getPartialShortNames(hashed.substring(0, minLength));
		let found;
		if (allVals.length !== 1 || allVals[0].url !== url) {
			for (let i = minLength; i < hashed.length; i++) {
				const subHash = hashed.substring(0, i);
				found = allVals.find((val) => val.shortName === subHash);
				if (!found) {
					found = { url, shortName: subHash };
					break;
				}
			}
			addShortName(found!.url, found!.shortName);
		} else {
			found = allVals[0];
		}
		addUserToExisting(found!.shortName, user);

		return found!.shortName;
	};

	const getLinkFromShortName = (shortName: string) =>
		db.prepare<string, { url: string }>('SELECT url FROM urls WHERE shortName = ?').get(shortName);

	const updatePassword = (oldPassword: string, newPassword: string, username: string) => {
		if (validateUser(username, oldPassword)) {
			db.prepare<[string, string], never>('UPDATE users SET password = ? WHERE username = ?').run(
				username,
				bcrypt.hashSync(newPassword, 10)
			);
			return {
				success: true
			};
		}
		return {
			success: false,
			message: "Old password didn't match"
		};
	};

	const deleteLink = (shortName: string, username: string) => {
		console.log(shortName, username);
		const delStatement = db.prepare<[string, string], never>(
			'DELETE FROM user_urls WHERE shortName = ? AND username = ?'
		);
		const cleanupStatement = db.prepare(
			'DELETE FROM urls WHERE shortName NOT IN (SELECT shortName FROM user_urls)'
		);
		db.transaction(() => {
			delStatement.run(shortName, username);
			cleanupStatement.run();
		})();
	};

	return {
		database: db,
		changeSettings,
		close,
		getUsers,
		addUser,
		validateUser,
		getPartialShortNames,
		getShortNamesForUser,
		generateShortName,
		getLinkFromShortName,
		deleteLink,
		updatePassword
		// addShortName,
		// addUserToExisting
	};
};
