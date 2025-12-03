<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { locale } = useI18n();

// Save language preference to localStorage whenever it changes
watch(locale, (newLocale) => {
  localStorage.setItem('language', newLocale);
});
</script>

<template>
  <div class="flex items-center gap-2">
    <label for="language-select" class="text-sm text-gray-600">🌐</label>
    <select 
      id="language-select"
      v-model="locale" 
      class="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer transition-colors"
    >
      <option value="en">English</option>
      <option value="fr">French</option>
    </select>
  </div>
</template>
