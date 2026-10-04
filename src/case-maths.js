export const CASE_MATH_SOURCES = [
  { id: 'bcg', title: 'BCG case interview preparation', url: 'https://careers.bcg.com/global/en/case-interview-preparation', use: 'Structure calculations, clarify assumptions, and explain business implications.' },
  { id: 'mckinsey', title: 'McKinsey Electro-Light sample case', url: 'https://www.mckinsey.com/careers/interviewing/electrolight', use: 'Examples of the quantitative skills used in case interviews; not reproduced here.' },
  { id: 'hbs', title: 'Harvard Management Consulting Club case interview guide (contribution analysis, break-even market share, pricing)', use: 'Unit contribution, break-even volume and break-even market share; price and perceived value. Wording and figures here are original.' },
  { id: 'iima', title: 'IIMA Consult Prep Book 2026-27, guesstimates introduction (pp. 376-378)', use: 'Approach selection (top-down vs bottom-up, demand vs supply), splits and filters, cross-validation. Wording here is original.' },
  { id: 'openstax', title: 'OpenStax: break-even in units and dollars', url: 'https://openstax.org/books/principles-managerial-accounting/pages/3-2-calculate-a-break-even-point-in-units-and-dollars', use: 'Check standard contribution and break-even relationships and their assumptions. All lesson wording, scenarios, and figures here are original.' },
]

