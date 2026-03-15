<template>
    <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Create an account</h2>
        <p class="text-gray-500 text-sm mb-6">Start managing your bookings today</p>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First name</label>
                    <input v-model="form.firstName" type="text" required
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="John" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                    <input v-model="form.lastName" type="text" required
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="Doe" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="form.email" type="email" required
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="you@example.com" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input v-model="form.password" type="password" required
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="••••••••" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                <select v-model="form.role"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition">
                    <option value="client">Client — I want to book services</option>
                    <option value="manager">Manager — I want to manage a business</option>
                </select>
            </div>

            <button type="submit" :disabled="loading"
                class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-primary-600 font-medium hover:underline">
                Sign in
            </NuxtLink>
        </p>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'client'
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
    loading.value = true
    error.value = ''

    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: form
        })
        await navigateTo('/auth/login')
    } catch (e: any) {
        error.value = e.data?.message || 'An error occurred'
    } finally {
        loading.value = false
    }
}
</script>