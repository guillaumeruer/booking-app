import Tenant from "../../models/Tenant";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const search = query.q as string;
	const category = query.category as string;

	const filter: any = { isActive: true };

	if (search) {
		filter.name = { $regex: search, $options: "i" };
	}

	if (category) {
		filter.category = category;
	}

	const tenants = await Tenant.find(filter)
		.select("name slug category bookingType")
		.sort({ name: 1 })
		.limit(20);

	return { tenants };
});
