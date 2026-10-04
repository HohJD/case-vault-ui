// Cases added after the tap-only format. Authored directly in tap form, so they have no legacy written version.
// Provenance stays in `pages` and `sourceNote` (not rendered). Added practice assumptions are labelled in `dataNote`.
const option = (id, label, feedback, value) => ({ id, label, feedback, ...(value === undefined ? {} : { value }) })
const part = (id, title, correct, options) => ({ id, title, correct, options })
const BUILD_PROMPT = 'Build the best-supported recommendation: choose an action, supporting evidence, and a risk or next step.'

export const EXTRA_CASES = [
  {
    id: 'airline-own-airports', title: 'Empty seats at the new airports', category: 'Profitability', sector: 'Aviation', level: 'Intermediate', focus: 'Follow the customer journey behind a falling number', pages: '15–17',
    brief: 'A European low-cost airline has been burning cash for two to three years. Its two main competitors have not. Diagnose why and recommend what to do.',
    sourceNote: 'Adapted from “Airline operator”. Mode-of-transport shares are from the source; the relative-change exercise is added.',
    steps: [
      { kind: 'choice', prompt: 'Revenue is down and costs are up. What should you establish first?', options: [
        option('split', 'Which revenue drivers and cost lines moved, and whether competitors saw the same.', 'Splitting profit into its drivers, and checking the problem is client-specific, tells you where to dig.'),
        option('fares', 'How far can we cut fares to win passengers back?', 'That jumps to a fix before you know why revenue fell, and fare cuts could deepen the cash burn.'),
        option('fleet', 'Should we sell part of the fleet to raise cash?', 'Selling assets treats a symptom. You do not yet know what is driving the losses.'),
      ], correct: 'split', hint: 'Break profit into revenue and cost drivers before choosing a fix.', reveal: ['Only the client is affected. It flies more direct flights, but occupancy has fallen on direct and connecting flights.', 'Hangar costs rose because the client started owning airports on city outskirts, where passengers need arrive only 30 minutes before departure.', 'Travel time to the new airports is about the same as before.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO areas that best explain the cash burn.', correct: ['occupancy', 'airports'], options: [
        option('occupancy', 'Why occupancy fell: each step of the passenger journey, from booking to reaching the airport.', 'Occupancy is the revenue driver that moved. Walking the customer journey shows where passengers drop out.'),
        option('airports', 'The cost and payback of owning airports, compared with competitors.', 'The only cost line that rose is tied to the new airports. Its size and payback explain much of the cash burn.'),
        option('cargo', 'Cargo pricing and freight volumes.', 'Nothing points to cargo. The facts point to passenger occupancy and airport costs.'),
        option('wages', 'Cabin crew pay compared with industry benchmarks.', 'Salaries were not reported as rising, and pay would not explain a client-specific fall in occupancy.'),
      ], hint: 'Follow the two things that changed: occupancy and hangar costs.', model: 'Split profit into revenue (flights × seats × occupancy × fare) and costs (fixed and variable). Occupancy and hangar costs moved. Walk the passenger journey to explain the occupancy fall, and test whether owning airports can pay back.' },
      { kind: 'calculation', prompt: 'By how much, in relative terms, did the share of passengers arriving by taxi fall?', unit: '% fall', answer: 80, tolerance: 0.01, dataNote: 'Mode-of-transport shares from the case: earlier airports compared with the client’s new airports.', exhibit: [['Mode', 'Earlier airports', 'New airports'], ['Public transport', '30%', '50%'], ['Own vehicle', '20%', '40%'], ['Taxi', '50%', '10%']], hint: 'Relative change = (old − new) ÷ old.', working: 'Taxi share fell from 50% to 10%, a drop of 40 percentage points. Relative fall = 40 ÷ 50 = 80%: four in five taxi arrivals have gone.', options: [
        option('relative', '80% fall', 'Correct: (50 − 10) ÷ 50 = 80%.', 80),
        option('points', '40% fall', '40 is the change in percentage points. Relative to the old 50% share, it is an 80% fall.', 40),
        option('kept', '20% fall', '10% is one-fifth of 50%, so 20% of the old share remains. The fall is 80%.', 20),
      ] },
      { kind: 'choice', prompt: 'Why have taxis largely disappeared from the new airports?', options: [
        option('return', 'On the outskirts, taxis rarely get a return fare, so fewer drivers serve the route.', 'Taxi supply follows two-way demand. Without return fares, drivers avoid the route, and passengers who relied on taxis fly with someone else.'),
        option('price', 'Passengers now find taxis too expensive.', 'Nothing suggests taxi fares rose. The shift is in availability, not price.'),
        option('time', 'The journey now takes much longer.', 'The case says travel time is about the same. The problem is getting a taxi at all.'),
      ], correct: 'return', hint: 'Think about the driver’s economics, not just the passenger’s.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Fix the broken step in the journey, cite the number, and test the investment.', model: 'Restore easy access to the new airports with a shuttle, or taxi and ride-hailing partnerships that make the return trip worthwhile, and consider bundling ground transport into the ticket. Taxi arrivals fell from 50% to 10% of passengers, an 80% fall, while travel time was unchanged. Track occupancy after the change and separately test whether owning airports pays back.', parts: [
        part('action', 'Action', 'access', [
          option('access', 'Restore access: run a shuttle or partner with taxi firms, with return-trip incentives.', 'This fixes the specific break in the customer journey behind the occupancy fall.'),
          option('sell', 'Sell the new airports immediately.', 'Do not undo a strategy without evidence. First test whether fixing access restores occupancy.'),
          option('discount', 'Cut fares across the network to fill seats.', 'Lower fares deepen the cash burn and do not fix how passengers reach the airport.'),
        ]),
        part('evidence', 'Supporting evidence', 'taxi', [
          option('taxi', 'Taxi arrivals fell 80% (from 50% to 10% of passengers) while travel time stayed the same.', 'This ties the occupancy fall to access rather than journey time or price.'),
          option('points', 'Taxi use fell by 40%.', 'That confuses the 40-point change with the 80% relative fall.'),
          option('cargo', 'Cargo revenue has collapsed.', 'No cargo data was given.'),
        ]),
        part('risk', 'Risk / next step', 'payback', [
          option('payback', 'Track occupancy after the fix, and test whether airport ownership pays back.', 'This checks both the revenue recovery and the investment behind the cost rise.'),
          option('wait', 'Assume occupancy will recover on its own.', 'Nothing suggests taxis will return without a reason to.'),
          option('awareness', 'Measure brand awareness among travellers.', 'Awareness is not the constraint; getting to the airport is.'),
        ]),
      ] },
    ],
  },
  {
    id: 'business-school-campus', title: 'A satellite MBA campus', category: 'Market entry', sector: 'Education', level: 'Foundation', focus: 'Size demand, then test whether entry can work', pages: '75–76',
    brief: 'A leading US business school is considering a satellite MBA campus in India within five years. It wants an international class, not only Indian students. Advise on the proposal.',
    sourceNote: 'Adapted from “HBS Satellite campus”. Applicant pools, shares, and the regulatory constraint are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('objective', 'The objective, target students, timeline, and how the campus should compare with the home campus.', 'Entry cases turn on the objective. Here it changes the target market: an international class, not only Indian students.'),
        option('fees', 'What fee should the campus charge?', 'Pricing comes later, once you know who the campus is for and whether demand exists.'),
        option('buildings', 'How many buildings will the campus need?', 'A design detail. It depends on class size, which depends on demand.'),
      ], correct: 'objective', hint: 'Ask what success means for the client before sizing anything.', reveal: ['Objective: add about 400 MBA seats and increase impact, within five years.', 'The school receives about 10,000 applications a year; assume half would consider an Indian campus.', 'Awarding a degree in India needs regulator (AICTE) approval, and complying would dilute the curriculum.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that should drive the recommendation.', correct: ['demand', 'viability'], options: [
        option('demand', 'Demand: current applicants willing to study in India, plus new Indian applicants, against 400 seats.', 'Demand against capacity shows whether seats can be filled at the school’s standard.'),
        option('viability', 'Feasibility and viability: regulation, faculty, land, costs, and pricing parity with the home campus.', 'Demand is not enough. Regulation, faculty travel, and land decide whether the campus can work financially.'),
        option('rankings', 'Where the campus would appear in global rankings.', 'Rankings follow later outcomes. They do not decide whether to enter now.'),
        option('alumni', 'Planning alumni events in India.', 'Useful after launch, not part of the entry decision.'),
      ], hint: 'Opportunity first, then whether it can actually work.', model: 'Structure entry as opportunity (market size, and share against leading Indian schools), feasibility (regulation, faculty, land, value chain), and viability (pricing, costs, risks). Demand looks ample; the decision turns on feasibility and cost.' },
      { kind: 'calculation', prompt: 'Roughly how many potential applicants would the campus have each year?', unit: 'applicants', answer: 7000, tolerance: 0, dataNote: 'Source assumptions: half of current applicants would consider India; about 200,000 people sit India’s MBA entrance test (CAT), and about 1% would meet the school’s bar.', exhibit: [['Pool', 'Base', 'Share', 'Applicants'], ['Current applicants', '10,000', '50%', '?'], ['New Indian applicants', '200,000', '1%', '?']], hint: 'Apply each share, then add the two pools.', working: 'Current pool: 10,000 × 50% = 5,000. New Indian pool: 200,000 × 1% = 2,000. Total ≈ 7,000 applicants for about 400 seats, roughly 17 per seat. Demand is not the constraint.', options: [
        option('total', 'About 7,000', 'Correct: 5,000 + 2,000.', 7000),
        option('current', 'About 5,000', 'That counts only current applicants and misses the new Indian pool.', 5000),
        option('raw', 'About 12,000', 'That adds 10,000 and 2,000 without applying the 50% share.', 12000),
      ] },
      { kind: 'choice', prompt: 'Demand looks ample. What is the biggest obstacle?', options: [
        option('feasibility', 'No degree without regulator approval, which would dilute the curriculum; land and flying in faculty are also costly.', 'Feasibility and cost, not demand, decide this case.'),
        option('demand', 'Too few students would apply.', 'About 7,000 potential applicants for 400 seats says demand is not the problem.'),
        option('global', 'Other global schools already dominate India.', 'The case says global schools are not yet a strong threat; Indian schools are the main competitors.'),
      ], correct: 'feasibility', hint: 'Once demand clears, look at what could stop the campus working.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Strong demand is not the same as a workable campus.', model: 'Advise against a full satellite campus on current terms. Demand is ample, at about 7,000 potential applicants for 400 seats, but a degree needs regulator approval that would dilute the curriculum, and land and faculty travel make costs high. Explore lighter options such as a non-degree programme or a partnership, and revisit if regulation changes.', parts: [
        part('action', 'Action', 'against', [
          option('against', 'Advise against a full campus on current terms; revisit if regulation or costs change.', 'This matches the evidence: strong demand, weak feasibility and viability.'),
          option('build', 'Build the full campus now, since demand is strong.', 'Demand alone ignores the degree restriction and high costs.'),
          option('discount', 'Launch at a steep discount to the home-campus fee.', 'Discounting worsens viability, and parity pricing was the working assumption.'),
        ]),
        part('evidence', 'Supporting evidence', 'constraints', [
          option('constraints', 'A degree needs approval that dilutes the curriculum, and land and faculty travel raise costs.', 'These are the facts that outweigh strong demand.'),
          option('demand', 'About 7,000 potential applicants for 400 seats.', 'True, but it supports entering, not the recommendation against it.'),
          option('rankings', 'Indian schools rank higher in India.', 'This is not stated in the case.'),
        ]),
        part('risk', 'Risk / next step', 'lighter', [
          option('lighter', 'Test lighter options, such as a non-degree programme or a partnership, and monitor regulation.', 'This keeps the goal of more impact while avoiding the main barrier.'),
          option('never', 'Rule India out permanently.', 'Regulation can change; a permanent no is not supported.'),
          option('menu', 'Survey students on campus food preferences.', 'Not a material risk to the entry decision.'),
        ]),
      ] },
    ],
  },
  {
    id: 'helicopter-shuttle', title: 'Pricing a helicopter shuttle', category: 'Pricing', sector: 'Transport', level: 'Intermediate', focus: 'Let the cost floor test the value ceiling', pages: '92–93',
    brief: 'A helicopter operator with services in London, Paris, and New York wants to launch an airport shuttle in Delhi, with no direct competitor. How should it price the service, and is it viable?',
    sourceNote: 'Adapted from “Helicopter service”. Costs are from the source. The source spreads cost over 100 monthly “trips” while describing round trips; this exercise states one-way flights explicitly.',
    steps: [
      { kind: 'choice', prompt: 'Which question best opens the analysis?', options: [
        option('service', 'What exactly is the service (route, time saved, capacity), and what does it replace?', 'You need the product and its alternatives, such as cabs and the metro, before choosing a pricing method.'),
        option('extras', 'What luxury extras would justify a premium?', 'Extras come after you know the costs and the customer’s value.'),
        option('fleet', 'How many helicopters should we buy?', 'Fleet size depends on demand and viability, which are not known yet.'),
      ], correct: 'service', hint: 'Understand the product and its substitutes first.', reveal: ['One rented helicopter flies between the airport and ports at either end of the city.', 'A cab takes about two hours; the helicopter about one.', 'Monthly fixed costs: rent $1.6 million, airport charges $200,000, salaries $400,000, other overheads $100,000. Fuel: 60 litres an hour at $75 a litre.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO pricing lenses to use first.', correct: ['cost', 'value'], options: [
        option('cost', 'Cost-based: the break-even fare from fixed costs, fuel, flights, and seats.', 'Break-even sets the floor the fare must clear.'),
        option('value', 'Value-based: time saved compared with cab fares and other helicopter rides.', 'Value sets the ceiling: what time-pressed travellers would pay.'),
        option('competitor', 'Competitor-based: match the nearest helicopter rival in Delhi.', 'There is no direct competitor, so this lens has little to anchor on.'),
        option('penetration', 'Launch cheaply to build volume, then raise fares.', 'With one helicopter, capacity is fixed, so cheap fares cannot grow volume much.'),
      ], hint: 'With no direct competitor, one method gives the floor and another the ceiling.', model: 'Use cost to set the floor and value to set the ceiling. Cost: fixed costs plus fuel, divided by seats flown at realistic occupancy. Value: time saved against cab fares, sanity-checked against other helicopter rides. If the floor sits above what most travellers value their time at, the business is not viable.' },
      { kind: 'calculation', prompt: 'Assume 8 one-hour flights a day (4 round trips), 25 days a month, and 4 seats per flight, all full. What one-way fare per seat breaks even?', unit: '$ per seat', answer: 4000, tolerance: 0.5, dataNote: 'Costs from the source. The flight schedule is a simplifying practice assumption.', exhibit: [['Item', 'Per month'], ['Fixed costs: rent, airport, salaries, overheads', '$2.3 million'], ['Fuel: 60 L an hour × $75 × 8 hours × 25 days', '?'], ['Seats: 8 flights × 4 seats × 25 days', '?']], hint: 'Total monthly cost ÷ seats flown.', working: 'Fuel = 60 × $75 = $4,500 an hour × 8 hours × 25 days = $900,000. Total = 23 + 9 = $3.2 million a month. Seats = 8 × 4 × 25 = 800. Break-even = $3,200,000 ÷ 800 = $4,000 per seat each way, even with every seat full.', options: [
        option('full', '$4,000', 'Correct: $3.2 million of monthly cost over 800 one-way seats.', 4000),
        option('round', '$8,000', 'That spreads cost over 400 round-trip seats. Per one-way flight it is half: $4,000.', 8000),
        option('fixed', '$2,875', 'That leaves out $900,000 of fuel: $2,300,000 ÷ 800.', 2875),
      ] },
      { kind: 'choice', prompt: 'A cab costs about $800 and takes an hour longer. What does the break-even fare imply?', options: [
        option('value', 'Riders must value an hour at over $3,200, even with full flights: a small, very wealthy market.', '($4,000 − $800) ÷ 1 hour saved = $3,200 an hour, before any empty seats. Few travellers qualify.'),
        option('cheap', 'It is cheap, because joyrides cost more per minute.', 'Short joyrides have different costs and buyers. For commuters, the cab is the relevant comparison.'),
        option('raise', 'Raise the fare, because there is no competitor.', 'No direct competitor does not mean no alternative. Cabs cap what most riders will pay.'),
      ], correct: 'value', hint: 'Compare the premium over a cab with the time saved.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Compare the cost floor with what the time saved is worth.', model: 'Do not launch a daily shuttle on these economics. Even with every seat full, break-even is $4,000 per one-way seat, five times a cab fare, so riders must value an hour at over $3,200. At most, test a premium pre-booked niche such as corporate transfers, and validate real occupancy and willingness to pay first.', parts: [
        part('action', 'Action', 'no-go', [
          option('no-go', 'Do not launch a daily shuttle; at most, test a premium pre-booked niche.', 'The cost floor is far above what most travellers value their time at.'),
          option('cheap', 'Launch at $1,500 a seat to win volume.', 'Below the $4,000 break-even, every flight loses money.'),
          option('second', 'Add a second helicopter to spread fixed costs.', 'Most fixed costs scale with each helicopter; rent alone is $1.6 million each.'),
        ]),
        part('evidence', 'Supporting evidence', 'floor', [
          option('floor', 'Break-even is $4,000 a seat even when full, five times a cab fare.', 'This shows the gap between the cost floor and what most riders would pay.'),
          option('monopoly', 'No competitor means demand is guaranteed.', 'No competitor can also mean there is no market.'),
          option('fuel', 'Fuel is the largest cost.', 'Fixed costs ($2.3 million) are larger than fuel ($900,000).'),
        ]),
        part('risk', 'Risk / next step', 'occupancy', [
          option('occupancy', 'Test real occupancy and willingness to pay with corporate or pre-booked customers.', 'Every empty seat raises the break-even fare, so occupancy is the key unknown.'),
          option('full', 'Plan on 100% occupancy.', 'Full flights are the best case, not a planning assumption.'),
          option('livery', 'Choose the helicopter’s livery.', 'Not a material risk.'),
        ]),
      ] },
    ],
  },
  {
    id: 'chemicals-share', title: 'Growing, but losing share', category: 'Growth', sector: 'Chemicals', level: 'Foundation', focus: 'Separate slower growth from falling sales', pages: '106–107',
    brief: 'A commodity chemicals manufacturer is losing market share. The rest of the industry is not. Find out why and recommend what to do.',
    sourceNote: 'Adapted from “Chemicals manufacturer”. Growth rates and shares in the calculation are added practice assumptions.',
    steps: [
      { kind: 'choice', prompt: 'What should you establish first?', options: [
        option('sales', 'Have the client’s sales fallen, or is it growing more slowly than the market?', 'Share can fall while sales rise. The answer points to very different causes.'),
        option('price', 'Should the client cut prices to win back share?', 'A price cut assumes the cause, and in commodities it can start a price war.'),
        option('rebrand', 'Does the product need rebranding?', 'Commodity chemicals compete on price, availability, and reliability, not brand.'),
      ], correct: 'sales', hint: 'Market share is a ratio. Which part of it moved?', reveal: ['Sales have not fallen; the client is growing more slowly than the industry.', 'Factories run at 100% capacity, and product mix is not the issue.', 'Factories and warehouses are far from major customers, and products are damaged in transit.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO areas that best explain the slower growth.', correct: ['capacity', 'access'], options: [
        option('capacity', 'Supply: production capacity and utilisation.', 'At 100% capacity, the client cannot grow with the market however strong demand is.'),
        option('access', 'Accessibility: distance to customers, logistics, and damage in transit.', 'Distant sites add cost and damage products, pushing customers to competitors.'),
        option('ads', 'Advertising spend against competitors.', 'In commodity chemicals, advertising rarely drives share.'),
        option('culture', 'Employee engagement scores.', 'Nothing in the case points here.'),
      ], hint: 'Split growth into supply and demand. Which side is blocked?', model: 'Share falls either because sales drop or because the client grows more slowly than the market. Sales are growing, so split slower growth into supply (capacity, accessibility, product mix) and demand (price, competitors, quality). Full capacity and distant, damage-prone logistics explain it.' },
      { kind: 'calculation', prompt: 'The client grows 5% a year while the market grows 10%. From a 20% share, what is its share after one year? Round to two decimals.', unit: '% share', answer: 20 * 1.05 / 1.1, tolerance: 0.01, dataNote: 'Practice assumptions: the source gives no growth rates or shares.', exhibit: [['', 'Sales now', 'Growth'], ['Client', '20', '5%'], ['Whole market', '100', '10%']], hint: 'New share = client sales next year ÷ market sales next year.', working: 'Client: 20 × 1.05 = 21. Market: 100 × 1.10 = 110. Share = 21 ÷ 110 = 19.09%. Sales rose 5%, yet share fell by almost a point.', options: [
        option('ratio', '19.09%', 'Correct: 21 ÷ 110.', 19.09),
        option('gap', '15%', 'That subtracts the 5-point growth gap from the share, mixing growth rates with share points.', 15),
        option('rough', '19%', 'Close, but 21 ÷ 110 is 19.09%, not 20 − 1.', 19),
      ] },
      { kind: 'choice', prompt: 'A new plant would take years to build. What should the client do first?', options: [
        option('near', 'Act now: move warehouses nearer customers, cut transit damage, and outsource some demand.', 'Practical near-term moves come first; new capacity follows.'),
        option('wait', 'Wait for the new plant before changing anything.', 'Years of slower growth would compound the share loss.'),
        option('discount', 'Cut prices to win customers back.', 'At full capacity the client cannot serve extra demand, so a price cut only lowers margin.'),
      ], correct: 'near', hint: 'Capacity takes years. What can change this quarter?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Fix access now, capacity next, and name the number that shows the problem.', model: 'Grow capacity and access together. Now: move warehouses nearer customers, cut transit damage, sign long-term contracts, and outsource overflow. Later: add capacity. Even with rising sales, growing 5% in a 10% market cuts a 20% share to about 19.09% in a year. Validate the capacity payback and how much customers value reliable delivery.', parts: [
        part('action', 'Action', 'both', [
          option('both', 'Move warehouses nearer customers, sign long-term contracts, and outsource while adding capacity.', 'This tackles both the access and capacity constraints.'),
          option('war', 'Start a price war to regain share.', 'At full capacity, cheaper prices cannot turn into more sales.'),
          option('brand', 'Invest in a brand campaign.', 'Brand is not what limits growth here.'),
        ]),
        part('evidence', 'Supporting evidence', 'constraint', [
          option('constraint', 'The client runs at 100% capacity with distant, damage-prone logistics.', 'These are the two facts that explain slower growth.'),
          option('falling', 'The client’s sales are falling sharply.', 'Sales are rising, just more slowly than the market.'),
          option('mix', 'The product mix is wrong.', 'The case rules product mix out.'),
        ]),
        part('risk', 'Risk / next step', 'payback', [
          option('payback', 'Check the capacity investment payback and whether customers value faster, damage-free delivery.', 'These decide whether the recommendation pays off.'),
          option('auto', 'Assume share will recover by itself.', 'Nothing changes while capacity and access stay the same.'),
          option('social', 'Track social media mentions.', 'Not a material driver in commodity chemicals.'),
        ]),
      ] },
    ],
  },
  {
    id: 'packaging-delays', title: 'Why small jobs run late', category: 'Strategy', sector: 'Packaging', level: 'Intermediate', focus: 'Find where the time goes, then check the incentives', pages: '128–129',
    brief: 'A packaging manufacturer is taking longer than planned to complete jobs. Competitors nearby are not. Diagnose why and recommend solutions.',
    sourceNote: 'Adapted from “Increased processing time”. Target and actual completion times are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('define', 'What counts as completion time, and is the delay in every plant and job type?', 'Defining the metric and narrowing where the problem appears saves most of the analysis.'),
        option('machines', 'Should we buy faster machines?', 'That is a fix before a diagnosis. The machines may not be the cause.'),
        option('overtime', 'Can staff work overtime to catch up?', 'This treats the symptom and adds cost.'),
      ], correct: 'define', hint: 'Pin down the metric and where the problem shows up.', reveal: ['Completion time runs from receiving raw material to finishing the job.', 'Only one of three plants is affected.', 'Jobs over 5,000 cartons are large; others are small. Target vs actual: small 36 vs 72 hours, large 48 vs 54 hours.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO components to break completion time into.', correct: ['run', 'idle'], options: [
        option('run', 'Manufacturing time: number of processes, run speed, and order quantity.', 'Run speed fell across machines, which explains part of the extra time.'),
        option('idle', 'Idle time: set-up and breakdowns on each machine, and waiting between machines.', 'Waiting and set-up often explain delays that machine speed cannot.'),
        option('sales', 'How quickly the sales team answers customers.', 'That is outside the manufacturing process the metric covers.'),
        option('prices', 'Raw material price trends.', 'Prices affect cost, not completion time.'),
      ], hint: 'A job is either running or waiting.', model: 'Completion time = manufacturing time + idle time. Manufacturing depends on processes, run speed, and order size; idle time on set-up, breakdowns, and waiting between machines. Both overran here, concentrated in small jobs at one plant.' },
      { kind: 'calculation', prompt: 'By what percentage did small jobs overrun their target completion time?', unit: '% over target', answer: 100, tolerance: 0.01, dataNote: 'Target and actual times from the case.', exhibit: [['Job type', 'Target (hours)', 'Actual (hours)'], ['Small (up to 5,000 cartons)', '36', '72'], ['Large (over 5,000 cartons)', '48', '54']], hint: 'Overrun = (actual − target) ÷ target.', working: 'Small jobs: (72 − 36) ÷ 36 = 100% over target. Large jobs: (54 − 48) ÷ 48 = 12.5%. The problem sits mainly in small jobs.', options: [
        option('target', '100%', 'Correct: 36 extra hours on a 36-hour target.', 100),
        option('actual', '50%', 'That divides the 36 extra hours by the 72-hour actual, not the target.', 50),
        option('large', '12.5%', 'That is the large-job overrun: 6 ÷ 48.', 12.5),
      ], reveal: ['Recent small jobs are more complex; operators slow the machines to avoid quality defects.', 'Set-up time and waiting between machines have both increased.', 'Customers are not asking for large jobs first, yet line managers schedule large jobs ahead of small ones.'] },
      { kind: 'choice', prompt: 'Why would line managers put large jobs first, and what does it suggest?', options: [
        option('kpi', 'Their target is cartons produced a day, so slower small jobs get pushed back. The incentive drives the delay.', 'When a metric rewards volume, people rationally delay low-volume work. Fix the metric, not just the people.'),
        option('careless', 'The managers are careless and should be replaced.', 'Blaming individuals misses that the incentive makes the behaviour rational.'),
        option('customers', 'Customers asked for large jobs first.', 'The case says there is no priority clash from customers.'),
      ], correct: 'kpi', hint: 'Ask what the line manager is measured on.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Address the skill gap and the incentive, and prove it with the overrun.', model: 'Train operators to run complex small jobs at speed without defects, learning from the two unaffected plants. Change line-manager targets from cartons produced to jobs completed by type, and plan machine time from forecasts. Small jobs overran their target by 100% against 12.5% for large jobs. Track completion time by job type to confirm the fix.', parts: [
        part('action', 'Action', 'fix', [
          option('fix', 'Train operators on complex jobs, set manager targets on jobs completed by type, and plan machine time from forecasts.', 'This covers both causes: slower runs and deprioritised small jobs.'),
          option('machines', 'Buy faster machines for the plant.', 'Speed is limited by quality on complex jobs, not by the machines.'),
          option('refuse', 'Stop accepting small jobs.', 'This loses customers instead of fixing the process.'),
        ]),
        part('evidence', 'Supporting evidence', 'overrun', [
          option('overrun', 'Small jobs overran by 100% against 12.5% for large ones, and managers are rewarded on cartons.', 'This links the delay to job type and to the incentive.'),
          option('all-plants', 'Every plant is running late.', 'Only one of three plants is affected.'),
          option('materials', 'Raw materials arrive late.', 'Nothing in the case supports this.'),
        ]),
        part('risk', 'Risk / next step', 'track', [
          option('track', 'Track completion time by job type, and copy practices from the two unaffected plants.', 'This confirms the fix and uses evidence already inside the company.'),
          option('training-only', 'Assume training alone fixes it.', 'Training leaves the carton-based incentive in place.'),
          option('more-managers', 'Hire more line managers.', 'More managers on the same target would behave the same way.'),
        ]),
      ] },
    ],
  },
  {
    id: 'campus-bank-branch', title: 'A campus bank branch’s profit', category: 'Estimation', sector: 'Banking', level: 'Intermediate', focus: 'Build profit from streams, then subtract losses', pages: '167',
    brief: 'Estimate the yearly profit contribution of a bank branch on a business-school campus, before branch operating costs. Build it from the main income streams and losses. Figures are simplified practice assumptions.',
    sourceNote: 'Adapted from guesstimate 12, “Profit made by a bank branch on campus”. Figures follow the source’s estimate.',
    steps: [
      { kind: 'choice', prompt: 'Which clarification matters most before estimating?', options: [
        option('streams', 'Who the customers are, such as students and faculty, and which products earn money: loans, insurance, foreign exchange.', 'A campus branch serves a narrow customer base. Naming its products gives you the revenue streams.'),
        option('staff', 'How many tellers work at the branch?', 'Operating costs matter, but this exercise estimates contribution before them. Start with how the branch earns money.'),
        option('national', 'What is the bank’s national market share?', 'National share says little about one campus branch.'),
      ], correct: 'streams', hint: 'Who banks here, and for what?', reveal: ['About 100 education loans a year, each repaid over five years, so about 500 loans are active.', 'Average outstanding principal is about $1 million per loan; net interest margin is 3%.', 'Exchange students and faculty make about 300 overseas trips a year, buying travel insurance and foreign currency.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO building blocks for the estimate.', correct: ['interest', 'fees-losses'], options: [
        option('interest', 'Interest income: active loans × average principal × net interest margin.', 'Loans are the biggest earner, and the margin, not the full interest rate, is what the bank keeps.'),
        option('fees-losses', 'Fee income from insurance and foreign exchange, less expected loan defaults.', 'This completes the picture: smaller fee streams, minus losses from bad loans.'),
        option('atm', 'Number of ATM withdrawals.', 'Withdrawals are a service, not a meaningful profit stream.'),
        option('gross-rate', 'Total deposits × the full interest rate charged on loans.', 'This mixes deposits with loan pricing and ignores the cost of funds. Use net interest margin.'),
      ], hint: 'Main earner first, then the smaller streams and the losses.', model: 'Profit contribution = interest income (active loans × principal × net interest margin) + insurance commission + forex income − losses from defaults. Keep units consistent in thousands and millions, and sanity-check the size of each stream.' },
      { kind: 'calculation', prompt: 'Using the table, what is the branch’s yearly profit contribution?', unit: '$', answer: (150 + 2.4 + 18 - 25) * 100000, tolerance: 1000, dataNote: 'Simplified practice assumptions following the source’s estimate.', exhibit: [['Stream', 'Working', 'Total ($)'], ['Interest', '500 loans × $1 million × 3%', '?'], ['Insurance commission', '300 policies × $2,000 × 40%', '240,000'], ['Forex income', '300 trips × $6,000', '1,800,000'], ['Defaults', 'About one loan lost a year, principal and interest', '−2,500,000']], hint: 'Work out interest in the same units first, then add and subtract the rest.', working: 'Interest = 500 × $1 million × 3% = $15 million. Contribution = 150 + 2.4 + 18 − 25 = $14,540,000, about $14.5 million. Interest is almost 90% of income.', options: [
        option('net', '$14,540,000', 'Correct: 150 + 2.4 + 18 − 25.', 14540000),
        option('gross', '$17,040,000', 'That forgets to subtract the $2.5 million default loss.', 17040000),
        option('decimal', '$1,040,000', 'Interest is 500 × $1 million × 3% = $15 million, not $1.5 million.', 1040000),
      ] },
      { kind: 'choice', prompt: 'Which check best tests whether about $14.5 million is sensible?', options: [
        option('driver', 'Interest is almost 90% of income, so test loan count, principal, and margin.', 'Test the dominant driver: each percentage point of margin moves the answer by $5 million.'),
        option('forex', 'Refine the forex estimate first.', 'Forex is $1.8 million; even a large error barely moves the total.'),
        option('precise', 'Report exactly $14,540,000.', 'An estimate needs a range and its drivers, not false precision.'),
      ], correct: 'driver', hint: 'Test the assumption that moves the answer most.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Give a base case, show what drives it, and say what is missing.', model: 'Present about $14.5 million a year as a base-case contribution before branch operating costs: interest $15 million, insurance $240,000, forex $1.8 million, less $2.5 million of defaults. Show a range, since each point of net interest margin moves the answer by $5 million, then subtract staff and premises costs for true profit.', parts: [
        part('action', 'Action', 'base', [
          option('base', 'Present about $14.5 million a year as a base case before operating costs, with a range.', 'A clear base case plus a range is what an estimate should deliver.'),
          option('exact', 'Present $14,540,000 as a precise forecast.', 'The inputs are rough; the answer should not look exact.'),
          option('skip-defaults', 'Leave out defaults, since they are rare.', 'One default costs $2.5 million, more than insurance and forex income combined.'),
        ]),
        part('evidence', 'Supporting evidence', 'build', [
          option('build', 'Interest of $15 million dominates; fees add $2,040,000; defaults take $2.5 million.', 'This shows how the total is built and which stream matters most.'),
          option('deposits', 'Deposits are the main source of profit.', 'The estimate is built on loan margin, fees, and defaults.'),
          option('fees', 'Fee income is the largest stream.', 'Fees are $2,040,000 against $15 million of interest.'),
        ]),
        part('risk', 'Risk / next step', 'margin', [
          option('margin', 'Test loan volume, principal, and margin, then subtract staff and premises costs.', 'These drive most of the answer and turn contribution into profit.'),
          option('forex-only', 'Only refine the forex assumption.', 'Forex barely moves the total.'),
          option('none', 'No further checks are needed.', 'Rough inputs always need a sensitivity check.'),
        ]),
      ] },
    ],
  },
  {
    id: 'washing-machine-margins', title: 'Stock that never reaches the shop', category: 'Profitability', sector: 'Consumer durables', level: 'Intermediate', focus: 'Check the obvious fix against the numbers', pages: '36–37',
    brief: 'A leading washing-machine maker for middle-class buyers has seen profits fall about 10% over two years. Costs are not the problem. Find out why and recommend what to do.',
    sourceNote: 'Adapted from “Washing Machine firm”. Units, dealer prices, costs, and margins are from the source.',
    steps: [
      { kind: 'choice', prompt: 'Revenue is falling. What should you establish first?', options: [
        option('split', 'Is it price or volume, and is it the client alone or the whole industry?', 'Splitting revenue and benchmarking against competitors shows where to dig.'),
        option('discount', 'How big a consumer discount would bring buyers back?', 'That assumes weak demand. You have not yet checked whether buyers can even find the product.'),
        option('features', 'Which new features should the next model have?', 'Product changes come after you know why sales fell.'),
      ], correct: 'split', hint: 'Revenue = price × volume. Which moved, and for whom?', reveal: ['Prices are unchanged; volumes fell. The problem is specific to the client.', 'The product is better quality than competitors’ at a similar price.', 'Distributors have cut the stock they send to retailers: the client gives them a 4% margin, competitors give 7%.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO areas to analyse next.', correct: ['availability', 'economics'], options: [
        option('availability', 'Availability: distributor margins, stock levels, and retailer coverage.', 'A better product at the same price should sell. If it is not on shelves, the channel is the problem.'),
        option('economics', 'The economics of fixing it: margin changes against the volume they win back, and other routes to retailers.', 'Any fix has a cost. You need to know whether it leaves the client better off.'),
        option('quality', 'A product redesign to lift quality further.', 'Quality is already better than competitors’. It is not what limits sales.'),
        option('ads', 'A bigger consumer advertising budget.', 'Advertising cannot sell a machine that is not in the shop.'),
      ], hint: 'A good product at a fair price is not selling. Follow it to the shelf.', model: 'Profit = revenue − cost; revenue fell through volume, not price, and only for the client. With a better product at a similar price, check availability: distributors stock less because their margin is 4% against competitors’ 7%. Then compare the cost of each fix, such as matching the margin or selling around distributors, with the profit it recovers.' },
      { kind: 'calculation', prompt: 'If the client matched the 7% margin (dealer price falls to about $17,400) and volume returned to 100,000 units, what would profit be?', unit: '$ million', answer: 100000 * (17400 - 14000) / 1e6, tolerance: 0.1, dataNote: 'Source figures. The source assumes volume fully recovers if margins match competitors.', exhibit: [['', 'FY2017', 'FY2019', 'Margin matched'], ['Units sold', '100,000', '90,000', '100,000'], ['Price to dealer ($)', '18,000', '18,000', '≈ 17,400'], ['Cost per unit ($)', '14,000', '14,000', '14,000'], ['Profit ($ million)', '400', '360', '?']], hint: 'Profit = units × (dealer price − cost per unit). Answer in millions.', working: '100,000 × (17,400 − 14,000) = $340 million. Today the client makes 90,000 × 4,000 = $360 million. Matching the margin wins back the volume but leaves profit $20 million lower.', options: [
        option('matched', '$340 million', 'Correct: 100,000 × $3,400.', 340),
        option('old-price', '$400 million', 'That is FY2017 profit at the old $18,000 dealer price, before cutting it.', 400),
        option('no-volume', '$306 million', 'That cuts the price without winning back volume: 90,000 × $3,400.', 306),
      ], reveal: ['Five distributors serve about 200 retailers across Gujarat and Maharashtra.', 'The client barely sells online itself; distributors list its products on e-commerce sites.'] },
      { kind: 'choice', prompt: 'Matching the margin would leave profit at $340 million, below today’s $360 million. What should the client do instead?', options: [
        option('bypass', 'Reach retailers without the distributors: sell to them directly, with a factoring agent handling invoicing and collection, and sell online itself.', 'With only about 200 retailers, a direct route is manageable, and it recovers availability without giving away margin.'),
        option('match', 'Match the 7% margin anyway to win back volume.', 'That recovers volume but leaves the client $20 million a year worse off than today.'),
        option('discount', 'Cut the consumer price.', 'Demand is not the problem; the product is not reaching shops.'),
      ], correct: 'bypass', hint: 'If the middleman is the problem, is there a route around them?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Fix availability without giving away more than it recovers.', model: 'Sell directly to the roughly 200 retailers, using a factoring agent for invoicing and collection, and sell on e-commerce sites directly. Matching competitors’ 7% distributor margin would cut profit to $340 million, below today’s $360 million, even with full volume back. Test retailer onboarding and collection costs, logistics, and how distributors react.', parts: [
        part('action', 'Action', 'direct', [
          option('direct', 'Sell directly to retailers and online, with a factoring agent for collections.', 'This restores availability without the margin cost.'),
          option('match', 'Raise distributor margins to 7%.', 'Full volume at the lower price still earns less than today.'),
          option('ads', 'Launch a consumer advertising campaign.', 'Buyers already want the product; it is not on shelves.'),
        ]),
        part('evidence', 'Supporting evidence', 'numbers', [
          option('numbers', 'Matching margins gives $340 million against $360 million today; the problem is availability, not demand.', 'This shows why the obvious fix fails and where the real problem is.'),
          option('quality', 'The product is lower quality than competitors’.', 'The case says it is better quality.'),
          option('price', 'Consumers find the price too high.', 'Prices are comparable to competitors’.'),
        ]),
        part('risk', 'Risk / next step', 'test', [
          option('test', 'Test retailer onboarding, collection costs, logistics, and distributor reactions.', 'These decide whether the direct route actually costs less than the margin.'),
          option('none', 'No risk: retailers will switch immediately.', 'Retailers and distributors may resist; this needs testing.'),
          option('brand', 'Commission a brand-awareness survey.', 'Awareness is not the constraint.'),
        ]),
      ] },
    ],
  },
  {
    id: 'anti-smoking-pill', title: 'A premium anti-smoking pill', category: 'Market entry', sector: 'Pharmaceuticals', level: 'Intermediate', focus: 'Size the market with a clear funnel, then price on value', pages: '83–84',
    brief: 'A drug company has a nicotine-free, prescription-only anti-smoking pill that has succeeded in countries with smokers like India’s. It wants to launch in India at a premium. Assess the market and a feasible price.',
    sourceNote: 'Adapted from “Anti-smoking pills”. Funnel shares and the $8 price are the source’s assumptions. The source’s summary table uses 50% for smokers wanting to quit; the transcript uses 20%, which this exercise follows.',
    steps: [
      { kind: 'choice', prompt: 'Which question should come first?', options: [
        option('product', 'How is the pill different from existing options, how is it sold, and how did launches elsewhere go?', 'The product’s edge and its sales route shape both the price and how you reach buyers.'),
        option('price', 'What is the highest price we can charge?', 'You cannot judge price before knowing the value over alternatives and who decides the purchase.'),
        option('factory', 'Where should we build a factory in India?', 'Manufacturing comes after deciding whether and how to launch.'),
      ], correct: 'product', hint: 'Understand the product and its route to the patient first.', reveal: ['The pill is nicotine-free, taken three times a day for three months, and needs a doctor’s prescription.', 'Lab results show it about five times as effective as nicotine lozenges, which sell for about $1 a unit.', 'Launches in countries with similar smokers have succeeded.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that should drive the launch plan.', correct: ['value', 'reach'], options: [
        option('value', 'Price: willingness to pay against the value of quitting and the alternatives, checked against cost.', 'A premium must rest on value to the buyer, not just the company’s wish.'),
        option('reach', 'Reach: doctors and chemists through medical representatives, since it needs a prescription.', 'Doctors decide whether it is prescribed, so they are the channel to win.'),
        option('tv', 'A mass TV campaign aimed at smokers.', 'Prescription drugs are chosen by doctors, so consumer ads do little to drive prescriptions.'),
        option('grocery', 'Shelf space in grocery stores.', 'It cannot be sold over the counter.'),
      ], hint: 'Who decides the purchase, and what is the pill worth to them?', model: 'Assess the product’s edge, the competition, and results elsewhere. Then size the market with a funnel (population, smokers, those wanting to quit, those who can afford it), set a price between cost and willingness to pay, and plan the launch through doctors and chemists via trained medical representatives.' },
      { kind: 'calculation', prompt: 'At $8 a pill, what is the yearly revenue pool in Delhi?', unit: '$ million', answer: 15000000 * 0.4 * 0.2 * 0.75 * 8 * 3 * 90 / 1e6, tolerance: 0.1, dataNote: 'Practice assumptions from the source. The 40% smoking rate is the source’s assumption, not a statistic.', exhibit: [['Step', 'Value'], ['Delhi population', '15 million'], ['Share who smoke', '40%'], ['Smokers who want to quit', '20%'], ['Of those, share who can afford it', '75%'], ['Course: 3 pills a day for 90 days at $8', '?']], hint: 'People × cost of one full course. Answer in millions.', working: '15 million × 40% × 20% × 75% = 900,000 likely buyers. A course is 3 × 90 × $8 = $2,160. Pool = 900,000 × $2,160 = $1.944 billion.', options: [
        option('pool', '$1.944 billion', 'Correct: 900,000 buyers × $2,160 a course.', 1944),
        option('once', '$648 million', 'That assumes one pill a day. The course is three a day: $2,160, not $720.', 648),
        option('half', '$4.86 billion', 'That uses 50% of smokers wanting to quit instead of 20%.', 4860),
      ] },
      { kind: 'choice', prompt: 'Is $8 a pill, or $2,160 for a course, a sensible premium?', options: [
        option('value', 'Plausibly, if set against what smokers spend on cigarettes and the higher success rate, but test willingness to pay by income group.', 'A premium is defensible on value; the evidence to confirm it is buyers’ willingness to pay.'),
        option('match', 'No: match nicotine lozenges at $1.', 'That gives away the value of a five-times-more-effective, nicotine-free product.'),
        option('max', 'Charge as much as possible, since there is no competitor.', 'Patients still weigh the price against lozenges or not quitting, and doctors weigh affordability.'),
      ], correct: 'value', hint: 'Compare the price with what it replaces, then say how you would check it.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Launch where the pool is real, through the people who prescribe.', model: 'Launch as a premium prescription product, starting in large cities, with trained medical representatives targeting doctors and chemists, and protect the product with patents. In Delhi alone, about 900,000 likely buyers at $2,160 a course make a $1.94 billion pool. Validate willingness to pay, doctor adoption, and the cost of training representatives.', parts: [
        part('action', 'Action', 'launch', [
          option('launch', 'Launch as a premium prescription product in large cities, pushed through doctors and chemists, with patent protection.', 'This matches the product’s edge and how it must be sold.'),
          option('otc', 'Launch over the counter nationwide.', 'The pill needs a prescription.'),
          option('cheap', 'Price at $1 to match lozenges.', 'That abandons the premium the product can justify.'),
        ]),
        part('evidence', 'Supporting evidence', 'pool', [
          option('pool', 'About 900,000 likely buyers in Delhi alone: a $1.94 billion pool at $2,160 a course.', 'This sizes the opportunity from an explicit funnel.'),
          option('everyone', 'Every smoker in India will buy it.', 'Most smokers are not trying to quit, and not all can afford it.'),
          option('share', 'No competitor means a guaranteed 100% share.', 'Buyers can choose lozenges or nothing at all.'),
        ]),
        part('risk', 'Risk / next step', 'validate', [
          option('validate', 'Validate willingness to pay and doctor adoption, and budget for training representatives.', 'These determine whether the pool turns into sales.'),
          option('none', 'No validation needed after success abroad.', 'Indian prices, incomes, and prescribing habits still need testing.'),
          option('logo', 'Redesign the logo for India.', 'Not a material risk.'),
        ]),
      ] },
    ],
  },
  {
    id: 'apartment-pricing', title: 'Pricing a new housing complex', category: 'Pricing', sector: 'Real estate', level: 'Foundation', focus: 'Set a cost floor now, add value as the area develops', pages: '96–97',
    brief: 'A new builder has finished a complex of economy apartments on the outskirts of Kolkata, ahead of other builders. Offices and a metro line are planned nearby. How should the apartments be priced?',
    sourceNote: 'Adapted from “Residential complex”. The source computes a $2.8 billion target from $2.5 billion plus 10%; this exercise uses the arithmetically consistent $2.75 billion.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('basics', 'The product and location: number and size of flats, amenities, investment, and what is changing nearby.', 'These inputs feed all three pricing methods and show what could add value later.'),
        option('discount', 'What launch discount would sell out fastest?', 'Speed of sale matters, but you need a price floor first.'),
        option('design', 'Which paint colours buyers prefer.', 'Not a pricing driver at this stage.'),
      ], correct: 'basics', hint: 'You cannot price what you have not described.', reveal: ['10 buildings × 100 flats = 1,000 flats, each about 2,000 sq ft, economy category, standard amenities.', 'The builder has invested $2.5 billion and expects a 10–12-year payback period.', 'Offices and a state-announced metro line are coming; neither is open yet.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO pricing lenses that matter most right now.', correct: ['cost', 'future-value'], options: [
        option('cost', 'Cost-based: recover the $2.5 billion investment plus the target margin.', 'This sets a floor, and there are few nearby benchmarks yet.'),
        option('future-value', 'Value over time: premiums once the metro and offices arrive, and for better floors.', 'The location’s value will rise; the pricing plan should capture it.'),
        option('competitor-now', 'Match today’s competitor prices in the area.', 'The builder arrived before any competitors, so there is little to match.'),
        option('auction', 'Auction every flat on launch day.', 'Economy buyers need predictable prices, and demand builds over years.'),
      ], hint: 'There are no neighbours yet, but the neighbourhood is changing.', model: 'Look at cost, competitor, and value-based pricing. With no nearby competitors and the metro not yet built, start from a cost-plus floor, price lower floors at a premium, and raise prices as the metro and offices raise the area’s value.' },
      { kind: 'calculation', prompt: 'To recover $2.5 billion plus a 10% margin, what average price per sq ft is needed?', unit: '$ per sq ft', answer: 250e7 * 1.1 / (1000 * 2000), tolerance: 0.5, dataNote: 'Source assumptions: profit is 10% of the investment; maintenance is charged separately.', exhibit: [['Item', 'Value'], ['Investment', '$2.5 billion'], ['Target margin', '10% of investment'], ['Flats × size', '1,000 × 2,000 sq ft']], hint: 'Target revenue ÷ total square feet.', working: 'Target revenue = $2.5 billion × 1.1 = $2.75 billion. Area = 1,000 × 2,000 = 2 million sq ft. Average = $2.75 billion ÷ 2 million sq ft = $1,375 per sq ft. With floors 1–5 at a 10% premium, that is about $1,441 for lower floors and $1,310 for upper floors.', options: [
        option('target', '$1,375', 'Correct: $2.75 billion over 2 million sq ft.', 1375),
        option('cost-only', '$1,250', 'That recovers cost only: $2.5 billion ÷ 2 million sq ft, with no margin.', 1250),
        option('rounded', '$1,400', 'That uses a $2.8 billion target. $2.5 billion plus 10% is $2.75 billion.', 1400),
      ] },
      { kind: 'choice', prompt: 'The builder expects to sell about 20% of the flats each year for five years. How should prices move?', options: [
        option('raise', 'Start near the cost-plus price, then raise it as the metro and offices arrive and the area develops.', 'Later buyers get more value, so later flats can carry higher prices.'),
        option('fixed', 'Fix the launch price for all five years.', 'That hands the metro’s added value to later buyers.'),
        option('premium-now', 'Charge the post-metro premium from day one.', 'Buyers will not pay today for a metro that does not exist yet.'),
      ], correct: 'raise', hint: 'Five years of sales in a changing area.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'A floor for today, a path for tomorrow.', model: 'Launch at a cost-plus average of about $1,375 per sq ft (about $1,441 for floors 1–5 and $1,310 for 6–10), then raise prices as the metro and offices arrive. Revisit competitor and value-based pricing as other builders enter. Validate demand from office workers, the metro timeline, and the pace of sales.', parts: [
        part('action', 'Action', 'cost-plus', [
          option('cost-plus', 'Launch at a cost-plus average, lower floors at a premium, and raise prices as the area develops.', 'This secures the floor now and captures value later.'),
          option('cheap', 'Price below cost to sell out quickly.', 'That locks in a loss on a 10–12-year investment.'),
          option('peak', 'Price at the future metro premium immediately.', 'The value has not arrived yet, so sales would stall.'),
        ]),
        part('evidence', 'Supporting evidence', 'floor', [
          option('floor', '$2.75 billion over 2 million sq ft needs about $1,375 per sq ft, and no nearby competitors exist yet.', 'This justifies both the floor and the choice of method.'),
          option('crowded', 'The area is crowded with competing builders.', 'The builder arrived before any competitors.'),
          option('metro', 'The metro is already running.', 'It has been announced, not built.'),
        ]),
        part('risk', 'Risk / next step', 'timeline', [
          option('timeline', 'Track the metro timeline, office demand, and the pace of sales, and revisit prices each year.', 'The price path depends on these.'),
          option('none', 'No risk: every flat will sell at launch.', 'The builder expects sales over five years.'),
          option('colour', 'Survey buyers on exterior colours.', 'Not a material risk.'),
        ]),
      ] },
    ],
  },
  {
    id: 'saas-plateau', title: 'Stuck at $110,000 a month', category: 'Growth', sector: 'Software', level: 'Intermediate', focus: 'Look at customer flows, not just the total', pages: '114–115',
    brief: 'A software-as-a-service company sells website-analytics tools. Monthly revenue has stalled at about $110,000. It has no direct competitor. The CEO wants to grow beyond the plateau.',
    sourceNote: 'Adapted from “Software product company”. Segment prices, customer counts, and customer flows are from the source.',
    steps: [
      { kind: 'choice', prompt: 'What should you understand first?', options: [
        option('mix', 'Where revenue comes from: which customer segments, how many customers, and at what price.', 'Totals hide what is happening underneath. Break revenue into segments and customers.'),
        option('raise', 'Can we raise prices?', 'That jumps to a lever before you know why growth stopped.'),
        option('build', 'Which new product should we build?', 'A new product may help later, but first diagnose the current business.'),
      ], correct: 'mix', hint: 'Break the $110,000 into its parts.', reveal: ['Small businesses: 2,000 customers at $50 a month ($100,000). Large enterprises: 10 at $1,000 ($10,000).', 'Prices have not changed. Small-business revenue is falling; enterprise revenue is rising.', 'Every month, about 1,800 small businesses leave and about 1,800 join. Among enterprises, 9 of 10 renew.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO analyses that explain the plateau.', correct: ['flows', 'fit'], options: [
        option('flows', 'Customer flows by segment: new, renewing, and lost customers.', 'A flat total can hide heavy churn offset by heavy acquisition.'),
        option('fit', 'Fit: what each segment needs compared with what the product does.', 'Churn usually means the product is not solving the customer’s real problem.'),
        option('elasticity', 'Price elasticity in each segment.', 'Prices have not changed, so they do not explain the plateau.'),
        option('benchmark', 'Benchmarking against competitors.', 'There are no direct competitors.'),
      ], hint: 'Revenue = customers × price. Price is fixed, so follow the customers.', model: 'Revenue = customers × price. Prices are fixed, so trace customers: new, renewing, and lost in each segment. Heavy small-business churn masks acquisition. Then compare each segment’s needs with what the product does: small businesses want more visitors; enterprises want to prove return on investment, which the product shows.' },
      { kind: 'calculation', prompt: 'What share of small-business customers leave each month?', unit: '% a month', answer: 1800 / 2000 * 100, tolerance: 0.01, dataNote: 'Customer flows from the case.', exhibit: [['Segment', 'Customers', 'Price a month', 'Leave each month', 'Join each month'], ['Small businesses', '2,000', '$50', '1,800', '1,800'], ['Large enterprises', '10', '$1,000', '1', '1']], hint: 'Customers lost ÷ customers at the start of the month.', working: '1,800 ÷ 2,000 = 90% of small-business customers leave every month. The company adds 1,800 just to stand still. Enterprises lose 1 in 10 a month.', options: [
        option('churn', '90%', 'Correct: 1,800 of 2,000 leave each month.', 90),
        option('renew', '10%', 'That is the share who stay: 200 of 2,000.', 10),
        option('net', '0%', 'That is the net change. Behind it, 90% of customers are replaced every month.', 0),
      ] },
      { kind: 'choice', prompt: 'Why do small businesses leave so quickly?', options: [
        option('mismatch', 'They want more visitors; the tool improves how existing visitors convert, which matters little when traffic is low.', 'The product solves a problem small businesses do not yet have. Enterprises, who must prove return on investment, get exactly what they need.'),
        option('price', '$50 a month is too expensive.', 'Nothing suggests price is the issue, and it has not changed.'),
        option('bugs', 'The software is unreliable.', 'Nothing points to quality, and 9 in 10 enterprises renew.'),
      ], correct: 'mismatch', hint: 'Compare what they want with what the product does.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Grow where the product fits and customers stay.', model: 'Focus sales and marketing on large enterprises, where the product proves return on investment and 9 in 10 renew each month, and stop spending to acquire small businesses, 90% of whom leave every month. Check that the company can win enough enterprise clients: sales capacity, deal length, and pricing.', parts: [
        part('action', 'Action', 'focus', [
          option('focus', 'Shift sales and marketing to large enterprises, and stop chasing small businesses.', 'This puts effort where the product fits and customers stay.'),
          option('acquire', 'Spend more on small-business acquisition.', 'That refills a bucket losing 90% a month.'),
          option('discount', 'Offer small businesses a discount.', 'Price is not why they leave.'),
        ]),
        part('evidence', 'Supporting evidence', 'churn', [
          option('churn', '90% of small businesses leave monthly while 9 in 10 enterprises renew, because the product proves ROI rather than adding traffic.', 'This links the plateau to churn and product fit.'),
          option('price', 'Prices have fallen in both segments.', 'Prices have not changed.'),
          option('rivals', 'Competitors are taking share.', 'There are no direct competitors.'),
        ]),
        part('risk', 'Risk / next step', 'capacity', [
          option('capacity', 'Check the company can win enough enterprises: sales capacity, deal length, and pricing.', 'Enterprise sales are slower; this decides how fast revenue grows.'),
          option('none', 'No risk: enterprises will find the product on their own.', 'Enterprise deals usually need an active sales effort.'),
          option('logo', 'Refresh the logo.', 'Not a material risk.'),
        ]),
      ] },
    ],
  },
  {
    id: 'streaming-bid', title: 'Bidding for a hit show’s final season', category: 'Strategy', sector: 'Media', level: 'Intermediate', focus: 'Work out the most you can pay before thinking about winning', pages: '124–125',
    brief: 'An Indian streaming platform has been invited, with four rivals, to bid for exclusive rights to the final season of the most-watched English TV series in India. It wants to maximise profit. Last season it bid $3 million and came a close second.',
    sourceNote: 'Adapted from “Bid Strategy for GOT Season 8”. Case data are from the source. The 20% return is applied to the bid itself, matching the source’s $5 million answer.',
    steps: [
      { kind: 'choice', prompt: 'What should you clarify first?', options: [
        option('terms', 'The objective, exactly what is being bought (exclusivity, duration), and how the auction works.', 'You cannot value rights until you know what they include and what the client wants from them.'),
        option('win', 'How far above rivals should we bid to be sure of winning?', 'Winning at any price can destroy value. First find what the rights are worth to you.'),
        option('edit', 'Can we edit the show for family viewers?', 'A detail to consider later, not the starting point for a bid.'),
      ], correct: 'terms', hint: 'Know what you are buying before deciding what to pay.', reveal: ['Exclusive streaming rights for the final season, only while it airs: 10 episodes over three months. Closed bid.', 'The platform earns $2 a month per subscriber and would sell ad slots during episodes.', 'No merchandising rights are included.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO lenses that should shape the bid.', correct: ['value', 'risks'], options: [
        option('value', 'Financial value: extra subscriptions, ad revenue, and synergies, less costs and the required return.', 'This sets the most the platform can pay.'),
        option('risks', 'Strategic fit and risks: family-focused subscribers, content partners, piracy, and cannibalisation.', 'These can make the rights worth less than the spreadsheet says.'),
        option('merch', 'Merchandise sales.', 'Merchandising rights are not included.'),
        option('anchor', 'Add 10% to last year’s bid.', 'That anchors on a past number rather than on what the rights are worth now.'),
      ], hint: 'What is it worth, and what could make it worth less?', model: 'Value the rights: new subscribers × fee × months, plus ad slots × episodes × price per slot, plus synergies such as retained subscribers and pricier ads on other shows. Subtract other costs and require a return to get a maximum bid. Then check strategic fit and risks before choosing where to bid below that cap.' },
      { kind: 'calculation', prompt: 'What is the most the platform should bid?', unit: '$ million', answer: 6 / 1.2, tolerance: 0.01, dataNote: 'Case data. The required 20% return is on the bid: (net value − bid) ÷ bid ≥ 20%.', exhibit: [['Item', 'Value'], ['Fans of the show in India', '1.25 million'], ['Share the platform would capture', '80%'], ['Fans already subscribed', '0.5 million'], ['Subscription', '$2 a month, for 3 months'], ['Ads', '10 minutes per episode in 30-second slots, 10 episodes'], ['Average price per slot', '$15,000'], ['Synergies', '$1 million'], ['Other costs', '$1 million']], hint: 'New subscribers = captured fans − existing subscribers. Then net value ÷ 1.2.', working: 'New subscribers = 1.25 × 80% − 0.5 = 0.5 million. Subscriptions = 0.5 million × $2 × 3 = $3 million. Ads = 20 slots × 10 episodes × $15,000 = $3 million. Add $1 million synergies and subtract $1 million costs: $6 million. Maximum bid B where (6 − B) ÷ B = 20%: B = 6 ÷ 1.2 = $5 million.', options: [
        option('cap', '$5 million', 'Correct: $6 million of net value ÷ 1.2.', 5),
        option('no-return', '$6 million', 'That leaves no return on the bid.', 6),
        option('all-fans', '$7.5 million', 'That counts fans who already subscribe as new subscribers.', 7.5),
      ] },
      { kind: 'choice', prompt: 'Last season $3 million came a close second. How should that shape the bid?', options: [
        option('range', 'Bid above $3 million but never above the $5 million cap.', 'Last year’s losing bid sets a floor; the value sets the ceiling.'),
        option('cap', 'Bid exactly $5 million to be safe.', 'Paying the full value leaves no surplus. Aim to win at the lowest price likely to beat rivals.'),
        option('repeat', 'Bid $3 million again.', 'That lost last time.'),
      ], correct: 'range', hint: 'One number sets the floor, another the ceiling.' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Bid inside the range the numbers allow, and name what could go wrong.', model: 'Bid above last season’s $3 million but no more than $5 million. The rights add $6 million of value after other costs, so $5 million is the most that still earns the 20% return. Watch piracy, weaker-than-expected uptake, regulatory pressure on explicit content, and cannibalisation of existing shows.', parts: [
        part('action', 'Action', 'bid', [
          option('bid', 'Bid just above $3 million, with a hard cap of $5 million.', 'This gives a good chance of winning without overpaying.'),
          option('overbid', 'Bid $7 million to guarantee winning.', 'Above $5 million the deal misses the 20% return.'),
          option('skip', 'Do not bid: the content is risky.', 'The case assumes the platform is strategically aligned, and the value supports bidding.'),
        ]),
        part('evidence', 'Supporting evidence', 'value', [
          option('value', 'The rights add $6 million after costs, so $5 million is the most that still earns 20%.', 'This is the basis for the cap.'),
          option('fans', '1.25 million fans means 1.25 million new subscribers.', 'Only 80% are captured, and 0.5 million already subscribe.'),
          option('last', 'Last year’s $3 million bid lost.', 'True, but that sets the floor, not the cap.'),
        ]),
        part('risk', 'Risk / next step', 'risks', [
          option('risks', 'Watch piracy, weak uptake, regulatory pressure on explicit content, and cannibalisation of existing shows.', 'These could push the value below the cap.'),
          option('none', 'No risk once the bid is won.', 'Uptake and piracy decide whether the value materialises.'),
          option('merch', 'Plan merchandise sales.', 'Merchandising rights are not included.'),
        ]),
      ] },
    ],
  },
  {
    id: 'sanitary-pads-estimate', title: 'Sanitary pads used in India', category: 'Estimation', sector: 'Consumer health', level: 'Foundation', focus: 'Build a funnel, then question who it leaves out', pages: '173',
    brief: 'Estimate how many sanitary pads are used in India each year. Build a transparent funnel, then test whether the answer makes sense. Figures are simplified practice assumptions.',
    sourceNote: 'Adapted from guesstimate 18. The source rounds 72 million users to 75 million; this exercise keeps 72 million.',
    steps: [
      { kind: 'choice', prompt: 'Which clarification matters most before estimating?', options: [
        option('scope', 'What exactly to count (pads used, not bought or made), over what period, and for which population.', 'A clear unit and scope stop you estimating the wrong thing.'),
        option('brand', 'Which brand leads the market?', 'Brand share matters for a company’s sales, not for total usage.'),
        option('price', 'What does a pack cost?', 'Price matters for market value, not the number of pads.'),
      ], correct: 'scope', hint: 'Define the unit and the population.', reveal: ['India’s population is about 1,250 million, of whom about 600 million are female.', 'About 50% of women are of menstruating age; about 30% of them live in cities.', 'About 80% of urban women are mid or high income, the group most likely to use pads.'] },
      { kind: 'select', required: 2, prompt: 'Pick the TWO building blocks for the estimate.', correct: ['funnel', 'usage'], options: [
        option('funnel', 'A user funnel: women of menstruating age, split by city/rural and income.', 'This counts the people who use pads.'),
        option('usage', 'Usage rate: pads per cycle × cycles per year.', 'This turns users into pads.'),
        option('factories', 'Factory capacity of manufacturers.', 'Possible, but supply data is harder to estimate than the consumer side here.'),
        option('shops', 'Number of pharmacies.', 'Shop counts do not tell you how many pads are used.'),
      ], hint: 'Users × pads per user.', model: 'Pads per year = women of menstruating age × share who use pads (by city/rural and income) × pads per cycle × cycles per year. State each assumption, then question the groups the funnel leaves out.' },
      { kind: 'calculation', prompt: 'Using the funnel, how many pads are used each year? Assume 5 pads per cycle and 12 cycles a year.', unit: 'million pads', answer: 600 * 0.5 * 0.3 * 0.8 * 5 * 12, tolerance: 0.5, dataNote: 'Simplified practice assumptions following the source; rural users are excluded, as in the source.', exhibit: [['Step', 'Value'], ['Women', '600 million'], ['Of menstruating age', '50%'], ['Living in cities', '30%'], ['Mid or high income', '80%'], ['Pads per cycle × cycles a year', '5 × 12']], hint: 'Multiply down the funnel, then by 60 pads a year.', working: '600 × 50% = 300 million; × 30% = 90 million urban; × 80% = 72 million users. 72 million × 5 × 12 = 4,320 million pads a year.', options: [
        option('annual', '4,320 million', 'Correct: 72 million users × 60 pads a year.', 4320),
        option('monthly', '360 million', 'That is one month: 72 million × 5. Multiply by 12 cycles.', 360),
        option('everyone', '18,000 million', 'That counts all 300 million women of menstruating age as users.', 18000),
      ] },
      { kind: 'choice', prompt: 'The funnel counts no rural users at all. What is the best next step?', options: [
        option('rural', 'Treat 4,320 million as an urban figure: add a rural adoption rate, test the income filter, and cross-check against industry sales.', 'Naming what the funnel leaves out, and checking against an independent source, makes the estimate credible.'),
        option('precise', 'Report exactly 4,320 million.', 'An estimate needs its assumptions and a range, not false precision.'),
        option('double', 'Double it to be safe.', 'Arbitrary adjustments hide the reasoning instead of improving it.'),
      ], correct: 'rural', hint: 'Who is missing, and how would you check the total?' },
      { kind: 'build', prompt: BUILD_PROMPT, hint: 'Give a base case, show what drives it, and name what is missing.', model: 'Present about 4.3 billion pads a year as an urban base case: 72 million users × 5 pads × 12 cycles. Add a rural adoption rate and show a range, then cross-check against manufacturers’ sales data and test the urban income filter.', parts: [
        part('action', 'Action', 'range', [
          option('range', 'Present about 4.3 billion as an urban base case, then add rural use and show a range.', 'This is honest about scope and gives a usable answer.'),
          option('exact', 'Present 4,320 million as a precise national figure.', 'It excludes rural users, so it is neither precise nor national.'),
          option('all', 'Assume every woman of menstruating age uses pads.', 'That ignores affordability and access.'),
        ]),
        part('evidence', 'Supporting evidence', 'funnel', [
          option('funnel', '72 million urban users × 5 pads × 12 cycles ≈ 4,320 million.', 'This shows how the number is built.'),
          option('total', '300 million women × 60 pads.', 'That skips the city and income filters.'),
          option('monthly', '360 million pads a year.', 'That is one month, not a year.'),
        ]),
        part('risk', 'Risk / next step', 'validate', [
          option('validate', 'Test the urban income filter and rural adoption, and cross-check with industry data.', 'These are the weakest assumptions.'),
          option('none', 'No checks needed.', 'Every estimate needs a sanity check.'),
          option('brand', 'Survey brand preferences.', 'Brand does not change total usage.'),
        ]),
      ] },
    ],
  },
]
