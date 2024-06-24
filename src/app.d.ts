// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: string;
			admin: boolean;
			baseURL: string;
		}
		// interface PageData {}
		interface PageState {
			showModal: boolean;
		}
		// interface Platform {}
	}
}

export {};
