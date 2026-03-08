import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(): Promise<void> {
	if (isConnected) return;

	const mongoUri = process.env.MONGO_URI;

	if (!mongoUri) {
		throw new Error("MONGO_URI is not defined in environment variables");
	}

	await mongoose.connect(mongoUri);
	isConnected = true;
	console.log("MongoDB connected");
}
