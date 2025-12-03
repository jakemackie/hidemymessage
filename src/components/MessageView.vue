<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { decryptMessage, parseUrlFragment } from '../lib/crypto';
import { Button } from './ui/button';
import MessageForm from './MessageForm.vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const router = useRouter();
const decryptedMessage = ref('');
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const showDialog = ref(false);
const isCopied = ref(false);

onMounted(async () => {
  try {
    // Parse the URL fragment
    const hash = window.location.hash;
    const data = parseUrlFragment(hash);
    
    if (!data) {
      throw new Error('Invalid or missing encrypted data in URL');
    }
    
    // Decrypt the message
    const message = await decryptMessage(data.encrypted, data.key);
    decryptedMessage.value = message;
    showDialog.value = true;
  } catch (error) {
    hasError.value = true;
    errorMessage.value = error instanceof Error ? error.message : 'Failed to decrypt message';
    console.error('Decryption error:', error);
  } finally {
    isLoading.value = false;
  }
});

function copyToClipboard() {
  navigator.clipboard.writeText(decryptedMessage.value).then(() => {
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  });
}
</script>

<template>
  <div class="max-w-md w-full text-center">
    <div v-if="isLoading" class="space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
      <p class="text-gray-600">Decrypting your message...</p>
    </div>

    <div v-else-if="hasError" class="space-y-4">
      <div class="text-red-500 text-5xl">⚠️</div>
      <h1 class="text-2xl font-bold text-gray-900">Decryption Failed</h1>
      <p class="text-gray-600">{{ errorMessage }}</p>
      <Button @click="router.push('/')" class="bg-blue-400 hover:bg-blue-500 active:scale-95 transition-transform duration-75 ease-in-out">
        Create Your Own Message
      </Button>
    </div>

    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Secret Message</DialogTitle>
          <DialogDescription>
            This message was encrypted and shared securely.
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4">
          <div class="max-h-40 overflow-scroll p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-gray-900 whitespace-pre-wrap break-all">
              {{ decryptedMessage }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <Button 
              @click="copyToClipboard" 
              variant="outline"
              class="flex-1 cursor-copy active:scale-95 transition-transform duration-75 ease-in-out"
            >
              {{ isCopied ? 'Copied!' : 'Copy Message' }}
            </Button>
            <Button 
              @click="router.push('/')" 
              class="flex-1 bg-blue-400 hover:bg-blue-500 active:scale-95 transition-transform duration-75 ease-in-out"
            >
              Create Your Own
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <MessageForm v-if="!isLoading && !hasError" class="mt-8" />
  </div>
</template>
