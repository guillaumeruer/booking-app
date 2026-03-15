import Resource from "../../models/Resource";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({
			statusCode: 400,
			message: "Tenant id is required",
		});
	}

	const resources = await Resource.find({
		tenantId: id,
		isActive: true,
	}).sort({ name: 1 });

	return { resources };
});
