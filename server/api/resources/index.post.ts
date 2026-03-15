import Resource from "../../models/Resource";
import Tenant from "../../models/Tenant";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const body = await readBody(event);
	const { tenantId, name, type, capacity } = body;

	if (!tenantId || !name || !type) {
		throw createError({
			statusCode: 400,
			message: "All fields are required",
		});
	}

	const tenant = await Tenant.findById(tenantId);

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	if (tenant.ownerId.toString() !== user.id && user.role !== "super_admin") {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	const resource = await Resource.create({
		tenantId,
		name,
		type,
		capacity: type === "room" ? capacity : 1,
		isActive: true,
	});

	return { resource };
});
