<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import { createWebSocketStore } from '$lib/stores/createWebSocketStore';
  import WebSocketService from '$lib/services/WebSocketService';

  const user = crypto.randomUUID().split('-')[0];

  let wsService: WebSocketService;
  let chatStore: ReturnType<typeof createWebSocketStore>;
  let message = '';

  const sendMessage = () => {
    if (message.trim() && chatStore) {
      chatStore.sendMessage({ text: message, user, timestamp: Date.now() });
      message = '';
    }
  };

  onMount(() => {
    if (browser) {
      wsService = new WebSocketService('ws://localhost:8080');
      chatStore = createWebSocketStore(wsService);
    }
  });

  onDestroy(() => {
    if (chatStore) chatStore.destroy();
  });
</script>
<div class="flex flex-col h-full max-w-2xl mx-auto p-4 space-y-4">
  <Card class="flex-1 shadow-lg">
    <ScrollArea class="h-[500px] w-full pr-4">
      <CardContent class="pt-6 px-4">
        <div class="space-y-6">
          {#each $chatStore || [] as { text, user, timestamp }}
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-primary/10 p-4">
                <strong>{new Date(timestamp).toLocaleTimeString()} - {user}:</strong> {text}
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </ScrollArea>
  </Card>

  <div class="flex gap-3 pt-2">
    <Input
      bind:value={message}
      placeholder="Type a message..."
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
      class="flex-1"
    />
    <Button on:click={sendMessage} class="px-6">Send</Button>
  </div>
</div>
