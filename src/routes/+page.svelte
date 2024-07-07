<script>
  import { onMount } from "svelte";
  import Compressor from "compressorjs";

  let imageFile;
  let compressedImage = "";
  let compressionQuality = 0.8;
  let outputWidth = 0;
  let outputHeight = 0;
  let imageSize = "";
  let originalAspectRatio = 0;

  let showOptions = true;
  let dragActive = false;
  let viewMode = "fit";
  let uploadError = false;

  const handleImageUpload = (event) => {
    imageFile = event.target.files[0];
    uploadError = false;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalAspectRatio = img.width / img.height;
        compressImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const compressImage = () => {
    if (!imageFile) return;

    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
    ];
    if (!supportedTypes.includes(imageFile.type)) {
      uploadError = true;
      return;
    }

    new Compressor(imageFile, {
      quality: compressionQuality,
      mimeType: "image/webp",
      width: outputWidth || undefined,
      height: outputHeight || undefined,
      success(result) {
        compressedImage = URL.createObjectURL(result);
        updateImageSize(result);
      },
      error(err) {
        console.error("Compression error:", err);
      },
    });
  };

  const handleQualityChange = () => {
    compressImage();
  };

  const handleWidthChange = () => {
    if (outputWidth === 0) {
      outputHeight = 0;
    } else {
      outputHeight = Math.round(outputWidth / originalAspectRatio);
    }
    compressImage();
  };

  const handleHeightChange = () => {
    if (outputHeight === 0) {
      outputWidth = 0;
    } else {
      outputWidth = Math.round(outputHeight * originalAspectRatio);
    }
    compressImage();
  };

  const downloadImage = () => {
    if (!compressedImage) return;

    const imageName = imageFile.name.replace(/\.[^/.]+$/, "");
    const downloadLink = document.createElement("a");
    downloadLink.href = compressedImage;
    downloadLink.download = `${imageName}_compressed.webp`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const updateImageSize = (image) => {
    imageSize = `${(image.size / 1024).toFixed(2)} KB`;
  };

  let dragCounter = 0;

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter++;
    dragActive = true;
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      dragActive = false;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragActive = false;
    uploadError = false;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      imageFile = e.dataTransfer.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          originalAspectRatio = img.width / img.height;
          compressImage();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(imageFile);
    }
  };

  onMount(() => {
    document.addEventListener("dragover", (e) => e.preventDefault());
  });
</script>

<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="icon-menu" viewBox="0 0 24 24">
    <path d="M3 6h18v2H3V6zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
  </symbol>

  <symbol id="icon-upload" viewBox="0 0 24 24">
    <path
      d="M 11 11.363 L 11 19 L 13 19 L 13 11.363 L 16.3 14.663 L 17.7 13.263 L 12 7.563 L 6.3 13.263 L 7.7 14.663 L 11 11.363 Z"
    />
    <path
      d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v-2H3V5h18v12h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
    />
  </symbol>

  <symbol id="icon-download" viewBox="0 0 24 24">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </symbol>
</svg>

