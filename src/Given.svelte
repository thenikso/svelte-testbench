<script>
  import { getTest, setSection } from './lib/context';

  export let actual;
  export let prepare = null;

  const test = getTest(true);

  setSection({
    test,
    section: 'given',
  });

  let element;

  $: if (actual && element) {
    test.setActual(actual, element, prepare);
  }
</script>

<div bind:this={element}>
  <slot />
</div>
