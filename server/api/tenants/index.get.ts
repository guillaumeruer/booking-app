import Tenant from "../../models/Tenant";

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);

	if (session.user.role !== "super_admin") {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	const tenants = await Tenant.find().populate(
		"ownerId",
		"email firstName lastName",
	);

	return { tenants };
});