export const CASE_MATH_LESSONS = [
  {
    id: 'units', title: 'Units & quick estimates', group: 'Foundations', description: 'Keep the zeros, time period, and denominator straight.',
    formula: 'Revenue per order = annual revenue ÷ 12 ÷ monthly orders',
    method: ['Name the output unit first: dollars per order, not dollars per month.', 'Align time periods and powers of ten before dividing. 1m = 1,000k = 1,000,000.', 'Estimate a sensible range first. Round for a quick check, but calculate more precisely near a decision threshold.'],
    trap: 'Annual revenue divided by monthly orders overstates revenue per order twelvefold. Revenue per order is not profit per order.', sources: ['bcg'],
  },
  {
    id: 'percentages', title: 'Percentages & percentage points', group: 'Foundations', description: 'Know what changed, and which base to use.',
    formula: 'Relative change = (new − old) ÷ old × 100%; percentage-point change = new % − old %',
    method: ['Distinguish a share or rate from a currency amount. Ask which comparison the client wants.', 'For relative growth, divide the difference by the original value. Use 10%, 5%, and 1% as mental anchors.', 'If a rate goes from 10% to 15%, that is +5 percentage points and +50% relative growth. The change alone does not establish its cause.'],
    trap: 'A 20% rise followed by a 20% fall is not a return to the start: 1.2 × 0.8 = 0.96. A zero starting value has no defined relative growth rate.', sources: ['bcg'],
  },
  {
    id: 'weighted', title: 'Weighted averages', group: 'Foundations', description: 'Read segment data without averaging the wrong things.',
    formula: 'Blended revenue per order = total revenue ÷ total orders = Σ(orders × revenue per order) ÷ Σorders',
    method: ['Choose weights that match the metric. Revenue per order needs order counts, not revenue shares.', 'Calculate each segment’s total, add the totals, then divide by the combined count.', 'The answer must lie between the segment values and be closer to the value with the larger weight.'],
    trap: 'A plain average only works for equal weights. To blend profit margins, weight by revenue, not by order counts.', sources: ['bcg', 'openstax'],
  },
  {
    id: 'margins', title: 'Profit & margins', group: 'Business numbers', description: 'Separate sales, contribution, profit, and markup.',
    formula: 'Operating profit = (price − variable cost per unit) × volume − fixed costs; operating margin = operating profit ÷ revenue',
    method: ['Build revenue and cost for the same period, using the costs included in the question.', 'Subtract variable and fixed operating costs. Contribution is the amount before fixed costs.', 'Use revenue as the margin denominator. Markup instead divides a profit or price increment by its stated cost base.'],
    trap: 'Do not call contribution net profit. Interest and tax may still sit below operating profit; always specify which margin you mean.', sources: ['openstax', 'mckinsey'],
  },
  {
    id: 'break-even', title: 'Break-even volume', group: 'Business numbers', description: 'Find how many sales cover the fixed costs.',
    formula: 'Break-even units = fixed costs ÷ (price − variable cost per unit), rounded up for whole units',
    method: ['Find the contribution from one extra unit sold, not its full selling price.', 'Divide fixed costs by positive unit contribution. Match the fixed-cost period to the sales period.', 'Round up when units are indivisible, then test whether capacity and realistic demand can reach that volume.'],
    trap: 'With positive fixed costs and zero or negative contribution, selling more cannot reach break-even. The shortcut assumes stable prices, unit costs, and capacity in the relevant range.', sources: ['openstax', 'mckinsey'],
  },
  {
    id: 'breakeven-share', title: 'Break-even market share', group: 'Business numbers', description: 'Turn break-even volume into the share of the market you must win.',
    formula: 'Break-even share = (fixed costs ÷ unit contribution) ÷ total market volume',
    method: ['Work out unit contribution (price minus variable cost) and divide it into the fixed costs to get break-even volume.', 'Divide that volume by the whole market’s volume for the same period. Units over units, so the answer is a share.', 'Judge it against reality: how much do established rivals hold, and how fast could a newcomer plausibly win share?'],
    trap: 'Dividing fixed costs by market revenue skips contribution and makes the hurdle look smaller than it is. A small required share is not the same as an easy one.', sources: ['hbs', 'openstax'],
  },
  {
    id: 'growth', title: 'Growth & compounding', group: 'Business numbers', description: 'Build a growth bridge without adding annual rates.',
    formula: 'Future value = starting value × (1 + annual rate)ⁿ; CAGR = (ending ÷ starting)^(1/n) − 1',
    method: ['Count intervals, not date labels. From the end of year 1 to the end of year 4 is three years.', 'Turn each rate into a multiplier. For 10% growth, multiply by 1.1 once per year.', 'CAGR is a smooth equivalent rate, not proof that every year grew evenly. Confirm that the starting and ending values are positive.'],
    trap: 'Adding rates ignores growth on growth. A constant future rate is a modelling assumption, not a verified forecast.', sources: ['bcg'],
  },
  {
    id: 'sizing', title: 'Market-sizing maths', group: 'Business numbers', description: 'Turn assumptions into a transparent demand model.',
    formula: 'Annual market revenue = population × eligible share × adoption × purchases per week × weeks × price',
    method: ['Restate the question and fix the scope: geography, period, the unit you count, and what is in or out. Then pick the route with the fewest guessed inputs: top-down from a population you trust, or bottom-up from one store, household or machine.', 'Write the whole equation before adding numbers, using a few strong splits (urban/rural, age, income, usage frequency) rather than many weak ones. Keep percentages as decimals and carry units through.', 'Sanity-check at human scale (per person, per household, per day), then cross-check from the other side: a demand-side answer against supply capacity, or the reverse. Name the input you would verify first.'],
    trap: 'A neat calculation does not validate the assumptions. A 10% relative change in one multiplicative assumption changes the result by 10%, with all other inputs fixed.', sources: ['bcg', 'mckinsey'],
  },
  {
    id: 'capacity', title: 'Capacity & bottlenecks', group: 'Decision checks', description: 'Find the constraint before buying more equipment.',
    formula: 'Steady-state serial output ≤ slowest stage rate × productive hours',
    method: ['Map the process: must every unit pass through every stage, or are there genuinely parallel resources?', 'For a simple serial process, take the minimum comparable rate. Add only rates of usable parallel resources.', 'Check demand, downtime, yield, and working hours. After an upgrade, locate the next constraint.'],
    trap: 'Adding serial rates overstates system capacity. Utilisation above 100% signals an infeasible plan under the stated capacity, not an efficiency gain.', sources: ['bcg'],
  },
  {
    id: 'payback', title: 'Payback & cash returns', group: 'Decision checks', description: 'Use cash, check the hurdle, and know the limits.',
    formula: 'Simple payback = upfront investment ÷ annual incremental net cash benefit',
    method: ['Subtract incremental running costs from cash savings. Do not substitute accounting profit for cash.', 'For steady benefits, divide the investment by the annual net benefit. For uneven benefits, accumulate cash flows until the investment is recovered.', 'Compare with the stated payback hurdle. A T-year cash ROI can be defined as (T × annual net benefit − investment) ÷ investment; neither metric discounts cash flows.'],
    trap: 'Quick payback does not prove a positive NPV or a good investment. Consider the asset’s life, risk, discount rate, and cash flows after payback. Non-positive net savings do not recover the investment.', sources: ['bcg'],
  },
  {
    id: 'price-change', title: 'Price cuts & the volume they need', group: 'Decision checks', description: 'Check how much extra volume a discount must bring just to stand still.',
    formula: 'Required volume increase = old unit contribution ÷ new unit contribution − 1',
    method: ['Find unit contribution before and after the price change. Variable cost per unit stays the same.', 'Total contribution stays flat when new contribution × new volume equals old contribution × old volume, so new volume ÷ old volume = old contribution ÷ new contribution.', 'Compare the lift needed with what customers will realistically do. The lower the margin, the bigger the lift a cut demands.'],
    trap: 'A 10% price cut needs far more than 10% extra volume when margins are thin. Keeping revenue flat is not the same as keeping profit flat.', sources: ['hbs'],
  },
  {
    id: 'lifetime-value', title: 'Customer lifetime value', group: 'Decision checks', description: 'Weigh what a customer is worth against what it costs to win one.',
    formula: 'Lifetime value = monthly revenue per customer × gross margin ÷ monthly churn rate',
    method: ['Turn revenue into gross profit per customer per month: revenue times gross margin.', 'Expected lifetime in months is one divided by monthly churn, so divide monthly gross profit by churn.', 'Set lifetime value against customer acquisition cost (CAC). The gap is what is left to cover fixed costs and profit.'],
    trap: 'Using revenue instead of gross profit inflates the value. This simple version ignores discounting and assumes churn stays constant.', sources: ['bcg'],
  },
  {
    id: 'perpetuity', title: 'Valuing a steady cash stream', group: 'Decision checks', description: 'Price a business from next year’s cash, its growth and the return investors want.',
    formula: 'Value today = next year’s cash flow ÷ (required return − growth rate)',
    method: ['Use next year’s cash flow, not this year’s profit.', 'Subtract the long-run growth rate from the required return, then divide the cash flow by that spread.', 'Test the spread: small changes in either rate move the answer a lot, so state the assumptions and show a range.'],
    trap: 'The formula only works when the required return is above the growth rate. Dividing by the return alone ignores growth and undervalues a growing business.', sources: ['bcg'],
  },
]

