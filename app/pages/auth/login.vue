<template>
    <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
        <p class="text-gray-500 text-sm mb-6">Sign in to your account</p>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
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

            <button type="submit" :disabled="loading"
                class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
            Don't have an account?
            <NuxtLink to="/auth/register" class="text-primary-600 font-medium hover:underline">
                Sign up
            </NuxtLink>
        </p>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

const form = reactive({
    email: '',
    password: ''
})

const loading = ref(false)
const error = ref('')

const authStore = useAuthStore()

async function handleSubmit() {
    loading.value = true
    error.value = ''

    try {
        await authStore.login(form.email, form.password)
        await navigateTo('/dashboard')
    } catch (e: any) {
        error.value = e.data?.message || 'An error occurred'
    } finally {
        loading.value = false
    }
}
</script>