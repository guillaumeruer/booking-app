<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12 px-6">
            <div class="max-w-4xl mx-auto">
                <NuxtLink to="/" class="text-white/70 hover:text-white text-sm transition mb-4 inline-block">
                    ← Back to BookEase
                </NuxtLink>
                <div v-if="loading" class="text-white/70">Loading...</div>
                <div v-else-if="tenant">
                    <p class="text-white/70 text-sm uppercase tracking-wide mb-1">{{ tenant.category }}</p>
                    <h1 class="text-3xl font-bold">{{ tenant.name }}</h1>
                    <p class="text-white/70 mt-2">{{ tenant.bookingType === 'slot' ?
                        'Book an appointment' : 'Reserve your seat' }}</p>
                </div>
            </div>
        </div>

        <div class="max-w-4xl mx-auto px-6 py-10">
            <div v-if="loading" class="text-gray-500">Loading...</div>

            <div v-else-if="!tenant" class="text-center py-20">
                <p class="text-gray-500 text-lg">This business was not found.</p>
            </div>

            <div v-else>
                <!-- No slots -->
                <div v-if="slots.length === 0" class="text-center py-20">
                    <p class="text-gray-500 text-lg">No availability at the moment.</p>
                </div>

                <!-- Slots list -->
                <div v-else class="space-y-4">
                    <h2 class="text-lg font-bold text-gray-900 mb-6">Available slots</h2>
                    <div v-for="slot in slots" :key="slot._id"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <p class="font-semibold text-gray-900">{{ slot.resourceId?.name }}</p>
                            <p class="text-sm text-gray-500 mt-1">
                                {{ formatDate(slot.startAt) }} → {{ formatDate(slot.endAt) }}
                            </p>
                            <p class="text-sm text-gray-400 mt-1">
                                {{ slot.capacity - slot.bookedCount }} place(s) remaining
                            </p>
                        </div>
                        <button :disabled="slot.capacity - slot.bookedCount === 0"
                            class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            @click="selectSlot(slot)">
                            {{ slot.capacity - slot.bookedCount === 0 ? 'Full' : 'Book' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Booking confirmation modal -->
        <div v-if="selectedSlot" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="selectedSlot = null">
            <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Confirm your booking</h3>
                <p class="text-gray-500 text-sm mb-6">You are about to book the following slot :</p>

                <div class="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                    <p class="font-medium text-gray-900">{{ selectedSlot.resourceId?.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(selectedSlot.startAt) }} → {{
                        formatDate(selectedSlot.endAt) }}</p>
                    <p class="text-sm text-gray-500">{{ tenant?.name }}</p>
                </div>

                <div v-if="!loggedIn" class="bg-yellow-50 text-yellow-700 text-sm rounded-lg p-3 mb-6">
                    You need to be signed in to book.
                    <NuxtLink to="/auth/login" class="font-medium underline">Sign in</NuxtLink>
                </div>

                <div v-if="bookingError" class="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
                    {{ bookingError }}
                </div>

                <div class="flex gap-3">
                    <button
                        class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        @click="selectedSlot = null">
                        Cancel
                    </button>
                    <button :disabled="!loggedIn || bookingLoading"
                        class="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        @click="confirmBooking">
                        {{ bookingLoading ? 'Booking...' : 'Confirm' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { loggedIn } = useUserSession()

const tenant = ref<any>(null)
const slots = ref<any[]>([])
const loading = ref(true)
const selectedSlot = ref<any>(null)
const bookingLoading = ref(false)
const bookingError = ref('')

async function fetchData() {
    loading.value = true
    try {
        const [tenantData, slotsData] = await Promise.all([
            $fetch<{ tenant: any }>(`/api/tenants/${slug}`),
            $fetch<{ slots: any[] }>(`/api/tenants/${slug}/slots`),
        ])
        tenant.value = tenantData.tenant
        slots.value = slotsData.slots
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

function selectSlot(slot: any) {
    bookingError.value = ''
    selectedSlot.value = slot
}

async function confirmBooking() {
    if (!selectedSlot.value) return
    bookingLoading.value = true
    bookingError.value = ''

    try {
        await $fetch('/api/bookings', {
            method: 'POST',
            body: { slotId: selectedSlot.value._id, quantity: 1 }
        })
        selectedSlot.value = null
        await fetchData()
        await navigateTo('/dashboard/bookings')
    } catch (e: any) {
        bookingError.value = e.data?.message || 'An error occurred'
    } finally {
        bookingLoading.value = false
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