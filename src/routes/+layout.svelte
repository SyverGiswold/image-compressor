<script>
  import { onMount } from 'svelte';
  import ConsentForm from '$lib/components/ConsentForm.svelte';
  import ConsentManagerButton from '$lib/components/ConsentManagerButton.svelte';
  import { loadClarity } from '$lib/clarityLoader.js';
  
  onMount(() => {
    loadClarity();
  });
</script>

<ConsentManagerButton />
<ConsentForm />

<slot />