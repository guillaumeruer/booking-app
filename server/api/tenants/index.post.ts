import Tenant from "../../models/Tenant";
import { requireUserSession } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireUserSession(event);

	if (
		user.role !== "manager" &&
		user.role !== "super_admin"
	) {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	const body = await readBody(event);
	const { name, category, bookingType, slug } = body;

	if (!name || !category || !bookingType || !slug) {
		throw createError({
			statusCode: 400,
			message: "All fields are required",
		});
	}

	const existingTenant = await Tenant.findOne({ slug });
	if (existingTenant) {
		throw createError({ statusCode: 409, message: "Slug already in use" });
	}

	const tenant = await Tenant.create({
		ownerId: user.id,
		name,
		category,
		bookingType,
		slug,
	});

	return { tenant };
});
