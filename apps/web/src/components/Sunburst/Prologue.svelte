<script>
 import dayjs from 'dayjs';
 import { takeRight } from 'lodash-es';
 import SectionHeader from '../SectionHeader.svelte';
 import { activeRelease, releases, versions, gatewayapis, implementations } from '../../store';

 const SPYGLASS_URL = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs'
 let releaseSwitch = false;
 let versionSwitch = false;
 let implementationSwitch = false;

 function capitalize(str) {
   return str.replace(/\b\w/, function(char) {
     return char.toUpperCase();
   });
 }


 $: ({
   release,
   release_date,
   sources
 } = $activeRelease);

 $: date = dayjs(release_date).format('DD MMMM, YYYY');

 const prettyPrintNumber = (num) => {
   let numbers = ['zero', 'one', 'two', 'three', 'four', 'five'];
   return numbers[Number(num)];
 }

 let currentRelease = $activeRelease.release;

 function findRelease(implementation) {
   return implementation.release === currentRelease;
 }

 let index = $implementations.findIndex(findRelease);
 let currentImplementation = $implementations[index];
 let gatewayAPIVersion = $gatewayapis[0].version;

</script>

{#if release}
  <SectionHeader title={""}>
    <h2>Gateway API {gatewayAPIVersion}
      <button on:click={() => versionSwitch = true}>switch version</button>
    </h2>
    {#if versionSwitch}
      <ul class='releases'>
      {#each $gatewayapis as gatewayapi}
        <li><a href={'/gatewayapi/'+gatewayapi.version} on:click={() => versionSwitch = false}>{gatewayapi.version}</a></li>
      {/each}
      </ul>
    {/if}
    <h2>{capitalize(currentImplementation.name)} {currentImplementation.version} Testing Coverage
      <button on:click={() => implementationSwitch = true}>switch implementation</button>
    </h2>
    {#if implementationSwitch}
      <ul class='releases'>
      {#each $implementations as current}
        <li><a rel="external" href={'/'+current.release+'/'} on:click={() => implementationSwitch = false}>{capitalize(current.name)} {current.version}</a></li>
      {/each}
      </ul>
    {:else}
      <em>Data comes from {prettyPrintNumber(sources.length)} e2e test suite {#if sources.length > 1}runs{:else}run{/if} from {date}:</em>
        <ul class='sources'>
          {#each sources as source}
            <li>
            <a href="{source}" title="spyglass link" target="_blank" rel="noreferrer noopener">
              {takeRight(source.split('/'), 2).join('/')}
            </a>
            </li>
          {/each}
        </ul>
    {/if}
    <p>This sunburst shows the testing coverage for the Kubernetes API, based on
    auditlog data pulled from e2e test runs. The endpoints are organized by
    level (alpha, beta, or stable), then category. The color of an endpoint
    indicates its level of coverage. Gray means no test coverage, faded coloring
    means its tested but not conformance tested, solid coloring means its tested
    and conformance tested.
    <p> You can click on any section of the sunburst to zoom into that region.
    Click into the center to zoom out one level</p>
  </SectionHeader>
{/if}


<style>
 ul.releases , ul.releases li {
   display: inline;
   margin-right: 1rem;
   padding-left: 0;
   margin-left: 0;
 }
 a:hover {
   background: aliceblue;
 }
 ul.sources {
   margin: 0;
   padding: 0;
   list-style-type: none;
 }
</style>
