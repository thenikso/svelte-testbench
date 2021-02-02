<script>
  import { onMount } from 'svelte';
  import { getTest, setSection } from './lib/context';

  export let should;
  export let prepare = null;

  const test = getTest(true);

  setSection({
    test,
    section: 'should',
  });

  let element;

  onMount(() => {
    test.setExpected(should, element, prepare, $$restProps);
  });
</script>

<div bind:this={element}>
  <slot>
    <div class="no-expected-content">
      No expected content. Add it to &lt;Expected&gt;...&lt;/Expected&gt;
    </div>
  </slot>
</div>

<style>
  .no-expected-content {
    opacity: 0.3;
  }
</style>
