<script setup lang="ts">
import { Toaster } from './components/ui/sonner';
import 'vue-sonner/style.css';
</script>

<template>
  <main class="relative pt-4 sm:pt-0 min-h-screen flex flex-col items-center sm:justify-center">
    <RouterView />
    <div class="absolute -z-10 inset-0 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-size-[10px_10px] opacity-10"></div>
  </main>
  <Toaster position="top-center" richColors />
</template>
