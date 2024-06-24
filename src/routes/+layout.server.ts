export const load = async ({ locals }) => {
	return {
		user: locals.user,
		admin: locals.admin,
		baseURL: locals.baseURL
	};
};
