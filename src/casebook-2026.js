// Cases adapted from the IIMA Consult Prep Book 2026-27 and the HBS Management Consulting Club
// Case Interview Guide. Authored directly in tap form, so they have no legacy written version.
// Provenance stays in `pages` and `sourceNote` (not rendered). Added practice assumptions are labelled in `dataNote`.
const option = (id, label, feedback, value) => ({ id, label, feedback, ...(value === undefined ? {} : { value }) })
const part = (id, title, correct, options) => ({ id, title, correct, options })
const BUILD_PROMPT = 'Build the best-supported recommendation: choose an action, supporting evidence, and a risk or next step.'

export const CASES_2026 = [
  {
    id: 'urban-company-bottom-line', title: 'Breaking even at a home-services platform', category: 'Profitability', sector: 'Consumer tech', level: 'Foundation', focus: 'Add revenue streams before touching the two-sided model', pages: '49–50',
    brief: 'Urban Company, a home-services platform, wants to improve its bottom line and break even within a year. How should it go about it?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 4 “Urban Company”. Revenue mix and the plan wait-time figures are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('model', 'How the platform earns money on each side, what each vertical contributes, and the break-even target.', 'A two-sided platform has revenue on the customer and partner sides. The objective, break-even in a year, sets the bar for every idea.'),
        option('fee', 'By how much can we raise the convenience fee?', 'A fee rise assumes customers are not price sensitive, which is exactly what you need to check.'),
        option('cities', 'Which new cities should we launch in?', 'Expansion is a growth decision. The brief is to fix the bottom line of the existing business.'),
      ], correct: 'model', hint: 'Understand both sides of the platform and the target before choosing levers.', reveal: ['Beauty contributes 40% of revenue; cleaning and miscellaneous services contribute 30% each.', 'Revenue has been rising and costs falling faster, but the company is only just about to break even.', 'Customers pay per service plus a convenience fee; partners pay platform fees and buy consumables and tools through the platform.', 'Prepaid plans can cut the wait between booking and service from about 2 hours to under 15 minutes.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO most promising revenue levers to examine first.', correct: ['new-streams', 'frequency'], options: [
        option('new-streams', 'New streams: monetising usage data and advertising, which the platform does not earn from today.', 'The client earns only from services today. Data and advertising are untapped streams on a high-traffic platform.'),
        option('frequency', 'Recency, frequency, and monetary value: subscriptions and prepaid plans that lock in existing customers.', 'Prepaid plans raise retention and pull revenue forward, and subscribers get faster service.'),
        option('partner-fees', 'Raising the platform fee partners pay to stay listed.', 'Higher fees encourage disintermediation and slow partner sign-ups, hurting the network effect.'),
        option('cost-cuts', 'Cutting partner training and tool subsidies.', 'Quality is the platform’s promise; cutting the very costs that build it risks the revenue base.'),
      ], hint: 'Look for streams the platform does not use yet, then ways to deepen existing customers.', model: 'Bottom line improves through revenue or cost. Revenue splits into services (customer fees, convenience fee, prepaid plans, surge pricing) plus partner fees and consumables, and new streams such as data monetisation and advertising. Costs are dominated by training and attrition. Prioritise new streams and customer frequency over raising partner fees, which threatens the network.' },
      { kind: 'calculation', prompt: 'How many bookings a month does the platform need to break even?', unit: 'bookings per month', answer: 5e7 / 250, tolerance: 0.01, dataNote: 'Exercise assumptions: the source gives no figures. The platform earns a 20% commission on an average $1,000 service plus a $50 convenience fee per booking; monthly fixed costs are $50 million.', exhibit: [['Input', 'Value'], ['Average service price', '$1,000'], ['Commission rate', '20%'], ['Convenience fee per booking', '$50'], ['Monthly fixed costs', '$50 million']], hint: 'Contribution per booking = commission plus convenience fee. Break-even = fixed costs ÷ contribution.', working: 'Contribution per booking = 1,000 × 20% + 50 = $250. Break-even = $50,000,000 ÷ 250 = 200,000 bookings a month.', options: [
        option('breakeven', '200,000', 'Correct: $50 million ÷ $250 contribution per booking.', 200000),
        option('full-price', '50,000', 'That divides by the full $1,000 service price, forgetting the platform keeps only $250 a booking.', 50000),
        option('no-fee', '250,000', 'That forgets the $50 convenience fee: $50 million ÷ $200.', 250000),
      ] },
      { kind: 'choice', prompt: 'Why is raising partner platform fees a weak lever here?', options: [
        option('disintermediate', 'It pushes partners and customers to deal directly, shrinking the platform it relies on.', 'On a two-sided platform, pricing one side too hard breaks the network that creates the value.'),
        option('small', 'Partner fees are too small to matter.', 'They are a real stream. The problem is what the increase does to behaviour, not the size.'),
        option('illegal', 'Platform fees are regulated and cannot rise.', 'No regulation was mentioned. The constraint is commercial, not legal.'),
      ], correct: 'disintermediate', hint: 'Ask what partners do when the platform takes a bigger cut.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Pick the levers that add revenue without breaking the network.', model: 'Grow revenue through prepaid subscriptions and surge pricing, and open the unused data and advertising streams, while controlling training and attrition costs through better partner selection. On the exercise assumptions, break-even needs about 200,000 bookings a month at $250 contribution each, so plans that lift bookings and contribution both matter. Avoid raising partner fees, since disintermediation would break the marketplace.', parts: [
        part('action', 'Action', 'plans', [
          option('plans', 'Push prepaid plans and surge pricing, and pilot data and advertising revenue.', 'These add revenue on the customer side without weakening the partner network.'),
          option('fees', 'Raise partner platform fees across the board.', 'This risks disintermediation and slower partner growth, hurting the platform.'),
          option('cut-quality', 'Cut training and tool subsidies to save costs.', 'Quality is the value proposition; cutting it attacks the reason customers come.'),
        ]),
        part('evidence', 'Supporting evidence', 'bookings', [
          option('bookings', 'Break-even needs about 200,000 bookings a month at $250 contribution each; prepaid plans and new streams lift both bookings and contribution.', 'This ties the recommendation to the volume the break-even requires.'),
          option('fifty-k', 'Break-even is 50,000 bookings a month.', 'That divides fixed costs by the full $1,000 service price; the platform keeps $250 a booking, so it is 200,000.'),
          option('flat', 'Beauty is the smallest vertical at 40%.', 'Beauty is the largest at 40%; cleaning and miscellaneous are 30% each.'),
        ]),
        part('risk', 'Risk / next step', 'sensitivity', [
          option('sensitivity', 'Test customer price sensitivity before raising the convenience fee, and watch partner churn.', 'Both sides of the platform can leave; measure elasticity before leaning on either.'),
          option('assume', 'Assume advertisers will pay whatever the platform asks.', 'Ad value depends on usage and user experience, which need testing.'),
          option('expand', 'Launch in new cities to spread costs.', 'New cities add cost and complexity; they do not fix the core economics.'),
        ]),
      ] },
    ],
  },
  {
    id: 'zoomcar-deposit-refunds', title: 'Reviews that stopped the bookings', category: 'Profitability', sector: 'Car rental', level: 'Intermediate', focus: 'Trace a revenue fall to the step of the journey that broke', pages: '63–65',
    brief: 'ZoomCar, a self-drive car rental company, has seen revenues decline for four months while three competitors are unaffected. Diagnose why and recommend a response.',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 11 “Zoom Car”. The voucher figures and the four-month decline are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('scope', 'Whether the decline is client-specific or industry-wide, and whether it sits in particular streams or geographies.', 'Three competitors are unaffected, so this is client-specific. Narrowing where it lands saves the analysis.'),
        option('discounts', 'How deep a discount would win customers back?', 'That assumes price caused the decline. Nothing yet points to price.'),
        option('fleet', 'Whether to expand the fleet to chase volume.', 'The fleet has been constant; more cars cannot fix falling demand.'),
      ], correct: 'scope', hint: 'Client-specific or industry-wide? Which stream, which geography?', reveal: ['Revenue = number of cars × utilisation (bookings) × average trip revenue, plus penalties; for this exercise, utilisation fell from 60% to 45% while the fleet and trip revenue held steady.', 'Demand is down for both new and repeat customers across India, concentrated in short trips, the biggest stream.', 'Negative reviews have spread on social media over the same four months, driven by delayed security-deposit refunds.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO lenses that best locate the decline.', correct: ['supply-demand', 'journey'], options: [
        option('supply-demand', 'Supply versus demand: cars and uptime on one side, new and repeat bookings on the other.', 'Cars are unchanged and bookings are falling on both customer types, so the problem is on the demand side.'),
        option('journey', 'The customer journey: pre-trip booking, during the trip, and post-trip charges and refunds.', 'Reviews come from existing customers. Walking the journey finds the exact step that broke: the deposit refund.'),
        option('pricing', 'Competitor price benchmarking.', 'Competitors are not the issue; the decline is client-specific and linked to reviews.'),
        option('macro', 'Seasonality and macroeconomic demand for travel.', 'An India-wide, client-only fall over four months is not a seasonal pattern.'),
      ], hint: 'Confirm the side that broke, then walk the journey existing customers complain about.', model: 'Split revenue into cars, utilisation, and trip revenue. Utilisation fell while cars and competitors held steady, so this is a demand-side problem. Walk the customer journey for the reviewers: booking, the trip itself, then post-trip charges and refunds. The break is the slow security-deposit refund.' },
      { kind: 'calculation', prompt: 'Utilisation fell from 60% to 45% while the fleet and average trip revenue held steady. By what percentage did revenue fall?', unit: '% fall', answer: (60 - 45) / 60 * 100, tolerance: 0.01, dataNote: 'Exercise assumptions: the source gives utilisation fell but no figures; the fleet and average trip revenue are constant, so revenue tracks utilisation.', exhibit: [['Driver', 'Before', 'Now'], ['Utilisation (bookings)', '60%', '45%'], ['Number of cars', 'Unchanged', 'Unchanged'], ['Average trip revenue', 'Unchanged', 'Unchanged']], hint: 'Revenue = cars × utilisation × trip revenue, so the percentage fall in revenue equals the relative fall in utilisation.', working: 'Revenue is proportional to utilisation, so the fall is (60 − 45) ÷ 60 = 15 ÷ 60 = 25%. That is 15 percentage points on the utilisation measure, a 25% fall in revenue.', options: [
        option('relative', '25%', 'Correct: 15 ÷ 60.', 25),
        option('points', '15%', 'That is the change in percentage points of utilisation. Relative to the old 60% level, revenue fell 25%.', 15),
        option('new-base', '33.3%', 'That divides the 15-point drop by the new 45% level, not the old 60%.', 33.3),
      ] },
      { kind: 'choice', prompt: 'Why did delayed refunds hit both new and repeat bookings?', options: [
        option('trust', 'Reviews destroyed trust: new customers will not book, and burned repeat customers leave.', 'A rental asks for a deposit before any service. Visible refund complaints attack the core of the buying decision.'),
        option('price', 'Deposits became more expensive.', 'The deposit amount did not change; its refund did.'),
        option('capacity', 'Delayed refunds removed cars from the fleet.', 'Refunds are a cash-flow issue, not a fleet issue.'),
      ], correct: 'trust', hint: 'What does a deposit refund complaint say to someone who has not booked yet?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Fix the broken step first, then rebuild demand.', model: 'Short term: lower the deposit, state refund timelines clearly, and offer instant refunds as platform credits to pull repeat bookings. Long term: upgrade the booking platform and use partnerships, such as $1,000 coupons bought for $900, to rebuild demand while controlling cost. On the exercise assumptions, utilisation falling from 60% to 45% is a 25% revenue fall with the fleet unchanged. Track review sentiment and repeat booking rates.', parts: [
        part('action', 'Action', 'refund', [
          option('refund', 'Fix the refund: lower the deposit, publish clear timelines, and offer instant credit refunds.', 'This removes the exact complaint driving the negative reviews and the booking decline.'),
          option('ads', 'Launch a brand campaign over the bad reviews.', 'Marketing cannot outshout an unresolved complaint stream; fix the cause first.'),
          option('price', 'Cut rental prices until bookings recover.', 'Price cuts do not address why customers left, and they sacrifice margin.'),
        ]),
        part('evidence', 'Supporting evidence', 'reviews', [
          option('reviews', 'Utilisation fell from 60% to 45%, a 25% revenue fall, while cars and competitors held steady.', 'This ties the revenue decline to the demand side and the broken post-trip step.'),
          option('cars', 'The fleet shrank, so fewer cars were available.', 'The number of cars stayed the same; utilisation is what fell.'),
          option('fifteen', 'Revenue fell 15%.', 'That is the fall in percentage points of utilisation. Relative to 60%, revenue fell 25%.'),
        ]),
        part('risk', 'Risk / next step', 'sentiment', [
          option('sentiment', 'Track review sentiment and repeat bookings to confirm the refund fix is working.', 'The diagnosis came from reviews; the recovery should be measured there too.'),
          option('deposit-zero', 'Remove the deposit entirely.', 'The deposit exists to cover damage and fuel; removing it adds risk. Lower and speed it up instead.'),
          option('ignore', 'Treat the reviews as a passing phase.', 'Four months of decline say the problem does not fix itself.'),
        ]),
      ] },
    ],
  },
  {
    id: 'ev-launch-timing', title: 'When to start building the first EV', category: 'Market entry', sector: 'Automotive', level: 'Intermediate', focus: 'Run two clocks: when demand arrives, minus how long you take', pages: '137–139',
    brief: 'An Indian carmaker has no electric vehicle in its portfolio. When should it begin developing one: early enough to matter, but not so early that a finished car finds no buyers?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 42 “EV Launch Timing”. Prices, running costs, and the battery-cost decline are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What is the most useful way to restate the question?', options: [
        option('timing', 'The question is when, not whether: find when EV demand exists and subtract development time.', 'The client has already decided to enter. A timing question needs a demand date and a lead time, not a yes/no case.'),
        option('whether', 'Whether EVs are a good market to be in at all.', 'The client asked when to start developing, not whether to. Answer the question asked.'),
        option('model', 'Which vehicle segment the EV should target.', 'The mid-segment car at roughly $800,000 is already specified.'),
      ], correct: 'timing', hint: 'Identify the real decision: a date, not a go or no-go.', reveal: ['India, mid-segment passenger cars; the comparable ICE car costs $800,000.', 'Battery pack costs $600,000 today and is falling by about $40,000 a year. Assume no cannibalisation of ICE sales.', 'Running cost: ICE at $5 per km (20 km/l at $100/l); EV at about $1 per km. Development takes about three years.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that pin down the answer.', correct: ['tco', 'lead-time'], options: [
        option('tco', 'Need-based demand: the year when the EV’s total cost of ownership falls below the ICE car’s.', 'Mainstream demand arrives at cost parity. Finding that year is the demand clock.'),
        option('lead-time', 'The supply clock: development, validation, and supplier tooling time from decision to first sale.', 'The decision date equals the demand date minus development lead time.'),
        option('want', 'Want-based demand from early adopters who buy for status or preference.', 'Early adopters are too small to support a mainstream launch; the source sets this aside.'),
        option('policy', 'Possible subsidies and tax incentives for EVs.', 'Policy is unpredictable. A plan built on natural cost parity survives a withdrawn subsidy.'),
      ], hint: 'One clock for demand, one for your own development.', model: 'Two parallel clocks. Demand clock: need-based demand appears when EV TCO undercuts ICE TCO; ignore want-based demand and unpredictable policy. Supply clock: about three years from decision to first sale. Decide at parity year minus three.' },
      { kind: 'calculation', prompt: 'The EV costs $1.4 million ($800,000 car plus a $600,000 battery) and saves $4 per km over 100,000 km of lifetime driving. With the battery falling $40,000 a year, in which year does the EV reach cost parity?', unit: 'year', answer: 5, tolerance: 0.01, dataNote: 'All figures from the case; discounting and resale are excluded.', exhibit: [['Item', 'Value'], ['Lifetime saving ($4/km × 100,000 km)', '$400,000'], ['Price premium today ($1.4 million − $800,000)', '$600,000'], ['Shortfall to recover', '$200,000'], ['Battery cost decline', '$40,000 per year']], hint: 'Years = gap between premium and lifetime saving ÷ annual battery decline.', working: 'The EV is $200,000 worse off over its life ($600,000 premium minus $400,000 saving). The premium is entirely the battery, falling $40,000 a year: 200,000 ÷ 40,000 = 5 years to parity. At year 4 the pack is still $440,000, so the EV still loses.', options: [
        option('parity', 'Year 5', 'Correct: $200,000 ÷ $40,000 a year.', 5),
        option('full', 'Year 15', 'That divides the whole $600,000 pack by $40,000, ignoring the $400,000 of lifetime savings already banked.', 15),
        option('dev', 'Year 3', 'Three years is the development time, not the parity date. Parity is year 5.', 3),
      ] },
      { kind: 'choice', prompt: 'Parity arrives in year 5 and development takes 3 years. What does that make the decision?', options: [
        option('year2', 'Decide to develop by the end of year 2 so the car launches just as demand turns up.', 'Start earlier and the car is ready before parity, sitting unsold while it still loses on lifetime cost; start later and competitors take the segment.'),
        option('now', 'Start development today to be first.', 'Ready in year 3, the pack has fallen only to $480,000 against the $400,000 parity level, so the EV is still $80,000 worse off over its life and unsold for two years.'),
        option('wait', 'Wait until parity is proven, then decide.', 'Deciding at year 5 means the car arrives at year 8, three years after competitors.'),
      ], correct: 'year2', hint: 'Decision date = parity year minus lead time.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Anchor to the two clocks and the variables worth watching.', model: 'Hold off on development spending for now and schedule a formal decision at the end of year 2, conditional on pack costs still dropping $40,000 a year. Start battery-cell supplier negotiations now, since sourcing lead times sit outside the three-year build. Parity arrives in year 5 ($200,000 gap ÷ $40,000 a year). Watch the pack cost and the petrol-electricity price gap.', parts: [
        part('action', 'Action', 'gate', [
          option('gate', 'Set a year-2 decision gate on battery-cost trajectory, and open cell supplier talks now.', 'This times the commitment to the parity point while removing the bottleneck that sits outside the build window.'),
          option('commit', 'Commit full development capital immediately.', 'The car would arrive before need-based demand exists, tying up capital in unsold inventory.'),
          option('wait-5', 'Reassess only in year 5.', 'That forfeits the segment to whoever started three years earlier.'),
        ]),
        part('evidence', 'Supporting evidence', 'gap', [
          option('gap', 'The EV is $200,000 worse off over its life today; at $40,000 a year, the pack reaches parity in year 5.', 'This is the arithmetic that sets the decision date.'),
          option('saving-6', 'The EV already saves $600,000 over its life.', 'Lifetime running saving is $400,000 against a $600,000 premium: it is $200,000 behind.'),
          option('parity-3', 'Parity arrives in year 3.', 'Year 3 is the development lead time; parity needs five years of battery decline.'),
        ]),
        part('risk', 'Risk / next step', 'variables', [
          option('variables', 'Track the two volatile inputs: battery pack cost and the petrol-electricity price gap.', 'Everything else is structural; these two move the parity date.'),
          option('policy-bet', 'Plan around a hoped-for subsidy.', 'Policy is unpredictable; a parity-based plan survives without it.'),
          option('resale', 'Assume EV resale values will fix the gap.', 'Resale was explicitly excluded; flag it as a sensitivity, not a plan.'),
        ]),
      ] },
    ],
  },
  {
    id: 'dating-app-india', title: 'A dating app sizes up India', category: 'Market entry', sector: 'Consumer tech', level: 'Intermediate', focus: 'Funnel a population down to the users who could pay', pages: '120–121',
    brief: 'A UK-based dating app, the market leader at home, wants to enter India and become a competitive player. Evaluate the venture.',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 35 “Online Dating App”. The sizing funnel, competitor shares, and pricing are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('objective', 'The objective and model: long-term profit, a freemium app like the leaders, and any benchmarks from past entries.', 'The client took a 7% share in a comparable market in year one; that benchmark frames what entry can deliver.'),
        option('name', 'What the Indian app should be called.', 'Branding comes after the venture is shown to be viable.'),
        option('feature', 'Which unique feature would beat the incumbents.', 'The app is deliberately similar to the leaders; the edge is UI/UX, not a new feature.'),
      ], correct: 'objective', hint: 'Objective, business model, and a benchmark share first.', reveal: ['Two major players hold about 80% of the market; the rest is fragmented. Ignore marriage apps.', 'Competitor pricing: $450 and $400 for three months. The client is the UK market leader with a marginal UI/UX edge.', 'In a similar competitive entry last year, the client reached 7% market share in year one.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that drive the entry view.', correct: ['size', 'share'], options: [
        option('size', 'Market attractiveness: funnel the population to realistically addressable users.', 'A filtered funnel on 1,400 Mn people shows whether the pool can support a paid product.'),
        option('share', 'The share the client can win, benchmarked on its 7% first-year result and its UI/UX edge.', 'Market size times a realistic share sets the opportunity; the past entry gives the benchmark.'),
        option('costs', 'Detailed unit costs of running the app in India.', 'The interviewer excludes costs; push where the evidence leads, not the checklist.'),
        option('website', 'Whether to build a website alongside the app.', 'The scope is an app only.'),
      ], hint: 'Size the pool, then estimate the slice you can take.', model: 'Evaluate market attractiveness (funnel: urban, connected, age, gender, willingness), achievable share (benchmarked on the past 7% entry, adjusted for the UI/UX edge), then operational feasibility. The funnel yields roughly 28 Mn relevant users; a strong play could target 25-30% share in 4-5 years.' },
      { kind: 'calculation', prompt: 'Using the funnel, roughly how many relevant users does the market hold?', unit: 'million users', answer: 15.75 + 6.3 + 4.2 + 1.26, tolerance: 0.02, dataNote: 'All funnel shares are case assumptions from the source.', exhibit: [['Segment', 'Users', 'Open to dating', 'Willing to use apps', 'Relevant'], ['18-30 males', '52.5 Mn', '60%', '50%', '15.75 Mn'], ['18-30 females', '52.5 Mn', '40%', '30%', '6.3 Mn'], ['30-45 males', '42 Mn', '25%', '40%', '4.2 Mn'], ['30-45 females', '42 Mn', '15%', '20%', '1.26 Mn']], hint: 'Multiply along each branch, then add the four segments.', working: '1,400 Mn × 40% urban × 75% connectivity = 420 Mn; age splits give 105 Mn (18-30) and 84 Mn (30-45), halved by gender. Relevant users = 15.75 + 6.3 + 4.2 + 1.26 ≈ 27.5 Mn, about 28 Mn people.', options: [
        option('sum', 'About 28 Mn', 'Correct: 15.75 + 6.3 + 4.2 + 1.26 ≈ 27.5 Mn.', 27.51),
        option('pool', 'About 420 Mn', 'That stops after the urban and connectivity filters, before age, gender, and willingness.', 420),
        option('biggest', 'About 52.5 Mn', 'That is the largest single segment before the openness and willingness factors.', 52.5),
      ] },
      { kind: 'choice', prompt: 'What does the competitive structure imply for pricing and position?', options: [
        option('acquire', 'Price low with long plans to acquire users fast, because network effects reward scale; invest to raise fees later.', 'Dating apps live on user density. Land users cheaply now; monetise once the base is hard to leave.'),
        option('premium', 'Launch above $450 for three months as a premium product.', 'A premium needs a clear edge; a marginal UI/UX advantage will not carry a price premium against 80% incumbents.'),
        option('match', 'Simply match the $450 leader price.', 'Matching concedes the acquisition battle; the client needs share, not parity.'),
      ], correct: 'acquire', hint: 'In a network-effects product, what is the scarcest asset at launch?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Enter, price for acquisition, and name the network-effects risk.', model: 'Enter India with an acquisition-first pricing strategy: minimal premium pricing, long-duration plans, referrals, and safety-focused marketing to attract female users, who are often the constraint in dating ecosystems. The funnel gives about 28 Mn relevant users and the client took 7% in a comparable market in year one. The risk is prolonged price wars destroying margins, so keep investing in the product to raise fees gradually.', parts: [
        part('action', 'Action', 'enter', [
          option('enter', 'Enter with cheap long plans and heavy marketing to build the user base fast.', 'Network effects make the user base the prize; monetise it later.'),
          option('premium', 'Enter at a premium above the $450 leader.', 'A marginal UI/UX edge cannot support a premium over entrenched players.'),
          option('skip', 'Stay out; two players already hold 80%.', 'A concentrated market with a weak number two is exactly where a strong challenger can enter.'),
        ]),
        part('evidence', 'Supporting evidence', 'funnel', [
          option('funnel', 'About 28 Mn relevant users from the funnel, and a 7% first-year share in a comparable entry.', 'These two numbers bound a realistic opportunity.'),
          option('half', 'The addressable market is about 420 Mn paying users.', '420 Mn is the connected urban pool before willingness filters; relevant users are about 28 Mn.'),
          option('price', 'The leaders charge $450 a month.', 'They charge $450 and $400 for three months, not per month.'),
        ]),
        part('risk', 'Risk / next step', 'war', [
          option('war', 'Price wars could destroy margins; keep improving the product so fees can rise later.', 'Cheap acquisition only pays off if you can monetise a retained base.'),
          option('ignore-women', 'Treat the gender mix as fixed.', 'A lack of female users is a known failure mode; safety-focused marketing addresses it.'),
          option('marriage', 'Expand into marriage matchmaking immediately.', 'Marriage apps were excluded from scope and are a different product.'),
        ]),
      ] },
    ],
  },
  {
    id: 'qcomm-membership-price', title: 'Pricing a quick-commerce membership', category: 'Pricing', sector: 'Quick commerce', level: 'Advanced', focus: 'Price between customer value, company cost, and the competitor’s number', pages: '169–171',
    brief: 'A leading quick-commerce company plans a paid membership with free standard and express delivery plus member discounts. What monthly price should it charge?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 55 “Quick-Commerce Membership Pricing”. All fees, costs, order patterns, and the margin target are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you pin down first?', options: [
        option('goal', 'The goal (profitable with good adoption), the rollout scope, and what members actually get.', 'Pricing follows the objective: profit and adoption pull in opposite directions, and benefits set both value and cost.'),
        option('price-point', 'A specific price that feels right to test.', 'Picking a number before knowing value, cost, and competition is guessing.'),
        option('tech', 'Whether the app can support membership billing.', 'Feasibility matters later; the question is what the programme is worth.'),
      ], correct: 'goal', hint: 'Objective, scope, and benefits before any number.', reveal: ['Delivery fees today: $25 standard, $50 express. Costs to the company: $20 standard, $30 express per order.', 'Order patterns: light users 3 a month (2 standard, 1 express), medium 6 (3 and 3), heavy 12 (6 and 6).', 'The main competitor charges $199 a month for free standard delivery only. The client wants at least a 25% margin.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO anchors for the price.', correct: ['value', 'cost'], options: [
        option('value', 'Customer value: delivery savings plus discounts by segment.', 'Value sets the ceiling; a medium user saves $225 on delivery and $200 in discounts, so $425 a month.'),
        option('cost', 'Cost to serve: delivery and discount cost per member, against the 25% margin target.', 'Cost sets the floor; a medium user costs $350 a month, so a 25% margin needs at least about $467.'),
        option('first-order', 'A one-month introductory free trial as the price anchor.', 'A trial drives adoption but does not set the sustainable price.'),
        option('days', 'Whether delivery speed is 20 or 45 minutes.', 'Delivery time feeds perceived value but does not price the plan by itself.'),
      ], hint: 'Ceiling from value, floor from cost, then check the competitor.', model: 'Price membership between three anchors: perceived value (medium $425, heavy $800, light $200 a month), cost to serve with the 25% margin floor ($350 cost needs about $467), and the competitor’s $199 for a weaker plan. $299 lands between: strong value for medium users and profitable once order uplift covers the shortfall.' },
      { kind: 'calculation', prompt: 'A medium user costs the company $350 a month. At a 25% margin on the membership price, what is the minimum monthly price?', unit: '$ per month', answer: 350 / (1 - .25), tolerance: 0.01, dataNote: 'Cost and margin target from the case.', exhibit: [['Item', 'Medium user, per month'], ['Delivery cost ($20×3 + $30×3)', '$150'], ['Member discounts', '$200'], ['Total cost', '$350'], ['Margin target', '25% of price']], hint: 'Margin is on price, not on cost: price = cost ÷ (1 − margin).', working: 'If cost is 75% of the price, price = 350 ÷ 0.75 ≈ $467. The source rounds to $466 and tests $469 or $499. A 25% markup on cost, $437.5, delivers only a 20% margin.', options: [
        option('margin', 'About $467', 'Correct: 350 ÷ (1 − 0.25).', 466.67),
        option('markup', '$437.5', 'That adds 25% on top of cost. A 25% margin needs cost to be 75% of price: 350 ÷ 0.75.', 437.5),
        option('sum', '$375', 'That adds a flat $25. Margin is a share of the price, not a dollar amount.', 375),
      ] },
      { kind: 'choice', prompt: '$299 sits below the $467 floor for medium users. What makes it defensible?', options: [
        option('uplift', 'At $60 contribution per order, about 3 extra orders a month close the $167 gap, which free delivery plausibly drives.', 'The membership itself encourages the extra orders that fund it. $299 also clears the $199 competitor price.'),
        option('losses', 'Memberships can lose money forever as a marketing cost.', 'The brief requires the programme to be profitable, not a permanent subsidy.'),
        option('average', 'All segments cost the same, so it averages out.', 'Heavy users cost $650 and light $170; the economics are segment-specific.'),
      ], correct: 'uplift', hint: 'What does the programme itself do to order frequency?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Price, evidence, and the cap that keeps heavy users profitable.', model: 'Launch at $299 a month with an annual option near $2,999 (about $249 a month effective). It clears the $199 competitor plan while offering more, and the $167 per-member shortfall against the $467 floor needs only about 3 extra orders at $60 contribution. Cap express deliveries at 6 a month and discounts at $350 so heavy users stay profitable. Run a one-month trial to validate usage before the full rollout.', parts: [
        part('action', 'Action', 'price-299', [
          option('price-299', 'Price at $299 monthly, about $2,999 yearly, with caps on express deliveries and discounts.', 'Best balance: above the competitor on value, funded by the order uplift the membership drives.'),
          option('price-467', 'Price at $467 to guarantee the margin on day one.', 'Nearly 2.4 times the competitor’s $199; adoption would suffer badly.'),
          option('price-199', 'Match the competitor at $199.', 'At $199 the plan loses about $151 a month per medium user before any uplift, on a richer benefit set.'),
        ]),
        part('evidence', 'Supporting evidence', 'math', [
          option('math', '$467 is the 25%-margin floor ($350 ÷ 0.75); $299 needs about 3 extra orders a month to close the gap.', 'This is the arithmetic that makes $299 defensible rather than a guess.'),
          option('value-800', 'A medium user gets $800 of monthly value.', '$800 is the heavy user. Medium is $425, still comfortably above $299.'),
          option('margin-25', '$437.5 gives a 25% margin.', 'That is a 25% markup on cost, which is only a 20% margin.'),
        ]),
        part('risk', 'Risk / next step', 'trial', [
          option('trial', 'Run a one-month free trial to observe real usage, then finalise caps.', 'The whole case rests on the order-uplift assumption; measure it before scaling.'),
          option('uncapped', 'Offer unlimited express deliveries to all members.', 'Heavy users already cost $650; uncapped express removes the control that keeps them profitable.'),
          option('none', 'No further checks; launch nationally at once.', 'A tier-1 rollout with measured data is safer than betting the model on assumed behaviour.'),
        ]),
      ] },
    ],
  },
  {
    id: 'battery-swap-pricing', title: 'Pricing a battery swap', category: 'Pricing', sector: 'Electric vehicles', level: 'Intermediate', focus: 'Anchor on the substitute, then test whether volume covers the fixed cost', pages: '164–165',
    brief: 'A carmaker launching an electric compact SUV in Delhi will run its own battery-swap stations. Swapping replaces a 45-minute fast charge with a 5-minute swap. What should a swap cost?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 53 “Battery Swap Cost for E4W”. Charging times, energy prices, battery size, station costs, and the value-of-time assumption are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish before pricing?', options: [
        option('substitute', 'What the customer’s nearest alternative is and what the swap is worth over it.', 'With no direct swap competitor, fast charging is the benchmark. Value-based pricing starts from the substitute.'),
        option('subscription', 'How the battery subscription fee should be priced.', 'The subscription is a separate decision; the question prices the swap itself.'),
        option('nationwide', 'Whether swap stations will cover intercity routes.', 'Stations are Delhi NCR only; price for the retail customer who can still fast charge.'),
      ], correct: 'substitute', hint: 'With no direct competitor, find the alternative customers compare you to.', reveal: ['DC fast charging 20-100% takes 45 minutes; a swap takes 5.', 'Fast charging costs about $20 per kWh; the battery is about 40 kWh, so a 20-100% charge covers 80% of capacity.', 'Retail customers value idle time at about $250 an hour ($150k a month over about 300 working hours, at half value). No direct swap competitors in India.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO lenses to set the price.', correct: ['value', 'cost'], options: [
        option('value', 'Value-based: the energy delivered plus the value of 40 minutes saved per swap.', 'The customer pays for the charge plus the time back; that is the value ceiling.'),
        option('cost', 'Cost-based: monthly station fixed costs plus electricity per swap, against expected swap volume.', 'The cost floor only binds if enough swaps a month spread the fixed costs.'),
        option('penetration', 'Price at a token amount to build the habit.', 'Stations have high fixed costs; a token price with thin volume never recovers them.'),
        option('rival', 'Match the price of the nearest swap competitor.', 'There are no direct swap competitors; the comparison is fast charging.'),
      ], hint: 'Value sets the ceiling, cost and volume set the floor.', model: 'Value per swap = energy value (80% × 40 kWh × $20 ≈ $640) plus time saved (40 min × $250/hr ≈ $160-167), so about $800. Cost side: $12 million equipment over 10 years is $100,000 a month plus $150,000 other fixed, total $250,000; electricity $160 per swap. At $640 gross margin, viability needs roughly 400 swaps a month per station.' },
      { kind: 'calculation', prompt: 'What is the value-based price per swap for a retail customer?', unit: '$ per swap', answer: .8 * 40 * 20 + 160, tolerance: 0.01, dataNote: 'Source figures; the source rounds the time premium (40 min × $250/hr ≈ $167) to about $160.', exhibit: [['Component', 'Working', 'Value'], ['Energy, 80% of 40 kWh at $20/kWh', '0.8 × 40 × 20', '$640'], ['Time saved, 40 min at $250/hr', '250 × 40/60', 'about $160'], ['Value-based price', '640 + 160', 'about $800']], hint: 'Charge for the energy delivered plus the time the customer gets back.', working: 'Energy: 0.8 × 40 × 20 = $640. Time premium: 40 minutes × $250/hour ≈ $167, which the source rounds to $160. Value-based price ≈ $800 per swap for a 20-100% charge.', options: [
        option('full', 'About $800', 'Correct: $640 of energy plus about $160 of time value.', 800),
        option('energy', '$640', 'That is only the electricity parity price; it ignores the 40 minutes the customer gets back.', 640),
        option('kwh', '$960', 'That charges for the full 40 kWh ($800) plus time. A 20-100% swap delivers only 80% of capacity, so the energy is $640 and the total about $800.', 960),
      ] },
      { kind: 'choice', prompt: 'Fixed station costs are $250,000 a month. What does viability hinge on?', options: [
        option('volume', 'About 400 swaps a month per station at roughly $640 gross margin each; otherwise the price cannot carry the fixed cost.', '250,000 ÷ 640 ≈ 390, so around 400 swaps. Price is not the problem; utilisation is.'),
        option('double', 'Doubling the price to $1,600 to halve the swaps needed.', 'At $1,600 customers pay more than the value they get; they will fast charge instead.'),
        option('staff', 'Whether swap stations are staffed or automated.', 'Staff cost is inside the $250,000 fixed figure; the binding question is swap volume.'),
      ], correct: 'volume', hint: 'Divide monthly fixed cost by margin per swap.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Set the value price, cite the volume needed, and segment the offer.', model: 'Price a swap near $800: $640 of energy plus about $160 for the 40 minutes returned, and intangible benefits like convenience justify the premium. Viability needs roughly 400 swaps a month per station at $640 gross margin, so check utilisation before building. Offer heavy fleet users a monthly plan or volume rates, since a single pay-per-swap price under-serves them.', parts: [
        part('action', 'Action', 'value-price', [
          option('value-price', 'Price near $800 per swap, with separate plans for heavy fleet users.', 'This captures the energy plus time value and fixes the incentive gap for high-volume customers.'),
          option('cost-price', 'Price at $160, just covering electricity.', 'Below the $640 margin needed, each swap loses money against fixed costs.'),
          option('flat-all', 'One flat price for every customer forever.', 'Heavy users need volume pricing; one price leaves value on the table.'),
        ]),
        part('evidence', 'Supporting evidence', 'eight-hundred', [
          option('eight-hundred', '$640 of energy plus about $160 of time value gives about $800, and 400 swaps a month covers the $250,000 fixed cost.', 'Both anchors, value and volume, are captured in these numbers.'),
          option('five-hundred', '$500 covers the full battery charge.', 'A 20-100% swap is 80% of 40 kWh, $640 of energy, before the time premium.'),
          option('cheap-time', 'The time saving is worth about $40.', 'Forty minutes at $250 an hour is about $167, not $40.'),
        ]),
        part('risk', 'Risk / next step', 'demand', [
          option('demand', 'Estimate cumulative car sales and stations to check whether 400 swaps a month per station is reachable.', 'The price works only if utilisation spreads the fixed cost; test demand before building.'),
          option('wtp-flat', 'Assume every customer values time identically.', 'Fleet drivers use the vehicle far more; their willingness to pay differs, which is why they need separate pricing.'),
          option('battery-risk', 'Worry first about battery chemistry standards.', 'The battery is already specified at about 40 kWh; utilisation is the open question.'),
        ]),
      ] },
    ],
  },
  {
    id: 'saas-logistics-expansion', title: 'Closing a $5 million growth gap', category: 'Growth', sector: 'Enterprise software', level: 'Intermediate', focus: 'Turn a growth target into a customer count, then pick a beachhead', pages: '196–198',
    brief: 'An Indian B2B SaaS logistics platform at $20 million ARR wants to lift growth from 15% to 40% a year. Management sees international expansion as the lever. Advise them.',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 65 “B2B SaaS Logistics Platform”. ARR, growth rates, customer values, and the expansion budget are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('scope', 'Whether the mandate is only international expansion or any lever that closes the gap, plus the budget and timeline.', 'The client is open to other levers and has $5 million and an 18-24 month window; both constrain the plan.'),
        option('product', 'Whether the platform needs a redesign for new markets.', 'Product adaptation matters, but only after you know which market and whether the gap is real.'),
        option('hire', 'How many salespeople to hire in each region.', 'Headcount follows the region choice and the budget, not before.'),
      ], correct: 'scope', hint: 'Confirm the lever set, the budget, and the deadline.', reveal: ['ARR is $20M with 90% of revenue from India; baseline organic growth is 15%, the target is 40%.', 'Average enterprise customer value is roughly $250,000-400,000 a year.', 'Regions in view: Middle East (fast-growing, English-friendly, an existing UAE distributor partner), Europe (large, mature, compliance-heavy), North America (largest, most expensive to win).'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that should drive the recommendation.', correct: ['gap', 'regions'], options: [
        option('gap', 'The size of the growth gap in ARR and in the number of new enterprise customers it implies.', 'Quantifying the gap turns an abstract 40% into roughly 10-20 wins, which makes the plan testable.'),
        option('regions', 'A comparison of candidate regions on market size, competition, regulation, and fit.', 'The choice of beachhead determines whether the gap can be closed inside the budget.'),
        option('brand', 'A global rebranding to look more international.', 'Brand does not move ARR within 18-24 months against this gap.'),
        option('free', 'A freemium tier for small businesses.', 'The product serves large enterprises; freemium changes the customer and the model.'),
      ], hint: 'Quantify the gap, then choose where to win it.', model: 'First quantify the gap: 40% growth means $28M ARR against $23M at the baseline 15%, a $5M gap, roughly 10-20 enterprise customers. Then compare regions: the Middle East pairs fast growth with low barriers and an existing partner; Europe needs compliance investment; North America is the biggest and costliest. Phase the expansion: Middle East first, Europe selectively later.' },
      { kind: 'calculation', prompt: 'Baseline growth of 15% takes ARR to $23M in a year; the 40% target means $28M. What is the ARR gap expansion must fill?', unit: '$ million', answer: 20 * .4 - 20 * .15, tolerance: 0.01, dataNote: 'ARR and growth rates from the case.', exhibit: [['Path', 'ARR in a year'], ['Baseline, 15% growth', '20 × 1.15 = $23M'], ['Target, 40% growth', '20 × 1.40 = $28M']], hint: 'The gap is the extra growth rate applied to the ARR base.', working: 'Gap = 28 − 23 = $5M, or directly 20 × (0.40 − 0.15) = $5M. At $250,000-400,000 a customer, that is roughly 10-20 new enterprise accounts.', options: [
        option('gap', '$5M', 'Correct: 28 − 23, or 20 × 25%.', 5),
        option('target', '$8M', 'That is 40% growth on $20M, forgetting the business already grows 15% on its own.', 8),
        option('total', '$28M', 'That is the target ARR level, not the incremental gap.', 28),
      ] },
      { kind: 'choice', prompt: 'Why the Middle East ahead of Europe or North America?', options: [
        option('fit', 'Fast-growing demand, lower competition, an existing UAE partner, and a shorter sales cycle fit a $5M budget and 18-month clock.', 'The region matches the constraints: affordable entry, faster wins, and a partner already in place.'),
        option('biggest', 'It is the largest of the three markets.', 'North America is the largest; size alone is not the criterion.'),
        option('easy', 'No product changes would be needed at all.', 'Some adaptation, like Arabic interfaces and data residency, is still required. The barriers are lower, not zero.'),
      ], correct: 'fit', hint: 'Match the region to the budget and the clock, not to the market size.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Sequence the expansion and cite the customer math.', model: 'Enter the Middle East first, focused on the UAE and Saudi Arabia through the existing distributor partner, with localised product and a small local sales team; aim for about a dozen enterprise clients in 18 months. The gap is $5M, roughly 10-20 customers at $250,000-400,000 each. Add upselling in India and new analytics features in parallel, then expand selectively into Europe once the Middle East is stable.', parts: [
        part('action', 'Action', 'phased', [
          option('phased', 'Start in the Middle East via the UAE partner, then enter Europe selectively from the cash flow and learnings.', 'Phasing fits the $5M budget; simultaneous entry into three regions would spread it too thin.'),
          option('all-three', 'Launch in all three regions at once.', 'With $5M and an 18-month window, three markets at once stretches every one too thin.'),
          option('india-only', 'Stay in India and push domestic sales harder.', 'Indian large enterprises are mostly served already, with long replacement cycles; expansion is the faster route.'),
        ]),
        part('evidence', 'Supporting evidence', 'gap-number', [
          option('gap-number', 'The gap is $5M, about 10-20 enterprise customers at $250,000-400,000 each, and a UAE partner already exists.', 'A quantified gap plus an entry partner is what makes the Middle East plan credible.'),
          option('gap-8', 'The expansion must deliver $8M of new ARR.', '$8M is the full 40% growth; $3M of it comes from baseline organic growth, so the gap is $5M.'),
          option('na', 'North America is cheapest to enter.', 'It is the largest but the most expensive, with the highest acquisition costs.'),
        ]),
        part('risk', 'Risk / next step', 'reviews', [
          option('reviews', 'Set six-month go/no-go reviews and diversify clients across the region against sudden regulatory shifts.', 'The Middle East carries political and regulatory risk; staged reviews keep the option to stop.'),
          option('compliance-first', 'Spend the first year on European compliance.', 'That spends the budget on the harder market before proving expansion works at all.'),
          option('no-risks', 'Expansion is low risk, so no monitoring is needed.', 'Every new market adds regulatory, competitive, and execution risk; reviews are cheap insurance.'),
        ]),
      ] },
    ],
  },
  {
    id: 'ai-startup-acquisition', title: 'Is the AI startup worth $2.5 billion?', category: 'M&A', sector: 'E-commerce', level: 'Foundation', focus: 'Value the synergy to you, not the startup’s standalone revenue', pages: '228–229',
    brief: 'An Indian e-commerce platform with $50 billion revenue wants to buy a young AI startup, asking price $2.5 billion. The target’s own revenue is just $50 million. Should the deal go ahead?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 79 “AI Startup Acquisition”. Revenue, margins, growth and hurdle rates, and the valuation result are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('objective', 'The objective of the deal: what the client gains, and what happens to the startup’s existing business after acquisition.', 'The startup’s $50 million revenue cannot justify $2.5 billion. The value must come from what it does for the acquirer, so the objective drives the valuation.'),
        option('standalone', 'The startup’s own profit and loss as an independent company.', 'Standalone economics miss the point; the acquisition is strategic, not financial.'),
        option('funding', 'The startup’s previous funding rounds.', 'The source sets no funding constraints; valuation should come from value created, not past rounds.'),
      ], correct: 'objective', hint: 'A strategic acquisition is valued on the buyer’s gains, not the target’s books.', reveal: ['The startup’s AI analyses customer calls; post-acquisition it will serve the parent exclusively, so its $50 million service revenue is forgone.', 'Client economics: EBIT margin 10%, effective tax 20%, expected sales uplift 5%.', 'The plan uses hurdle rate 20% and growth 15%.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO components the valuation needs.', correct: ['incremental', 'foregone'], options: [
        option('incremental', 'Incremental cash flow to the parent: EBIT after tax times the sales uplift the AI drives.', 'The deal’s value is the extra cash the parent earns, net of tax, from better customer service.'),
        option('foregone', 'Subtract the startup’s existing cash flows, lost when it works only for the parent.', 'Exclusive focus means the $50 million service revenue disappears; the incremental figure must be net of it.'),
        option('multiple', 'Apply a standard revenue multiple to the $50 million.', 'A revenue multiple ignores the synergy, which is the entire reason for the deal.'),
        option('headcount', 'Count the engineers and multiply by a cost per hire.', 'Replacement cost prices talent, not the cash flows the technology creates.'),
      ], hint: 'New cash in, minus old cash given up.', model: 'Incremental CF = EBIT × (1 − tax) × sales uplift − forgone service revenue = 5,000 × 10% × 80% × 5% − 5 = $150 million a year. Value it as a growing perpetuity: NPV = CF ÷ (r − g) = 15 ÷ (0.20 − 0.15) = $3 billion. Compare with the $2.5 billion ask, then weigh risks: developer attrition, technology leapfrogging, culture.' },
      { kind: 'calculation', prompt: 'Value the acquisition as a growing perpetuity. What is its NPV to the client?', unit: '$ million', answer: (5000 * .1 * .8 * .05 - 5) / (.2 - .15) * 10, tolerance: 0.1, dataNote: 'All inputs are case assumptions from the source.', exhibit: [['Input', 'Value'], ['Incremental CF', '5,000 × 10% × (1 − 0.20) × 5% − 5 = $150 million'], ['Hurdle rate r', '20%'], ['Growth rate g', '15%'], ['Asking price', '$2.5 billion']], hint: 'NPV = annual incremental cash flow ÷ (r − g).', working: 'Incremental CF = 5,000 × 0.10 × 0.80 × 0.05 − 5 = 20 − 5 = $150 million. NPV = 15 ÷ (0.20 − 0.15) = 15 ÷ 0.05 = $3 billion, above the $2.5 billion ask.', options: [
        option('npv', '$3 billion', 'Correct: 15 ÷ 0.05.', 3000),
        option('no-tax', '$4 billion', 'That skips the 20% tax: the flow becomes $200 million and 20 ÷ 0.05 = $4 billion. After tax the flow is $150 million, so the value is $3 billion.', 4000),
        option('cf', '$150 million', 'That is the annual cash flow, not the capitalised value. Divide by (r − g) = 5%.', 150),
      ] },
      { kind: 'choice', prompt: 'NPV of $3 billion exceeds the $2.5 billion ask. What could still sink the deal?', options: [
        option('people', 'The developers behind the model may leave, and AI advances could make this model redundant.', 'The asset walks out the door each evening. Attrition and leapfrogging attack the cash flows the valuation assumes.'),
        option('valuation', 'The $3 billion valuation is too low to be reliable.', '$3 billion exceeds the ask; the valuation supports the deal, the fragility of the asset is the concern.'),
        option('culture', 'The cultures are so different that integration is impossible.', 'The flat, entrepreneurial overlap is real but manageable; the source treats culture fit as workable.'),
      ], correct: 'people', hint: 'What exactly did you just buy, and can it leave?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Go ahead, cite the $3 billion value, and protect the asset you bought.', model: 'Proceed with the acquisition: the incremental cash flow of $150 million a year capitalises to about $3 billion, above the $2.5 billion ask. Capture the upside by folding the founders into the senior product team and cutting support-staff costs. Manage the risks: retain key developers so the model keeps improving for the platform, and monitor AI advances that could leapfrog it.', parts: [
        part('action', 'Action', 'proceed', [
          option('proceed', 'Acquire, and integrate the founders into the product leadership with retention incentives.', 'The value clears the ask; locking in the team protects the asset that creates it.'),
          option('reject', 'Reject the deal; $50 million revenue cannot justify $2.5 billion.', 'Standalone revenue is the wrong base; the synergy value is $3 billion.'),
          option('haggle', 'Walk away unless the price falls below $1 billion.', 'The value supports $3 billion; refusing to pay up to that concedes the synergy for no reason.'),
        ]),
        part('evidence', 'Supporting evidence', 'three-hundred', [
          option('three-hundred', 'Incremental CF is $150 million a year; at r = 20% and g = 15%, NPV is $3 billion against a $2.5 billion ask.', 'This is the valuation chain, computed correctly with tax and forgone revenue.'),
          option('five-revenue', 'The startup earns $50 million, so it is worth about $50 million.', 'The $50 million is forgone, not valued; the $3 billion comes from the parent’s uplift.'),
          option('ask', 'NPV is $150 million, below the ask.', '$150 million is the annual flow; the perpetuity value is $3 billion.'),
        ]),
        part('risk', 'Risk / next step', 'attrition', [
          option('attrition', 'Structure retention for the AI team and watch for technologies that could leapfrog the model.', 'The two named risks attack the valuation directly: the people and the pace of the field.'),
          option('culture-only', 'Focus only on culture surveys post-merger.', 'Culture fit was assessed as workable; the sharper risks are attrition and obsolescence.'),
          option('none', 'NPV is positive, so the deal carries no real risk.', 'A positive NPV on assumed uplift still depends on the team staying and the tech staying relevant.'),
        ]),
      ] },
    ],
  },
  {
    id: 'call-center-ai', title: 'The call centre that AI ate', category: 'Strategy', sector: 'Business services', level: 'Intermediate', focus: 'Show the headline number understates the threat, then reposition the business', pages: '343–344',
    brief: 'AI voice agents are expected to take about 40% of the calls a 5,000-seat BPO handles for US insurers within three years. What should the business turn into?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 127 “The Call Center That AI Ate”. Seat counts, the erosion share, and the pricing-model insight are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('economics', 'How the client earns (per seat, per transaction, or outcome-linked), the voice versus non-voice mix, and what they are optimising for.', 'The pricing model decides who suffers when AI removes volume, and the objective, enterprise value, frames every option.'),
        option('tech', 'Which AI vendor offers the best voice agents.', 'Choosing a vendor presumes the strategy; first understand the business model and the threat.'),
        option('revenue', 'Current total revenue and margin.', 'Useful later, but the business model and the erosion scope determine what the numbers mean.'),
      ], correct: 'economics', hint: 'Ask how the client gets paid before measuring what AI takes away.', reveal: ['Billed per seat on multi-year contracts; about 70% of 5,000 seats are voice, mostly inbound.', 'The 40% erosion hits simple, high-volume calls: policy status, address changes, payments, first notice of loss.', 'The objective is to maximise enterprise value; the client has usable rights to interaction data, and 8-10 large insurers form the customer base.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO moves the business should make.', correct: ['integrate', 'reprice'], options: [
        option('integrate', 'Become the AI-operations provider: run the bots and the human escalation desk together, trained on each client’s own call history.', 'The moat is workflow knowledge plus proprietary data plus an escalation layer a pure tech vendor cannot staff.'),
        option('reprice', 'Shift pricing from per-seat to per-resolution or outcome-based, so revenue decouples from headcount.', 'Per-seat billing ties revenue to the very headcount AI removes; repricing lets the client keep the productivity gain.'),
        option('lobby', 'Lobby insurers and regulators to slow AI adoption.', 'Delaying the technology is not a strategy; competitors and vendors will adopt it regardless.'),
        option('offshore', 'Move all seats to cheaper locations to cut costs.', 'Location costs do not change the structural threat to the pricing model.'),
      ], hint: 'Capture the productivity instead of being its victim.', model: 'Frame what to become, then how. Integrate forward into a managed AI-plus-human service, expand people into judgment work like complex claims and fraud, and divest the commodity voice line deliberately. Reprice per-seat contracts to per-resolution at renewals, phased over three years, moving first with existing insurers.' },
      { kind: 'calculation', prompt: 'Roughly how many of the 5,000 seats does the erosion threaten, and what share of the business is that?', unit: '% of business', answer: .7 * .4 * 100, tolerance: 0.01, dataNote: 'Seat mix and erosion share from the case.', exhibit: [['Step', 'Value'], ['Voice seats', '5,000 × 70% = 3,500'], ['Eroded seats', '3,500 × 40% ≈ 1,400'], ['Share of business', '1,400 ÷ 5,000 = 28%']], hint: 'Apply the voice share first, then the erosion rate.', working: 'Voice seats = 5,000 × 70% = 3,500. Erosion = 3,500 × 40% ≈ 1,400 seats, which is 1,400 ÷ 5,000 = 28% of the business, not 40%.', options: [
        option('share', '28%', 'Correct: 0.7 × 0.4 = 0.28.', 28),
        option('headline', '40%', 'Forty per cent applies only to the voice line, which is 70% of seats. On the whole business it is 28%.', 40),
        option('seats', '14%', 'That under-multiplies. 3,500 voice seats × 40% = 1,400 of 5,000 = 28%.', 14),
      ] },
      { kind: 'choice', prompt: 'Why does even the 28% figure understate the threat?', options: [
        option('pricing', 'AI takes the simple calls, leaving costlier complex ones, and the bot’s cheap resolution resets the price clients expect on all work.', 'Second-order effects compress margins on retained volume, and per-seat billing ties revenue to the headcount being removed.'),
        option('volume', 'Actually 60% of calls will be automated, not 40%.', 'Nothing supports a bigger number; the point is that the damage runs deeper than the percentage suggests.'),
        option('seats', 'All 5,000 seats will go within a year.', 'The erosion is over three years and concentrated in simple calls; total elimination is not the claim.'),
      ], correct: 'pricing', hint: 'Think about what happens to the price of the work that remains.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Reposition, cite the seat math, and name the data-rights hinge.', model: 'Become the AI operator rather than its victim: run bots plus human escalation end to end, move staff into judgment work such as complex claims and fraud, and wind down commodity Tier-1 seats deliberately. Erosion threatens about 1,400 seats, 28% of the business, and worse, it resets the reference price for all work. Move first to existing insurers, and confirm data-ownership rights, which the whole play hinges on.', parts: [
        part('action', 'Action', 'operator', [
          option('operator', 'Sell a managed AI-plus-escalation service repriced per resolution, while divesting commodity voice seats.', 'This captures the productivity, decouples revenue from headcount, and uses the data moat.'),
          option('defend', 'Defend the per-seat model and wait for the threat to pass.', 'Per-seat billing dies with the seats; waiting surrenders the client base to tech vendors.'),
          option('sell', 'Sell the whole business now.', 'The data, relationships, and workflow knowledge are worth more deployed than exited cheaply.'),
        ]),
        part('evidence', 'Supporting evidence', 'seats-math', [
          option('seats-math', 'About 1,400 seats, 28% of the business, are exposed, and the bot price resets expectations on the rest.', 'This quantifies the direct hit and names the deeper pricing damage.'),
          option('forty', '40% of the whole business is eroding.', 'The 40% applies to the 70% voice line: the direct exposure is 28%.'),
          option('growth', 'AI will grow the client’s seat count.', 'The entire premise is that automation removes volume.'),
        ]),
        part('risk', 'Risk / next step', 'data-rights', [
          option('data-rights', 'Confirm contractual ownership of call transcripts, the hinge for tuning models, and watch insurers building in-house.', 'Without data rights there is no moat; with them, the main risk is being bypassed, so move first.'),
          option('privacy-last', 'Treat privacy liability as someone else’s problem.', 'In a regulated industry, mishandled claims data lands on the operator.'),
          option('hire', 'Hire 1,400 replacement agents.', 'That rebuilds the eroding line instead of repositioning it.'),
        ]),
      ] },
    ],
  },
  {
    id: 'butcher-shop-throughput', title: 'Walk or run the cows?', category: 'Strategy', sector: 'Food processing', level: 'Foundation', focus: 'Size demand before paying for capacity', pages: '36–38',
    brief: 'A fast-food chain’s meat-processing shop can process cows walking or running in. Running triples daily output but more than doubles cost. Demand is what it is. Which should the manager choose?',
    sourceNote: 'Adapted from HBS Management Consulting Club Case Interview Guide, practice case 2 “Butcher Shop”. Throughput, cost, and demand figures are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What is the right order of analysis?', options: [
        option('order', 'Capacity and unit cost in each mode, then demand, then match the two.', 'Cost per burger falls when running, but that only matters if demand exists to absorb the output.'),
        option('cost-only', 'Pick the mode with the lowest cost per burger.', 'Cheapest per unit is misleading if the extra units cannot be sold.'),
        option('quality', 'Whether customers prefer fresh burgers.', 'Both modes produce fresh burgers; the question is throughput against demand.'),
      ], correct: 'order', hint: 'Supply, then cost, then demand, then match.', reveal: ['Each cow makes 20 hamburgers; the shop runs 10 hours a day, 5 days a week.', 'Walking processes 10 cows an hour (2,000 burgers a day, 10,000 a week); running processes 25 an hour (5,000 a day, 25,000 a week).', 'Weekly cost: $6,000 walking, $12,500 running, so $0.60 versus $0.50 per burger.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that decide this.', correct: ['unit-cost', 'demand'], options: [
        option('unit-cost', 'Cost per burger in each mode, from weekly cost and weekly output.', 'Running drops unit cost by $0.10, which matters only against what demand can absorb.'),
        option('demand', 'Weekly demand from the 10 outlets’ funnel: population, share, target segment, visit frequency, burger share.', 'Demand, about 10,000 burgers a week, is exactly what walking capacity already meets.'),
        option('welfare', 'The ethics of running cattle.', 'Outside the scope of a throughput and demand decision.'),
        option('mechanise', 'Whether to automate the processing room further.', 'A bigger investment raises the same question: is there demand for the extra output?'),
      ], hint: 'Cheap burgers nobody buys are still waste.', model: 'Compare capacity and unit cost in both modes, then build demand bottom-up: 10 outlets × 30,000 people × 25% share × 40% target demographic × a third who visit × 2 visits a week × 50% ordering burgers = about 10,000 burgers a week. Walking already meets that; running adds cost without revenue.' },
      { kind: 'calculation', prompt: 'Using the demand funnel, how many burgers a week do the 10 outlets need?', unit: 'burgers per week', answer: 10 * 30000 * .25 * .4 / 3 * 2 * .5, tolerance: 0.01, dataNote: 'All funnel figures are case assumptions from the source.', exhibit: [['Step', 'Value'], ['Population served', '10 outlets × 30,000 = 300,000'], ['Market share', '25% → 75,000'], ['Target demographic', '40% → 30,000'], ['Regular visitors', '÷ 3 → 10,000'], ['Visits a week', '× 2 = 20,000'], ['Order a burger', '50% → ?']], hint: 'Multiply the funnel down, then halve for burger orders.', working: '300,000 × 25% = 75,000; × 40% = 30,000; ÷ 3 = 10,000 regular customers; × 2 visits = 20,000 visits; × 50% = 10,000 burgers a week. Walking capacity of 10,000 a week matches it exactly.', options: [
        option('demand', '10,000', 'Correct: the funnel lands on 10,000 a week.', 10000),
        option('visits', '20,000', 'That counts visits before halving for the share who order burgers.', 20000),
        option('capacity', '25,000', 'That is what running can produce, not what is demanded.', 25000),
      ] },
      { kind: 'choice', prompt: 'Running costs $0.10 less per burger. Why walk anyway?', options: [
        option('waste', 'Demand is only 10,000 a week; running produces 15,000 unsold burgers while adding $6,500 of cost.', 'A lower unit cost on volume nobody buys is a worse business, not a better one.'),
        option('simpler', 'Walking is simpler to manage.', 'The deciding factor is demand versus capacity, not managerial ease.'),
        option('quality', 'Running lowers burger quality.', 'Nothing in the case links speed to quality; the economics decide it.'),
      ], correct: 'waste', hint: 'Unit cost is not the same as profit when output exceeds demand.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Match capacity to demand and cite the funnel.', model: 'Have the cows walk: it meets the 10,000-burger weekly demand exactly and keeps meat fresh. Running would cost $6,500 more a week to make 15,000 burgers the outlets cannot sell; the $0.10 unit saving only pays if demand grows. Revisit if new outlets or share gains lift demand toward 25,000 a week.', parts: [
        part('action', 'Action', 'walk', [
          option('walk', 'Walk the cows, matching 10,000 a week of capacity to 10,000 of demand.', 'Meets demand fully at the lower total cost; running adds capacity nobody buys.'),
          option('run', 'Run, since $0.50 a burger beats $0.60.', 'The unit saving applies to 25,000 burgers; only 10,000 sell, so total cost rises $6,500.'),
          option('expand', 'Run and find new outlets to absorb the surplus.', 'Building demand is a different project; decide throughput on the demand that exists.'),
        ]),
        part('evidence', 'Supporting evidence', 'funnel-number', [
          option('funnel-number', 'The funnel gives 10,000 burgers a week, exactly walking capacity; running adds $6,500 for unsold output.', 'This ties the demand estimate to the capacity choice.'),
          option('cost-gap', 'Running halves the unit cost.', 'It cuts unit cost by $0.10, 17%, not half.'),
          option('share', 'Each outlet already serves all 30,000 people nearby.', 'A 25% share among three competitors gives 7,500 potential customers per outlet.'),
        ]),
        part('risk', 'Risk / next step', 'watch-demand', [
          option('watch-demand', 'Watch demand growth from new outlets or share gains; rerun the comparison near 25,000 a week.', 'The walk decision holds only while demand stays near current capacity.'),
          option('assume', 'Assume demand will grow to fill running capacity.', 'Hope is not demand; decide on the measured funnel.'),
          option('price', 'Cut burger prices to create demand.', 'Pricing decisions belong to the chain’s strategy, and lowering price to justify capacity is backwards.'),
        ]),
      ] },
    ],
  },
  {
    id: 'juice-producer-mix', title: 'Gallons that grow and profits that fall', category: 'Profitability', sector: 'Beverages', level: 'Intermediate', focus: 'Check the price per unit against the cost each product carries', pages: '39–40',
    brief: 'A juice producer added plastic gallon packs beside its 18-ounce cartons. Sales grew about 20% a year but profits fell. Find out why.',
    sourceNote: 'Adapted from HBS Management Consulting Club Case Interview Guide, practice case 3 “Juice Producer”. Pack sizes, prices, and the sales mix are from the source.',
    steps: [
      { kind: 'choice', prompt: 'Sales are up and profits are down. Where do you look first?', options: [
        option('costs', 'The cost side: what the new packaging, machinery, and labour actually cost versus what the price recovers.', 'Rising sales with falling profits points at costs or price, and the change coincides with the new gallon line.'),
        option('volume', 'Whether sales are really growing.', 'Given: sales grew about 20% a year. Take the fact and diagnose the profit fall.'),
        option('competitors', 'Whether competitors entered the juice market.', 'Nothing suggests share loss; volume is growing, so the issue is economics per unit.'),
      ], correct: 'costs', hint: 'Growing revenue plus shrinking profit means look at cost and price, not demand.', reveal: ['Prices after a $0.50 across-the-board rise: carton $2.50 for 18 oz, gallon $4.00 for 36 oz.', 'Gallon packaging costs more (plastic over paper), needed new machinery, and uses more expensive skilled labour.', 'Overhead is allocated by dividing total factory costs by units produced; gallons are now 60% of unit sales.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that expose the problem.', correct: ['unit-price', 'cost-allocation'], options: [
        option('unit-price', 'Price per ounce of each pack, against the volume mix.', 'Per ounce, the gallon sells for less than the carton even though it costs more to make.'),
        option('cost-allocation', 'How costs are allocated: averaging all factory costs across every unit.', 'Averaging loads gallon costs onto cartons and underprices the very product that is growing.'),
        option('advertising', 'Whether marketing spend rose with the new pack.', 'No evidence points to marketing; the cost drivers named are packaging, machinery, and labour.'),
        option('seasonality', 'Seasonal demand swings for juice.', 'A steady multi-year profit decline is structural, not seasonal.'),
      ], hint: 'Compare like for like: price per ounce, and who carries which costs.', model: 'Split profit into price, cost, and mix. Price per ounce: carton $2.50 ÷ 18 ≈ 13.9¢, gallon $4.00 ÷ 36 ≈ 11.1¢, so the bigger, costlier pack sells for about 20% less per ounce. Cost allocation by units produced hides the gallon’s true cost. With gallons at 60% of sales, every incremental sale loses more.' },
      { kind: 'calculation', prompt: 'How does the gallon’s price per ounce compare with the carton’s?', unit: '% lower', answer: (1 - (4 / 36) / (2.5 / 18)) * 100, tolerance: 0.01, dataNote: 'Pack sizes and prices from the case.', exhibit: [['Pack', 'Size', 'Price', 'Price per oz'], ['Carton', '18 oz', '$2.50', 'about 13.9¢'], ['Gallon', '36 oz', '$4.00', 'about 11.1¢']], hint: 'Divide each price by its ounces, then compare.', working: 'Carton: 2.50 ÷ 18 ≈ 13.9¢ per ounce. Gallon: 4.00 ÷ 36 ≈ 11.1¢ per ounce. Ratio = 11.1 ÷ 13.9 = 0.8, so the gallon sells about 20% cheaper per ounce, despite higher cost.', options: [
        option('per-oz', 'About 20% lower', 'Correct: (4 ÷ 36) ÷ (2.5 ÷ 18) = 0.8.', 20),
        option('sticker', '60% higher', 'That compares sticker prices: 4 ÷ 2.5 = 1.6. The gallon holds twice the juice, so per ounce it is cheaper.', 60),
        option('same', 'The same per ounce', 'Twice the size would cost $5 at carton rates; at $4 it is cheaper per ounce.', 0),
      ] },
      { kind: 'choice', prompt: 'Why did profits fall as the gallon’s share of sales rose to 60%?', options: [
        option('underpriced', 'The gallon is priced 20% lower per ounce while carrying higher real costs; growth in it diluted every sale.', 'Averaged overhead hid the true cost, so the mix shift toward the underpriced pack dragged profit down.'),
        option('volume', 'Total volume fell as gallons grew.', 'Sales grew about 20% a year; the problem is per-unit economics, not volume.'),
        option('quality', 'Customers disliked the gallon and bought less juice.', 'The gallon grew to 60% of sales because customers liked it; they just were not charged enough.'),
      ], correct: 'underpriced', hint: 'Follow the cost each product actually causes.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Fix costing, then price, and cite the per-ounce gap.', model: 'Do activity-based costing so each pack carries its real direct and overhead costs, then reprice the gallon: at 20% cheaper per ounce despite higher cost, it needs a higher price or a smaller pack. Recheck the mix economics as volumes shift, since gallons at 60% of sales amplify any mispricing.', parts: [
        part('action', 'Action', 'abc', [
          option('abc', 'Run activity-based costing and reprice the gallon to cover its true cost.', 'This directly fixes the misallocation and the underpriced pack.'),
          option('drop', 'Drop the gallon line entirely.', 'Demand for it is strong; fix the price before killing a growing product.'),
          option('raise-all', 'Raise both prices by another $0.50.', 'An across-the-board rise repeats the mistake; the packs need different economics.'),
        ]),
        part('evidence', 'Supporting evidence', 'ounces', [
          option('ounces', 'The gallon sells for about 11.1¢ an ounce versus 13.9¢ for the carton, about 20% lower, while costing more to make.', 'This is the mispricing that turns growth into falling profit.'),
          option('sticker2', 'The gallon is priced 60% higher, so it cannot be underpriced.', 'Sixty per cent higher on the sticker is 20% lower per ounce; the unit of comparison matters.'),
          option('mix', 'Gallons are only a small share of sales.', 'They are 60% of unit sales, which is why the mispricing hurts so much.'),
        ]),
        part('risk', 'Risk / next step', 'elasticity', [
          option('elasticity', 'Test price elasticity before re-anchoring the gallon, and monitor the mix shift.', 'A higher gallon price may shift demand back to cartons; measure before locking it in.'),
          option('nothing', 'No further work; volumes will fix profits.', 'Volume was already growing while profits fell; volume alone changes nothing.'),
          option('ads2', 'Increase advertising for cartons.', 'Advertising does not correct a costing and pricing error.'),
        ]),
      ] },
    ],
  },
  {
    id: 'vietire-tariff', title: 'Ten years of falling tariffs', category: 'Strategy', sector: 'Manufacturing', level: 'Intermediate', focus: 'Put a date on the threat, then spend the years lowering cost', pages: '43–44',
    brief: 'VieTire, Vietnam’s only tire maker, is protected by a 50% tariff that the government will cut by 5 points a year for ten years. Assess the situation and advise how to respond.',
    sourceNote: 'Adapted from HBS Management Consulting Club Case Interview Guide, practice case 5 “VieTire”. Cost structures, shipping, and the tariff schedule are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('costs', 'VieTire’s cost structure versus a foreign rival’s landed cost, and how the tariff changes it year by year.', 'The threat is a landed-cost crossover. Put both cost stacks side by side and let the tariff schedule date it.'),
        option('retaliate', 'How to lobby the government to keep the tariff.', 'The reduction is decided; plan for the world as announced.'),
        option('exports', 'Whether VieTire can export to offset domestic losses.', 'Possible later; first size the domestic threat the client asked about.'),
      ], correct: 'costs', hint: 'The question is when an imported tire beats a domestic one on cost.', reveal: ['VieTire’s tire costs $40 to make: labour 40%, raw materials 20%, other 40%. A US rival produces at $30 with $4 shipping to Vietnam.', 'The tariff, now 50% of production-plus-shipping cost, falls 5 percentage points a year for ten years.', 'Rival technology keeps improving, so their $30 cost may fall further.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that shape the response.', correct: ['landed', 'restructure'], options: [
        option('landed', 'The imported landed cost under each year’s tariff, against VieTire’s $40.', 'This dates the threat: imports stay above $40 until the tariff nears 20%, around year 6.'),
        option('restructure', 'VieTire’s own cost re-engineering: technology, labour productivity, and customer loyalty before imports arrive.', 'The tariff only buys time; closing the cost gap is what survives year 6.'),
        option('pricing-today', 'Immediate price cuts to build goodwill.', 'Cutting price today sacrifices margin years before competitors even enter.'),
        option('product', 'Launching a premium tire line.', 'A premium line does not answer the cost crossover in the volume market.'),
      ], hint: 'Date the crossover, then close your own gap before it arrives.', model: 'Landed cost = ($30 + $4) × (1 + tariff): $51 now, about $40.80 at 20% in year 6, when rivals can enter. VieTire’s labour-heavy $40 cost must fall through technology and productivity. Use the protected years to re-engineer cost and lock in customer loyalty.' },
      { kind: 'calculation', prompt: 'What is the landed cost of an imported tire today, at the 50% tariff?', unit: '$ per tire', answer: (30 + 4) * 1.5, tolerance: 0.01, dataNote: 'Production cost, shipping, and tariff base from the case.', exhibit: [['Component', 'Amount'], ['US production cost', '$30'], ['Shipping to Vietnam', '$4'], ['Tariff', '50% of cost + shipping'], ['VieTire domestic cost', '$40']], hint: 'Apply the tariff to cost plus shipping, not to production cost alone.', working: 'Landed cost = (30 + 4) × 1.5 = $51, comfortably above VieTire’s $40. At a 20% tariff in year 6 it falls to about $40.80, near the crossover.', options: [
        option('landed', '$51', 'Correct: 34 × 1.5.', 51),
        option('no-ship', '$49', 'That tariffs only the $30 production cost then adds shipping: 45 + 4. The tariff applies to the whole $34.', 49),
        option('tariff-out', '$45', 'That adds the tariff to the $30 but forgets shipping entirely.', 45),
      ] },
      { kind: 'choice', prompt: 'The source projects entry around year 6 at a 20% tariff. What makes that date fragile?', options: [
        option('faster-costs', 'Foreign costs are still falling with technology, so the crossover can arrive sooner than the tariff schedule suggests.', 'The $30 rival cost is not static; improving technology pulls the entry date forward.'),
        option('fixed', 'The date is fixed because the tariff schedule is fixed.', 'The schedule is fixed, but the cost it multiplies is not.'),
        option('never', 'Rivals will never enter because Vietnam is too small.', 'A $51-to-$40 cost path toward a dominant market is exactly what attracts entrants.'),
      ], correct: 'faster-costs', hint: 'Which input in the landed-cost formula is still moving?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Use the protected years; cite the $51 versus $40 gap.', model: 'Treat the tariff as borrowed time, not protection. Benchmark world-class production and re-engineer VieTire’s labour-heavy cost base, invest in technology and workforce skills while containing wages, and build customer loyalty to hold share. Imports cost $51 today against $40 domestically, but the gap closes around year 6, earlier if rival costs keep falling.', parts: [
        part('action', 'Action', 'restructure', [
          option('restructure', 'Re-engineer production to cut the labour-heavy $40 cost, and build loyalty before year 6.', 'The only durable defence is a competitive cost base plus customers who stay.'),
          option('lobby-2', 'Spend the period lobbying to restore the tariff.', 'The policy direction is set; a plan dependent on reversing it is not a plan.'),
          option('price-cut', 'Cut prices now to pre-empt entry.', 'Rivals cannot enter at $51 landed cost; cutting price now just gives away margin.'),
        ]),
        part('evidence', 'Supporting evidence', 'fifty-one', [
          option('fifty-one', 'Landed imports cost $51 today versus VieTire’s $40, reaching about $40.80 at a 20% tariff in year 6.', 'This dates the threat and shows the window for restructuring.'),
          option('already', 'Imports already undercut VieTire today.', 'At $51 landed, imports are $11 above the domestic cost.'),
          option('static', 'The $30 US cost is fixed, so year 6 is certain.', 'Technology keeps pushing rival costs down; the entry date is likely earlier.'),
        ]),
        part('risk', 'Risk / next step', 'benchmark', [
          option('benchmark', 'Track foreign cost trends and benchmark production yearly; assume entry before year 6.', 'The fragile input is the rival’s $30 cost; monitor it rather than trusting the schedule.'),
          option('ignore-labour', 'Leave labour practices unchanged.', 'Labour is 40% of cost and the reason VieTire costs more; it is the first thing to fix.'),
          option('diversify', 'Diversify into other products first.', 'A distraction from the core task: making tires competitively.'),
        ]),
      ] },
    ],
  },
  {
    id: 'e2w-fleet-entry', title: 'A premium badge meets the delivery fleet', category: 'Market entry', sector: 'Electric vehicles', level: 'Intermediate', focus: 'Sell a thin-margin entry on capacity absorption, not blended margin', pages: '140–141',
    brief: 'A premium electric two-wheeler maker is split on entering the commercial delivery-fleet segment. A rival just launched a sub-$50,000 scooter for riders. Should it enter, and how?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 43 “Fleet Segment Entry of E2W Maker”. Rider base, penetration, prices, and margins are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you pin down first?', options: [
        option('objective', 'What the client is optimising for, margin and brand or volume, and who the fleet buyer is.', 'Management has said margin and brand, not volume, and fleet operators are a different customer from retail buyers. Both shape the whole analysis.'),
        option('price', 'What price the rival is charging.', 'The rival’s sub-$50,000 scooter matters, but first learn what the client wants and who buys fleet vehicles.'),
        option('tech', 'Which battery chemistry the fleet scooter should use.', 'A product detail that does not help decide whether the segment is worth entering.'),
      ], correct: 'objective', hint: 'Entry questions start with the client’s objective and its real customer.', reveal: ['Retail ASP is $130,000 at a 20% contribution margin; the client makes its own cells and motors.', 'About 2 million riders work across food delivery, quick commerce and parcel logistics, and half are expected to ride EVs within five years.', 'Fleet riders cover 80-100 km a day, 3-4 times retail usage, so bikes are replaced every 2 years.', 'A fleet scooter sells for about $65,000 at a 10% contribution margin.', 'Fleet sales are mostly B2B to operators and platforms; some go through rider subscriptions.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO strands that decide the entry case.', correct: ['sizing', 'contribution'], options: [
        option('sizing', 'Sizing annual fleet demand from riders, EV penetration, and the two-year replacement cycle.', 'The funnel converts a 2-million rider base into about 500,000–600,000 units a year at maturity.'),
        option('contribution', 'The contribution the entry adds versus what it does to blended margin and the fixed-cost base.', 'The unit margin is worse than retail, but every unit absorbs fixed cell and motor costs an under-utilised plant already carries.'),
        option('fashion', 'Which colours and styling the fleet scooter needs.', 'Fleet buyers optimise cost per kilometre and uptime, not styling.'),
        option('exports', 'Whether the fleet model could be exported.', 'The brief is about the domestic delivery segment; exports are a later question.'),
      ], hint: 'Size the prize, then judge it against the margin-versus-absorption trade-off.', model: 'Annual demand = addressable riders × EV penetration ÷ replacement cycle: about 2 million × 50% ÷ 2 years ≈ 500,000–600,000 units. At a conservative 15-18% share that is roughly 99,000 units and about $640 million of contribution at a 10% margin. Per-unit contribution is $6,500 versus $26,000 in retail, so the case for entry is fixed-cost absorption, battery-data learning, and blocking the rival, not margin accretion.' },
      { kind: 'calculation', prompt: 'At an 18% share of 550,000 mature annual demand, what annual contribution does the fleet business add?', unit: '$ million per year', answer: 550000 * .18 * 65000 * .1 / 1e6, tolerance: 0.1, dataNote: 'Rider base, penetration, replacement cycle, price, and margins from the case; share and demand are the source’s own assumptions.', exhibit: [['Step', 'Value'], ['Mature annual demand', '2 million riders × 50% EV ÷ 2-year cycle ≈ 550,000 units'], ['Client share', '18% → 99,000 units'], ['Price × contribution margin', '$65,000 × 10% = $6,500 per unit'], ['Annual contribution', '99,000 × $6,500']], hint: 'Multiply units by per-unit contribution, not by price alone.', working: '99,000 units × $6,500 contribution = $643.5 million a year, about $640 million. Revenue is a much bigger $6.435 billion, but only 10% of it drops through as contribution, versus $26,000 a unit in retail.', options: [
        option('c64', 'About $640 million', 'Correct: 99,000 units × $6,500 per unit ≈ $643.5 million.', 643.5),
        option('c643', 'About $6.43 billion', 'That is the revenue line: 99,000 × $65,000. Only the 10% margin is contribution.', 6435),
        option('c6', 'About $64 million', 'That is a 1% margin, not 10%: contribution per unit is $6,500, not $650.', 64.35),
      ] },
      { kind: 'choice', prompt: 'Unit economics look four times worse than retail. What still makes the entry attractive?', options: [
        option('absorb', 'Every fleet unit absorbs fixed cell and motor costs the under-utilised plant already carries, plus faster battery-data learning.', 'Vertical integration means incremental volume spreads fixed cost, and 3-4 times the usage multiplies the battery data flywheel.'),
        option('margin-up', 'Fleet margins will quickly rise above 20%.', 'Fleet buyers optimise cost per kilometre; there is no sign the thin margin self-corrects.'),
        option('cross-sell', 'Fleet riders will upgrade to the premium family scooter.', 'Fleet operators were never going to buy the $130,000 scooter, so the two customer groups do not overlap.'),
      ], correct: 'absorb', hint: 'What does vertical integration do to how you judge incremental volume?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Enter, but protect the premium badge and correct the margin expectation.', model: 'Enter, but treat it as strategy rather than margin: the volume soaks up fixed cost in an integrated plant that is running below capacity, accelerates the battery-data flywheel, and blocks the rival’s beachhead, adding roughly $640 million of contribution at maturity. Protect the premium brand by launching under a separate sub-brand, since the fleet buyer does not pay for the badge anyway, and sell straight to operators through leasing or a pay-per-use EV service rather than the retail dealer network.', parts: [
        part('action', 'Action', 'enter', [
          option('enter', 'Enter under a separate sub-brand, selling direct to fleet operators on leasing or EV-as-a-service terms.', 'This captures the absorption and data benefits while shielding premium brand equity.'),
          option('stay-out', 'Stay out; the $6,500 per-unit contribution is too thin.', 'That ignores fixed-cost absorption and hands the segment to the rival unopposed.'),
          option('badge', 'Enter under the main premium badge to leverage its equity.', 'A delivery workhorse dilutes the aspirational story, and the fleet buyer was never paying for it.'),
        ]),
        part('evidence', 'Supporting evidence', 'sixtyfour', [
          option('sixtyfour', 'At 18% of mature demand the fleet adds about 99,000 units and roughly $640 million of contribution, on top of absorbing fixed costs the plant already carries.', 'This is why a thin-margin segment can still be worth entering.'),
          option('retail-margin', 'Fleet earns the same 20% contribution margin as retail.', 'The case gives 10% for fleet versus 20% retail, about $6,500 against $26,000 a unit.'),
          option('accretive', 'The entry will lift blended margins immediately.', 'Blended margins dilute; the source says to correct that expectation before launch.'),
        ]),
        part('risk', 'Risk / next step', 'brand-risk', [
          option('brand-risk', 'Set expectations that this is strategic, not margin-accretive, and watch for premium-brand spillover.', 'If the board expects margin accretion, the programme gets killed on the wrong metric.'),
          option('no-risk', 'There is no meaningful risk once the unit economics are positive.', 'Cannibalisation is low, but brand dilution and dealer-channel misfit are real.'),
          option('price-risk', 'The main risk is that the rival raises its price.', 'A rival price rise helps; the risks are brand spillover and execution in a B2B motion.'),
        ]),
      ] },
    ],
  },
  {
    id: 'bnpl-uae-entry', title: 'Checkout credit on a $5 billion checkout', category: 'Market entry', sector: 'Payments', level: 'Advanced', focus: 'Pick the vertical where existing assets give a right to win', pages: '142–143',
    brief: 'A Dubai e-commerce leader backed by an Indian payments major wants to enter UAE fintech. Which of four verticals should it launch, and how?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 44 “Fintech in UAE Market”. GMV, adoption, commission, and default assumptions are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('mandate', 'Whether the entry decision is already made, the profit objective, and the client’s standing in UAE e-commerce.', 'The client has decided to enter; the question is what to launch. It holds over 50% share and $5 billion GMV, which is the asset that shapes everything.'),
        option('licence', 'Which banking licence the client should apply for.', 'Licensing matters later; it does not choose between the four verticals.'),
        option('hiring', 'How many engineers the fintech team needs.', 'A staffing question, not a strategy screen.'),
      ], correct: 'mandate', hint: 'Entry is decided; the question is which vertical, so start with objective and assets.', reveal: ['Four verticals are under review: a P2P wallet, BNPL at checkout, wealthtech and broking, and an insurance/credit marketplace.', 'The client leads UAE e-commerce with over 50% share and $5 billion annual GMV; it wants profit maximised over five years.', 'The market is highly digitised: 95% banked, cash under 10% of transaction value.', 'Two well-funded regional BNPL players plus bank instalment products already compete.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO screens that best choose the vertical.', correct: ['right-to-win', 'profit-pool'], options: [
        option('right-to-win', 'Right to win: which vertical can use the client’s checkout flow, merchant network, and customer data.', 'BNPL sits inside a flow the client already owns; wealthtech and insurance need capabilities the platform lacks.'),
        option('profit-pool', 'Market attractiveness: the profit pool and competitive intensity of each vertical.', 'Checkout finance sits on top of retail spend, so its addressable base is essentially the client’s own GMV.'),
        option('novelty', 'Which vertical is newest and most exciting to customers.', 'A 90%-digital market rewards differentiation, not novelty for its own sake.'),
        option('exit', 'Which vertical is easiest to sell later.', 'Exit value does not screen which launch maximises five-year profit.'),
      ], hint: 'Screen on the assets the client can actually deploy, then on the size of the prize.', model: 'Of four verticals, only BNPL transfers the client’s assets: it is embedded in checkout, uses existing merchant contracts and customer transaction history, and lenders need no separate integration. A P2P wallet enters late into a 90% digital market, while wealthtech and insurance need underwriting and broking capability the platform lacks. Competitive intensity is real but rivals are third-party providers with a separate underwriting journey.' },
      { kind: 'calculation', prompt: 'What is Year-1 net profit from BNPL?', unit: '$ million', answer: 5e9 * .1 * (.05 - .02) / 1e6, tolerance: 0.01, dataNote: 'GMV, adoption, commission, and cost assumptions are all case assumptions from the source.', exhibit: [['Step', 'Value'], ['Platform GMV', '$5 billion'], ['BNPL adoption', '10% → $500 Mn volume'], ['Merchant commission', '5% → $25 Mn revenue'], ['Defaults + CapEx', '2% of volume → $10 Mn'], ['OpEx', 'Negligible, runs on existing IT']], hint: 'Net profit = volume × (commission − cost rate), not volume × commission.', working: 'BNPL volume = 5,000 × 10% = $500 Mn. Revenue = 500 × 5% = $25 Mn. Costs = 500 × 2% = $10 Mn. Net profit = 25 − 10 = $15 Mn in Year 1, small against the platform but a launch-year figure.', options: [
        option('fifteen', '$15 million', 'Correct: $25 Mn commission minus $10 Mn defaults and CapEx.', 15),
        option('twentyfive', '$25 million', 'That is gross commission before the 2% default and CapEx cost of $10 Mn.', 25),
        option('thirtyfive', '$35 million', 'That adds the $10 Mn cost to revenue instead of netting it out.', 35),
      ] },
      { kind: 'choice', prompt: 'What is the biggest threat to that thin margin?', options: [
        option('defaults', 'Credit defaults: a 200-basis-point rise adds $10 Mn of cost and wipes out two-thirds of the $15 Mn.', 'On a 3-point net margin, default risk is not a side issue; it decides whether the business works.'),
        option('adoption', 'Customers refusing BNPL at checkout.', 'The bigger risk is that adoption arrives but is unprofitable, not that it fails.'),
        option('fx', 'Currency swings between dirhams and dollars.', 'The exposure mentioned is credit, not currency.'),
      ], correct: 'defaults', hint: 'Which cost line can double on a small base and erase the profit?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Launch embedded, partner for the licence, and build the risk engine.', model: 'Launch BNPL inside the client’s own checkout. That is the one place where its transaction volume, merchant relationships and customer data give it an advantage. On the exercise assumptions it delivers about $15 Mn in Year 1 and scales towards $90 Mn as adoption climbs to 30%. Enter through a digital-bank partnership to go live in months without risking own capital, build underwriting on proprietary transaction data with low starting limits, then take a finance-company licence once the book proves out.', parts: [
        part('action', 'Action', 'partner', [
          option('partner', 'Launch embedded BNPL via a partner bank, then take a finance-company licence once the book scales.', 'The partner carries regulatory cover and lending risk while the client learns its default rates.'),
          option('licence-first', 'Apply for a full banking licence before launch.', 'A commercial licence takes years and heavy capital; the client wants speed to market.'),
          option('wallet', 'Lead with the P2P wallet instead.', 'A standalone wallet is undifferentiated in a 90% digital market and uses none of the client’s assets.'),
        ]),
        part('evidence', 'Supporting evidence', 'fifteen-m', [
          option('fifteen-m', 'Year-1 net profit is about $15 Mn on $500 Mn of BNPL volume, scaling towards $90 Mn by Year 5 if adoption triples and GMV compounds.', 'The small launch figure is the base, not the ceiling.'),
          option('twentyfive-m', 'Year-1 profit is $25 Mn.', 'That is gross commission; netting the 2% default and CapEx cost leaves $15 Mn.'),
          option('open-field', 'BNPL is an empty field in the UAE.', 'Two funded regional players and bank instalment products already compete; the edge is embedding, not emptiness.'),
        ]),
        part('risk', 'Risk / next step', 'credit', [
          option('credit', 'Build underwriting on transaction data, start users near $150 limits, and watch defaults weekly.', 'A 200-basis-point default swing erases most of the margin; risk management is the core.'),
          option('assume-bureau', 'Rely on bureau scores for new-to-country shoppers.', 'Young shoppers and expats have thin files; the client’s own order and repayment data is the better signal.'),
          option('marketing', 'Spend the first year on brand marketing.', 'Distribution is already inside the checkout; the scarce work is credit discipline.'),
        ]),
      ] },
    ],
  },
  {
    id: 'legal-ai-pricing', title: 'Pricing a paralegal’s AI assistant', category: 'Pricing', sector: 'Legal tech', level: 'Advanced', focus: 'Bracket the price: cost floor, competitor benchmark, value ceiling', pages: '181–182',
    brief: 'An Indian SaaS company is spinning off an AI tool for legal research and drafting, aimed at small to mid-sized firms. What should it charge per user per month?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 59 “Legal AI Solution Pricing”. Usage credits, salary, and saving shares are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('stack', 'The product’s place in the AI stack, its revenue model, and the pricing objective.', 'The client owns its RAG and application layer on third-party models, charges per user per month, and wants profit, not share. Each fact shapes the price.'),
        option('price-now', 'What price to announce at launch.', 'Picking a number before building the floor, benchmark, and ceiling puts the answer before the analysis.'),
        option('features', 'Which features to build next.', 'A roadmap question; the brief is pricing the product that exists.'),
      ], correct: 'stack', hint: 'Clarify the product, the model, and whether the client optimises for profit or share.', reveal: ['Target users are paralegals to mid-level associates at firms up to 150 employees; pricing is per user per month on a single tier.', 'Fixed costs are absorbed by the parent; variable cost is dominated by LLM API calls, about $800 a user at the P60 usage level, half of all variable cost.', 'The nearest competitor charges pay-as-you-go credits at $1 each: about 200 credits per research task and 50 per draft iteration, 15 cases a month.', 'The value lever is labour saved: 70% savings on research (25% of work) and 50% on drafting (20% of work) on an average $60,000 salary.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO lenses that bound the launch price.', correct: ['cost-floor', 'value-ceiling'], options: [
        option('cost-floor', 'Cost-based: variable cost plus a target margin sets the floor below which the product loses money.', 'At $800 API cost being half of variable cost, a 60% margin puts the floor near $4,000.'),
        option('value-ceiling', 'Value-based: the labour saving the tool unlocks per user sets the most it could ever charge.', '$16,500 of monthly saving is the theoretical ceiling; no customer pays it, but it caps the range.'),
        option('survey', 'A willingness-to-pay survey of law students.', 'Students are not the buyers; firms are, and trial usage data already exists.'),
        option('freemium', 'Whether to offer a free tier.', 'A packaging question that does not bound the paid price itself.'),
      ], hint: 'A floor from costs, a ceiling from value, and a benchmark in between.', model: 'Three lenses bound the price. Cost floor: $800 API cost at P60 usage is half of variable cost, so $1,600 total; at a 60% margin the floor is 1,600 ÷ 0.4 = $4,000. Competitor benchmark: 15 cases × (200 research + 50 × 2 drafting) credits ≈ $4,500. Value ceiling: labour saving of about $16,500 a month. Launch marginally above the competitor at about $4,500, well under the value ceiling.' },
      { kind: 'calculation', prompt: 'What is the value unlocked for the customer, the ceiling on any price?', unit: '$ per user per month', answer: .7 * .25 * 60000 + .5 * .2 * 60000, tolerance: 0.01, dataNote: 'Saving shares, task shares, and salary are case assumptions from the source.', exhibit: [['Task', 'Time saved', 'Share of work', 'Monthly saving'], ['Research', '70%', '25%', '$10,500'], ['Drafting', '50%', '20%', '$6,000'], ['Total value unlocked', '', '', '?']], hint: 'Multiply saving share × task share × salary for each task, then add.', working: 'Research: 70% × 25% × $60,000 = $10,500. Drafting: 50% × 20% × $60,000 = $6,000. Total value unlocked = $16,500 per user per month, the maximum a customer could rationally pay.', options: [
        option('v165', '$16,500', 'Correct: $10,500 from research plus $6,000 from drafting.', 16500),
        option('v105', '$10,500', 'That counts only research and drops the $6,000 drafting saving.', 10500),
        option('v27', '$27,000', 'That applies the task shares (45%) to the full salary without the saving rates; only 70% of research and 50% of drafting time is actually saved.', 27000),
      ] },
      { kind: 'choice', prompt: 'The value ceiling is $16,500. Why not charge near it?', options: [
        option('nascent', 'Competitors offer similar features in a nascent market, so the client can only price marginally above the $4,500 benchmark and extract the rest later.', 'When differentiation is not yet established, the competitor price anchors what customers will accept; the ceiling only frames headroom.'),
        option('illegal', 'Charging near the saving is illegal.', 'Value pricing is legal; the constraint is competitive, not regulatory.'),
        option('cost', 'The cost floor is $16,500.', 'The floor is near $4,000; $16,500 is the ceiling from customer value.'),
      ], correct: 'nascent', hint: 'Who else sells a similar tool, and what does their price do to yours?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Anchor to the competitor, sit above the floor, harvest the ceiling later.', model: 'Launch a single per-user tier at about $4,500 a month, marginally above the pay-as-you-go competitor and above the $4,000 cost floor, since differentiation is not yet established. Add usage limits or tiers to monetise heavy users beyond P60, and revisit pricing as features diverge. The $16,500 value ceiling shows headroom exists; it is captured through tiers over time, not at launch.', parts: [
        part('action', 'Action', 'anchor', [
          option('anchor', 'Price a single tier marginally above the competitor’s $4,500 equivalent, with usage limits for heavy users.', 'This undercuts nothing, sits above the cost floor, and leaves the value ceiling as headroom.'),
          option('ceiling-price', 'Price at $16,000 to capture most of the value created.', 'With similar features available at $4,500, that price will not sell in a nascent market.'),
          option('floor-price', 'Price at $4,000 to win share.', 'That is the cost floor at 60% margin, so it abandons the profit objective for share the client did not ask for.'),
        ]),
        part('evidence', 'Supporting evidence', 'bands', [
          option('bands', 'Cost floor $4,000, competitor equivalent $4,500, value ceiling $16,500; the launch price should sit just above the competitor.', 'The three lenses bound the decision and leave the recommendation one number to defend.'),
          option('ceiling-evidence', 'The tool unlocks $27,000 a month of value.', 'The correct ceiling is $16,500: $10,500 research plus $6,000 drafting.'),
          option('thin', 'The competitor prices far above cost, so there is no constraint.', 'The competitor at about $4,500 is only just above the $4,000 floor; the anchor is real.'),
        ]),
        part('risk', 'Risk / next step', 'usage', [
          option('usage', 'Watch API cost per user and token-maxing behaviour; add tiers if usage drifts above P60.', 'LLM cost is half of variable cost and behaviour-driven; the floor moves if usage does.'),
          option('ignore-cost', 'Fixed costs matter most, so track development spend.', 'The parent absorbs fixed cost; variable API cost is the moving piece.'),
          option('volume-risk', 'The main risk is signing too few firms in month one.', 'A nascent market normalises slowly; the sharper risk is cost per user breaking the floor.'),
        ]),
      ] },
    ],
  },
  {
    id: 'ipl-star-bid', title: 'A fair price for a superstar', category: 'Pricing', sector: 'Sports', level: 'Advanced', focus: 'Value a player from the revenue uplift he brings', pages: '172–173',
    brief: 'An IPL franchise is planning its bid for Virat Kohli at this year’s auction. What is a fair price to pay for him?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 56 “IPL Bidding”. Revenue mix, outcome probabilities, and uplift figures are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('method', 'How the bid will be valued: the client wants fair value, not a winning-at-any-cost number, and no sentimental factors apply.', 'Valuing by expected revenue uplift sets an upper limit on the bid; the client will not pay more.'),
        option('rivals', 'Which rival teams are bidding and how high.', 'Other teams are rational and value him similarly; competitor bids do not change the client’s fair value.'),
        option('fit', 'Whether Kohli still fits the team’s batting order.', 'The brief assumes the fit is real; the question is the price, not the selection.'),
      ], correct: 'method', hint: 'Fair value = the revenue uplift the player brings; the bid must sit below it.', reveal: ['An average IPL team earns about $2 billion a year: media rights 40%, brand sponsorships 25%, prize money 15%, tickets and merchandise 10% each.', 'Kohli’s arrival raises the expected finishing position: 30% stay 5th, 30% reach 4th, 25% reach 3rd, 10% final, 5% win, with no chance of doing worse.', 'That positional uplift adds about 14.5% to the variable streams, worth roughly $32.8 million on media rights and $43.5 million on prize money.', 'Kohli’s old team charged a 10% brand premium; occupancy rises from 70% to 77%, and merchandise moves with ticket sales.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO revenue lenses that drive most of the uplift.', correct: ['position', 'brand'], options: [
        option('position', 'Position-dependent streams: the expected value of better finishes on media-rights variable share and prize money.', 'The probability table over finishes converts directly into expected media and prize uplifts.'),
        option('brand', 'Brand and fan streams: the sponsorship premium, ticket occupancy, and merchandise that star power lifts.', 'A 10% premium on the brand stream plus occupancy-driven tickets and matching merchandise complete the uplift.'),
        option('cost', 'Kohli’s salary demands and coach preferences.', 'Costs are real and should be deducted from the benefit, but they refine the answer rather than build it.'),
        option('form', 'His likely batting average this season.', 'The case already encodes performance into the position probabilities; re-modelling form adds nothing.'),
      ], hint: 'Uplift comes from finishing higher and from monetising the star.', model: 'Fair value = expected revenue uplift across five streams. Media rights and prize money gain from the improved position probabilities ($32.8 million and $43.5 million, given). Brand deals gain a 10% premium on the $500 million stream, tickets rise with occupancy on the $200 million stream, and merchandise follows tickets. The summed uplift is the upper limit of the bid, less any extra costs his demands create.' },
      { kind: 'calculation', prompt: 'What is the total expected revenue uplift, the upper limit of the bid?', unit: '$ million', answer: 32.8 + 43.5 + 50 + 20 + 20, tolerance: 0.1, dataNote: 'Stream shares, the premium, and occupancy figures are case assumptions from the source.', exhibit: [['Stream', 'Basis', 'Uplift'], ['Media rights (variable part)', 'Given', '$32.8 million'], ['Prize money', 'Given', '$43.5 million'], ['Brand deals', '$500 million × 10% premium', '?'], ['Tickets', '$200 million × (77 − 70) ÷ 70', '?'], ['Merchandise', 'Follows tickets', '?']], hint: 'Derive the brand and ticket uplifts, then add the five streams.', working: 'Brand: 50 × 10% = $50 million. Tickets: 20 × 7 ÷ 70 = $20 million, and merchandise matches at $20 million. Total = 32.8 + 43.5 + 50 + 20 + 20 = $166.3 million. The bid must stay below it; any extra cost of the star’s demands is deducted before bidding.', options: [
        option('u16', '$166.3 million', 'Correct: 32.8 + 43.5 + 50 + 20 + 20 across the five streams.', 166.3),
        option('u31', '$316.3 million', 'That applies the 10% premium to all $2 billion of revenue ($200 million brand uplift) instead of the $500 million brand stream.', 316.3),
        option('u11', '$116.3 million', 'That forgets the $50 million brand premium, one of the largest streams.', 116.3),
      ] },
      { kind: 'choice', prompt: 'Why is $166.3 million an upper limit rather than the bid itself?', options: [
        option('costs', 'Star players bring extra costs, coaches, amenities, and demands, which must be deducted before bidding.', 'The uplift is gross benefit; the fair bid is benefit minus the cost of keeping the star.'),
        option('uncertainty', 'The probabilities are guarantees, so bid exactly that.', 'They are expectations, not guarantees, which argues for bidding below the limit, not at it.'),
        option('ego', 'Auctions always overpay, so add a premium.', 'Paying above value is the winner’s curse the method exists to avoid.'),
      ], correct: 'costs', hint: 'What still sits between expected benefit and a fair price?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Bid below the uplift; net out the star’s extra costs.', model: 'Bid up to but below $166.3 million, the expected revenue uplift across media, prize money, brand, tickets, and merchandise, net of the extra costs a superstar brings (coaches, amenities, special demands). The uplift is driven by better finishing positions and a 10% brand premium; since other teams value him similarly, discipline on the ceiling is what keeps the deal value-accretive.', parts: [
        part('action', 'Action', 'cap', [
          option('cap', 'Set the ceiling near $160 million, deduct expected star-related costs, and hold the line in the auction.', 'This converts the valuation into a bidding rule instead of a hope.'),
          option('overbid', 'Bid above $166.3 million to guarantee winning.', 'Overpaying destroys the very value the analysis quantified.'),
          option('skip', 'Do not bid; the analysis is too uncertain.', 'The uplift is expected value with explicit probabilities; uncertainty is priced in, not a reason to quit.'),
        ]),
        part('evidence', 'Supporting evidence', 'evidence1663', [
          option('evidence1663', 'Expected uplift is $166.3 million: $32.8 million media, $43.5 million prize money, $50 million brand premium, $20 million tickets, $20 million merchandise.', 'Each figure comes from a revenue share and the position probabilities.'),
          option('evidence25', 'The uplift is $316.3 million because brand gains 10% of all revenue.', 'The 10% premium applies to the $500 million brand stream, giving $50 million, not the whole $2 billion.'),
          option('evidence9', 'Uplift is $90 million, so bid cautiously.', 'That misses the $76.3 million from media and prize money driven by better finishes.'),
        ]),
        part('risk', 'Risk / next step', 'demands', [
          option('demands', 'Price the star’s special demands and deduct them; revisit if the auction runs past the net figure.', 'The hidden cost of superstars is the main gap between uplift and fair value.'),
          option('form-risk', 'Worry most about his batting form collapsing.', 'The probability table already prices performance; the unpriced item is the cost of keeping him.'),
          option('share-risk', 'Assume merchandise behaves differently from tickets.', 'The case treats them as highly correlated when a star joins.'),
        ]),
      ] },
    ],
  },
  {
    id: 'ott-hindi-acquisition', title: 'Buying the audience it could not build', category: 'Growth', sector: 'OTT', level: 'Advanced', focus: 'Compare an acquisition’s cost per premium user with organic acquisition cost', pages: '222–223',
    brief: 'A pan-India OTT platform has stagnated. It needs a short-term and long-term growth plan for its premium base, and one option is acquiring a Hindi content producer.',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 77 “OTT Platform Growth”. Subscriber counts, pricing, and the deal figures are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('objective', 'What growth means here, which segment is in scope, and the time horizon.', 'The client wants top-line growth only, on the premium segment, across short-term (one year) and long-term horizons.'),
        option('content', 'Which shows to produce next.', 'A programming decision; first learn what the client wants and where to play.'),
        option('churn', 'Why free users are leaving.', 'Free users are monetised by ads and stable; the focus is premium growth.'),
      ], correct: 'objective', hint: 'Growth of what, for whom, over how long?', reveal: ['The platform is freemium: 30 Mn ad-supported users and 3 Mn premium subscribers at $150 a month.', 'Content is English plus Hindi; in-house English content outperforms licensed content, and Hindi content is all licensed.', '80% of the market is held by a few majors (Netflix, Prime, Hotstar, Sony); the client prices above most rivals.', 'Tier-2 expansion and regional content are ruled out; the client believes tier-1 potential is untapped.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO growth levers the case actually develops.', correct: ['pricing', 'acquisition'], options: [
        option('pricing', 'Pricing architecture: limited-time discounts, annual and mobile-only plans, and tiers to grow premium without a permanent cut.', 'The single $150 plan sits above rivals; flexible plans create urgency and entry points.'),
        option('acquisition', 'Acquiring a Hindi content producer to fill the gap where in-house production has no experience.', 'In-house English content already outperforms licensed; the repeatable playbook is producing in-house, and buying is faster than building.'),
        option('tier2', 'Aggressive tier-2 expansion with regional content.', 'The client explicitly rules this out; stay inside the stated scope.'),
        option('sports', 'Diversifying into sports and news content.', 'A long-term adjacency the interviewer parked; the focus is the current content base.'),
      ], hint: 'One lever for the short term, one for the long term.', model: 'Short term: rework the single $150 plan into discounted limited-time offers, annual and mobile-only plans, and tiers. Long term: in-house English content outperforms licensed content, but the team lacks Hindi capability, so acquire rather than build. Target ABC, a Hindi producer with 5 Mn YouTube subscribers, weak monetisation, and an ask near $900 million, which would bring about 0.5 Mn loyal users plus convert about 1.5 Mn of the client’s free users to premium.' },
      { kind: 'calculation', prompt: 'The deal adds about 2 Mn premium users for $900 million. What is the effective acquisition cost per premium user?', unit: '$ per user', answer: 90e7 / 2e6, tolerance: 0.01, dataNote: 'Deal price, expected conversions, and the $500 industry acquisition cost are case figures from the source.', exhibit: [['Item', 'Value'], ['ABC loyal users converting', '0.5 Mn'], ['Client free users upgrading', '1.5 Mn'], ['Total new premium users', '2 Mn'], ['Acquisition price', '$900 million'], ['Organic acquisition cost', '$500 per user']], hint: 'Divide the price by the users it actually buys.', working: '900 million ÷ 2 Mn users = $450 per premium user, below the $500 organic acquisition cost. The deal also brings content capability and negotiating leverage, so it looks attractive on the numbers.', options: [
        option('c450', '$450', 'Correct: $900 million ÷ 2 Mn.', 450),
        option('c600', '$600', 'That divides by only the 1.5 Mn internal converts and forgets the 0.5 Mn ABC loyalists.', 600),
        option('c180', '$180', 'That divides by all 5 Mn YouTube subscribers; only about 0.5 Mn are expected to convert.', 180),
      ] },
      { kind: 'choice', prompt: '$450 per user beats the $500 organic CAC. What could still break the deal?', options: [
        option('content-risk', 'ABC may not keep producing hits; creative freedom and management incentives decide whether the 0.5 Mn users stay.', 'The valuation assumes the audience follows the content; if the creative team leaves, the subscribers follow them out.'),
        option('price-risk', '$450 is too high versus CAC.', 'It is below the $500 benchmark before counting synergies.'),
        option('tech', 'Merging two websites will take years.', 'Both are small digital operations; integration is not the hard part.'),
      ], correct: 'content-risk', hint: 'What does ABC actually sell, and can it walk away?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Short-term pricing moves, long-term acquisition with retained talent.', model: 'Short term, grow premium through limited-time discounts plus annual, mobile-only, and tiered plans rather than a permanent price cut. Long term, acquire ABC for Hindi content capability at about $450 per premium user versus $500 organic, gaining roughly 2 Mn subscribers and bargaining power with production houses. Retain ABC’s management and creative freedom, and structure the stock component so they are paid to keep producing.', parts: [
        part('action', 'Action', 'deal', [
          option('deal', 'Run flexible pricing now and open diligence on ABC, with retention and creative-freedom terms.', 'This pairs the short-term lever with the long-term capability buy.'),
          option('build', 'Build an in-house Hindi studio from scratch.', 'The team has no Hindi experience; buying is faster and the target is distressed.'),
          option('cut-price', 'Permanently cut the $150 price to match rivals.', 'A permanent cut surrenders margin; time-limited offers create urgency without closing off future rises.'),
        ]),
        part('evidence', 'Supporting evidence', 'cac', [
          option('cac', '$900 million buys about 2 Mn premium users at $450 each versus a $500 organic acquisition cost, before synergies.', 'This is the quantitative case for acquiring rather than building.'),
          option('cac600', 'The deal costs $600 a user.', 'That uses only the 1.5 Mn internal converts; including ABC’s 0.5 Mn loyalists gives $450.'),
          option('free', 'The free tier is worthless.', 'The 30 Mn free users are the conversion pool and the ad-revenue base the deal partly monetises.'),
        ]),
        part('risk', 'Risk / next step', 'talent', [
          option('talent', 'Lock in ABC’s top management with stock and creative freedom; test whether hit content continues.', 'The asset walks out the door if the creators leave.'),
          option('synergy-risk', 'Assume advertiser synergies are guaranteed.', 'Synergies are upside, not certainty; the subscriber and talent questions come first.'),
          option('english', 'Worry that English subscribers will flee Hindi content.', 'Possible churn is worth monitoring but secondary to whether ABC keeps producing.'),
        ]),
      ] },
    ],
  },
  {
    id: 'investment-platform-arpu', title: 'The ARPU gap no campaign will fix', category: 'Growth', sector: 'Financial services', level: 'Advanced', focus: 'Decompose ARPU into behaviour metrics before prescribing fixes', pages: '225–226',
    brief: 'A leading digital investment platform is the market leader by active investors but earns less per active customer than competitors. Accelerate revenue growth over three years.',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 78 “Digital Investment Platform”. Trade frequency, penetration, and per-unit revenues are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('levers', 'Whether the mandate is more customers or more revenue per existing customer, and what the revenue streams are.', 'The client explicitly wants revenue from existing customers, through brokerage, product commissions, and interest income.'),
        option('budget', 'How much the client can spend on marketing.', 'There are no significant capital constraints; the binding resource is which lever to pull.'),
        option('new-seg', 'Which new customer segments to enter.', 'Out of scope: the mandate is existing customers, though segmenting them by maturity still helps.'),
      ], correct: 'levers', hint: 'Revenue = customers × ARPU; find out which side is in scope.', reveal: ['Customers skew to first-time retail investors in Tier-2/3 cities; competitors carry more experienced investors.', 'Revenue splits into brokerage (trades × revenue per trade) and financial products (penetration × revenue per product customer), plus interest.', 'Benchmarks: 18 trades a year versus competitors’ 27; $22 versus $23 revenue per trade; product penetration 15% versus 34%; $420 versus $430 per product customer.', 'Initiatives compete for limited resources: engagement tools, cross-selling, advanced tools for experienced investors, and new products.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that locate the ARPU gap.', correct: ['decompose', 'benchmark'], options: [
        option('decompose', 'Decompose ARPU into trades × revenue per trade and penetration × revenue per product customer.', 'This separates behaviour gaps from pricing gaps.'),
        option('benchmark', 'Benchmark each component against competitors to see where the gap concentrates.', 'Frequency and penetration lag badly while per-unit pricing is near parity.'),
        option('surveys', 'Survey customers on which products they want.', 'Useful later for design; the diagnostic first needs the metric decomposition.'),
        option('churn-rate', 'Analyse why customers leave the platform.', 'The issue is revenue per active customer, not attrition.'),
      ], hint: 'Break ARPU into drivers, then compare each driver to the market.', model: 'ARPU = brokerage + product revenue. Client: 18 trades × $22 plus 15% × $420 ≈ $459. Competitor: 27 × $23 plus 34% × $430 ≈ $767. The gap is almost entirely behaviour, trading frequency and product penetration, not pricing, which fits a base of first-time investors. Prioritise engagement and cross-sell first, then advanced tools and new products.' },
      { kind: 'calculation', prompt: 'What is the client’s revenue per active customer?', unit: '$ per year', answer: 18 * 22 + .15 * 420, tolerance: 0.01, dataNote: 'All four inputs are case benchmarks from the source.', exhibit: [['Driver', 'Client', 'Competitor'], ['Trades per customer', '18', '27'], ['Revenue per trade', '$22', '$23'], ['Product penetration', '15%', '34%'], ['Revenue per product customer', '$420', '$430']], hint: 'ARPU = trades × revenue per trade + penetration × revenue per product customer.', working: 'Brokerage: 18 × $22 = $396. Products: 15% × $420 = $63. ARPU ≈ $459 versus competitors’ 27 × 23 + 34% × 430 ≈ $767. The gap is behaviour, not per-unit pricing.', options: [
        option('a459', '$459', 'Correct: $396 brokerage plus $63 product revenue.', 459),
        option('a767', '$767', 'That is the competitor ARPU: 27 × 23 + 34% × 430.', 767.2),
        option('a396', '$396', 'That is brokerage only; it omits the $63 of product revenue.', 396),
      ] },
      { kind: 'choice', prompt: 'Why is “raise prices” the wrong answer to this ARPU gap?', options: [
        option('parity', 'Revenue per trade and per product customer are already near competitor levels; the gap is how often customers use the platform, not what each use is worth.', '$22 versus $23 and $420 versus $430 are rounding differences; 18 versus 27 trades and 15% versus 34% penetration are the real gap.'),
        option('illegal', 'Brokerage prices are regulated.', 'The constraint is analytical, not legal.'),
        option('loyalty', 'Higher prices would attract customers.', 'Raising price does not fix a usage gap; it worsens it.'),
      ], correct: 'parity', hint: 'Compare per-unit economics first, then volumes.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Sequence by impact, investment, and time.', model: 'Grow ARPU through behaviour, not pricing. First lift engagement to raise trading frequency with portfolio insights, education, alerts, and review nudges, and cross-sell mutual funds, SIPs, ETFs, and insurance to close the 15% versus 34% penetration gap. Then add advanced tools for experienced investors and, last, adjacent products like retirement or lending once penetration improves. Prioritise by revenue potential, time to impact, and investment required.', parts: [
        part('action', 'Action', 'engage', [
          option('engage', 'Invest first in engagement and cross-sell: insights, education, alerts, and goal-based product recommendations.', 'The two biggest gaps, frequency and penetration, are the cheapest to move.'),
          option('new-products', 'Launch retirement and lending products immediately.', 'Highest investment, longest time to impact; earn the right after penetration improves.'),
          option('price-rise', 'Raise brokerage rates toward $30 a trade.', 'The gap is usage, and higher prices would depress the very frequency that needs lifting.'),
        ]),
        part('evidence', 'Supporting evidence', 'arpu-ev', [
          option('arpu-ev', 'Client ARPU is about $459 versus $767 for competitors, and per-unit prices are near parity; the gap is 18 versus 27 trades and 15% versus 34% penetration.', 'This is why engagement and cross-sell are the levers.'),
          option('pricing-ev', 'Per-trade revenue of $22 versus $23 explains the gap.', 'A $1 difference contributes about $20 a year; frequency and penetration contribute hundreds.'),
          option('acquisition-ev', 'The client trails on customer acquisition.', 'It is the market leader by active investors; the gap sits inside ARPU.'),
        ]),
        part('risk', 'Risk / next step', 'speculation', [
          option('speculation', 'Lift frequency through engagement without pushing speculation, and segment customers by maturity.', 'First-time investors need education and simple products; a one-size push damages trust.'),
          option('ignore-seg', 'Treat all customers the same to move fast.', 'A $459 ARPU built on first-time investors needs different tactics than experienced traders.'),
          option('measure', 'Do not track whether ARPU improves.', 'Revenue potential, time, and investment were the prioritisation criteria; impact needs measuring.'),
        ]),
      ] },
    ],
  },
  {
    id: 'egrocery-slotted-decline', title: 'The delivery slot nobody books anymore', category: 'Growth', sector: 'E-commerce', level: 'Intermediate', focus: 'Decompose a revenue decline into customers and frequency', pages: '212–213',
    brief: 'An e-grocery player selling across Tier-1 cities has seen muted growth for a year. Its quick-commerce arm grows healthily while slotted deliveries sag. Diagnose the cause.',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 72 “E-Grocery Player”. Customer, basket, and frequency figures are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('split', 'That the business runs two models, on-demand and slotted delivery, and that only slotted deliveries have slowed.', 'Quick commerce grows healthily, so the diagnosis should zoom into slotted deliveries rather than the whole company.'),
        option('marketing', 'Whether marketing spend was cut.', 'A plausible cause, but first locate where the decline sits; the client already knows it is not the on-demand arm.'),
        option('profit', 'Whether the metric is profit or sales.', 'The metric is sales, but the sharper clarification is which of the two models is dragging it.'),
      ], correct: 'split', hint: 'One service grows while the other stalls; start by separating them.', reveal: ['Slotted-delivery revenue last year: 500,000 customers × $1,200 basket × 24 orders = $14.4 billion.', 'This year: 425,000 customers × $1,200 × 22 orders = $11.22 billion, a fall of $3.18 billion (about 22%).', 'The client’s market share in slotted delivery is unchanged; the market itself has shrunk, and some competitors report the same.', 'Quick-commerce experience has improved with gamified interfaces, and working couples increasingly order groceries on-demand.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that explain the slotted decline.', correct: ['decompose', 'external'], options: [
        option('decompose', 'Decompose the revenue fall into the customer-count effect and the purchase-frequency effect.', 'Holding basket and frequency constant isolates the $2.16 billion lost to fewer customers.'),
        option('external', 'Since share is flat and rivals feel it too, look at external shifts: quick-commerce UX, work patterns, kirana loyalty.', 'A shrinking market with flat share points at industry causes, not client execution.'),
        option('pricing2', 'Check whether the client raised prices on baskets.', 'Basket value is flat at $1,200; price is not the driver.'),
        option('warehouse', 'Audit warehouse costs and delivery fleet efficiency.', 'A cost question, while the fall sits on the revenue side.'),
      ], hint: 'First split the decline, then ask whether the cause is internal or market-wide.', model: 'Revenue = customers × frequency × basket. Decomposition: customers fell 5L to 4.25L (worth −$2.16 billion) and frequency fell 24 to 22 (−$1.02 billion), so about 68% of the $3.18 billion decline is customer loss. With share flat and competitors hit too, the market itself shrank: better quick-commerce UX and changing work habits pulled planned, scheduled orders into on-demand.' },
      { kind: 'calculation', prompt: 'How much of the decline is attributable to losing customers? Hold basket and frequency at last year’s levels.', unit: '$ million decline', answer: (5 - 4.25) * 100000 * 1200 * 24 / 1e6, tolerance: 0.1, dataNote: 'Customer counts, basket value, and frequency are case figures from the source.', exhibit: [['Driver', 'Last year', 'This year'], ['Customers', '500,000', '425,000'], ['Average basket', '$1,200', '$1,200'], ['Orders per customer per year', '24', '22']], hint: 'Customer effect = change in customers × basket × old frequency.', working: 'Customer effect = (500,000 − 425,000) × $1,200 × 24 = 75,000 × 28,800 = $2.16 billion of the $3.18 billion fall, about 68%. The frequency effect, 425,000 × $1,200 × (22 − 24), is the other $1.02 billion.', options: [
        option('cust216', '$2.16 billion', 'Correct: 75,000 customers × $1,200 × 24 orders.', 2160),
        option('freq102', '$1.02 billion', 'That is the frequency effect on the new base: 425,000 × $1,200 × 2 orders.', 1020),
        option('total318', '$3.18 billion', 'That is the total decline; the question asks for the customer-driven share only.', 3180),
      ] },
      { kind: 'choice', prompt: 'The market shrank while share held. What does that tell you?', options: [
        option('industry', 'This is an industry-level shift to on-demand, so fixing the client’s own slotted operations alone will not restore growth.', 'Flat share plus falling market means external drivers: gamified quick-commerce UX and changed shopping habits.'),
        option('execution', 'The client must have an execution problem since revenue fell.', 'Flat share rules that out; the whole channel is losing customers.'),
        option('seasonal', 'It is a seasonal blip that will reverse next quarter.', 'A year of decline plus structural habit shifts argues against seasonality.'),
      ], correct: 'industry', hint: 'Share flat plus market down equals what diagnosis?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Follow the customers to on-demand rather than defending the slot.', model: 'Treat the decline as a channel shift, not an execution failure: customers moved to on-demand as quick-commerce UX improved and habits changed. Reallocate investment toward the quick-commerce experience and use slotted delivery for what it still does well, bulk planned orders, while rebuilding the customer funnel. The decomposition shows about 68% of the $3.18 billion fall is customer loss, so win-back and on-demand conversion matter more than frequency nudges.', parts: [
        part('action', 'Action', 'shift', [
          option('shift', 'Shift investment to the quick-commerce experience and win back lost customers into on-demand, keeping slots for bulk planners.', 'This follows the demand rather than defending a shrinking format.'),
          option('defend', 'Double down on slotted-delivery promotions to restore frequency.', 'Frequency explains only 32% of the fall; promotion spend fights the smaller driver.'),
          option('cut-cost', 'Cut slotted-delivery capacity to protect margin.', 'Possible as a supporting move, but it manages decline rather than addressing where customers went.'),
        ]),
        part('evidence', 'Supporting evidence', 'ev68', [
          option('ev68', 'Of the $3.18 billion fall, $2.16 billion (about 68%) is lost customers, and share is flat while the market shrank.', 'This is why the response targets win-back and channel shift, not just frequency.'),
          option('ev32', 'Frequency loss is the bigger driver.', 'Frequency accounts for $1.02 billion, about 32%, the smaller share.'),
          option('evshare', 'The client lost market share to rivals.', 'Share held constant; the market itself shrank, which is what makes it structural.'),
        ]),
        part('risk', 'Risk / next step', 'cannibalise', [
          option('cannibalise', 'Track whether on-demand growth cannibalises slotted profitably, and monitor kirana loyalty and habit shifts.', 'If the shift is structural, follow it; if habits revert, slots need a different answer.'),
          option('no-risk2', 'No risk; quick commerce is simply better.', 'Quick commerce carries different unit economics; the transition must be managed, not assumed.'),
          option('survey-risk', 'Commission a year-long study before acting.', 'A year of decline is enough signal; waiting cedes the on-demand customer to rivals.'),
        ]),
      ] },
    ],
  },
  {
    id: 'qexpress-due-diligence', title: 'Forty-five warehouses, eighteen months to pay back', category: 'M&A', sector: 'Quick commerce', level: 'Advanced', focus: 'Run commercial diligence as metrics to dollars: throughput, fill rate, break-even', pages: '253–254',
    brief: 'A large online retailer is looking at acquiring Q-Express to get into quick commerce faster. Q-Express runs 45 micro-warehouses in 30 Tier-2 cities. Run the commercial diligence.',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 89 “Q-Commerce Fulfillment Acquisition”. Warehouse metrics, budget, and break-even inputs are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('motive', 'The deal’s objective (speed versus cost), the budget and ROI timeline, and whether this is a full acquisition or a partnership.', 'The client buys speed into untapped T2 cities, budgets $1.5–2 billion, expects ROI in 18 months, wants a full acquisition, and needs go-live inside 6 months.'),
        option('price2', 'The exact valuation of Q-Express.', 'Valuation follows diligence; first understand what is being bought and why.'),
        option('handovers', 'Who runs Q-Express after the deal.', 'An integration detail; it does not structure the diligence.'),
      ], correct: 'motive', hint: 'Diligence is framed by why the buyer wants the asset.', reveal: ['23 of the target’s 30 cities overlap the client’s Phase 1-2 targets; groceries and FMCG fit q-commerce, though there is no cold chain yet.', 'Operations: 24-minute average delivery, 82% fill rate versus 90% benchmark, 88% pick accuracy versus 95%, 66% warehouse utilisation, 100% outsourced last mile.', 'Financials: $1.8 billion revenue at −4% EBITDA; per-order revenue $100 at 20% contribution margin; fixed cost about $200,000 per warehouse per month; current throughput 280 orders a day.', 'Tech: custom OMS with delayed inventory sync; 30% of warehouse leases renew within a year.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO diligence pillars that carry the verdict.', correct: ['ops', 'breakeven'], options: [
        option('ops', 'Operational capability: fill rate, pick accuracy, delivery time, and utilisation against benchmarks.', 'Fill rate at 82% and pick accuracy at 88% sit well under the 90%/95% benchmarks, the gaps the turnaround plan must close.'),
        option('breakeven', 'Financial viability: the per-warehouse break-even versus current throughput.', 'At $20 contribution an order, a warehouse needs about 333 orders a day against today’s 280.'),
        option('logo', 'Whether the Q-Express brand is worth keeping.', 'A branding question; the assets being bought are network and throughput.'),
        option('hr', 'Employee satisfaction scores at the target.', 'Secondary; the case tracks leases, tech, and process maturity instead.'),
      ], hint: 'The deal lives or dies on warehouse-level economics.', model: 'Diligence across four pillars: strategic fit (80% city overlap, category fit, missing cold chain), operations (fill rate 82% vs 90%, pick accuracy 88% vs 95%, 66% utilisation, outsourced fleet), financial viability (break-even ~333 orders/day vs 280 today; EBITDA −4% of $1.8 billion), and risks (30% leases renewing, lagged OMS sync, no forecasting). The turnaround levers: fill rate to 92%, hybrid owned/3PL fleet, real-time OMS.' },
      { kind: 'calculation', prompt: 'How many orders a day must a warehouse handle to break even?', unit: 'orders per day', answer: 200000 / 20 / 30, tolerance: 0.01, dataNote: 'Fixed cost, order value, and contribution margin are case assumptions from the source.', exhibit: [['Input', 'Value'], ['Monthly fixed cost per warehouse', '$200,000'], ['Revenue per order', '$100'], ['Contribution margin', '20% → $20 per order'], ['Current throughput', '280 orders/day']], hint: 'Break-even orders = fixed cost ÷ contribution per order, then per day.', working: 'Contribution per order = $100 × 20% = $20. Break-even = $200,000 ÷ $20 = 10,000 orders a month ÷ 30 ≈ 333 orders a day, against 280 today. Cutting variable cost $5 lifts contribution to $25 and drops break-even to about 267.', options: [
        option('b333', 'About 333', 'Correct: $200,000 ÷ $20 = 10,000 a month, ÷ 30 days.', 333.3333333333333),
        option('b67', 'About 67', 'That divides fixed cost by the full $100 order value instead of the $20 the warehouse keeps.', 66.66666666666667),
        option('b267', 'About 267', 'That uses the improved $25 contribution before the fill-rate and cost fixes are delivered.', 266.6666666666667),
      ] },
      { kind: 'choice', prompt: 'Throughput is 280 against a 333 break-even. Which lever closes the gap fastest?', options: [
        option('fillrate', 'Lifting fill rate toward 92% raises fulfilled demand, and cutting $5 of variable cost drops break-even to about 267.', 'Both levers work together: fill rate adds volume while pick accuracy and the hybrid fleet raise contribution.'),
        option('price-hike', 'Raise order prices 20% to lift contribution.', 'Order value and mix are set by the market; the case levers are fill rate and variable cost.'),
        option('close', 'Close the weakest warehouses immediately.', 'Premature; 66% utilisation is headroom, and lease timing decides which sites to keep, not panic.'),
      ], correct: 'fillrate', hint: 'Move both sides: more fulfilled orders and more contribution each.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Proceed, but make the seller prove the turnaround.', model: 'Proceed with a structured deal: $1.2 billion upfront plus a milestone-linked earnout inside the $1.5–2 billion budget. Earnout gates: 90%+ fill rate and 95% pick accuracy, break-even in at least 15 warehouses by year one, and real-time OMS sync with under 2% stockouts. Current EBITDA is −$72 million on $1.8 billion revenue, and the contribution plus throughput improvements target positive EBITDA in 12-18 months. Walk away if key lease renewals fail, the tech rebuild balloons, or the TAM proves smaller.', parts: [
        part('action', 'Action', 'earnout', [
          option('earnout', 'Acquire with $1.2 billion upfront and milestone-linked earnout tied to fill rate, break-even, and OMS sync.', 'Tying payment to proven performance derisks the turnaround the valuation depends on.'),
          option('full-price', 'Pay the full $1.5–2 billion upfront to close fast.', 'Paying for unproven projections hands the seller all the execution risk.'),
          option('build-own', 'Build the network from scratch instead.', 'The client is buying speed; building forfeits the first-mover window the deal exists for.'),
        ]),
        part('evidence', 'Supporting evidence', 'be333', [
          option('be333', 'Break-even is about 333 orders a day at $20 contribution versus 280 today; fill rate to 92% and $5 lower variable cost bring it below current volume.', 'This is the arithmetic behind the 12-18 month EBITDA turnaround.'),
          option('be267', 'Break-even is already 267 orders a day.', '267 needs the improved $25 contribution; today’s $20 implies 333.'),
          option('ebitda-ok', 'The target is already profitable.', 'EBITDA is −4% of $1.8 billion, a $72 million annual loss the earnout is designed to de-risk.'),
        ]),
        part('risk', 'Risk / next step', 'leases', [
          option('leases', 'Secure the 30% of leases renewing this year, converting critical sites to long-term or sale-leaseback.', 'A lapsed lease on a key city warehouse stalls the whole expansion thesis.'),
          option('culture', 'Focus on cultural integration workshops first.', 'The case flags leases, tech lag, and service levels; culture is not the binding constraint.'),
          option('none', 'No walk-away conditions needed.', 'Naming walk-away triggers, failed leases, tech rebuild cost, smaller TAM, is what makes the diligence credible.'),
        ]),
      ] },
    ],
  },
  {
    id: 'ai-assistant-acquisition', title: 'A $550 million answer to a weak assistant', category: 'M&A', sector: 'Consumer tech', level: 'Advanced', focus: 'Turn a strategic fit into a discounted cash-flow verdict', pages: '255–256',
    brief: 'A global consumer electronics giant wants to buy a $500M AI enterprise to replace its underperforming in-house assistant. Should it proceed?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 90 “AI Enterprise Acquisition”. Valuation, uplift, margin, tax, and discount assumptions are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('objective3', 'What the client wants from the deal and what the target contributes beyond the assistant.', 'The in-house assistant underperforms and the target’s superior assistant would slot into a device ecosystem; the objective defines which benefits count.'),
        option('price3', 'Whether $500M is negotiable.', 'Price is an input to NPV, not the first question.'),
        option('antitrust', 'Whether regulators will block the deal.', 'Relevant to risk, but the feasibility question comes first.'),
      ], correct: 'objective3', hint: 'M&A starts with the strategic reason for buying.', reveal: ['The target is valued at $500M; integration plus privacy compliance adds $50M.', 'The acquisition is projected to add $1 billion of annual revenue at a 25% EBIT margin and 20% tax rate.', 'The assistant is relevant for about 5 years; cash flows are discounted at 10%.', 'The target depends on multiple cloud providers, and device user data would reach its servers, raising privacy and integration risks.', 'Competitors may respond with their own AI acquisitions or marketing pushes.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO lenses that decide the deal.', correct: ['cashflow', 'dependencies'], options: [
        option('cashflow', 'Financial feasibility: net annual cash flow, discounted over five years, against the $550M all-in cost.', 'The DCF verdict, roughly $750M of present value against $550M, is the spine of the decision.'),
        option('dependencies', 'Dependencies and external risks: cloud reliance, data privacy, tech compatibility, and competitor response.', 'Each risk carries a cost or a mitigation that changes what the deal is worth.'),
        option('culture2', 'Whether the two companies have compatible cultures.', 'Mentioned, but the decisive work here is cash flow and the named dependencies.'),
        option('branding2', 'How to brand the assistant post-deal.', 'A naming question far below the go/no-go decision.'),
      ], hint: 'The numbers give the spine; dependencies can still break it.', model: 'Annual net cash flow = $1B revenue × 25% EBIT × (1 − 20% tax) = $200M. Over 5 years at a 10% discount rate, PV ≈ $750M. Less $500M price and $50M integration and compliance, NPV ≈ +$200M, and $1B of cumulative profit against $550M of cost is about an 82% net return. Risks: multi-cloud dependency, privacy exposure, integration incompatibility, competitor response.' },
      { kind: 'calculation', prompt: 'What is the annual after-tax net cash flow the deal adds?', unit: '$ million per year', answer: 1000 * .25 * (1 - .2), tolerance: 0.01, dataNote: 'Revenue uplift, EBIT margin, and tax rate are case assumptions from the source.', exhibit: [['Input', 'Value'], ['Incremental revenue', '$1,000 Mn'], ['EBIT margin', '25% → $250 Mn'], ['Tax rate', '20%'], ['Horizon / discount rate', '5 years at 10%']], hint: 'Apply the margin first, then tax: revenue × margin × (1 − tax).', working: 'EBIT = 1,000 × 25% = $250 Mn. After 20% tax: 250 × 0.8 = $200 Mn a year. Discounted over 5 years at 10% that is about $750 Mn of present value; netting the $550 Mn total cost leaves NPV near $200 Mn.', options: [
        option('f200', '$200 million', 'Correct: $250 Mn EBIT after 20% tax.', 200),
        option('f250', '$250 million', 'That is EBIT before tax; the 20% rate brings it to $200 Mn.', 250),
        option('f50', '$50 million', 'That subtracts the 20-point tax rate from the 25% margin (5% × $1B) instead of applying it multiplicatively.', 50),
      ] },
      { kind: 'choice', prompt: 'NPV is positive at ~$200M. What most threatens that value?', options: [
        option('privacy', 'Data-privacy compliance and integration incompatibility can raise the $50M cost or shrink the $1B uplift the NPV assumes.', 'The PV depends on realising the uplift on time; regulatory and technical friction attack exactly that.'),
        option('discount', 'The 10% discount rate is too high.', 'A lower rate only improves NPV; it is not the threat.'),
        option('years', 'Five years is too long a horizon.', 'The tool’s relevance window is a stated assumption; the threats are privacy, integration, and rivals.'),
      ], correct: 'privacy', hint: 'Which assumption do regulation and cloud dependence attack?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Proceed on the numbers, with privacy and integration funded.', model: 'Proceed with the acquisition: $200M of annual after-tax cash flow discounted over five years gives about $750M of present value against a $550M all-in cost, an NPV near $200M and a net return of about 82% on the investment. Fund robust privacy controls and user-permission flows upfront, plan the tech integration to limit incompatibilities, and prepare for competitive responses with marketing and rapid product refinement.', parts: [
        part('action', 'Action', 'proceed', [
          option('proceed', 'Acquire, while funding privacy compliance and a managed integration plan from day one.', 'Positive NPV plus strategic fit, provided the named risks are budgeted.'),
          option('reject', 'Walk away; integration risk is too high.', 'The risks are real but priced into the $50M line and manageable with permissions and planning.'),
          option('license', 'License the assistant instead of acquiring.', 'Licensing leaves the capability and its improvements outside the ecosystem the client is trying to lock in.'),
        ]),
        part('evidence', 'Supporting evidence', 'npv-ev', [
          option('npv-ev', 'Annual net cash flow is $200M, PV about $750M over five years, leaving roughly $200M NPV after $500M price and $50M integration.', 'This is the quantitative case for proceeding.'),
          option('npv-neg', 'NPV is negative once integration is included.', 'PV ≈ $750M less $550M total cost is still positive.'),
          option('roi-low', 'ROI is only 20%.', 'Cumulative five-year net profit of $1B against $550M invested is an 82% net return.'),
        ]),
        part('risk', 'Risk / next step', 'regulatory', [
          option('regulatory', 'Map GDPR/CCPA exposure before signing and budget dedicated compliance resources.', 'Privacy exposure to user device data is the risk most likely to move the cost or the uplift.'),
          option('speed', 'Delay a year to see if the target grows.', 'Waiting lets competitors move first and shrinks the five-year window of relevance.'),
          option('capex', 'Negotiate the price down 10% first.', 'Price is secondary; the swing factor is delivering the $1B uplift on schedule.'),
        ]),
      ] },
    ],
  },
  {
    id: 'service-automation-savings', title: 'Which tickets deserve a human', category: 'Strategy', sector: 'E-commerce', level: 'Intermediate', focus: 'Automate by impact and feasibility, then put a savings figure on it', pages: '347–348',
    brief: 'A large Indian e-commerce player wants to automate customer service without hurting CSAT. Which processes should it automate first?',
    sourceNote: 'Adapted from IIMA Consult Prep Book 2026-27, case 129 “Customer Service Process Automation”. Contact volumes, ticket mix, handling time, and cost rate are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('goal', 'The objective, cost reduction without hurting CSAT, plus contact volumes and the channel mix.', '12 million contacts a year, 70% after-sales, roughly 50% chat, 45% voice, 5% email; the goal frames which tickets to automate.'),
        option('vendor', 'Which chatbot vendor to buy.', 'A procurement question; first map where volume sits and what is safe to automate.'),
        option('headcount', 'How many agents to lay off.', 'The goal is cost reduction through automation, not a headcount plan chosen before any analysis.'),
      ], correct: 'goal', hint: 'Objective first, then volumes by channel and ticket type.', reveal: ['Mix of after-sales tickets: 30% tracking queries, 25% cancellations, 20% warranty claims, 15% rescheduled deliveries and 10% refund or return requests.', 'Order tracking is already largely automated via courier integration; cancellations are mostly automated too.', 'Delivery reschedules are handled manually, with agents relaying dates to courier partners; refunds wait on warehouse checks or seller approval.', 'Fully loaded agent cost is $400 an hour; warranty claims need brand coordination and document review.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO lenses that prioritise what to automate.', correct: ['journey', 'matrix'], options: [
        option('journey', 'Map the journey and zoom into the biggest driver: after-sales holds 70% of contacts.', 'The deep dive belongs where the volume is; after-sales is 8.4 million of 12 million contacts.'),
        option('matrix', 'Prioritise on impact and feasibility: high-volume, low-judgment tickets first; complex claims later.', 'Tracking, reschedules, and simple refunds automate now; warranty claims need humans with better tools.'),
        option('automate-all', 'Automate every ticket type at once for maximum savings.', 'CSAT is a constraint, and judgment-heavy claims fail without an agent escape hatch.'),
        option('voice-first', 'Start by automating the voice channel end-to-end.', 'Voice holds 45% of contacts but mixes ticket types; automate by ticket type, not channel.'),
      ], hint: 'Volume tells you where to look; judgment tells you what is safe.', model: 'Automate the quick wins first: delivery rescheduling via in-chat date pickers, auto-approved refunds for own warehouses and low-value seller orders, and proactive return/cancel suggestions. Keep warranty claims with agents but add intake forms, document upload, and AI document reading. Protect CSAT with an escape hatch after failed bot attempts, sentiment routing to agents, pilots by region, and separate NPS tracking for automated tickets.' },
      { kind: 'calculation', prompt: 'Automating tracking, reschedules, and simple refunds covers 55% of after-sales contacts. If 60% of those can be automated, what is the annual saving?', unit: '$ million per year', answer: 12e6 * .7 * .55 * (4 / 60) * .6 * 400 / 1e6, tolerance: 0.1, dataNote: 'Volumes, ticket mix, 4-minute handling time, 60% automation share, and $400 hourly cost are case assumptions from the source.', exhibit: [['Step', 'Value'], ['Annual contacts', '12 Mn'], ['After-sales', '70% → 8.4 Mn'], ['Automatable ticket types', '30% + 15% + 10% = 55% → 4.62 Mn'], ['Handling time', '4 minutes → about 308K hours'], ['Actually automated', '60% → about 185K hours'], ['Fully loaded cost', '$400 per hour']], hint: 'Multiply through the funnel, then multiply hours by the hourly cost.', working: '12M × 70% = 8.4M after-sales; × 55% = 4.62M automatable contacts; × 4 minutes = 18.48M minutes ≈ 308K hours; × 60% ≈ 185K hours saved; × $400 ≈ $74 million a year.', options: [
        option('s74', 'About $74 million', 'Correct: roughly 185K hours at $400 each.', 73.92),
        option('s134', 'About $134 million', 'That automates every after-sales contact, not just the 55% in the three ticket types.', 134.4),
        option('s123', 'About $123 million', 'That assumes 100% of the 4.62M automatable contacts are automated; the case uses 60%.', 123.2),
      ] },
      { kind: 'choice', prompt: 'Why keep warranty claims with agents?', options: [
        option('judgment', 'They need brand coordination, invoices, images, and approvals; automate the intake and reading, not the decision.', 'High-judgment, low-feasibility tickets fail in a bot; assist the agent instead of replacing them.'),
        option('rare', 'They are too rare to matter.', 'They are 20% of after-sales contacts, larger than refunds.'),
        option('legal2', 'Automation of warranty decisions is banned.', 'No ban; feasibility, not legality, is the barrier.'),
      ], correct: 'judgment', hint: 'Which tickets carry the most judgment per contact?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Quick wins now, agents on complex claims, safeguards throughout.', model: 'Automate in waves on an impact-feasibility matrix: first order-tracking upgrades, self-serve delivery rescheduling, auto-approved refunds for own warehouses and low-value seller orders, and proactive return/cancel chat suggestions, worth roughly $74 million a year. Keep warranty claims agent-led but add intake forms, document upload, and AI document reading. Guard CSAT with an agent escape hatch, sentiment routing, regional pilots, and separate NPS tracking for bot versus human tickets.', parts: [
        part('action', 'Action', 'waves', [
          option('waves', 'Automate reschedules, simple refunds, and suggestions now; add agent-assist tools for warranty claims.', 'This matches each ticket type to its feasibility while capturing the $74 million.'),
          option('big-bang', 'Automate all ticket types at once.', 'Judgment-heavy claims will fail in bots and damage CSAT, the stated constraint.'),
          option('agents', 'Hire more agents instead of automating.', 'The brief is cost reduction; adding agents grows the cost line being cut.'),
        ]),
        part('evidence', 'Supporting evidence', 'ev74', [
          option('ev74', 'The three quick-win ticket types hold 4.62M contacts; automating 60% at 4 minutes each saves about $74 million a year at $400 an hour.', 'The funnel turns a process map into a dollar estimate.'),
          option('ev134', 'Savings are $134 million across all after-sales contacts.', 'That assumes every after-sales ticket is automatable; only the three types qualify, and only 60% of those.'),
          option('ev-voice', 'Voice is 45% of contacts, so automate calls first.', 'Channel share is not automatable share; ticket complexity, not channel, drives feasibility.'),
        ]),
        part('risk', 'Risk / next step', 'csat', [
          option('csat', 'Track CSAT separately for automated versus human tickets and keep the two-strikes agent escape hatch.', 'The mandate is savings without hurting CSAT; you cannot manage what you do not split out.'),
          option('scale-fast', 'Roll out nationally in week one.', 'Pilots by region or category catch failures before they scale.'),
          option('fine', 'If savings land, CSAT will take care of itself.', 'Frustrated customers churn quietly; CSAT is an explicit constraint, not a by-product.'),
        ]),
      ] },
    ],
  },
  {
    id: 'regional-jet-lessors', title: 'The customers who buy twenty planes', category: 'Profitability', sector: 'Aerospace', level: 'Intermediate', focus: 'Segment profitability by customer before blaming cost', pages: '79–86',
    brief: 'Regional Jet makes two aircraft lines. The prop business earns a 30% economic margin while the jet business is unprofitable in a profitable market. Diagnose the jet business.',
    sourceNote: 'Adapted from HBS Management Consulting Club Case Interview Guide, practice case 16 “Regional Jet Corporation”. Market, segment revenue, and cost figures are from the source.',
    steps: [
      { kind: 'choice', prompt: 'Where would you start?', options: [
        option('market', 'Whether the jet market itself is profitable and growing, then how the client’s position compares.', 'The market earns about 4% economic margins and grows 5% a year, so the problem is the client’s position, not the industry.'),
        option('shrink', 'Whether to exit the jet business immediately.', 'One line is profitable and the market is healthy; diagnose before divesting.'),
        option('costs2', 'Whether jet production costs are out of line.', 'Worth checking, but the operating position is at parity; the diagnostic gap is elsewhere.'),
      ], correct: 'market', hint: 'Is this a bad industry or a bad position inside a good one?', reveal: ['1999 jet revenue $730M on 100 deliveries; economic profit −$20M (−3%) after a $21M capital charge; per-aircraft cost is $7.86M regardless of customer.', 'The market is about $5B, growing 5% a year, with six makers and no dominant leader; supplier power is low and entry barriers high.', 'Customers segment into buyers of 1 aircraft (5 customers, $42M revenue), 3 aircraft (11 customers, $280M), and 20 aircraft (3 lessors, $408M).', 'Regional Jet gains share while matching competitors on product; its price sits below market, especially for powerful lessor buyers.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that find the profit leak.', correct: ['forces', 'segments'], options: [
        option('forces', 'Structural forces: low supplier power, moderate rivalry, high entry barriers mean the market should be profitable.', 'That is what makes the client’s −3% margin diagnostic: the leak is inside the client, not the market.'),
        option('segments', 'Profitability by customer segment: revenue per aircraft across 1-, 3-, and 20-plane buyers.', 'Same cost per plane but very different prices; segment pricing exposes the leak.'),
        option('union', 'Whether labour unions inflate production cost.', 'Each aircraft costs about the same to run as the industry average, so cost is not where the airline stands out.'),
        option('capacity', 'Whether the factory can produce more jets.', 'Utilisation matters for fixed-cost absorption, but the immediate gap is price by segment.'),
      ], hint: 'Healthy market plus sick client means look at who pays what.', model: 'The market is structurally attractive, so focus on the client’s competitive position. Offering and operating positions are at parity; pricing is not. Per-aircraft revenue: small buyers $8.4M, medium $8.0M, lessors $6.8M. Lessors buy 20 at a time and use that leverage to extract discounts; at identical cost, the price gap flows straight to profit, leaving the 20-plane segment at −$33M economic profit.' },
      { kind: 'calculation', prompt: 'What is the average price per aircraft paid by the 20-aircraft lessor customers?', unit: '$ million per aircraft', answer: 408 / 60, tolerance: 0.01, dataNote: 'Segment revenue and aircraft counts are case figures from the source.', exhibit: [['Segment', 'Customers', 'Revenue', 'Aircraft'], ['Buy 1', '5', '$42M', '5'], ['Buy 3', '11', '$280M', '35'], ['Buy 20 (lessors)', '3', '$408M', '60']], hint: 'Divide segment revenue by aircraft delivered, not by customers.', working: '408 ÷ 60 = $6.8M per aircraft, versus $8.4M from small buyers (42 ÷ 5) and $8.0M from medium buyers (280 ÷ 35). With identical $7.86M cost, lessors alone lose about $1.06M a plane, about $33M of negative economic profit.', options: [
        option('p68', '$6.8 million', 'Correct: $408M ÷ 60 aircraft.', 6.8),
        option('p84', '$8.4 million', 'That is the small-buyer price: $42M ÷ 5. The lessor segment pays far less.', 8.4),
        option('p136', '$136 million', 'That divides revenue by the three lessor customers; the question is price per aircraft, not per customer.', 136),
      ] },
      { kind: 'choice', prompt: 'Cost per aircraft is identical across segments. What does the $6.8M versus $8.4M gap prove?', options: [
        option('pricing2', 'The profit difference is entirely a price problem: lessors use bulk buying power to extract discounts.', 'Same cost, different revenue; the gap can only be price, driven by the lessors’ negotiating leverage.'),
        option('quality', 'Lessors get cheaper, lower-spec aircraft.', 'The offering is at parity across segments; only the price differs.'),
        option('accounting', 'Segment overhead was allocated unfairly.', 'The handout strips costs per aircraft consistently; the difference is negotiated price.'),
      ], correct: 'pricing2', hint: 'If cost is constant and profit differs, only one line can be moving.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Rebalance the customer mix and build leverage against the lessors.', model: 'The jet business is disadvantaged on price, not cost or product: lessors pay $6.8M a plane against $8.4M for small buyers, turning a healthy market into a −$20M economic loss. Options: rebalance toward small and medium non-lessor customers while holding lessor volumes for scale, or enter aircraft leasing to build negotiating leverage and capture the 15% ROE lessors earn. Watch the scale risk: lessors take 60 of 100 units, so cutting them cold threatens the volume that spreads fixed cost.', parts: [
        part('action', 'Action', 'rebalance', [
          option('rebalance', 'Grow small and medium customers at market rate while entering leasing selectively to build leverage over the three dominant lessors.', 'This attacks the price gap at its source without surrendering the volume that absorbs fixed cost.'),
          option('drop-lessors', 'Stop serving lessors entirely.', 'They buy 60% of units; losing that scale breaks the per-unit economics the rest of the book relies on.'),
          option('accept', 'Accept the pricing; lessors are valuable customers.', 'At $6.8M a plane the segment loses about $1M per aircraft; volume at that price destroys value.'),
        ]),
        part('evidence', 'Supporting evidence', 'ev68m', [
          option('ev68m', 'Lessors pay $6.8M a plane versus $8.4M small and $8.0M medium on identical cost, leaving the segment at −$33M economic profit.', 'Same cost, lower price: the lessor segment is where the −$20M comes from.'),
          option('ev730', 'The business loses because $730M of revenue is too small.', 'The market is profitable at 4% margins; scale is not the leak, price is.'),
          option('evcost', 'Lessors cost more to serve.', 'Cost per aircraft is identical at $7.86M; only revenue per plane differs.'),
        ]),
        part('risk', 'Risk / next step', 'scale', [
          option('scale', 'Manage the transition so lessor volume falls gradually; test leasing economics before entering.', 'Scale loss is the main downside of dropping lessors; leasing itself is a new business with its own risks.'),
          option('nothing3', 'Do nothing; share gains will fix margins.', 'Share is growing precisely because price is low; more of the same deepens the loss.'),
          option('price-cap', 'Simply announce higher prices to lessors.', 'Their leverage comes from buying 20 at a time; an announcement without changed economics fails.'),
        ]),
      ] },
    ],
  },
  {
    id: 'britishtimes-golf-funnel', title: 'From page views to golf clubs', category: 'Estimation', sector: 'Media', level: 'Intermediate', focus: 'Size a new revenue line with a buy-to-browse funnel', pages: '87–90',
    brief: 'BritishTimes.com, the online arm of a respected UK newspaper, is brochureware today. Its CEO wants ideas to grow revenue, including monetising its upscale audience through online retail.',
    sourceNote: 'Adapted from HBS Management Consulting Club Case Interview Guide, practice case 17 “British Times”. Audience profile and the golf-store sizing assumptions are from the source.',
    steps: [
      { kind: 'choice', prompt: 'How would you frame the revenue question?', options: [
        option('streams', 'Internet revenue has three mainsprings: advertising, subscriptions, and transactions; test each against the site’s assets.', 'The brand and the wealthy, educated audience decide which stream fits, not a generic framework.'),
        option('costs3', 'How to cut the website’s operating costs.', 'The CEO asked about revenue, not cost.'),
        option('redesign', 'How to redesign the site visually.', 'Presentation follows the revenue strategy, not the reverse.'),
      ], correct: 'streams', hint: 'Name the ways websites earn, then match them to this audience.', reveal: ['The site draws only 30% fewer unique visitors than the UK’s top site, with viewers in the 75th income percentile, 60% university-educated.', 'Three candidate streams: premium advertising and corporate sponsorship, tiered subscriptions for archive access, and transactions such as a golf-equipment storefront earning commission.', 'The brand is strong in the UK but not overseas; the dot-com may use the paper’s content and brand.', 'Exercise assumptions for sizing a golf store: 60M UK population, a third online, 20% visiting the site, 20% browsing the store, 10% buying, $100 a purchase, twice a year, 5% commission.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO revenue streams best matched to this audience.', correct: ['premium-ads', 'transactions'], options: [
        option('premium-ads', 'Premium advertising and sponsorship: banks, insurers, and brokers pay for access to a wealthy business readership.', 'The audience is the product; high disposable income is exactly what financial advertisers buy.'),
        option('transactions', 'Transactions: a tollbooth on upscale verticals like golf, tax advice, or premium travel, earning commission per sale.', 'Upscale, high-margin products fit the audience better than volume retail.'),
        option('mass-ads', 'Mass-market banner ads at the lowest CPM.', 'Low-end ads waste the precise thing this audience commands a premium for.'),
        option('donations', 'Reader donations and crowdfunding.', 'A weak fit for a corporate-backed newspaper brand.'),
      ], hint: 'Follow the audience’s income and the brand’s credibility.', model: 'Advertising and sponsorship monetise the audience directly; tiered subscriptions monetise the archive; transactions monetise purchase intent through commission on upscale verticals. For a golf store, size it as a funnel: population × internet share × site visitors × store browsers × buyers × spend × frequency × commission.' },
      { kind: 'calculation', prompt: 'Estimate the golf store’s first-year commission revenue.', unit: '$ thousand', answer: 80000 * 100 * 2 * .05 / 1000, tolerance: 0.01, dataNote: 'All funnel assumptions are case figures from the source.', exhibit: [['Step', 'Value'], ['UK population online', '60M × 1/3 = 20M'], ['Visit BritishTimes.com', '× 20% = 4M'], ['Browse golf store', '× 20% = 800,000'], ['Actually buy', '× 10% = 80,000'], ['Spend × frequency', '$100 × 2 = $200 each'], ['Site commission', '5%']], hint: 'End at commission, not gross sales: the site earns 5%, not the full spend.', working: '80,000 buyers × $100 × 2 purchases = $16M gross sales; the site earns 5%, so $800,000 in first-year commission revenue.', options: [
        option('g800', '$800 thousand', 'Correct: $16M of sales at a 5% commission.', 800),
        option('g16m', '$16 million', 'That is gross merchandise value; the site earns only the 5% commission.', 16000),
        option('g400', '$400 thousand', 'That forgets customers buy twice a year: 80,000 × $100 × 5%.', 400),
      ] },
      { kind: 'choice', prompt: 'What is the biggest weakness of this funnel estimate?', options: [
        option('assumptions', 'Every percentage is an assumption; the value lies in stating them explicitly so they can be tested, not in the $800,000 figure itself.', 'A ballpark estimate is a structure with declared inputs; each link is a hypothesis to validate.'),
        option('too-small', '$800,000 is too small to matter, so the idea fails.', 'The estimate answers a sizing question; viability also depends on margin and cost to serve.'),
        option('population', 'The UK population figure is wrong.', '60 million is a reasonable round number; the fragile inputs are the behavioural shares.'),
      ], correct: 'assumptions', hint: 'What does a back-of-envelope number actually prove?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Monetise the audience three ways; pilot the store on stated assumptions.', model: 'Grow revenue on three fronts: premium advertising and corporate sponsorship aimed at finance and luxury brands, tiered subscriptions from free today’s news to full archive, and a commission-based storefront for upscale verticals like golf. The golf pilot is worth roughly $800,000 a year on stated assumptions; its value is the testable funnel, so validate the browse and buy shares before scaling.', parts: [
        part('action', 'Action', 'three-streams', [
          option('three-streams', 'Pursue premium ads and sponsorships, tiered subscriptions, and a pilot storefront on upscale verticals.', 'All three fit the audience; the pilot tests the weakest evidence at low cost.'),
          option('ads-only', 'Sell only banner ads.', 'Leaves subscription and transaction revenue unmonetised against a wealthy audience.'),
          option('paywall', 'Put the whole site behind a hard paywall.', 'A hard paywall sacrifices the reach that makes the advertising stream valuable.'),
        ]),
        part('evidence', 'Supporting evidence', 'ev800', [
          option('ev800', 'The funnel gives about $800,000 a year: 80,000 buyers × $100 × 2 × 5% commission, against an audience advertisers already want.', 'The number is small but built from explicit, testable shares.'),
          option('ev16m', 'The store earns $16M a year.', 'That is gross sales; commission at 5% makes the site’s revenue $800,000.'),
          option('ev30', 'Traffic is only 30% of the leader’s, so monetisation fails.', 'The site has 30% fewer visitors than the number 1 site, not 30% of it, and its visitors are unusually wealthy.'),
        ]),
        part('risk', 'Risk / next step', 'validate', [
          option('validate', 'Validate the 20% browse and 10% buy assumptions with a small pilot before scaling to other verticals.', 'The estimate is only as good as its behavioural links.'),
          option('scale-first', 'Launch five vertical stores at once.', 'Scaling on untested funnel shares multiplies the same risk.'),
          option('brand-risk2', 'Never sell products; it soils the brand.', 'The CEO asked for revenue options; a curated upscale storefront can fit the brand if executed well.'),
        ]),
      ] },
    ],
  },
]
