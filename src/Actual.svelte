<script>
  import { getTest, setSection } from './lib/context';

  export let given;
  export let prepare = null;

  const test = getTest(true);

  setSection({
    test,
    section: 'given',
  });

  let element;

  $: if (given && element) {
    test.setActual(given, element, prepare);
  }
</script>

<div bind:this={element}>
  <slot />
</div>
