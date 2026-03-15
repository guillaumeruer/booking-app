import Slot from "../../../models/Slot";
import Tenant from "../../../models/Tenant";
import Resource from "../../../models/Resource";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({
			statusCode: 400,
			message: "Tenant id is required",
		});
	}

	// Find tenant by slug or ObjectId
	const tenant = await Tenant.findOne({
		$or: [{ slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
	});

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	const slots = await Slot.find({ tenantId: tenant._id, isActive: true })
		.populate("resourceId", "name type capacity")
		.sort({ startAt: 1 });

	return { slots };
});
