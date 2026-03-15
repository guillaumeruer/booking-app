<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 text-white py-20 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-5xl font-bold mb-4">BookEase</h1>
        <p class="text-white/80 text-xl mb-10">Book your appointments and events in seconds</p>

        <div class="bg-white rounded-2xl shadow-xl p-2 flex gap-2">
          <input v-model="searchQuery" type="text" placeholder="Search a business..."
            class="flex-1 px-4 py-3 text-gray-900 rounded-xl focus:outline-none" @input="handleSearch" />
          <select v-model="categoryFilter" class="px-4 py-3 text-gray-600 rounded-xl focus:outline-none bg-gray-50"
            @change="handleSearch">
            <option value="">All categories</option>
            <option value="barbershop">Hair salon</option>
            <option value="cinema">Cinema</option>
            <option value="event">Event</option>
            <option value="other">Other</option>
          </select>
          <button
            class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition"
            @click="handleSearch">
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="max-w-5xl mx-auto px-6 py-12">
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>

      <div v-else-if="tenants.length === 0 && searched" class="text-center py-20">
        <p class="text-gray-500 text-lg">No business found.</p>
      </div>

      <div v-else-if="tenants.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">Search for a business to get started</p>
      </div>

      <div v-else>
        <p class="text-sm text-gray-400 mb-6">{{ tenants.length }} result(s)</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="tenant in tenants" :key="tenant._id" :to="`/booking/${tenant.slug}`"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition group">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 capitalize">
                {{ tenant.category }}
              </span>
              <span class="text-xs text-gray-400 capitalize">{{ tenant.bookingType === 'slot' ?
                'By appointment' : 'Byseat' }}</span>
            </div>
            <h3 class="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition">
              {{ tenant.name }}
            </h3>
            <p class="text-sm text-gray-400 mt-1">bookease.com/{{ tenant.slug }}</p>
            <p class="text-sm text-primary-600 font-medium mt-4">Book now →</p>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footer nav -->
    <div class="fixed bottom-6 right-6">
      <NuxtLink to="/dashboard"
        class="bg-white shadow-lg border border-gray-100 text-gray-700 font-medium px-5 py-3 rounded-full hover:shadow-xl transition text-sm">
        My dashboard →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const categoryFilter = ref('')
const tenants = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)

async function handleSearch() {
  loading.value = true
  searched.value = true

  try {
    const params: any = {}
    if (searchQuery.value) params.q = searchQuery.value
    if (categoryFilter.value) params.category = categoryFilter.value

    const data = await $fetch<{ tenants: any[] }>('/api/tenants/search', { query: params })
    tenants.value = data.tenants
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(handleSearch)
</script>