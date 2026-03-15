<template>
    <div class="max-w-2xl mx-auto">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Create a business</h1>
            <p class="text-gray-500 mt-1">Set up your business on BookEase</p>
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-6">
            {{ error }}
        </div>

        <form class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
            @submit.prevent="handleSubmit">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Business name</label>
                <input v-model="form.name" type="text" required
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="My Hair Salon" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select v-model="form.category"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition">
                    <option value="barbershop">Hair salon / Barbershop</option>
                    <option value="cinema">Cinema</option>
                    <option value="event">Event</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Booking type</label>
                <div class="grid grid-cols-2 gap-4">
                    <label class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition"
                        :class="form.bookingType === 'slot' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'">
                        <input v-model="form.bookingType" type="radio" value="slot" class="hidden" />
                        <div>
                            <p class="font-medium text-gray-900">By time slot</p>
                            <p class="text-xs text-gray-500">Hair salon, doctor...</p>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition"
                        :class="form.bookingType === 'seat' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'">
                        <input v-model="form.bookingType" type="radio" value="seat" class="hidden" />
                        <div>
                            <p class="font-medium text-gray-900">By seat</p>
                            <p class="text-xs text-gray-500">Cinema, event...</p>
                        </div>
                    </label>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                    <span class="text-gray-400 font-normal ml-1">(public URL)</span>
                </label>
                <div class="flex items-center gap-2">
                    <span class="text-gray-400 text-sm">bookease.com/</span>
                    <input v-model="form.slug" type="text" required
                        class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="my-hair-salon" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cancellation deadline (hours)</label>
                <input v-model="form.cancellationHours" type="number" min="0"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
            </div>

            <button type="submit" :disabled="loading"
                class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Creating...' : 'Create business' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
})

const form = reactive({
    name: '',
    category: 'barbershop',
    bookingType: 'slot',
    slug: '',
    cancellationHours: 24
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
    loading.value = true
    error.value = ''

    try {
        await $fetch('/api/tenants', {
            method: 'POST',
            body: form
        })
        await navigateTo('/dashboard')
    } catch (e: any) {
        error.value = e.data?.message || 'An error occurred'
    } finally {
        loading.value = false
    }
}
</script>