import bcrypt from "bcryptjs";
import User from "../../models/User";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, password, firstName, lastName } = body;

	if (!email || !password || !firstName || !lastName) {
		throw createError({
			statusCode: 400,
			message: "All fields are required",
		});
	}

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw createError({ statusCode: 409, message: "Email already in use" });
	}

	const passwordHash = await bcrypt.hash(password, 12);

	const user = await User.create({
		email,
		passwordHash,
		firstName,
		lastName,
		role: "client",
	});

	return {
		statusCode: 201,
		user: {
			id: user._id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
		},
	};
});
