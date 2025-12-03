<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { encryptMessage, createShareableUrl } from '../lib/crypto';
import { toast } from 'vue-sonner'
import GitHubIcon from './GitHubIcon.vue';
import ShareIcon from './ShareIcon.vue';
import SpinnerIcon from './SpinnerIcon.vue';

const message = ref('');
const isEncrypting = ref(false);

async function shareMessage() {
  if (!message.value.trim()) return;
  
  isEncrypting.value = true;
  
  try {
    // Encrypt the message
    const { encrypted, key } = await encryptMessage(message.value);
    
    // Create shareable URL with encrypted data in fragment
    const url = createShareableUrl(encrypted, key);

    // Try to use native share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Secret Message",
          text: "I've sent you a secret message. Click to decrypt:",
          url,
        });
        toast.success('Message Encrypted!');
      } catch (err) {
        // User canceled or share failed
        if ((err as Error).name !== 'AbortError') {
          console.warn("Share canceled or failed", err);
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard! Share it with anyone.");
    }
    
    // Clear the message after sharing
    message.value = '';
  } catch (error) {
    console.error('Encryption error:', error);
    toast.error('Failed to encrypt message. Please try again.');
  } finally {
    isEncrypting.value = false;
  }
}
</script>

<template>
  <div class="px-2 sm:px-0 max-w-md w-full flex flex-col gap-2">
    <div class="mb-4 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">🔒 Hide My Message</h1>
      <p class="text-gray-600">Send encrypted messages that only the recipient can read</p>
    </div>

    <Textarea
      v-model="message"
      placeholder="Type your secret message here..."
      class="min-h-40 bg-white border-gray-300"
      :disabled="isEncrypting"
    />

    <Button
      :disabled="!message.trim() || isEncrypting"
      @click="shareMessage"
      class="w-full sm:ml-auto sm:w-fit flex items-center gap-1 bg-blue-400 hover:bg-blue-500 active:scale-95 transition-transform duration-75 ease-in-out"
    >
      <SpinnerIcon class="size-5" v-if="isEncrypting" />
      <ShareIcon class="size-5" v-else />
      <span>{{ isEncrypting ? 'Encrypting...' : 'Share' }}</span>
    </Button>

    <p class="text-sm text-gray-500 text-center mt-4">
      Your message is encrypted in your browser. The key never leaves your device.
    </p>


    <div class="relative mt-8 w-full sm:w-80 rounded-lg border border-gray-300 bg-white">
      <div class="absolute left-14 bottom-0 size-4 -translate-x-1/2 translate-y-1/2 rotate-45 transform border-r border-b border-gray-300 bg-white"></div>
      <p class="p-4 text-sm text-gray-500">
        I&apos;m open source! Please leave a star if you found me useful. ⭐
      </p>
    </div>

    <div class="ml-10.75 mt-4">
      <a 
        class="group"
        href="https://github.com/jakemackie/hidemymessage/"
        taget="_blank"
      >
        <GitHubIcon class="size-7 group-hover:rotate-12 group-hover:scale-105 transition-transform duration-300 ease-in-out" />
      </a>
    </div>
  </div>
</template>