<main class="container">
  <aside class="sidebar" class:active={showOptions}>
    <button class="toggle-btn" on:click={() => (showOptions = !showOptions)}>
      <svg class="icon"><use xlink:href="#icon-menu" /></svg>
    </button>
    <div class="sidebar-content">
      <h2>Options</h2>
      <div class="sidebarImageOptions">
        <label for="quality"
          >Quality ({compressionQuality === 1
            ? "Lossless"
            : `${Math.round(compressionQuality * 100)}%`})</label
        >
        <input
          type="range"
          id="quality"
          min="0.01"
          max="1"
          step="0.01"
          bind:value={compressionQuality}
          on:input={handleQualityChange}
        />

        <label for="width">Width (px)</label>
        <input
          type="number"
          id="width"
          min="0"
          bind:value={outputWidth}
          on:input={handleWidthChange}
        />

        <label for="height">Height (px)</label>
        <input
          type="number"
          id="height"
          min="0"
          bind:value={outputHeight}
          on:input={handleHeightChange}
        />

        {#if imageSize}
          <p>Image Size: {imageSize}</p>
        {/if}

        <button
          class="download-btn"
          on:click={downloadImage}
          disabled={!compressedImage}
        >
          Download image
        </button>
      </div>
      <div class="sidebarViewOptions">
        <button on:click={() => (viewMode = "fit")}>Fit both</button>
        <button on:click={() => (viewMode = "actual")}>Full size</button>
        <button on:click={() => (viewMode = "width-100")}>Fit width</button>
        <button on:click={() => (viewMode = "height-100")}>Fit height</button>
      </div>
    </div>
  </aside>

  <section
    class="image-preview"
    class:drag-active={dragActive}
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    aria-label="Drag and drop image upload area"
  >
    {#if compressedImage}
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src={compressedImage} alt="Compressed image" class={viewMode} />
    {:else}
      <div class="placeholder">
        <svg class="icon"><use xlink:href="#icon-upload" /></svg>
        {#if uploadError}
          <p class="error-message">
            Unsupported file format. Please upload a JPG, PNG, GIF, WEBP or AVIF
            image.
          </p>
          <input
            type="file"
            accept="image/*"
            on:change={handleImageUpload}
            id="file-input"
          />
          <label for="file-input" class="file-input-label"
            >choose an image</label
          >
        {:else}
          <p>
            Drag and drop an image, or
            <input
              type="file"
              accept="image/*"
              on:change={handleImageUpload}
              id="file-input"
            />
            <label for="file-input" class="file-input-label"
              >choose an image</label
            >
          </p>
        {/if}
      </div>
    {/if}
  </section>
</main>

<style>
  @import "../reset.css";
  @import "../variable.css";

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    color: var(--text-color);
    background: var(--background-color);
    background-image: radial-gradient(
      var(--background-pattern-color) 1px,
      transparent 0
    );
    background-size: 40px 40px;
  }

  .sidebar,
  button,
  input {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    color: var(--text-color);
    background-color: var(--element-background);
  }

  #width,
  #height {
    font-size: 1rem;
    padding: 12px 24px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }

  button {
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  /* Container */
  .container {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  /* Sidebar */

  .sidebar,
  .sidebarImageOptions,
  .sidebarViewOptions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sidebarViewOptions {
    margin-top: 2rem;
  }

  .sidebar {
    width: 280px;
    background-color: var(--element-background);
    padding: 114px 2rem 2rem;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 10;
    max-height: 100%;
  }

  .sidebar-content {
    flex-grow: 1;
    overflow-y: auto;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .toggle-btn {
    position: absolute;
    top: 2rem;
    left: 2rem;
    padding: 8px;
    transition:
      background-color 0.2s ease,
      top 0.3s ease-in-out,
      left 0.3s ease-in-out;
  }

  .sidebar:not(.active) .toggle-btn {
    left: calc(-64px - 2rem);
  }

  .toggle-btn:hover {
    background-color: var(--hover-color);
  }

  .toggle-btn .icon {
    width: 48px;
    height: 48px;
  }

  /* Image Preview */
  .image-preview {
    width: 100%;
    display: grid;
    place-content: center;
    margin-right: 344px;
    padding: 24px;
    border-radius: 8px;
    transition:
      border-color 0.3s ease,
      margin 0.3s ease-in-out;
    border: 4px dashed transparent;
  }

  .sidebar:not(.active) ~ .image-preview {
    margin-right: 0;
  }

  .image-preview.drag-active {
    border-color: var(--primary-color);
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .placeholder .icon {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
  }

  .placeholder .file-input-label {
    color: var(--primary-color);
    text-decoration: underline;
  }

  img {
    max-width: calc(100vw - 360px);
    max-height: calc(100vh - 56px);
    object-fit: contain;
    border-radius: 8px;
    margin: auto;
  }

  img.actual {
    max-width: none;
    max-height: none;
  }

  img.width-100 {
    width: calc(100vw - 360px);
    height: auto;
    max-width: unset;
    max-height: unset;
  }

  img.height-100 {
    height: calc(100vh - 56px);
    width: auto;
    max-width: unset;
    max-height: unset;
  }

  /* Buttons */
  button {
    padding: 0.5rem 1rem;
    color: var(--text-color);
    background-color: var(--element-background);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.3s ease;
    display: flex;
  }

  button:hover {
    background-color: var(--hover-color);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
  }

  button:disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
  }

  .download-btn {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-color);
    border: none;
    transition: background-color 0.2s ease;
  }

  .download-btn:hover {
    background-color: var(--primary-color-dark);
  }

  .icon use {
    fill: var(--text-color);
  }

  /* File Input */
  input[type="file"] {
    display: none;
  }

  label[for="file-input"] {
    cursor: pointer;
  }

  /* Utility Classes */
  .hidden {
    display: none;
  }

  .error-message {
    color: var(--error-color, rgb(175, 24, 24));
    font-size: 0.9rem;
    margin-top: 8px;
  }

  @media screen and (max-width: 875px) {
    .sidebar {
      width: 100%;
      right: 0;
      top: unset;
      transform: translateY(100%);
    }

    .toggle-btn {
      top: 2rem;
      left: 2rem;
      right: unset;
    }

    .sidebar:not(.active) .toggle-btn {
      top: calc(-64px - 2rem);
      left: unset;
    }

    .image-preview {
      margin-right: unset;
    }

    img {
      max-height: calc(100vh - 48px);
      max-width: calc(100% - 48px);
    }
  }
</style>
