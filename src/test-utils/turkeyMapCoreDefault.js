/** Vitest-only default-import interop for the core entry point. */
import * as turkeyMapCoreModule from 'turkey-map-react/lib/core.js';

const moduleExports = turkeyMapCoreModule.default ?? turkeyMapCoreModule;

export const useTurkeyMap = moduleExports.useTurkeyMap ?? turkeyMapCoreModule.useTurkeyMap;

export default moduleExports.default ?? moduleExports;
