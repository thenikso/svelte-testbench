<script>
  import {
    Suite,
    Describe,
    Test,
    Actual,
    Expect,
    Show,
    // asserts
    snapshotMatch,
    // prepares
    waitOk,
    giveOk,
    snapshot,
    log,
    snapshotOnTrigger,
    snapshotTrigger,
    action,
    dataURL,
    copy,
  } from '../src';
  import Reveal from './Reveal.svelte';

  const template = (imgs) =>
    imgs.map((src, i) => `<img alt="expected-${i}" src="${src}" />`).join('\n');
</script>

<Describe title="Examples" assert={snapshotMatch()}>
  <Test>
    <Actual given="a revealed content" prepare={[waitOk(), 'li', snapshot()]}>
      <Reveal each="li" after={1} on:reveal={giveOk()}>
        <ul>
          <li>A</li>
          <li>B</li>
          <li>C</li>
        </ul>
      </Reveal>
    </Actual>
    <Expect should="matches the snapshots" prepare="ul > li">
      <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
      </ul>
    </Expect>
    <div slot="fail" let:error>
      {error.message}
      <Show element={error.diff} />
    </div>
  </Test>

  <Test>
    <Actual
      given="a slowly revealed content"
      prepare={[
        snapshotOnTrigger(),
        waitOk(),
        action('copy', [dataURL(), log(), copy(template)]),
      ]}
      style="width: 300px"
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
    </Actual>
    <Expect should="match these images">
      <img
        alt="expected-0"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAASCAYAAADheuMcAAACS0lEQVR4Xu3av6vxURwH8PfNHd2kLqm7Slbp3hGZZEI3i40i2cliUTfFKIPFZmCQP0BSJr9GJYNFSUlhMSi37ylPPT2PUgb33PM+C+n4dj6vj96d7/l6Op/PZ3BQgAIUkEDgiYElQZe4RApQQAgwsPhDoAAFpBGQLrA+Pj4wHA6xWq1gsVikgeZCKUCB+wWkCqzZbAa73S6qLpfLSKVS9wvwChSggDQCUgVWPp9HLpeDzWaDwWDAYDCQBpoLpQAF7heQJrC0h5lWqxVOpxM+nw+xWAzz+Vx8xkEBCqghIE1gjUYjvL+/o9FowOPxwGw24+vrC9lsVo1OsUoKUECep4TpdBrFYhH7/R4vLy9il7VYLKCda3FQgAJqCDx0h9Xv9zGdThEKhfD6+npV/HQ64e3tDW63W+ywtFGr1RCNRjGZTOBwONToFqukgOICDwssLWi08yhteL1edDqdq63odrtijjaCwaB4XS6X4u8NmUwGhUJB8TayfAqoIfCwwGo2mwiHw0JZO49ar9dXxROJBKrVqji7MhqNf+a1Wi3xXtuB6XQ6NTrGKimgsMDDAmu32yEQCGA8HqNUKiEej/+3DcfjUQSadmZ1uR28TLzcFvZ6PbhcLoXbyNIpoIbAwwLrVt52uy2CTduRfX5+/vW1zWYDk8mEZDKJSqVy6yU5jwIUkFTgxwdWJBJBvV7H4XCAXq//h9nv90M7vN9ut3h+fpa0DVw2BShwi8CPD6xbiuAcClBADQEGlhp9ZpUU+BUCDKxf0UYWQQE1BL4BgevXy/zgdS0AAAAASUVORK5CYII="
      />
      <img
        alt="expected-1"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAkCAYAAAAzWQesAAAD/0lEQVR4Xu3dTSg1URgH8P/FwoIkn2UryQ4hKaSUrBA2kqJIFnakUCIplpJYWCiKhawskJSFfK+UfG2UlORjY0FXz1NX7/ty30YWc885/7Mhjds8v2f6N3PuzJlAMBgMgoMCFKCAAQIBBpYBXeIuUoACKsDA4oFAAQoYI2BcYBUWFmJ/fx+3t7dIT083Bpo7SgEK/F7AqMA6OztDdna2Vj05OYmurq7fC/ATKEABYwSMCqzh4WEMDg4iKysLCQkJ2NvbMwaaO0oBCvxewJjAki8zMzMzkZ+fj6qqKrS1teH8/Fz/xkEBCrghYExgHRwcoKCgAEtLSygvL0dqaipGR0fR19fnRqdYJQUoYM63hD09PRgfH8fz8zPi4+P1LOv6+hoyr8VBAQq4IeDrGdbOzg5OT09RV1eH5OTksOJvb2/IyMhAWVmZnmHJmJubQ2trK46OjpCbm+tGt1glBRwX8C2wJGhkPkpGRUUFNjc3w7Zia2tLt5FRW1urP29ubvT2ht7eXoyNjTneRpZPATcEfAus5eVlNDY2qrLMR93d3YUV7+jowMzMjM5dJSYmfm63srKiv8sZWHR0tBsdY5UUcFjAt8B6enpCTU0NDg8PMTExgfb29m/b8Pr6qoEmc1ahy8HQhqHLwu3tbZSWljrcRpZOATcEfAssr7yrq6sabHJGVl9f/9e/3d/fIyUlBZ2dnZiamvL6kdyOAhQwVCDiA6upqQkLCwt4eXlBXFzcF+bq6mrI5P3DwwNiYmIMbQN3mwIU8CIQ8YHlpQhuQwEKuCHAwHKjz6ySAlYIMLCsaCOLoIAbAgwsN/rMKilghQADy4o2sggKuCHAwHKjz6ySAlYIGBFYgUDgC3ZeXh4aGhogD0VHRUVZ0QwWQQEK/F/AqMCanZ3Vaq6urjA/P6/PE8qifv39/ewzBSjggIARgZWWlqYPPy8uLn62RG4UTUpKQklJid44ykEBCtgvYGxgSWtktYfHx0dcXl7a3ylWSAEKmLGA379nWO/v75AlZyorK7m8DA9iCjgkYMQZVmjSXZaXkbA6OTnRZwtbWlowPT2N2NhYh1rGUingroCvgeV1xdFQYDU3N2un5DLw+PhYJ92Hhob0TTocFKCA/QK+BdZPVhz9btJdFu3r7u7WZWV2d3dRVFRkf7dYIQUcF/AtsH6y4uh3gSV9k6AqLi7mS1UdP4hZvjsCvgWW1xVHpRXhAmtgYAAjIyNYW1vTFUk5KEABuwV8C6yfsIbmsEI3jso9WBsbG1hfX9flky8uLvTVXxwUoIDdAkYF1p+tyMnJ0ctBeZmqhBYHBShgv4ARgWV/G1ghBSjgRYCB5UWJ21CAAhEhwMCKiDZwJyhAAS8CHyz/rKTmRBrFAAAAAElFTkSuQmCC"
      />
    </Expect>
    <div slot="fail" let:error>
      <pre>{error.message}</pre>
      {#each error.errors as e}
        <pre>{e.message}</pre>
        <Show element={e.diff} />
      {/each}
    </div>
  </Test>
</Describe>
