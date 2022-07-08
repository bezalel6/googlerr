<style>

*{
    /* color:magenta; */
}

</style>
<script lang="ts">
import { onMount } from "svelte";
import {searchForSolution} from '../../src/solutions'
import type { LintingError, Message, Question } from "../types/Types";
import QuestionComponent from "./QuestionComponent.svelte";
    let data:({error:LintingError,found?:Question[]})|null = null
    onMount(()=>{
        window.addEventListener('message',event=>{
            const message = event.data as Message;
            switch(message.command){
                case 'search':{
                    console.log('got msg',message)
                    data= {error:message.value.errorMessage as LintingError};
                    searchForSolution(data.error).then(res=>{
                        console.log('%cSidebar.svelte line:21 res', 'color: #007acc;', res);
                        data = {error:data!.error,found:res}
                    })
                    break;
                }
            }
        })
    })

</script>
<!-- <div>{text}</div> -->
<!-- <input /> -->

{#if data==null}
     <div>no error</div>
{:else if  !data.found}
     <div>searching..</div>
{:else}
<ul>
{#each data.found as question}
<li>
    <QuestionComponent question={question}></QuestionComponent>
</li>
{/each}
</ul>
{/if}
<button on:click={()=>{
    tsvscode.postMessage({
        command:'alert',value:'alerting'
    })
}}>Google it</button>
