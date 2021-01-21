<script>
  import TestSection from './components/TestSection.svelte';
  import { setTest } from './context';
  import { setTimeout } from './utils';
  import { TimeoutError } from './errors';
  import { equal } from './assert';

  export let assert = equal;
  export let timeout = 5000;

  let given;
  let actualContainer;
  let actualWrapper;
  let actualPrepare;
  let actualResult;

  let should;
  let expectedContainer;
  let expectedWrapper;
  let expectedPrepare;
  let expectedResult;

  let testStatus = 'preparing';

  setTest({
    setActual(str, wrapper, prepare) {
      if (actualWrapper && actualWrapper !== wrapper) {
        throw new Error('Actual already set');
      }
      given = str;
      actualWrapper = wrapper;
      actualPrepare = prepare;
    },
    setExpected(str, wrapper, prepare) {
      if (expectedWrapper && expectedWrapper !== wrapper) {
        throw new Error('Expected already set');
      }
      should = str;
      expectedWrapper = wrapper;
      expectedPrepare = prepare;
    },
  });

  $: if (
    actualContainer &&
    actualWrapper &&
    actualWrapper.parentElement !== actualContainer
  ) {
    actualContainer.appendChild(actualWrapper);
  }

  $: if (!actualResult && actualPrepare && actualWrapper) {
    actualResult = Promise.resolve().then(() => actualPrepare(actualWrapper));
  }

  $: if (
    expectedContainer &&
    expectedWrapper &&
    expectedWrapper.parentElement !== expectedContainer
  ) {
    expectedContainer.appendChild(expectedWrapper);
  }

  $: if (!expectedResult && expectedPrepare && expectedWrapper) {
    expectedResult = Promise.resolve().then(() =>
      expectedPrepare(expectedWrapper),
    );
  }

  $: testResult =
    actualResult &&
    expectedResult &&
    (timeout
      ? Promise.race([
          setTimeout(timeout).then(() =>
            Promise.reject(new TimeoutError(timeout)),
          ),
          Promise.all([actualResult, expectedResult]),
        ])
      : Promise.all([actualResult, expectedResult])
    )
      .then((res) => assert(...res))
      .then((res) => {
        testStatus = 'success';
        return res;
      })
      .catch((error) => {
        testStatus = 'fail';
        return Promise.reject(error);
      });

  $: if (testResult && testStatus === 'preparing') {
    testStatus = 'pending';
  }
</script>

<article class="test test-{testStatus}">
  <header>
    <div class="indicator">
      <svg
        height="16"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22
          9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
        />
      </svg>
    </div>
    <h3 class="test-title">Given {given}: {should}</h3>
  </header>
  <TestSection title="Actual">
    <div bind:this={actualContainer} />
  </TestSection>
  <TestSection title="Expected">
    <div bind:this={expectedContainer} />
  </TestSection>
  <footer>
    <div>
      <span class="test-result">{testStatus}</span>
      <h4>Result</h4>
    </div>
    {#if testResult}
      <div>
        {#await testResult}
          <!-- loading -->
        {:then result}
          <slot name="success" {result} />
        {:catch error}
          <slot name="fail" {error}>{error.message}</slot>
        {/await}
      </div>
    {/if}
  </footer>
  <div style="display: none"><slot /></div>
</article>

<style>
  .test {
    position: relative;
    overflow: hidden;
    margin: 20px 0;
    background-color: white;
    border: 1px solid #d1d5da;
    border-radius: 5px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
  }

  .test.test-pending {
    border-color: #dbab09;
  }

  .test.test-success {
    border-color: #2ea44f;
  }

  .test.test-fail {
    border-color: #d73a49;
  }

  .test > header {
    padding: 15px 15px 15px 55px;
    font-size: 13px;
    line-height: 1.4;
  }

  .test > header .actions {
    float: right;
  }

  .test > header .actions > button {
    display: inline-block;
    font-size: inherit;
    color: #0366d6;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    border: none;
    background: transparent;
    outline: none;
  }

  .test > header .actions > button:hover {
    text-decoration: underline;
  }

  .test > header h3 {
    margin: 0;
    font-weight: 500;
    font-size: 1.5em;
  }

  .test > header .indicator {
    float: left;
    margin-left: -40px;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 50%;
    background-color: #d1d5da;
    color: #ffffff;
  }

  .test.test-pending > header .indicator {
    background-color: #dbab09;
  }

  .test.test-success > header .indicator {
    background-color: #2ea44f;
  }

  .test.test-fail > header .indicator {
    background-color: #d73a49;
  }

  .test > header .indicator svg {
    display: block;
    margin-top: 6px;
    margin-right: auto;
    margin-left: auto;
    fill: currentColor;
  }

  /* Test results */

  .test > footer {
    border-top: 1px solid #e1e4e8;
    background-color: #fafbfc;
    padding: 15px;
  }

  .test > footer h4 {
    margin: 0 10px 5px 0;
    font-size: 1em;
  }

  .test-result {
    float: right;
  }
</style>