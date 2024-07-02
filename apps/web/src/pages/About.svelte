<script>
 import { RELEASES_URL, EARLIEST_VERSION } from '../lib/constants.js';
 import { onMount, afterUpdate } from 'svelte';
 import { isEmpty, mapValues, groupBy } from 'lodash-es';
 import dayjs from 'dayjs';
 import yaml from 'js-yaml';
 import { gte } from '../lib/semver.js'
 import { releaseJsonExists } from '../lib/utils.js'
 import {
   activeFilters,
   activeRelease,
     releases,
     latestVersion
 } from '../store';

 export let params;
 export let query;

 $: ({
     version,
     level,
     category,
     endpoint
 } = params);

 afterUpdate(async() => {
     if ($releases && isEmpty($releases)) {
       let releasesFromYaml = await fetch(`${RELEASES_URL}/releases.yaml`)
         .then(res => res.blob())
         .then(blob => blob.text())
         .then(yamlString => yaml.load(yamlString))
         .then(releases => releases.filter(({version}) => gte(version, EARLIEST_VERSION)))

       let releasesData = await releaseJsonExists(releasesFromYaml)
         .then(releases => {
           return mapValues(groupBy(releases, 'version'),
                            ([{version, release_date}]) => ({
                              release: version,
                              release_date: release_date == '' ? new Date() : release_date,
                              spec: '',
                              source: '',
                              endpoints: [],
                              tests: []
           }))
         });
         releases.update(rel => releasesData);
     }

     if (version === 'latest' || version == null) {
         version = $latestVersion;
     };
   activeFilters.update(af => ({
     ...af,
     version,
     level: '',
     category: '',
     endpoint: ''
   }))
   if (isEmpty($activeRelease.endpoints)) {
     let rel = await fetch(`${RELEASES_URL}/${version}.json`).then(res => res.json());
     releases.update(rels => {
       rels[version] = rel;
       return rels;
     });
   }
 });

 $: lastUpdate = $activeRelease
               ? dayjs($activeRelease.release_date).format('DD MMMM, YYYY')
               : '';
</script>

<svelte:head>
	<title>GatewaySnoop | About</title>
</svelte:head>
<h1>About Gatewaysnoop</h1>

<p>Gatewaysnoop tracks the testing and conformance coverage of various <a href="https://gateway-api.sigs.k8s.io/" target="_blank">Gateway API</a> implementations by analyzing the audit logs created by conformance test runs.</p>

<h2>How We gather our coverage</h2>

<h2>Additional Resources</h2>
<ul>
  <li><a href="https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports" target="_blank">Gateway-API Conformance Reports</a></li>
</ul>
