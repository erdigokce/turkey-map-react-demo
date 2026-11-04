/**
 * Vitest-only interop shim.
 *
 * The linked turkey-map-react bundle is CommonJS without an `__esModule`
 * marker, so a default import resolves to the whole module object in Node.
 * Re-export the real component and hook from the deep entry point instead.
 */
import * as turkeyMapModule from 'turkey-map-react/lib/index.js';

const moduleExports = turkeyMapModule.default ?? turkeyMapModule;
const TurkeyMap = moduleExports.default ?? moduleExports;

export const useTurkeyMap = moduleExports.useTurkeyMap ?? turkeyMapModule.useTurkeyMap;

export default TurkeyMap;
