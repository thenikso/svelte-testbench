<script>
  import { Suite, Describe, Test, Given, Should, waitOk, giveOk } from '../src';
  import Reveal from './Reveal.svelte';
</script>

<Test>
  <Given actual="a revealed content" prepare={[waitOk(), 'li']}>
    <Reveal after={1} on:reveal={giveOk()}>
      <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
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
</Test>
