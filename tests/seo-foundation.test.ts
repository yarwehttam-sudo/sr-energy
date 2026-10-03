import test from 'node:test';
import assert from 'node:assert/strict';
import { STATES } from '../lib/locations';
import {
  SERVICE_TERRITORIES,
  getLegacyUrlDisposition,
  isServiceTerritory,
} from '../lib/serviceTerritories';
import { CLAIMS_REGISTRY, validateClaimsRegistry } from '../lib/claimsRegistry';

const EXPECTED_CODES = [
  'CA', 'CO', 'CT', 'DE', 'IL', 'IA', 'MD', 'MI', 'MT', 'NE',
  'NH', 'NJ', 'OH', 'OR', 'PA', 'RI', 'TX', 'VA', 'WA', 'DC',
];

test('service-territory source contains exactly 19 states plus DC', () => {
  assert.deepEqual(SERVICE_TERRITORIES.map(({ code }) => code), EXPECTED_CODES);
  assert.equal(SERVICE_TERRITORIES.length, 20);
  assert.equal(new Set(EXPECTED_CODES).size, 20);
});

test('legacy location dataset remains intact and discrepancies are explicit', () => {
  const supportedLegacy = STATES.filter(({ abbr }) => isServiceTerritory(abbr));
  const unsupportedLegacy = STATES.filter(({ abbr }) => !isServiceTerritory(abbr));

  assert.equal(STATES.length, 30);
  assert.equal(supportedLegacy.length, 19);
  assert.deepEqual(
    unsupportedLegacy.map(({ abbr }) => abbr),
    ['AR', 'GA', 'HI', 'ME', 'MA', 'NV', 'NM', 'NY', 'UT', 'VT', 'WV'],
  );
  assert.equal(STATES.some(({ abbr }) => abbr === 'DC'), false);
});

test('legacy URL policy preserves Texas VPP and holds unsupported territories', () => {
  assert.equal(getLegacyUrlDisposition('TX', 'texas-vpp'), 'PRESERVE_CLAIMS_REVIEW');
  assert.equal(getLegacyUrlDisposition('CA'), 'PRESERVE_SUPPORTED');
  assert.equal(getLegacyUrlDisposition('UT'), 'HOLD_DATA_REQUIRED');
});

test('claims registry has unique ids and no unsupported approvals', () => {
  assert.deepEqual(validateClaimsRegistry(), []);
  assert.equal(new Set(CLAIMS_REGISTRY.map(({ id }) => id)).size, CLAIMS_REGISTRY.length);
  assert.ok(CLAIMS_REGISTRY.every(({ status }) => status === 'HOLD_DATA_REQUIRED'));
  assert.ok(CLAIMS_REGISTRY.every(({ sources }) => sources.length === 0));
  assert.ok(CLAIMS_REGISTRY.every(({ verifiedAt, reviewBy }) => verifiedAt === null && reviewBy === null));
});
