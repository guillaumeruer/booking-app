import Booking from "../../../models/Booking";
import Tenant from "../../../models/Tenant";
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

	const bookings = await Booking.find({ tenantId })
		.populate("userId", "email firstName lastName")
		.populate("slotId", "startAt endAt capacity bookedCount")
		.sort({ createdAt: -1 });

	return { bookings };
});
