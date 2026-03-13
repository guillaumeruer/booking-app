import Tenant from "../../models/Tenant";
import { requireUserSession } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireUserSession(event);

	if (user.role !== "super_admin") {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	const tenants = await Tenant.find().populate(
		"ownerId",
		"email firstName lastName",
	);

	return { tenants };
});
