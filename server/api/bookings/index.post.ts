import Booking from "../../models/Booking";
import Slot from "../../models/Slot";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const body = await readBody(event);
	const { slotId, quantity = 1 } = body;

	if (!slotId) {
		throw createError({ statusCode: 400, message: "Slot id is required" });
	}

	const slot = await Slot.findById(slotId);

	if (!slot || !slot.isActive) {
		throw createError({
			statusCode: 404,
			message: "Slot not found or inactive",
		});
	}

	const updatedSlot = await Slot.findOneAndUpdate(
		{ _id: slotId, bookedCount: { $lte: slot.capacity - quantity } },
		{ $inc: { bookedCount: quantity } },
		{ new: true },
	);

	if (!updatedSlot) {
		throw createError({
			statusCode: 409,
			message: "No availability for this slot",
		});
	}

	const booking = await Booking.create({
		tenantId: slot.tenantId,
		slotId,
		userId: user.id,
		quantity,
		status: "confirmed",
		paymentStatus: "none",
	});

	return { booking };
});
