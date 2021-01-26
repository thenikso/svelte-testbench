<script>
  import { onDestroy } from 'svelte';

  export let element;
  export let wrapped = false;

  let container;
  const comment = document.createComment('show DOM element');

  onDestroy(() => {
    if (!container.parentElement) {
      comment.parentElement.insertBefore(container, comment);
      comment.remove();
    }
  });

  $: if (container) {
    if (wrapped && comment.parentElement) {
      comment.parentElement.insertBefore(container, comment);
      comment.remove();
    } else if (container.parentElement) {
      container.parentElement.insertBefore(comment, container);
      container.remove();
    }
  }

  $: elements = (Array.isArray(element) ? element : [element])
    .map((e) => {
      if (typeof e === 'string') {
        return document.createTextNode(e);
      }
      return e;
    })
    .filter((e) => e instanceof Node);

  $: if (container) updateElements(elements);

  let currentElements;

  function updateElements(elements) {
    if (currentElements) {
      for (const c of currentElements) {
        c.remove();
      }
    }
    if (wrapped) {
      for (const e of elements) {
        container.appendChild(e);
      }
    } else {
      for (const e of elements) {
        comment.parentElement.insertBefore(e, comment);
      }
    }
    currentElements = elements.slice();
  }
</script>

<div bind:this={container} {...$$restProps} />
