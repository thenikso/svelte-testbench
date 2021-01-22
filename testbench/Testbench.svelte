<script>
  import {
    Suite,
    Describe,
    Test,
    Given,
    Should,
    Show,
    waitOk,
    giveOk,
    toCanvas,
    log,
    imageMatch,
  } from '../src';
  import Reveal from './Reveal.svelte';
</script>

<Test assert={imageMatch()}>
  <Given actual="a revealed content" prepare={[waitOk(), 'li', toCanvas()]}>
    <Reveal after={1} on:reveal={giveOk()}>
      <ul>
        <li>A</li>
        <li>B</li>
        <li>D</li>
      </ul>
    </Reveal>
  </Given>
  <Should expect="is properly revealed" prepare="ul > li">
    <ul>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </ul>
  </Should>
  <div slot="fail" let:error>
    {error.message}
    <Show element={error.diff} />
  </div>
</Test>
