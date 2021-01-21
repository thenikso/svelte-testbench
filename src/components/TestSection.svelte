<script>
  export let title;
  export let collapsed = false;
</script>

<div class="test-section" class:collapsed>
  <header>
    <h4>{title}</h4>
    <span
      class="toggle-collapse show"
      on:click={() => {
        collapsed = false;
      }}>
      <svg
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06
          0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06
          0z"
        />
      </svg>
    </span>
    <span
      class="toggle-collapse hide"
      on:click={() => {
        collapsed = true;
      }}>
      <svg
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M3.22 9.78a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0l4.25
          4.25a.75.75 0 01-1.06 1.06L8 6.06 4.28 9.78a.75.75 0 01-1.06 0z"
        />
      </svg>
    </span>
  </header>
  <div class="test-section-container">
    <slot />
  </div>
</div>

<style>
  .test-section > header {
    display: flex;
    position: relative;
    padding: 10px 15px;
    background-color: #f6f8fa;
    border-top: 1px solid #e1e4e8;
    border-bottom: 1px solid #e1e4e8;
  }

  .test-section > header h4 {
    flex-grow: 1;
    display: inline-block;
    margin: 0 10px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1em;
  }

  .test-section > header .toggle-collapse {
    cursor: pointer;
  }

  .test-section > header .toggle-collapse.hide {
    fill: currentColor;
    color: #959da5;
  }

  .test-section > .test-section-container {
    padding: 10px 15px;
    background-color: white;
  }

  .test-section.collapsed > header {
    border-bottom: none;
  }

  .test-section:not(.collapsed) > header .toggle-collapse.show {
    display: none;
  }

  .test-section.collapsed > header .toggle-collapse.hide {
    display: none;
  }

  .test-section.collapsed > .test-section-container {
    display: none;
  }
</style>
