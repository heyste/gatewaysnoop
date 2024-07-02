export const RELEASES_SITE = __app.env.RELEASE_SITE
  ?  `${__app.env.RELEASE_SITE}`
  :  'https://raw.githubusercontent.com';
console.log("RELEASES_SITE: ", RELEASES_SITE);
const head = process.env.HEAD;
export const RELEASES_URL = head
  ? `${RELEASES_SITE}/apisnoop/gatewaysnoop/${head}/resources/coverage`
  : `${RELEASES_SITE}/apisnoop/gatewaysnoop/main/resources/coverage`;
console.log("RELEASES_URL: ", RELEASES_URL)
export const PENDING_ENDPOINTS_URL = `${RELEASES_SITE}/kubernetes/kubernetes/master/test/conformance/testdata/pending_eligible_endpoints.yaml`;
export const INELIGIBLE_ENDPOINTS_URL = `${RELEASES_SITE}/kubernetes/kubernetes/master/test/conformance/testdata/ineligible_endpoints.yaml`;
// the earliest release we have test data for
export const EARLIEST_VERSION ='1.15.0';
