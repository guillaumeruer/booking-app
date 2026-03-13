import Slot from "../../models/Slot";
import Tenant from "../../models/Tenant";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({ statusCode: 400, message: "Slot id is required" });
	}

	const slot = await Slot.findById(id);

	if (!slot) {
		throw createError({ statusCode: 404, message: "Slot not found" });
	}

	const tenant = await Tenant.findById(slot.tenantId);

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	if (tenant.ownerId.toString() !== user.id && user.role !== "super_admin") {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	const body = await readBody(event);
	const { resourceId, startAt, endAt, capacity, isActive } = body;

	const updatedSlot = await Slot.findByIdAndUpdate(
		id,
		{
			resourceId,
			startAt: startAt ? new Date(startAt) : undefined,
			endAt: endAt ? new Date(endAt) : undefined,
			capacity,
			isActive,
		},
		{ new: true, runValidators: true },
	);

	return { slot: updatedSlot };
});
