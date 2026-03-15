<template>
    <div
        class="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-white tracking-tight">BookEase</h1>
                <p class="text-white/70 mt-2">Your booking platform</p>
            </div>
            <div class="bg-white rounded-2xl shadow-2xl p-8">
                <slot />
            </div>
        </div>
    </div>
</template>