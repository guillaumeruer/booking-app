import Tenant from "../../models/Tenant";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({
			statusCode: 400,
			message: "Id or slug is required",
		});
	}

	const tenant = await Tenant.findOne({
		$or: [{ slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
		isActive: true,
	}).populate("ownerId", "email firstName lastName");

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	return { tenant };
});
