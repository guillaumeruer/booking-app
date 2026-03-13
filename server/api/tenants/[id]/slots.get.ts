import Slot from "../../../models/Slot";

export default defineEventHandler(async (event) => {
	const tenantId = getRouterParam(event, "id");

	if (!tenantId) {
		throw createError({
			statusCode: 400,
			message: "Tenant id is required",
		});
	}

	const slots = await Slot.find({ tenantId, isActive: true })
		.populate("resourceId", "name type capacity")
		.sort({ startAt: 1 });

	return { slots };
});
