<script>
  import { getTest, setSection } from './context';
  import { nodes, select } from './prepare';

  export let expect;
  export let prepare = nodes;

  const test = getTest(true);

  setSection({
    test,
    section: 'should',
  });

  let element;

  $: finalPrepare = typeof prepare === 'string' ? select(prepare) : prepare;

  $: if (expect && element && finalPrepare) {
    test.setExpected(expect, element, finalPrepare);
  }
</script>

<div bind:this={element}>
  <slot />
</div>
