<script lang="ts">
import type { Question } from "../types/Types";


    export let question:Question;

    // Values that are passed in as props
    // are immediately available
    console.log({ question });
</script>

<h1>{question.htmlTitle}</h1>
<ul>
{#each question.answers as answer}
<li>{answer.text}</li>
{/each}
</ul>
