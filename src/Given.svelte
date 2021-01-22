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

  let el;

  $: if (actual && el && prepare) {
    test.setActual(actual, el, resolvePrepare(prepare));
  }
</script>

<div bind:this={el}>
  <slot />
</div>
