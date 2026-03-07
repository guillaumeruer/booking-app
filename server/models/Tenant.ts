import mongoose, { Schema, Document } from "mongoose";

export interface ITenant extends Document {
	ownerId: mongoose.Types.ObjectId;
	name: string;
	category: "barbershop" | "cinema" | "event" | "other";
	bookingType: "slot" | "seat";
	isActive: boolean;
	paymentEnabled: boolean;
	cancellationHours: number;
	slug: string;
}

const TenantSchema = new Schema<ITenant>(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true, trim: true },
		category: {
			type: String,
			enum: ["barbershop", "cinema", "event", "other"],
			required: true,
		},
		bookingType: { type: String, enum: ["slot", "seat"], required: true },
		isActive: { type: Boolean, default: false },
		paymentEnabled: { type: Boolean, default: false },
		cancellationHours: { type: Number, default: 24 },
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
	},
	{ timestamps: true },
);

export default mongoose.models.Tenant ||
	mongoose.model<ITenant>("Tenant", TenantSchema);
