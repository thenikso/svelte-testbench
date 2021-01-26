<script>
  import { onMount } from 'svelte';
  import { getTest, setSection } from './lib/context';
  import Show from './Show.svelte';

  export let given;
  export let prepare = null;
  export let showPrepare = $$slots.prepared || false;

  const test = getTest(true);

  setSection({
    test,
    section: 'given',
  });

  let element;
  let prepareResult;

  const updatePrepared = (res) => {
    prepareResult = res;
  };

  onMount(() => {
    test.setActual(given, element, prepare, $$restProps, updatePrepared);
  });
</script>

<div bind:this={element}>
  <slot />
  {#if showPrepare && prepareResult}
    <div class="prepared">
      <h5>Prepared</h5>
      <div class="prepared-content">
        <slot name="prepared" prepared={prepareResult}>
          <Show element={prepareResult} />
        </slot>
      </div>
    </div>
  {/if}
</div>
