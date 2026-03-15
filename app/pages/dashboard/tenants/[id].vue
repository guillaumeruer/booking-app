<template>
    <div>
        <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <NuxtLink to="/dashboard" class="text-gray-400 hover:text-gray-600 transition">
                    ← Back
                </NuxtLink>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ tenant?.name }}</h1>
                    <p class="text-gray-500 mt-1 text-sm">bookease.com/{{ tenant?.slug }}</p>
                </div>
            </div>
            <span class="text-xs font-medium px-2.5 py-1 rounded-full"
                :class="tenant?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                {{ tenant?.isActive ? 'Active' : 'Inactive' }}
            </span>
        </div>

        <div v-if="loading" class="text-gray-500">Loading...</div>

        <div v-else-if="!tenant" class="text-gray-500">Tenant not found.</div>

        <div v-else class="space-y-6">
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <p class="text-sm font-medium text-gray-500">Total bookings</p>
                    <p class="text-3xl font-bold text-gray-900 mt-2">{{ bookings.length }}</p>
                </div>
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <p class="text-sm font-medium text-gray-500">Active slots</p>
                    <p class="text-3xl font-bold text-gray-900 mt-2">{{ slots.length }}</p>
                </div>
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <p class="text-sm font-medium text-gray-500">Booking type</p>
                    <p class="text-3xl font-bold text-gray-900 mt-2 capitalize">{{ tenant.bookingType }}</p>
                </div>
            </div>

            <!-- Slots -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-900">Slots</h2>
                    <button
                        class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                        @click="showSlotForm = true">
                        + Add slot
                    </button>
                </div>

                <div v-if="slots.length === 0" class="text-center py-8 text-gray-400">
                    No slots yet. Add your first slot !
                </div>

                <div v-else class="space-y-3">
                    <div v-for="slot in slots" :key="slot._id"
                        class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                        <div>
                            <p class="font-medium text-gray-900">{{ slot.resourceId?.name }}</p>
                            <p class="text-sm text-gray-500">
                                {{ formatDate(slot.startAt) }} → {{ formatDate(slot.endAt) }}
                            </p>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="text-sm text-gray-500">{{ slot.bookedCount }} / {{ slot.capacity }}</span>
                            <button class="text-red-400 hover:text-red-600 text-sm transition"
                                @click="deleteSlot(slot._id)">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bookings -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 class="text-lg font-bold text-gray-900 mb-6">Recent bookings</h2>

                <div v-if="bookings.length === 0" class="text-center py-8 text-gray-400">
                    No bookings yet.
                </div>

                <div v-else class="space-y-3">
                    <div v-for="booking in bookings" :key="booking._id"
                        class="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                        <div>
                            <p class="font-medium text-gray-900">{{ booking.userId?.firstName }} {{
                                booking.userId?.lastName }}</p>
                            <p class="text-sm text-gray-500">{{ booking.userId?.email }}</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="text-xs font-medium px-2.5 py-1 rounded-full" :class="{
                                'bg-green-100 text-green-700': booking.status === 'confirmed',
                                'bg-red-100 text-red-600': booking.status === 'cancelled',
                                'bg-yellow-100 text-yellow-700': booking.status === 'pending'
                            }">
                                {{ booking.status }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add slot modal -->
        <div v-if="showSlotForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="showSlotForm = false">
            <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h3 class="text-lg font-bold text-gray-900 mb-6">Add a slot</h3>
                <form class="space-y-4" @submit.prevent="handleAddSlot">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Resource</label>
                        <select v-model="slotForm.resourceId" required
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition">
                            <option value="">Select a resource</option>
                            <option v-for="resource in resources" :key="resource._id" :value="resource._id">
                                {{ resource.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Start</label>
                        <input v-model="slotForm.startAt" type="datetime-local" required
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">End</label>
                        <input v-model="slotForm.endAt" type="datetime-local" required
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input v-model="slotForm.capacity" type="number" min="1" required
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button type="button"
                            class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            @click="showSlotForm = false">
                            Cancel
                        </button>
                        <button type="submit" :disabled="slotLoading"
                            class="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                            {{ slotLoading ? 'Adding...' : 'Add slot' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
})

const route = useRoute()
const tenantId = route.params.id as string

const tenant = ref<any>(null)
const slots = ref<any[]>([])
const bookings = ref<any[]>([])
const resources = ref<any[]>([])
const loading = ref(true)
const showSlotForm = ref(false)
const slotLoading = ref(false)

const slotForm = reactive({
    resourceId: '',
    startAt: '',
    endAt: '',
    capacity: 1
})

async function fetchData() {
    loading.value = true
    try {
        const [tenantData, slotsData, bookingsData, resourcesData] = await Promise.all([
            $fetch<{ tenant: any }>(`/api/tenants/${tenantId}`),
            $fetch<{ slots: any[] }>(`/api/tenants/${tenantId}/slots`),
            $fetch<{ bookings: any[] }>(`/api/tenants/${tenantId}/bookings`),
            $fetch<{ resources: any[] }>(`/api/resources/${tenantId}`),
        ])
        tenant.value = tenantData.tenant
        slots.value = slotsData.slots
        bookings.value = bookingsData.bookings
        resources.value = resourcesData.resources
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

async function handleAddSlot() {
    slotLoading.value = true
    try {
        await $fetch(`/api/tenants/${tenantId}/slots`, {
            method: 'POST',
            body: slotForm
        })
        showSlotForm.value = false
        await fetchData()
    } catch (e) {
        console.error(e)
    } finally {
        slotLoading.value = false
    }
}

async function deleteSlot(slotId: string) {
    if (!confirm('Delete this slot?')) return
    try {
        await $fetch(`/api/slots/${slotId}`, { method: 'DELETE' })
        await fetchData()
    } catch (e) {
        console.error(e)
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(fetchData)
</script>