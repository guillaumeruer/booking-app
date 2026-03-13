import Booking from "../../models/Booking";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	const bookings = await Booking.find({ userId: user.id })
		.populate("slotId", "startAt endAt capacity bookedCount")
		.populate("tenantId", "name slug category")
		.sort({ createdAt: -1 });

	return { bookings };
});
