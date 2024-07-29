<!-- src/lib/components/ConsentManagerButton.svelte -->
<script>
  function resetConsent() {
    localStorage.removeItem('clarityConsent');
    window.location.reload();
  }
</script>

<button class="consent-manager-button" on:click={resetConsent}>
  Manage Cookie Consent
</button>

<style>
  .consent-manager-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px;
    background: var(--element-background);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 100;
    color: var(--text-color);
  }
</style>