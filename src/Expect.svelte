<script>
  import { getTest, setSection } from './lib/context';

  export let should;
  export let prepare = null;

  const test = getTest(true);

  setSection({
    test,
    section: 'should',
  });

  let element;

  $: if (should && element) {
    test.setExpected(should, element, prepare, $$restProps);
  }
</script>

<div bind:this={element}>
  <slot />
</div>
