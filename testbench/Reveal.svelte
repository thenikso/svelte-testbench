<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let after = 1;

  const dispatch = createEventDispatcher();
  const placeholder = document.createComment('revealing');
  let el;
  let timer;

  function reveal() {
    clearTimeout(timer);
    placeholder.parentElement.insertBefore(el, placeholder);
    placeholder.remove();
    dispatch('reveal');
  }

  onMount(() => {
    el.parentElement.insertBefore(placeholder, el);
    el.remove();
    timer = setTimeout(reveal, after * 1000);
  });

  onDestroy(reveal);
</script>

<div bind:this={el}><slot /></div>