const number = value => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
const money = value => `$${number(value)}`
const option = (label, feedback) => ({ label, feedback })
const question = (prompt, good, trap, alternative) => ({ prompt, correct: 'reasoned', options: [good, trap, alternative].map((item, index) => ({ ...item, id: ['reasoned', 'trap', 'alternative'][index] })) })

export function makeCaseMathExercise(lessonId, variant = 0) {
  if (!CASE_MATH_LESSONS.some(item => item.id === lessonId)) throw new Error(`Unknown case maths lesson: ${lessonId}`)
  if (!Number.isSafeInteger(variant) || variant < 0 || variant > 1000000) throw new Error('Invalid exercise variant')
  const n = variant, alternate = n % 2 === 1
  let context, exhibit, setup, calculate, interpret, inputs, expected
  if (lessonId === 'units') {
    const monthlyRevenue = (n % 5 + 3) * 120000, monthlyOrders = (n % 3 + 2) * 10000, annualRevenue = monthlyRevenue * 12
    inputs = { annualRevenue, monthlyOrders }; expected = monthlyRevenue / monthlyOrders
    context = `A ${alternate ? 'repair-booking service' : 'parcel service'} reports ${money(annualRevenue / 1000000)}m in annual revenue and ${number(monthlyOrders)} orders per month. Activity and revenue are steady throughout the year.`
    setup = question('Which setup gives dollars of revenue per order?', option('Convert millions to dollars, divide annual revenue by 12, then divide by monthly orders.', 'Bring both figures to a monthly basis; dollars per month ÷ orders per month leaves dollars per order.'), option('Divide annual revenue in dollars by monthly orders.', 'The time periods differ. This would produce a value twelve times too high.'), option('Divide monthly orders by annual revenue in dollars.', 'This reverses the requested ratio and still mixes time periods.'))
    calculate = question('What is the revenue per order?', option(`${money(expected)} per order`, `${money(annualRevenue)} ÷ 12 = ${money(monthlyRevenue)} per month. Divide by ${number(monthlyOrders)} orders to get ${money(expected)} per order. As a scale check, hundreds of thousands divided by tens of thousands should give tens, not thousands.`), option(`${money(expected * 12)} per order`, 'This uses annual revenue against monthly orders. Divide by twelve as well.'), option(`${money(expected / 1000)} per order`, 'A million is one thousand thousands. Check your powers of ten before dividing.'))
    interpret = question('What can you tell the client from this result?', option('Compare revenue per order with cost per order before judging profitability.', 'The ratio describes revenue, not profit. Matching it with costs on the same basis makes it commercially useful.'), option('Every order produces this much profit.', 'There is no cost data, so profit is not established.'), option('This is the revenue earned in a whole month.', 'The output unit is dollars per order, not dollars per month.'))
  }
  if (lessonId === 'percentages') {
    const before = [12, 20, 25, 40][n % 4], gain = [3, 4, 5][Math.floor(n / 4) % 3], after = before + gain
    inputs = { before, after }; expected = gain / before * 100
    context = `A ${alternate ? 'subscription site' : 'retailer'} compares conversion before and after a redesign. Comparable traffic samples show the rates below. These are observed results, not a controlled experiment.`
    exhibit = [['Period', 'Conversion rate'], ['Before', `${before}%`], ['After', `${after}%`]]
    setup = question('How should relative growth in conversion be calculated?', option('(New rate − original rate) ÷ original rate × 100%', 'Growth is measured against the original base.'), option('(New rate − original rate) ÷ new rate × 100%', 'The denominator must be the original rate, not the result.'), option('New rate − original rate, reported as relative % growth', 'Subtracting rates gives a percentage-point change, not relative growth.'))
    calculate = question('What is the relative increase? Round to two decimal places if needed.', option(`${number(expected)}%`, `The rate increased by ${gain} percentage points. Relative growth is ${gain} ÷ ${before} × 100 = ${number(expected)}%.`), option(`${gain}%`, `${gain} is the percentage-point difference. Divide it by the starting rate to find relative growth.`), option(`${number(gain / after * 100)}%`, 'This divides by the final rate rather than the starting rate.'))
    interpret = question('Which statement accurately reports the change?', option(`Conversion rose by ${gain} percentage points (${number(expected)}% relative growth); the cause is not yet proven.`, 'State both measures clearly and separate the observed difference from a causal claim.'), option(`Conversion rose by ${number(expected)} percentage points.`, 'Relative percentages and percentage points use different bases.'), option('The redesign definitely caused all of the improvement.', 'Comparable samples do not rule out other changes, seasonality, or sampling variation.'))
  }
  if (lessonId === 'weighted') {
    const countA = (n % 5 + 2) * 100, countB = countA * [2, 3, 4][Math.floor(n / 5) % 3], priceA = 12 + n % 4 * 2, priceB = priceA + 8 + Math.floor(n / 4) % 3 * 4
    inputs = { countA, countB, priceA, priceB }; expected = (countA * priceA + countB * priceB) / (countA + countB)
    context = `A ${alternate ? 'laundry operator' : 'delivery company'} has two service tiers. Every order belongs to exactly one tier. Find blended revenue per order for the period.`
    exhibit = [['Tier', 'Orders', 'Revenue / order'], ['Standard', number(countA), money(priceA)], ['Premium', number(countB), money(priceB)]]
    setup = question('Which calculation correctly combines the tiers?', option('Add each tier’s orders × revenue per order, then divide by total orders.', 'Weight each rate by the number of orders generating that revenue.'), option('Add the two revenue-per-order figures and divide by two.', 'The tiers have different order volumes, so an unweighted average is not representative.'), option('Weight each revenue-per-order figure by its share of total revenue.', 'Revenue shares are not the correct weights for revenue per order. Use order counts.'))
    calculate = question('What is blended revenue per order, to the nearest cent?', option(money(expected), `Total revenue = ${number(countA)} × ${money(priceA)} + ${number(countB)} × ${money(priceB)} = ${money(countA * priceA + countB * priceB)}. Divide by ${number(countA + countB)} orders to get ${money(expected)} per order.`), option(money((priceA + priceB) / 2), 'This is the unweighted mean; it gives too much weight to the smaller standard tier.'), option(money(countA * priceA + countB * priceB), 'That is total revenue. You still need to divide by the total order count.'))
    interpret = question('Which sanity check supports your answer?', option('It lies between both rates, closer to the higher-volume premium tier.', 'With positive weights, the weighted average lies between the component values. Premium has more orders, so it pulls the average upward.'), option('It must be exactly halfway between the two rates.', 'That only follows if the order counts are equal.'), option('It proves the premium tier is more profitable.', 'Revenue per order does not account for the cost of serving each tier.'))
  }
  if (lessonId === 'margins') {
    const price = [80, 100, 120][n % 3], volume = (n % 4 + 2) * 1000, variableCost = price * 0.6, fixedCost = (n % 5 + 1) * 10000
    const revenue = price * volume, cost = variableCost * volume + fixedCost, profit = revenue - cost
    inputs = { price, volume, variableCost, fixedCost }; expected = profit / revenue * 100
    context = `A ${alternate ? 'desk-lamp maker' : 'bag maker'} sells ${number(volume)} units this month at ${money(price)} each. Variable operating cost is ${money(variableCost)} per unit and fixed operating costs are ${money(fixedCost)} per month. No other operating costs apply; ignore interest and tax.`
    setup = question('Which setup gives the operating margin?', option('[(Price − variable cost) × units − fixed costs] ÷ (price × units)', 'Calculate operating profit after both cost types, then divide by revenue.'), option('(Price − variable cost) ÷ price', 'That gives the contribution margin before fixed costs.'), option('Operating profit ÷ total operating costs', 'That uses a cost base rather than the revenue denominator required for margin.'))
    calculate = question('What is the operating margin? Round to two decimal places if needed.', option(`${number(expected)}%`, `Revenue = ${money(revenue)}. Operating costs = ${money(variableCost * volume)} + ${money(fixedCost)} = ${money(cost)}. Profit = ${money(profit)}, so margin = ${money(profit)} ÷ ${money(revenue)} × 100 = ${number(expected)}%.`), option('40%', 'This is contribution divided by revenue. It does not deduct fixed costs.'), option(`${number(profit / cost * 100)}%`, 'This divides profit by costs; operating margin divides profit by revenue.'))
    interpret = question('What does this margin mean?', option(`About ${number(expected)} cents per revenue dollar remain after the stated operating costs.`, 'It is operating profit per sales dollar, before any excluded interest and tax.'), option('This percentage of revenue is available before fixed costs are paid.', 'Fixed operating costs have already been deducted in this calculation.'), option('This is the company’s net margin after all taxes and financing.', 'Interest and tax were explicitly excluded, so net margin cannot be inferred.'))
  }
  if (lessonId === 'break-even') {
    const price = 35 + n % 5 * 5, contribution = [12, 16, 20][Math.floor(n / 5) % 3], variableCost = price - contribution, fixedCost = 12005 + n % 7 * 2000
    inputs = { price, variableCost, fixedCost }; expected = Math.ceil(fixedCost / contribution)
    context = `A ${alternate ? 'craft-kit shop' : 'meal-kit shop'} sells each kit for ${money(price)}, with ${money(variableCost)} variable cost per kit and ${money(fixedCost)} monthly fixed costs. Every kit produced is sold. Assume these prices and costs remain constant within the relevant capacity range.`
    setup = question('How many whole kits must be sold to avoid an operating loss?', option('Fixed costs ÷ (price − variable cost per kit), rounded up', 'Each sale contributes only price minus variable cost toward covering fixed costs.'), option('Fixed costs ÷ price, rounded up', 'This assumes the full selling price is available to cover fixed costs and ignores variable costs.'), option('Fixed costs ÷ (price − variable cost), rounded down', 'Rounding down leaves a fraction of fixed costs uncovered.'))
    calculate = question('What is the minimum number of whole kits?', option(`${number(expected)} kits`, `Unit contribution = ${money(price)} − ${money(variableCost)} = ${money(contribution)}. ${money(fixedCost)} ÷ ${money(contribution)} = ${number(fixedCost / contribution)} kits, so round up to ${number(expected)}.`), option(`${number(Math.ceil(fixedCost / price))} kits`, 'You divided by price rather than by unit contribution.'), option(`${number(expected - 1)} kits`, 'At this volume, contribution is still below fixed costs. One more whole kit is needed.'))
    interpret = question('What should you check before recommending the launch?', option('Whether realistic monthly demand and capacity can reach this volume.', 'The arithmetic identifies a threshold, not proof of attainable demand. Recheck costs if reaching it requires new capacity.'), option('Nothing else: break-even volume proves there will be enough customers.', 'Cost recovery math does not establish customer demand.'), option('At break-even, revenue equals profit.', 'Revenue pays variable and fixed costs. Operating profit is approximately zero at the threshold.'))
  }
  if (lessonId === 'growth') {
    const initialRevenue = (n % 5 + 4) * 100000, rate = [5, 10, 20, 25][Math.floor(n / 5) % 4], years = 2 + n % 2
    inputs = { initialRevenue, rate, years }; expected = initialRevenue * (1 + rate / 100) ** years
    context = `A ${alternate ? 'training platform' : 'software provider'} has ${money(initialRevenue)} in current annual revenue. Model revenue ${years} years from now, assuming ${rate}% growth in each of the ${years} full annual intervals.`
    setup = question('Which model applies the same percentage growth each year?', option(`Current revenue × (1 + ${rate}%)^${years}`, 'Each year grows from the previous year’s revenue, not from the original base.'), option(`Current revenue × (1 + ${years} × ${rate}%)`, 'This adds annual growth rates and omits growth on earlier increases.'), option(`Current revenue × (1 + ${rate}%)`, 'This models only one annual interval.'))
    calculate = question('What annual revenue does the model give at the end of that period?', option(money(expected), `${money(initialRevenue)} × ${number(1 + rate / 100)}^${years} = ${money(expected)}. This is revenue in the final year, not cumulative revenue across the period.`), option(money(initialRevenue * (1 + years * rate / 100)), 'This is simple growth from the starting base, rather than compounded growth.'), option(money(initialRevenue * (1 + rate / 100)), 'This stops after one year. Apply the multiplier for every annual interval.'))
    interpret = question('How should you describe this result to the client?', option('A scenario based on constant annual growth, not a guaranteed forecast.', 'CAGR can describe the smooth equivalent rate between two values, but does not prove the actual path or that future growth is achievable.'), option('The total revenue collected across all of those years.', 'The formula gives the final year’s annual revenue, not the sum of all years.'), option('A verified forecast because the formula is mathematically correct.', 'A correct calculation can still rest on an unrealistic growth assumption.'))
  }
  if (lessonId === 'sizing') {
    const population = (n % 5 + 2) * 100000, eligible = [20, 25, 40][Math.floor(n / 5) % 3], penetration = [25, 50, 75][Math.floor(n / 15) % 3], frequency = 2 + n % 3, weeks = 50, price = 5 + n % 4
    inputs = { population, eligible, penetration, frequency, weeks, price }; expected = population * eligible / 100 * penetration / 100 * frequency * weeks * price
    context = `Estimate the defined annual ${alternate ? 'prepared-lunch' : 'takeaway-drink'} market in a city of ${number(population)} people. ${eligible}% are eligible customers; ${penetration}% of those customers buy ${frequency} times per week at ${money(price)} per purchase for ${weeks} weeks a year. Each person is counted once. These are exercise assumptions, not surveyed facts.`
    setup = question('Which model gives total annual revenue in this defined market?', option('People × eligible share × adoption × weekly purchases × weeks × price', 'The shares narrow the population, frequency converts people into purchases, and price converts purchases into revenue.'), option('People × eligible share × weekly purchases × weeks × price', 'This assumes every eligible person buys, ignoring the adoption assumption.'), option('People × eligible share × adoption × weekly purchases × price', 'This gives weekly revenue. The question asks for a year.'))
    calculate = question('What annual market revenue follows from the assumptions?', option(money(expected), `${number(population)} × ${eligible / 100} × ${penetration / 100} = ${number(population * eligible / 100 * penetration / 100)} buying customers. Multiply by ${frequency} × ${weeks} purchases per year × ${money(price)} to get ${money(expected)} per year.`), option(money(expected / (penetration / 100)), 'This leaves out adoption and counts all eligible people as buyers.'), option(money(expected / weeks), 'This is the weekly figure; multiply by the stated number of active weeks.'))
    interpret = question('Which conclusion follows from this estimate?', option('This is the defined market, not the client’s revenue; test adoption and attainable share.', 'Market size, feasible market share, and profitability are separate questions. Sensitivity analysis should focus on the uncertain inputs.'), option('The client can automatically earn this revenue after entry.', 'The estimate includes all providers in the defined market.'), option('The exact-looking result means the assumptions are accurate.', 'Multiplying assumed inputs does not verify them. Show a plausible range when the inputs are uncertain.'))
  }
  if (lessonId === 'capacity') {
    const first = 60 + n % 5 * 12, rates = [first, first - 12, first + 24], hours = 6 + n % 3
    inputs = { rates, hours }; expected = Math.min(...rates) * hours
    context = `A ${alternate ? 'gift-box' : 'device'} line sends every unit through preparation, assembly, then checking. Assume steady-state flow, no defects or downtime, enough demand, and ${hours} productive hours per day. Rates are for the entire stage, not individual workers.`
    exhibit = [['Serial stage', 'Capacity / hour'], ['Preparation', number(rates[0])], ['Assembly', number(rates[1])], ['Checking', number(rates[2])]]
    setup = question('Which setup estimates the line’s daily output capacity?', option('Minimum of the three stage rates × productive hours', 'Every unit must pass through all three stages. The slowest stage constrains steady-state flow.'), option('Sum of all three stage rates × productive hours', 'Adding rates would treat serial stages as if they were parallel lines.'), option('Average of all three stage rates × productive hours', 'An average hides the bottleneck and overstates feasible throughput.'))
    calculate = question('How many finished units can the line produce per day under these assumptions?', option(`${number(expected)} units`, `Assembly is the bottleneck at ${rates[1]} units/hour. ${rates[1]} × ${hours} productive hours = ${number(expected)} finished units/day.`), option(`${number(rates.reduce((a, b) => a + b, 0) * hours)} units`, 'Each unit needs all stages, so summing their rates counts incompatible output.'), option(`${number(rates[0] * hours)} units`, 'Preparation can produce this much, but assembly cannot process all of it.'))
    interpret = question('Which next step is best supported?', option('Investigate assembly; after any upgrade, check whether preparation becomes the constraint.', 'Upgrading the bottleneck can help, but only until a different stage, demand, or another operating constraint becomes binding.'), option('Upgrade checking first because it already has the highest hourly capacity.', 'More checking capacity alone does not remove the assembly bottleneck.'), option('Commit to this output without checking downtime or demand.', 'The result is conditional on the stated operating assumptions, not a production guarantee.'))
  }
  if (lessonId === 'payback') {
    const investment = (n % 5 + 3) * 60000, grossSaving = (n % 4 + 4) * 15000, runningCost = (n % 3 + 1) * 5000, net = grossSaving - runningCost
    inputs = { investment, grossSaving, runningCost }; expected = investment / net
    context = `A ${alternate ? 'warehouse' : 'hotel'} could invest ${money(investment)} upfront to save ${money(grossSaving)} in cash each year, with ${money(runningCost)} of additional yearly running costs. Benefits accrue evenly from day one for ten years. No other cash flows apply. The client’s simple-payback hurdle is no more than three years.`
    setup = question('Which setup measures simple payback in years?', option('Upfront investment ÷ (annual cash savings − additional annual running costs)', 'Use incremental net cash benefit, so dollars ÷ dollars per year leaves years.'), option('Upfront investment ÷ gross annual savings', 'The new operating costs reduce annual cash recovery and must be deducted.'), option('Annual net cash savings ÷ upfront investment', 'This is a cash-return rate, not the time to recover the investment.'))
    calculate = question('What is simple payback, to two decimal places if needed?', option(`${number(expected)} years`, `Annual incremental net cash benefit = ${money(grossSaving)} − ${money(runningCost)} = ${money(net)}. Payback = ${money(investment)} ÷ ${money(net)} = ${number(expected)} years.`), option(`${number(investment / grossSaving)} years`, 'This ignores the extra running costs and makes recovery look too fast.'), option(`${number(net / investment)} years`, 'The ratio is inverted: annual benefit divided by investment is not a duration.'))
    interpret = question('What should you report against the client’s hurdle?', option(`${expected <= 3 ? 'It passes' : 'It fails'} the three-year payback screen; assess discounted cash flows and risk separately.`, 'Use the unrounded value for the threshold comparison. Payback ignores time value and cash flows after recovery; it does not determine NPV.'), option('It must have positive NPV because annual net savings are positive.', 'Positive annual savings alone do not establish whether discounted lifetime benefits exceed the initial cost.'), option('Simple payback accounts for the time value of money.', 'Simple payback does not discount cash flows. A discounted analysis is a different calculation.'))
  }
  if (lessonId === 'breakeven-share') {
    const contribution = [10, 15, 20, 25][Math.floor(n / 6) % 4], variableCost = [15, 20, 25, 30, 35][n % 5], price = contribution + variableCost
    const fixedCost = (n % 6 + 3) * 15000, market = (Math.floor(n / 24) % 5 + 4) * 10000
    const units = Math.ceil(fixedCost / contribution)
    inputs = { price, variableCost, fixedCost, market }; expected = units / market * 100
    context = `A ${alternate ? 'water-filter' : 'cycle-helmet'} brand is weighing entry into a market that buys ${number(market)} units a year. It would sell at ${money(price)} a unit, with ${money(variableCost)} variable cost per unit and ${money(fixedCost)} of extra fixed costs a year. Prices and costs are assumed stable; figures are exercise assumptions.`
    setup = question('Which calculation gives the market share needed to break even?', option('(Fixed costs ÷ unit contribution) ÷ market units', 'Break-even volume comes from contribution, then dividing by market volume turns it into a share.'), option('Fixed costs ÷ (market units × price)', 'This compares costs with market revenue and ignores variable cost, so the hurdle looks too small.'), option('Unit contribution ÷ price', 'That is the contribution margin, which says nothing about how much of the market you need.'))
    calculate = question('What share of the market must the brand win? Round to two decimals.', option(`${number(expected)}%`, `Unit contribution = ${money(price)} − ${money(variableCost)} = ${money(contribution)}. Break-even volume = ${money(fixedCost)} ÷ ${money(contribution)} = ${number(units)} units (rounded up). Share = ${number(units)} ÷ ${number(market)} = ${number(expected)}%.`), option(`${number(fixedCost / (market * price) * 100)}%`, 'You divided fixed costs by market revenue. Each unit only contributes its margin toward fixed costs.'), option(`${number(contribution / price * 100)}%`, 'This is the contribution margin, not a market share.'))
    interpret = question('How should you use this number?', option('Compare it with what rivals hold and how fast a new brand could realistically gain share.', 'The share is a hurdle. Whether it is attainable depends on competition, distribution and time.'), option('Any share below 100% means the launch will make money.', 'A share can be technically possible yet unrealistic for a newcomer.'), option('It shows the price is set too high.', 'The calculation takes price as given; it does not test whether the price is right.'))
  }
  if (lessonId === 'price-change') {
    const price = [20, 25, 40, 50][n % 4], costShare = [40, 50, 60][Math.floor(n / 4) % 3], cut = [5, 10, 20][Math.floor(n / 12) % 3], volume = (n % 5 + 2) * 1000
    const variableCost = price * costShare / 100, newPrice = price * (1 - cut / 100)
    const oldContribution = price - variableCost, newContribution = newPrice - variableCost
    inputs = { price, variableCost, cut, volume }; expected = (oldContribution / newContribution - 1) * 100
    context = `A ${alternate ? 'gym chain' : 'coffee-pod brand'} sells ${number(volume)} units a month at ${money(price)}, with ${money(variableCost)} variable cost per unit. It is considering a ${cut}% price cut. Fixed costs do not change, and costs per unit stay the same at higher volume.`
    setup = question('When does the price cut leave profit unchanged?', option('When new unit contribution × new volume equals old unit contribution × old volume', 'Fixed costs are unchanged, so profit is flat when total contribution is flat.'), option(`When volume rises by ${cut}%, the same as the price cut`, 'Each unit now earns less contribution, so volume must rise by more than the cut.'), option('When new revenue equals old revenue', 'Flat revenue still means lower profit, because each extra unit carries variable cost.'))
    calculate = question('By how much must volume rise just to keep profit flat? Round to two decimals.', option(`${number(expected)}%`, `Old contribution = ${money(price)} − ${money(variableCost)} = ${money(oldContribution)}. New price = ${money(newPrice)}, so new contribution = ${money(newContribution)}. Volume must rise by ${money(oldContribution)} ÷ ${money(newContribution)} − 1 = ${number(expected)}%.`), option(`${cut}%`, 'Matching the price cut ignores that each unit now contributes less.'), option(`${number((1 / (1 - cut / 100) - 1) * 100)}%`, 'This keeps revenue flat, not profit.'))
    interpret = question('What is the right next question for the client?', option(`Will demand really rise about ${number(Math.round(expected))}% at the lower price, and will rivals match the cut?`, 'The arithmetic sets the bar; customer response and competitor reaction decide whether it is cleared.'), option('None: lower prices always grow profit through volume.', 'With thin margins a cut can need a very large volume lift and may never pay off.'), option('Whether the fixed costs can be cut by the same percentage.', 'Fixed costs were unchanged by assumption; the issue is contribution per unit.'))
  }
  if (lessonId === 'lifetime-value') {
    const revenue = [8, 12, 15, 20, 30][n % 5], margin = [40, 60, 75][Math.floor(n / 5) % 3], churn = [2, 4, 5, 8][Math.floor(n / 15) % 4], cac = [60, 90, 120, 150][(n + Math.floor(n / 5)) % 4]
    const monthlyProfit = revenue * margin / 100
    inputs = { revenue, margin, churn, cac }; expected = monthlyProfit / (churn / 100)
    const ratio = expected / cac
    context = `A ${alternate ? 'meal-plan app' : 'language-learning app'} charges ${money(revenue)} a month. Gross margin is ${margin}%, ${churn}% of subscribers cancel each month, and winning a new subscriber costs ${money(cac)} in marketing. Ignore discounting; assume churn stays constant.`
    setup = question('Which calculation gives lifetime value per subscriber?', option('Monthly gross profit per subscriber ÷ monthly churn rate', 'Gross profit is what each month is worth, and one over churn is the expected lifetime in months.'), option('Monthly revenue per subscriber ÷ monthly churn rate', 'Revenue overstates value because it ignores the cost of serving the customer.'), option('Monthly gross profit per subscriber × 12', 'That is one year of profit, not the customer’s expected lifetime.'))
    calculate = question('What is the lifetime value of one subscriber?', option(money(expected), `Monthly gross profit = ${money(revenue)} × ${margin}% = ${money(monthlyProfit)}. Expected lifetime = 1 ÷ ${churn}% = ${number(100 / churn)} months. Lifetime value = ${money(monthlyProfit)} × ${number(100 / churn)} = ${money(expected)}.`), option(money(revenue / (churn / 100)), 'This uses revenue rather than gross profit.'), option(money(monthlyProfit * 12), 'This counts only twelve months instead of the expected lifetime.'))
    interpret = question('What does this tell you about growth spending?', option(`Each subscriber is worth about ${number(Math.round(ratio * 10) / 10)}× what it costs to win, before fixed costs.`, 'Compare lifetime value with CAC; the gap must also cover overheads and profit, and churn assumptions deserve testing.'), option('Lifetime value is the profit each subscriber adds after all costs.', 'It is gross profit before fixed costs and before discounting, not net profit.'), option('Higher churn would raise lifetime value.', 'Higher churn shortens the expected lifetime and lowers the value.'))
  }
  if (lessonId === 'perpetuity') {
    const cash = [2, 3, 4, 5, 6][n % 5], rate = [8, 10, 12][Math.floor(n / 5) % 3], growth = [1, 2, 3][Math.floor(n / 15) % 3]
    inputs = { cash, rate, growth }; expected = cash / ((rate - growth) / 100)
    context = `A ${alternate ? 'chain of car washes' : 'regional water utility'} is expected to generate ${money(cash)}m of free cash flow next year, growing ${growth}% a year indefinitely. Investors require a ${rate}% annual return. These are exercise assumptions.`
    setup = question('Which formula values the business today?', option('Next year’s cash flow ÷ (required return − growth rate)', 'A growing perpetuity is cash flow divided by the spread between return and growth.'), option('Next year’s cash flow ÷ required return', 'This assumes zero growth, so it undervalues a growing business.'), option('Next year’s cash flow ÷ (required return + growth rate)', 'Growth increases value, so it must be subtracted from the return, not added.'))
    calculate = question('What is the business worth today?', option(`${money(expected)}m`, `Spread = ${rate}% − ${growth}% = ${rate - growth}%. Value = ${money(cash)}m ÷ ${rate - growth}% = ${money(expected)}m.`), option(`${money(cash / (rate / 100))}m`, 'You left out growth.'), option(`${money(cash / ((rate + growth) / 100))}m`, 'You added growth to the required return instead of subtracting it.'))
    interpret = question('What should you flag when presenting this value?', option('It is very sensitive to the gap between return and growth, so show a range.', `A one-point narrower spread would lift the value to ${money(cash / ((rate - growth - 1) / 100))}m.`), option('It is the total cash the business will ever produce.', 'It is a present value; future cash is discounted to today.'), option('Any growth rate can be assumed safely because it continues forever.', 'Growth must stay below the required return, and a long-run rate should be modest.'))
  }
  return { lessonId, variant, context, exhibit, math: { kind: lessonId, inputs, expected }, steps: [setup, calculate, interpret].map((step, index) => ({ ...step, stage: ['Set up', 'Calculate', 'Interpret'][index], calculation: index === 1 })) }
}
