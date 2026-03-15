import Resource from "../../models/Resource";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const tenantId = getRouterParam(event, "tenantId");

	if (!tenantId) {
		throw createError({
			statusCode: 400,
			message: "Tenant id is required",
		});
	}

	const resources = await Resource.find({ tenantId, isActive: true }).sort({
		name: 1,
	});

	return { resources };
});
