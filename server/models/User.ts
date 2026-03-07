import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	email: string;
	passwordHash: string;
	role: "super_admin" | "manager" | "client";
	firstName: string;
	lastName: string;
	createdAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		passwordHash: { type: String, required: true },
		role: {
			type: String,
			enum: ["super_admin", "manager", "client"],
			default: "client",
		},
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
	},
	{ timestamps: true },
);

export default mongoose.models.User ||
	mongoose.model<IUser>("User", UserSchema);
