<script>
  import { setDescribe } from './lib/context';
  import { SUCCESS } from './lib/statuses';

  export let title;
  export let assert = null;
  export let prepare = null;
  export let timeout = null;

  let tests = [];
  let statuses = [];

  function addTest(test) {
    const entry = {
      test,
      status: null,
      unsubscribe: null,
    };
    entry.unsubscribe = test.status.subscribe((value) => {
      entry.status = value;
      tests = tests.slice();
    });
    tests = [...tests, entry];
    test.suggestConfig({ assert, prepare, timeout });
  }

  setDescribe({
    title,
    addTest,
  });

  $: testsCount = tests.length;
  $: successes = tests.filter((t) => t.status === SUCCESS).length;
</script>

<section>
  <header>
    <span class="status">{successes}/{testsCount}</span>
    <h2>{title}</h2>
  </header>
  <slot />
</section>

<style>
  header {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
  }

  .status {
    float: right;
    font-size: 1.5em;
  }
</style>
