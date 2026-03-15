<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-8">
                <span
                    class="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                    BookEase
                </span>
                <div class="flex items-center gap-6">
                    <NuxtLink to="/dashboard" class="text-sm font-medium transition"
                        :class="$route.path === '/dashboard' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'">
                        My businesses
                    </NuxtLink>
                    <NuxtLink to="/dashboard/bookings" class="text-sm font-medium transition"
                        :class="$route.path === '/dashboard/bookings' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'">
                        My bookings
                    </NuxtLink>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600">{{ authStore.user?.firstName }} {{ authStore.user?.lastName
                    }}</span>
                <button class="text-sm text-red-500 hover:underline" @click="authStore.logout">
                    Sign out
                </button>
            </div>
        </nav>
        <main class="max-w-7xl mx-auto px-6 py-8">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>