<script>
  export let element;

  let container;

  $: if (container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    appendChilds(container, element);
  }

  function appendChilds(el, chi) {
    if (Array.isArray(chi)) {
      chi.forEach((c) => appendChilds(el, c));
    } else if (chi instanceof Node) {
      el.appendChild(chi);
    }
  }
</script>

<div bind:this={container} {...$$restProps} />
