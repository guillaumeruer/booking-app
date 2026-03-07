import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
	tenantId: mongoose.Types.ObjectId;
	name: string;
	type: "provider" | "room";
	capacity: number;
	isActive: boolean;
}

const ResourceSchema = new Schema<IResource>(
	{
		tenantId: {
			type: Schema.Types.ObjectId,
			ref: "Tenant",
			required: true,
		},
		name: { type: String, required: true, trim: true },
		type: { type: String, enum: ["provider", "room"], required: true },
		capacity: { type: Number, default: 1, min: 1 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

export default mongoose.models.Resource ||
	mongoose.model<IResource>("Resource", ResourceSchema);
