import Tenant from "../../models/Tenant";

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({ statusCode: 400, message: "Id is required" });
	}

	const tenant = await Tenant.findById(id);

	if (!tenant) {
		throw createError({ statusCode: 404, message: "Tenant not found" });
	}

	if (
		tenant.ownerId.toString() !== session.user.id &&
		session.user.role !== "super_admin"
	) {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	await Tenant.findByIdAndDelete(id);

	return { message: "Tenant deleted successfully" };
});
