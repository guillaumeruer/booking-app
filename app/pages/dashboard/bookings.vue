<template>
    <div>
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">My bookings</h1>
            <p class="text-gray-500 mt-1">All your upcoming and past reservations</p>
        </div>

        <div v-if="loading" class="text-gray-500">Loading...</div>

        <div v-else-if="bookings.length === 0"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p class="text-gray-500 text-lg">You don't have any bookings yet.</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="booking in bookings" :key="booking._id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                <div class="space-y-1">
                    <p class="font-bold text-gray-900">{{ booking.tenantId?.name }}</p>
                    <p class="text-sm text-gray-500">
                        {{ formatDate(booking.slotId?.startAt) }} → {{ formatDate(booking.slotId?.endAt) }}
                    </p>
                    <p class="text-sm text-gray-400 capitalize">{{ booking.tenantId?.category }}</p>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-xs font-medium px-2.5 py-1 rounded-full" :class="{
                        'bg-green-100 text-green-700': booking.status === 'confirmed',
                        'bg-red-100 text-red-600': booking.status === 'cancelled',
                        'bg-yellow-100 text-yellow-700': booking.status === 'pending'
                    }">
                        {{ booking.status }}
                    </span>
                    <button v-if="booking.status !== 'cancelled'"
                        class="text-red-400 hover:text-red-600 text-sm transition" @click="cancelBooking(booking._id)">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
})

const bookings = ref<any[]>([])
const loading = ref(true)

async function fetchBookings() {
    loading.value = true
    try {
        const data = await $fetch<{ bookings: any[] }>('/api/bookings/me')
        bookings.value = data.bookings
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

async function cancelBooking(bookingId: string) {
    if (!confirm('Cancel this booking?')) return
    try {
        await $fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' })
        await fetchBookings()
    } catch (e: any) {
        alert(e.data?.message || 'An error occurred')
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

onMounted(fetchBookings)
</script>