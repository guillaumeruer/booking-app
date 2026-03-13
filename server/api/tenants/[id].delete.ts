import Tenant from "../../models/Tenant";
import { requireUserSession } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireUserSession(event);
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({ statusCode: 400, message: "Id is required" });
	}

	const tenant = await Tenant.findById(id);

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	if (
		tenant.ownerId.toString() !== user.id &&
		user.role !== "super_admin"
	) {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	await Tenant.findByIdAndDelete(id);

	return { message: "Tenant deleted successfully" };
});
