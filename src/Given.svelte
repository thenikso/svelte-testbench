<script>
  import { getTest, setSection } from './lib/context';
  import resolvePrepare from './lib/resolvePrepare';

  export let actual;
  export let prepare = null;

  const test = getTest(true);

  setSection({
    test,
    section: 'given',
  });

  let element;

  $: if (actual && element && prepare) {
    test.setActual(actual, element, resolvePrepare(prepare));
  }
</script>

<div bind:this={element}>
  <slot />
</div>
