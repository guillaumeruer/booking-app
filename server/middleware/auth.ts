export default defineEventHandler(async (event) => {
	const protectedRoutes = ["/api/tenants", "/api/slots", "/api/bookings"];

	const isProtected = protectedRoutes.some((route) =>
		event.path.startsWith(route),
	);

	if (!isProtected) return;

	const session = await getUserSession(event);

	if (!session.user) {
		throw createError({ statusCode: 401, message: "Unauthorized" });
	}
});
