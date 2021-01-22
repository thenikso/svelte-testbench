<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let after = 1;
  export let each = null;

  const dispatch = createEventDispatcher();
  const placeholder = document.createComment('revealing');
  let el;
  let timer;

  function reveal() {
    clearTimeout(timer);
    placeholder.parentElement.insertBefore(el, placeholder);
    placeholder.remove();
    //
    if (each) {
      const childs = Array.from(el.querySelectorAll(each));
      childs.forEach((c) => (c.style.display = 'none'));
      revealMore(childs);
    } else {
      dispatch('reveal');
    }
  }

  function revealMore(items) {
    const item = items.shift();
    item.style.display = '';
    if (items.length) {
      dispatch('almost', { still: items.length });
      setTimeout(() => revealMore(items), after * 1000);
    } else {
      dispatch('reveal');
    }
  }

  onMount(() => {
    el.parentElement.insertBefore(placeholder, el);
    el.remove();
    timer = setTimeout(reveal, after * 1000);
  });

  onDestroy(reveal);
</script>

<div bind:this={el}><slot /></div>
