export const useAuthStore = defineStore("auth", () => {
	const { user, loggedIn, clear, fetch } = useUserSession();

	async function login(email: string, password: string) {
		await $fetch("/api/auth/login", {
			method: "POST",
			body: { email, password },
		});
		await fetch();
	}

	async function register(data: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		role: string;
	}) {
		await $fetch("/api/auth/register", {
			method: "POST",
			body: data,
		});
	}

	async function logout() {
		await clear();
		await navigateTo("/auth/login");
	}

	return {
		user,
		loggedIn,
		login,
		register,
		logout,
	};
});
