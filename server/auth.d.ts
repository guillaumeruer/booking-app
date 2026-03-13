declare module "#auth-utils" {
	interface User {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		role: "super_admin" | "manager" | "client";
	}
}

export {};
