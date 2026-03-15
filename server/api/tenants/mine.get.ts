import Tenant from "../../models/Tenant";
import { requireAuth } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	const tenants = await Tenant.find({ ownerId: user.id }).sort({
		createdAt: -1,
	});

	return { tenants };
});
