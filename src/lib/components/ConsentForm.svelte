<script>
  import { onMount } from 'svelte';
  
  let consentStatus = 'unknown';
  let isLoading = true;
  
  function giveConsent() {
    consentStatus = 'accepted';
    localStorage.setItem('clarityConsent', 'accepted');
    window.location.reload();
  }

  function rejectConsent() {
    consentStatus = 'rejected';
    localStorage.setItem('clarityConsent', 'rejected');
  }
  
  onMount(() => {
    const storedConsent = localStorage.getItem('clarityConsent');
    if (storedConsent) {
      consentStatus = storedConsent;
    }
    isLoading = false;
  });
</script>

{#if !isLoading && consentStatus === 'unknown'}
  <div class="consent-form">
    <p>We use Microsoft Clarity to analyze how our website is used. This helps us improve your experience. Do you consent to the use of cookies for this purpose?</p>
    <button class="consent-button" on:click={giveConsent}>I Consent</button>
    <button on:click={rejectConsent}>I Do Not Consent</button>
  </div>
{/if}

<style>
  .consent-form {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--element-background);
    padding: 1rem;
    text-align: center;
    z-index: 100;
    box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.2);
  }

  p {
    margin-bottom: 1rem;
  }

  .consent-form button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    background-color: var(--element-background);
    color: var(--text-color);
    transition: background-color 0.2s ease;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }

  .consent-form button:hover {
    background-color: var(--hover-color);
  }
  

  .consent-form .consent-button {
    background-color: var(--primary-color);
    transition: background-color 0.2s ease
  }

  .consent-form .consent-button:hover {
    background-color: var(--primary-color-dark);
  }
  
</style>