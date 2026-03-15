<template>
    <div>
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p class="text-gray-500 mt-1">Welcome back, {{ authStore.user?.firstName }}!</p>
            </div>
            <NuxtLink to="/dashboard/tenants/create"
                class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition">
                + New business
            </NuxtLink>
        </div>

        <div v-if="tenantStore.loading" class="text-gray-500">Loading...</div>

        <div v-else-if="tenantStore.tenants.length === 0"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p class="text-gray-500 text-lg">You don't have any business yet.</p>
            <NuxtLink to="/dashboard/tenants/create"
                class="inline-block mt-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition">
                Create your first business
            </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="tenant in tenantStore.tenants" :key="tenant._id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-medium px-2.5 py-1 rounded-full"
                        :class="tenant.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                        {{ tenant.isActive ? 'Active' : 'Inactive' }}
                    </span>
                    <span class="text-xs text-gray-400 capitalize">{{ tenant.category }}</span>
                </div>
                <h3 class="font-bold text-gray-900 text-lg">{{ tenant.name }}</h3>
                <p class="text-sm text-gray-400 mt-1">bookease.com/{{ tenant.slug }}</p>
                <NuxtLink :to="`/dashboard/tenants/${tenant._id}`"
                    class="block mt-4 text-center text-sm text-primary-600 font-medium hover:underline">
                    Manage →
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
})

const authStore = useAuthStore()
const tenantStore = useTenantStore()

onMounted(async () => {
    await tenantStore.fetchMyTenants()
})
</script>