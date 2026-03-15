<template>
    <div>
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-500 mt-1">Welcome back, {{ user?.firstName }} !</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-sm font-medium text-gray-500">Total bookings</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-sm font-medium text-gray-500">Upcoming</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-sm font-medium text-gray-500">Cancelled</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard'
})

const { user } = useUserSession()
</script>