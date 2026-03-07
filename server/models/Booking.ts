import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
	tenantId: mongoose.Types.ObjectId;
	slotId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	status: "pending" | "confirmed" | "cancelled";
	quantity: number;
	paymentStatus: "none" | "pending" | "paid";
	stripeSessionId?: string;
}

const BookingSchema = new Schema<IBooking>(
	{
		tenantId: {
			type: Schema.Types.ObjectId,
			ref: "Tenant",
			required: true,
		},
		slotId: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		status: {
			type: String,
			enum: ["pending", "confirmed", "cancelled"],
			default: "pending",
		},
		quantity: { type: Number, required: true, min: 1 },
		paymentStatus: {
			type: String,
			enum: ["none", "pending", "paid"],
			default: "none",
		},
		stripeSessionId: { type: String },
	},
	{ timestamps: true },
);

export default mongoose.models.Booking ||
	mongoose.model<IBooking>("Booking", BookingSchema);
