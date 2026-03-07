import mongoose, { Schema, Document } from "mongoose";

export interface ISlot extends Document {
	tenantId: mongoose.Types.ObjectId;
	resourceId: mongoose.Types.ObjectId;
	startAt: Date;
	endAt: Date;
	capacity: number;
	bookedCount: number;
	isActive: boolean;
}

const SlotSchema = new Schema<ISlot>(
	{
		tenantId: {
			type: Schema.Types.ObjectId,
			ref: "Tenant",
			required: true,
		},
		resourceId: {
			type: Schema.Types.ObjectId,
			ref: "Resource",
			required: true,
		},
		startAt: { type: Date, required: true },
		endAt: { type: Date, required: true },
		capacity: { type: Number, required: true, min: 1 },
		bookedCount: { type: Number, default: 0, min: 0 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

SlotSchema.path('bookedCount').validate(function (value: number) {
  return value <= this.capacity
}, 'bookedCount cannot exceed capacity')

export default mongoose.models.Slot ||
	mongoose.model<ISlot>("Slot", SlotSchema);
