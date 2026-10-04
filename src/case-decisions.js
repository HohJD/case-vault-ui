const option = (id, label, feedback, value) => ({ id, label, feedback, ...(value === undefined ? {} : { value }) })
const part = (id, title, correct, options) => ({ id, title, correct, options })

export const TAP_DECISIONS = {
  'brewery-capacity': {
    structure: { prompt: 'Pick the TWO priority areas to investigate before recommending equipment.', correct: ['unit-cost', 'feasibility'], options: [
      option('unit-cost', 'Processing cost per bottle: capital, labour, energy, and maintenance.', 'This tests the identified cost gap on a like-for-like unit basis rather than assuming a larger plant is automatically cheaper.'),
      option('feasibility', 'Demand, floor space, and the economics of extra shifts.', 'A technically better machine is not useful if it cannot fit or its output cannot be sold. This also tests an alternative using the current plant.'),
      option('distribution', 'Retailer coverage and distribution-channel expansion.', 'Distribution can matter to the business, but no distribution-cost or sales gap has been identified. Processing and its constraints are the immediate priorities.'),
      option('branding', 'Brand positioning and willingness to pay a premium.', 'Useful for a pricing or growth question, but it does not diagnose the processing-cost gap in this cost-focused brief.'),
    ] },
    calculation: [
      option('ratio', '25% reduction', 'Correct: cost per capacity unit falls from 1 to 0.75.', 25),
      option('capacity', '50% reduction', 'Doubling output would halve the ratio only if the machine cost stayed unchanged. Here it rises by 50%.', 50),
      option('remaining', '75% reduction', '0.75 is the new ratio relative to the old one. The reduction is 1 − 0.75.', 75),
    ],
    recommendation: [
      part('action', 'Action', 'shift', [
        option('shift', 'Test an additional shift within the current plant.', 'This respects the confirmed floor-space constraint and tests a reversible operational alternative.'),
        option('machine', 'Order the new machines for immediate installation.', 'The machines do not fit in the current plant. Better unit capacity economics do not remove that constraint.'),
        option('sourcing', 'Start by renegotiating raw-material contracts.', 'Raw-material costs are already in line with peers; the identified gap is in processing.'),
      ]),
      part('evidence', 'Supporting evidence', 'unit', [
        option('unit', 'New machinery lowers capital cost per capacity unit by 25%.', 'This states exactly what the calculation establishes, without calling it a total operating-cost saving.'),
        option('total', 'New machinery will reduce total company costs by 25%.', 'The calculation does not cover labour, energy, maintenance, utilisation, or other company costs.'),
        option('idle', 'The existing machinery has substantial unused capacity.', 'The case explicitly says the existing machines are fully utilised under the current schedule.'),
      ]),
      part('risk', 'Risk / next step', 'validate', [
        option('validate', 'Validate demand, incremental shift cost, staffing, and maintenance windows.', 'These determine whether more operating hours create profitable, feasible output.'),
        option('advertise', 'Measure social-media engagement before making changes.', 'This is not the main uncertainty in the proposed processing-capacity intervention.'),
        option('site', 'Commit to a bigger site before testing the shift economics.', 'A new site may be a later option, but it is a larger commitment than the evidence currently supports.'),
      ]),
    ],
  },
  'electric-bus-entry': {
    structure: { prompt: 'Pick the TWO analyses that should drive the entry decision first.', correct: ['economics', 'operations'], options: [
      option('economics', 'Buyer ownership economics, investment hurdle, and verified incentives.', 'This establishes whether customers have an economic reason to switch, rather than relying on a favourable market narrative.'),
      option('operations', 'Route distances, depot charging, uptime, and service support.', 'These are gating feasibility conditions for a bus with a limited range per charge.'),
      option('campaign', 'National advertising reach and brand-recall targets.', 'The initial decision is about a local launch. Promotion cannot resolve an uneconomic or operationally unsuitable product.'),
      option('exports', 'Expansion into several other Asian countries.', 'That broadens the geography before evaluating the specified Ahmedabad opportunity.'),
    ] },
    calculation: [
      option('incremental', '5.33 years', 'Correct: (16 + 2 − 10) ÷ 1.5 = 5.33 years.', 5.33),
      option('charger', '4.00 years', 'This omits the $2 million charging investment: (16 − 10) ÷ 1.5.', 4),
      option('gross', '12.00 years', 'This uses total electric-plus-charger cost rather than the additional cost over the diesel alternative.', 12),
    ],
    recommendation: [
      part('action', 'Action', 'conditional', [
        option('conditional', 'Defer a full rollout; consider only a tightly scoped pilot with clear learning goals.', 'The stated economics miss the hurdle. A limited pilot may still test technical and commercial uncertainties without committing to a full launch.'),
        option('launch', 'Launch at scale because the EV policy environment is supportive.', 'Policy enthusiasm alone does not overcome the stated buyer hurdle or charging constraints.'),
        option('abandon', 'Permanently abandon the market regardless of future changes.', 'The evidence supports a decision under current assumptions, not a permanent conclusion if incentives or operating economics change.'),
      ]),
      part('evidence', 'Supporting evidence', 'hurdle', [
        option('hurdle', '5.33-year payback exceeds the five-year hurdle; required annual savings are $1.6 million.', 'Both figures follow from the $8 million incremental investment and make the decision criterion explicit.'),
        option('cheap', 'The electric bus is cheaper to buy than the diesel alternative.', 'The case gives a higher purchase price, plus a dedicated charging outlay.'),
        option('tax', 'Government incentives guarantee that every operator will make a profit.', 'The exercise does not establish incentive eligibility, realised cash flows, or every operator’s economics.'),
      ]),
      part('risk', 'Risk / next step', 'verify', [
        option('verify', 'Verify route fit, charging uptime, and the savings needed to clear the hurdle.', 'These tests directly address both feasibility and the economic threshold.'),
        option('awareness', 'Use customer awareness alone as the pilot’s success metric.', 'Awareness is insufficient evidence that buses can run reliably and meet buyer economics.'),
        option('relax', 'Quietly relax the buyer’s five-year hurdle to make the case work.', 'A changed hurdle must be an explicit client decision, not an assumption inserted to justify entry.'),
      ]),
    ],
  },
  'long-life-bulb': {
    structure: { prompt: 'Pick the TWO strongest building blocks for the pricing analysis.', correct: ['value', 'economics'], options: [
      option('value', 'Segment-specific avoided replacement costs, alternatives, and willingness to pay.', 'The value of avoiding a replacement differs by location and customer. This supports a price hypothesis rather than a cost multiplier.'),
      option('economics', 'Manufacturing contribution, warranty exposure, and adoption constraints.', 'These test whether an attractive customer proposition is also commercially viable for the supplier.'),
      option('markup', 'Apply the old retail markup to the manufacturing-cost increase.', 'This is a possible calculation, not evidence that customers value the product enough to pay the resulting price.'),
      option('recovery', 'Make full recovery of R&D from the first order the pricing rule.', 'R&D recovery matters to the business case, but it does not create customer willingness to pay.'),
    ] },
    calculation: [
      option('full-cost', '2.22 years', 'Correct: annual avoided replacement cost is $1,800, so 4,000 ÷ 1,800 ≈ 2.22.', 2.22),
      option('bulb-only', '4.00 years', 'This counts only the $500 bulb twice a year and omits both workers’ labour.', 4),
      option('rounded', '2.00 years', 'That is an overly rough approximation for a question asking for two decimal places.', 2),
    ],
    recommendation: [
      part('action', 'Action', 'municipal', [
        option('municipal', 'Test a $4,000 offer with municipal or hard-to-access installations.', 'These customers can capture substantial avoided maintenance value; treat the price as a hypothesis to validate.'),
        option('household', 'Start with mass-market households using a 100× retail-price multiplier.', 'That assumes cost inflation translates into perceived consumer value and overlooks a better-suited segment.'),
        option('r-and-d', 'Set the price solely to recover the $1.2 billion R&D expense quickly.', 'Supplier sunk costs do not by themselves determine the customer’s value or willingness to pay.'),
      ]),
      part('evidence', 'Supporting evidence', 'payback', [
        option('payback', 'On the stated assumptions, the buyer’s simple payback is about 2.22 years.', 'This accurately links the price hypothesis to avoided full replacement spending.'),
        option('net-profit', 'Each bulb guarantees $3,600 of net profit.', '$3,600 excludes distribution, warranty, overhead, and R&D recovery; it is not net profit.'),
        option('certain-demand', 'The claimed lifespan proves that every buyer will accept the price.', 'Reliability claims, procurement budgets, and willingness to pay still need validation.'),
      ]),
      part('risk', 'Risk / next step', 'pilot', [
        option('pilot', 'Validate lifespan, warranty costs, procurement budgets, and willingness to pay.', 'These turn the pricing hypothesis into a testable commercial proposition.'),
        option('promise', 'Promise no maintenance costs of any kind for the buyer.', 'A long-life bulb does not eliminate all lighting-system maintenance or prove the lifespan claim.'),
        option('ignore', 'Ignore conventional-bulb cannibalisation because the new margin is high.', 'Lost existing sales and adoption costs can still affect the total business case.'),
      ]),
    ],
  },
  'cab-driver': {
    structure: { prompt: 'Pick the TWO areas to prioritise when modelling fare revenue within fixed working hours.', correct: ['cycle', 'return'], options: [
      option('cycle', 'Completed trips: paid journey time, search time, and breaks.', 'This links revenue to the time available and makes the idle-time bottleneck explicit.'),
      option('return', 'Fare or contribution per elapsed hour, including the return journey.', 'A high-fare ride can consume more time and empty mileage. Compare complete cycles, not only the fare.'),
      option('fare-rise', 'A higher meter price during busy periods.', 'Meter prices are regulated and fixed in this scenario, so this is not an available lever.'),
      option('longest', 'Maximise trip distance without modelling time between rides.', 'Longer rides increase fare per trip but may reduce the number of trips or create empty-return costs.'),
    ] },
    calculation: [
      option('whole-trips', '$640 per day', 'Correct: 420 available minutes allow eight complete 50-minute cycles at $80 each.', 640),
      option('fractional', '$672 per day', 'This sells 8.4 trips. The exercise allows revenue only from completed trips.', 672),
      option('old-cycle', '$560 per day', 'This retains the old 60-minute trip-plus-wait cycle rather than using the shorter wait.', 560),
    ],
    recommendation: [
      part('action', 'Action', 'idle-time', [
        option('idle-time', 'Reduce search and empty repositioning through better pickup and return-demand choices.', 'This acts on controllable time losses within the fixed fares and working window.'),
        option('long-rides', 'Accept only the longest available trips.', 'Distance alone does not establish revenue or contribution per constrained working hour.'),
        option('extra-hours', 'Extend the working day until the target is reached.', 'That changes the exercise’s fixed eight-hour constraint rather than improving performance within it.'),
      ]),
      part('evidence', 'Supporting evidence', 'increment', [
        option('increment', 'The shorter wait allows eight trips and $640, an $80 increase over the baseline.', 'This uses whole trips and compares the improvement with the original seven-trip day.'),
        option('fraction', 'The new plan earns $672 because 8.4 trips fit in the day.', 'A fractional incomplete trip cannot earn a full proportional fare under the exercise assumptions.'),
        option('fare', 'The improvement depends on increasing the regulated fare.', 'The calculation holds the fare at $80; it improves the number of completed trips.'),
      ]),
      part('risk', 'Risk / next step', 'measure', [
        option('measure', 'Track waiting time, empty mileage, and contribution per hour while keeping safe driving practices.', 'This tests whether the illustrative revenue gain survives actual demand and costs.'),
        option('speed', 'Use faster driving as the primary way to create more trips.', 'Speed cannot be increased at the expense of legal or safe operations; it is not the identified search-time lever.'),
        option('one-day', 'Treat one unusually busy day as proof of a permanent improvement.', 'Demand varies; representative days and operating costs are needed before making a lasting claim.'),
      ]),
    ],
  },
  'airline-green': {
    structure: { prompt: 'Pick the TWO analyses that best turn “go green” into a decision-ready programme.', correct: ['baseline', 'prioritise'], options: [
      option('baseline', 'Baseline fuel/emissions across the value chain, with absolute and intensity measures.', 'This identifies material sources and avoids confusing a better ratio with a lower total impact.'),
      option('prioritise', 'Rank interventions by impact, cost, operational feasibility, and required approvals.', 'A useful programme has prioritised, implementable actions rather than an undifferentiated list.'),
      option('visible', 'Start only with the most visible cabin-plastic changes.', 'Visible initiatives can be useful, but selecting them before comparing material impact may miss the largest opportunities.'),
      option('single-metric', 'Use fuel per passenger as the only measure of success.', 'Intensity can improve while total activity and total emissions increase. The programme needs both views.'),
    ] },
    calculation: [
      option('intensity', '24% reduction', 'Correct: fuel per passenger moves from 25 kg to 19 kg, a 24% reduction.', 24),
      option('absolute', '5% reduction', 'That is the reduction in total fuel for the flight, not fuel per passenger.', 5),
      option('passengers', '25% reduction', 'The passenger count increases by 25%; that is not the percentage change in fuel per passenger.', 25),
    ],
    recommendation: [
      part('action', 'Action', 'programme', [
        option('programme', 'Prioritise measurable operational improvements using a value-chain baseline.', 'This links the ambition to material, testable interventions instead of assuming a visible gesture is the best first move.'),
        option('publicity', 'Lead with a carbon-neutral announcement and choose initiatives afterwards.', 'A claim should follow a defined scope and defensible evidence, not precede them.'),
        option('equal', 'Fund all sustainability ideas equally to appear comprehensive.', 'A consultant should prioritise impact and feasibility rather than treating every idea as equally valuable.'),
      ]),
      part('evidence', 'Supporting evidence', 'scoped', [
        option('scoped', 'On equal-distance flights, fuel per passenger falls 24% and fuel per flight falls 5%.', 'This preserves the denominator and scope of each supported result.'),
        option('annual', 'The airline’s annual total emissions have fallen 24%.', 'The two-flight intensity comparison does not establish annual activity or total emissions.'),
        option('neutral', 'The lower fuel figure proves the airline is carbon neutral.', 'A fuel reduction does not establish a net-zero emissions balance.'),
      ]),
      part('risk', 'Risk / next step', 'validate', [
        option('validate', 'Check results across routes, costs, safety, and airport/regulatory approvals.', 'This tests whether the intervention can persist and be implemented at scale.'),
        option('ratio-only', 'Stop measuring absolute fuel use once the intensity ratio improves.', 'A better ratio can mask rising total impact as activity grows.'),
        option('no-approvals', 'Assume that all airport processes are under the airline’s sole control.', 'Implementation can require cooperation and approval from other stakeholders.'),
      ]),
    ],
  },
  'multiplex-estimate': {
    structure: { prompt: 'Pick the TWO most useful building blocks for an auditable revenue estimate.', correct: ['streams', 'units'], options: [
      option('streams', 'Patron-based ticket, F&B, and parking revenue, plus advertising with a defined percentage base.', 'This captures the material streams without silently treating advertising as a markup on the wrong subtotal.'),
      option('units', 'Per-show → per-day → per-screen → annual scaling, with occupancy sensitivity.', 'Consistent units and realistic occupancy stop double counting and false precision.'),
      option('capacity', 'Use full seating capacity as actual attendance throughout the year.', 'Capacity is not footfall. This ignores the occupancy and seasonality assumptions that drive the estimate.'),
      option('benchmark', 'Adopt a competitor’s annual revenue without building the venue model.', 'A benchmark can cross-check the model, but it does not replace a transparent calculation for this venue.'),
    ] },
    calculation: [
      option('subtotal', '$280,000 per screen per day', 'Correct: tickets $200,000 + F&B $60,000 + parking $20,000.', 280000),
      option('tickets', '$200,000 per screen per day', 'This counts ticket sales but omits the supplied F&B and parking streams.', 200000),
      option('ads', '$308,000 per screen per day', 'The question excludes advertising. This also applies 10% to the subtotal instead of to total revenue.', 308000),
    ],
    recommendation: [
      part('action', 'Action', 'base-case', [
        option('base-case', 'Use roughly $373.3 million as a base-case annual estimate, then test a range.', 'This scales the checked daily result and acknowledges that the assumptions need validation.'),
        option('book-total', 'Use the published $504 million figure without reconciling the inputs.', 'The source total is inconsistent with the stated inputs. A defensible estimate must reconcile the arithmetic.'),
        option('precise', 'Guarantee revenue of exactly $373.3 million for the coming year.', 'A simplified model is not a precise forecast or a commercial guarantee.'),
      ]),
      part('evidence', 'Supporting evidence', 'base', [
        option('base', 'Non-ad revenue is $280,000; if ads are 10% of total, daily total is $280,000 ÷ 0.90.', 'This correctly expresses the advertising base before multiplying by four screens and 300 days.'),
        option('markup', 'Daily total is $280,000 × 1.10 because ads are 10% of total.', 'That calculation makes ads 10% of the non-ad subtotal, not of the final total.'),
        option('seats', 'All 300 seats should be counted as paying customers in every show.', 'This replaces the supplied average attendance with full capacity and overstates revenue.'),
      ]),
      part('risk', 'Risk / next step', 'sensitivity', [
        option('sensitivity', 'Validate weekday/weekend occupancy, spend, parking transactions, and the ad share.', 'These are consequential assumptions; varying them makes the estimate useful for decisions.'),
        option('peak', 'Validate only the busiest weekend show and extrapolate it to all days.', 'A peak observation is not a representative annual average.'),
        option('fixed', 'Treat every stated assumption as a verified market fact.', 'The figures are simplified exercise assumptions. The real-world model needs validation and uncertainty bounds.'),
      ]),
    ],
  },
}
