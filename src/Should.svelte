<script>
  import { getTest, setSection } from './lib/context';

  export let expect;
  export let prepare = null;

  const test = getTest(true);

  setSection({
    test,
    section: 'should',
  });

  let element;

  $: if (expect && element) {
    test.setExpected(expect, element, prepare);
  }
</script>

<div bind:this={element}>
  <slot />
</div>
