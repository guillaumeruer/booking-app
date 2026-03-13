import bcrypt from "bcryptjs";
import User from "../../models/User";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, password } = body;

	if (!email || !password) {
		throw createError({
			statusCode: 400,
			message: "Email and password are required",
		});
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw createError({ statusCode: 401, message: "Invalid credentials" });
	}

	const isValidPassword = await bcrypt.compare(password, user.passwordHash);
	if (!isValidPassword) {
		throw createError({ statusCode: 401, message: "Invalid credentials" });
	}

	await setUserSession(event, {
		user: {
			id: user._id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
		},
	});

	return {
		user: {
			id: user._id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
		},
	};
});
