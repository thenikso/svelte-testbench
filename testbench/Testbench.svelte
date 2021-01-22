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
    snapshot,
    log,
    snapshotMatch,
    snapshotOnTrigger,
    snapshotTrigger,
    action,
    dataURL,
    copy,
  } from '../src';
  import Reveal from './Reveal.svelte';

  const template = (imgs) => `
  <div>
    ${imgs
      .map((src, i) => `<img alt="expected-${i}" src="${src}" />`)
      .join('\n')}
  </div>`;
</script>

<Test assert={snapshotMatch()}>
  <Given actual="a revealed content" prepare={[waitOk(), 'li', snapshot()]}>
    <Reveal each="li" after={1} on:reveal={giveOk()}>
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
  <div slot="fail" let:error>
    {error.message}
    <Show element={error.diff} />
  </div>
</Test>

<Test assert={snapshotMatch()}>
  <Given
    actual="a revealed content"
    prepare={[
      snapshotOnTrigger(),
      waitOk(),
      action('copy', [dataURL(), log(), copy(template)]),
    ]}
  >
    <Reveal
      each="li"
      after={1}
      on:almost={snapshotTrigger()}
      on:reveal={giveOk()}
    >
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
  <div slot="fail" let:error={err2}>
    <pre>{err2.message}</pre>
    <Show element={err2.diff} />
  </div>
</Test>
