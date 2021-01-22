<script>
  import { getTest, setSection } from './lib/context';
  import resolvePrepare from './lib/resolvePrepare';

  export let expect;
  export let prepare = null;

  const test = getTest(true);

  setSection({
    test,
    section: 'should',
  });

  let element;

  $: if (expect && element) {
    test.setExpected(expect, element, resolvePrepare(prepare));
  }
</script>

<div bind:this={element}>
  <slot />
</div>
