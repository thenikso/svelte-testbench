<script>
  import { getTest, setSection } from './lib/context';
  import { nodes, select } from './prepare';

  export let actual;
  export let prepare = nodes;

  const test = getTest(true);

  setSection({
    test,
    section: 'given',
  });

  let el;

  $: finalPrepare = typeof prepare === 'string' ? select(prepare) : prepare;

  $: if (actual && el && finalPrepare) {
    test.setActual(actual, el, finalPrepare);
  }
</script>

<div bind:this={el}>
  <slot />
</div>
