<script setup lang="ts">
import { Toaster } from './components/ui/sonner';
import 'vue-sonner/style.css';
</script>

<template>
  <main class="pt-20 sm:pt-0 min-h-screen flex flex-col items-center sm:justify-center">
    <RouterView />
  </main>
  <!-- Mobile Toaster -->
  <Toaster class="sm:hidden" position="bottom-center" richColors />
  <!-- Desktop Toaster -->
  <Toaster class="hidden sm:block" position="top-center" richColors />
</template>
