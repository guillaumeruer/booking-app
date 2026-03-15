import Slot from "../../../models/Slot";
import Tenant from "../../../models/Tenant";
import Resource from "../../../models/Resource";
import { requireAuth } from "../../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const tenantId = getRouterParam(event, "id");

	if (!tenantId) {
		throw createError({
			statusCode: 400,
			message: "Tenant id is required",
		});
	}

	const tenant = await Tenant.findById(tenantId);

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	if (tenant.ownerId.toString() !== user.id && user.role !== "super_admin") {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	const body = await readBody(event);
	const { resourceId, startAt, endAt, capacity } = body;

	if (!resourceId || !startAt || !endAt || !capacity) {
		throw createError({
			statusCode: 400,
			message: "All fields are required",
		});
	}

	const resource = await Resource.findById(resourceId);

	if (!resource) {
		throw createError({ statusCode: 404, message: "Resource not found" });
	}

	if (capacity > resource.capacity) {
		throw createError({
			statusCode: 400,
			message: `Capacity cannot exceed resource capacity (${resource.capacity})`,
		});
	}

	const slot = await Slot.create({
		tenantId,
		resourceId,
		startAt: new Date(startAt),
		endAt: new Date(endAt),
		capacity,
	});

	return { slot };
});
