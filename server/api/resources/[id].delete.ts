import Resource from "../../models/Resource";
import Tenant from "../../models/Tenant";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({
			statusCode: 400,
			message: "Resource id is required",
		});
	}

	const resource = await Resource.findById(id);

	if (!resource) {
		throw createError({ statusCode: 404, message: "Resource not found" });
	}

	const tenant = await Tenant.findById(resource.tenantId);

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	if (tenant.ownerId.toString() !== user.id && user.role !== "super_admin") {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	await Resource.findByIdAndDelete(id);

	return { message: "Resource deleted successfully" };
});
