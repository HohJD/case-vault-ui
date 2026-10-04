// Round figures candidates commonly use when sizing Indian markets. Taken from the cheat sheet and datasheet
// in the IIMA Consult Prep Book 2026-27 appendix (pp. 479-481), which marks them as approximate 2026 figures.
// Wording is Case Vault's own. Use them as starting assumptions to state and adjust, not as facts to quote.
export const ESTIMATION_ANCHORS = [
  {
    title: 'People and households',
    items: [
      ['India’s population', '~1.4-1.45 billion (world ~8 billion)'],
      ['Urban vs rural people', '~37% urban, ~63% rural'],
      ['Households', '~350 million, about 4 people each (3.7 urban, 4.4 rural)'],
      ['Households by tier', 'Tier 1 ~10%, Tier 2 ~15%, Tier 3 and below ~75%'],
      ['Nuclear vs joint homes', '~55% nuclear, ~45% joint'],
      ['Men vs women', 'Roughly half each (~940 women per 1,000 men)'],
    ],
  },
  {
    title: 'Age and income',
    items: [
      ['Age bands', '0-14: 25% · 15-24: 18% · 25-44: 30% · 45-59: 17% · 60+: 10%'],
      ['Income bands', 'Lower 20% · lower-middle 30% · middle 30% · upper-middle 15% · upper 5%'],
      ['Household income (yearly)', '~₹2.5 lakh overall: ~₹3.5 lakh urban, ~₹2 lakh rural'],
      ['Spending mix', 'About half on food, ~10% on travel; ~27% of income saved'],
      ['Literacy', '~75%'],
    ],
  },
  {
    title: 'Devices and ownership',
    items: [
      ['Any mobile phone', '~80% of people'],
      ['Smartphone', '~50% of people'],
      ['Internet users', '~55% of people'],
      ['TV', '~70% of households'],
      ['Laptop or computer', '~15%'],
      ['Two-wheeler / car', '~50% / ~8% of households'],
      ['Fridge / washing machine / AC', '~40% / ~15% / ~8% of households'],
      ['Bank account', '~80%'],
    ],
  },
  {
    title: 'Replacement cycles',
    items: [
      ['Smartphone', '~3 years'],
      ['Laptop', '~5 years'],
      ['Television', '~8 years'],
      ['Car', '~8-10 years'],
      ['Refrigerator', '~10 years'],
      ['LED bulb', '~2-3 years'],
    ],
  },
  {
    title: 'Cities',
    items: [
      ['Largest metros (millions)', 'Delhi 35 · Mumbai 22 · Kolkata 16 · Bengaluru 14 · Chennai 12 · Hyderabad 11'],
      ['People in the top 10 / 50 / 100 cities', '~135 million / ~220 million / ~255 million'],
    ],
  },
]
