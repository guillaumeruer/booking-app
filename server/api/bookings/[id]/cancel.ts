import Booking from "../../../models/Booking";
import Slot from "../../../models/Slot";
import Tenant from "../../../models/Tenant";
import { requireAuth } from "../../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({
			statusCode: 400,
			message: "Booking id is required",
		});
	}

	const booking = await Booking.findById(id);

	if (!booking) {
		throw createError({ statusCode: 404, message: "Booking not found" });
	}

	const isOwner = booking.userId.toString() === user.id;
	const isTenantManager = await Tenant.findOne({
		_id: booking.tenantId,
		ownerId: user.id,
	});

	if (!isOwner && !isTenantManager && user.role !== "super_admin") {
		throw createError({ statusCode: 403, message: "Forbidden" });
	}

	if (booking.status === "cancelled") {
		throw createError({
			statusCode: 400,
			message: "Booking is already cancelled",
		});
	}

	const tenant = await Tenant.findById(booking.tenantId);
	const slot = await Slot.findById(booking.slotId);

	if (tenant && slot) {
		const cancellationDeadline = new Date(slot.startAt);
		cancellationDeadline.setHours(
			cancellationDeadline.getHours() - tenant.cancellationHours,
		);

		if (new Date() > cancellationDeadline) {
			throw createError({
				statusCode: 400,
				message: "Cancellation deadline has passed",
			});
		}
	}

	await Booking.findByIdAndUpdate(id, { status: "cancelled" });
	await Slot.findByIdAndUpdate(booking.slotId, {
		$inc: { bookedCount: -booking.quantity },
	});

	return { message: "Booking cancelled successfully" };
});
