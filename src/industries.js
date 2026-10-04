// Sector notes, written in Case Vault's own words from the IIMA Consult Prep Book 2026-27 industry reports
// (pp. 410-477). Facts and figures follow the report; sentences never copy it, and nothing is added that the
// report does not state. Figures are dated context for practice, never live market data, and the UI says so.
// Keep provenance here, not on the page.
import { INDUSTRIES_2026 } from './industries-2026.js'
import { INDUSTRIES_2026_B } from './industries-2026-b.js'
import { INDUSTRIES_2026_C } from './industries-2026-c.js'
import { INDUSTRIES_2026_D } from './industries-2026-d.js'
import { INDUSTRIES_2026_E } from './industries-2026-e.js'
import { INDUSTRIES_2026_F } from './industries-2026-f.js'
import { INDUSTRIES_2026_G } from './industries-2026-g.js'
import { INDUSTRIES_2026_H } from './industries-2026-h.js'
import { INDUSTRIES_2026_I } from './industries-2026-i.js'

export const INDUSTRY_SOURCES = {
  prep2026: { title: 'Consult Club, IIM Ahmedabad. Consult Prep Book 2026-27, industry reports', pages: '410-477' },
}
export const INDUSTRY_AS_OF = '2026-27'

export const INDUSTRIES = [
  ...INDUSTRIES_2026, ...INDUSTRIES_2026_B, ...INDUSTRIES_2026_C, ...INDUSTRIES_2026_D, ...INDUSTRIES_2026_E,
  ...INDUSTRIES_2026_F, ...INDUSTRIES_2026_G, ...INDUSTRIES_2026_H, ...INDUSTRIES_2026_I,
].sort((a, b) => a.name.localeCompare(b.name))
