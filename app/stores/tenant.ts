export const useTenantStore = defineStore("tenant", () => {
	const tenants = ref<any[]>([]);
	const loading = ref(false);
	const error = ref("");

	async function fetchMyTenants() {
		loading.value = true;
		error.value = "";

		try {
			const data = await $fetch<{ tenants: any[] }>("/api/tenants/mine");
			tenants.value = data.tenants;
		} catch (e: any) {
			error.value = e.data?.message || "An error occurred";
		} finally {
			loading.value = false;
		}
	}

	async function createTenant(form: {
		name: string;
		category: string;
		bookingType: string;
		slug: string;
		cancellationHours: number;
	}) {
		await $fetch("/api/tenants", {
			method: "POST",
			body: form,
		});
		await fetchMyTenants();
	}

	return {
		tenants,
		loading,
		error,
		fetchMyTenants,
		createTenant,
	};
});
