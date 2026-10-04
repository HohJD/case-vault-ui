// Sector notes based on the IIMA Consult Prep Book 2026-27 industry reports (pp. 410-477), one two-page report
// per sector. Facts and figures follow the report exactly, but every line is written in Case Vault's own words:
// never paste a sentence from the source, and never add a fact the source does not state.
// Keep provenance here, not on the page.

const FORCE = {
  suppliers: 'Supplier power', buyers: 'Buyer power', entrants: 'Threat of new entrants', substitutes: 'Threat of substitutes', rivalry: 'Competitive rivalry',
}
const forces = list => list.map(([key, level, note]) => ({ name: FORCE[key], level, note }))
const chain = list => list.map(([stage, ...items]) => ({ stage, items }))
const pairs = list => list.map(([term, note]) => ({ term, note }))
const base = (page, extra) => ({ editions: ['2026-27'], source: [{ ref: 'prep2026', page }], ...extra })

export const INDUSTRIES_2026 = [
  {
    id: 'aviation', name: 'Airlines', tag: 'Transport', ...base(410),
    summary: 'Two airlines carry about 90% of 86.4 million domestic passengers, so the market works like a duopoly.',
    overview: [
      'Somewhere between 10 and 15 airlines fly domestically, yet the two largest carry about 90% of the 86.4 million passengers (up 1.4%).',
      'Internationally the field is crowded, and India accounts for 4% of air traffic.',
    ],
    segments: [
      'Scheduled flights, both domestic (IndiGo) and international (British Airways)',
      'Unscheduled flying: charters and air taxis (JET-Solution)',
      'Air cargo, carrying freight and mail (DHL)',
    ],
    valueChain: chain([
      ['Network planning', 'Buying or leasing the fleet', 'Designing routes', 'Securing airport slots and partners', 'Buying and hedging fuel'],
      ['Ground operations', 'Check-in and boarding', 'Bags and cargo', 'Turning the aircraft round: cleaning, fuelling, loading', 'Maintenance, repair and overhaul'],
      ['In the air', 'Flight deck and navigation', 'Cabin service', 'Safety and compliance', 'Catering and amenities'],
      ['Commercial', 'Yield management', 'Selling tickets through the website, app, agents and OTAs', 'Marketing campaigns', 'Loyalty schemes and alliances'],
      ['After the flight', 'Collecting feedback', 'Handling complaints and compensation', 'Keeping customers coming back'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Only a handful of firms build aircraft and engines.'],
      ['buyers', 'Medium', 'Seats look alike and switching airline costs nothing.'],
      ['entrants', 'Low', 'Starting an airline takes heavy investment and regulatory approval.'],
      ['substitutes', 'Medium', 'Fast trains such as Vande Bharat undercut air fares.'],
      ['rivalry', 'High', 'Around 15 carriers sell much the same service.'],
    ]),
    pestel: pairs([
      ['Economic', 'Conflict in West Asia pushed jet fuel prices up, and domestic traffic dropped 3.5% year on year in April 2026.'],
      ['Environmental', 'Domestic airlines face phased mandates to blend sustainable aviation fuel.'],
      ['Legal', 'Flying needs an Air Operator Permit from DGCA. Foreign ownership of up to 100% is allowed.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Ticket sales', 'Extras such as bag fees, seat selection and on-board sales', 'Cargo', 'Loyalty schemes and partnerships'] },
      { title: 'Cost drivers', items: ['Jet fuel (46%)', 'Maintenance and overhaul (24%)', 'Staff and airport user charges (13%)'] },
    ],
    kpis: pairs([
      ['Available seat miles (ASM)', 'Capacity: every seat flown, times the distance.'],
      ['Revenue passenger miles (RPM)', 'Volume: paying passengers, times the distance they flew.'],
      ['Passenger load factor', 'RPM divided by ASM, showing how full the planes are.'],
      ['Cost per available seat mile', 'Operating cost divided by ASM, showing efficiency.'],
    ]),
    terms: pairs([
      ['MRO', 'Maintenance, repair and overhaul: the work that keeps aircraft airworthy, and one of an airline’s biggest costs.'],
      ['DGCA', 'The Director General of Civil Aviation, India’s aviation regulator.'],
    ]),
    growth: [
      'Few Indians fly compared with almost any other country, so there is room to grow.',
      'Another 50 airports are planned by 2030, with 120 destinations linked by 2035.',
      'Big aircraft orders set Indian carriers up to win international share.',
    ],
    challenges: [
      'Fares sit about 15% below breakeven because pricing is so competitive.',
      'Around 80% of the commercial fleet is leased in dollars, so rupee swings raise costs.',
      'The fuel spike from the West Asia conflict cut April 2026 traffic by 3.5%.',
    ],
    models: pairs([
      ['Full-service carrier', 'The fare includes services before and during the flight (Air India, Emirates).'],
      ['Low-cost carrier', 'Keeps costs down with a big fleet flown hard, one aircraft type and few frills (IndiGo, EasyJet).'],
      ['Charter', 'Flies tourists, usually under contract with tour operators.'],
      ['Cargo airline', 'Carries freight rather than passengers.'],
    ]),
    facts: [
      'Low fares and cash crunches have sunk many Indian airlines, including Jet, Go First and Kingfisher.',
      'Some states tax jet fuel at up to 30%, which makes short routes uneconomic for small airlines. IndiGo absorbs it through scale.',
      'With fuel at about 46% of costs, total cost moves with crude prices and the rupee.',
      'There is little left to consolidate: IndiGo has 66.3% and the Air India Group 23.9%, leaving about 10% for the rest.',
      'Planes stayed full in June 2026 even as traffic flattened: Akasa 92.2%, SpiceJet 87.8%, Air India 85.5%, IndiGo 85.1%.',
    ],
    news: [
      'H1 2026: domestic passengers reached 86.4 million, only 1.44% more than a year earlier.',
      'April 2026: domestic traffic fell 3.47% as jet fuel rose on the West Asia conflict.',
      'June 2026: IndiGo’s domestic share rose to 66.3%, with the Air India Group at 23.9%.',
    ],
    caseIds: ['airline-green', 'airline-own-airports', 'regional-jet-lessors', 'helicopter-shuttle', 'salt-lake-airport'],
  },
  {
    id: 'asset-management', name: 'Asset management', tag: 'Financial services', ...base(412),
    summary: 'Mutual funds managed US$790 billion (₹73.73 lakh crore) in FY26, 12.2% more than a year before.',
    overview: [
      'Mutual fund assets climbed 12.2% in FY26 to US$790 billion, or ₹73.73 lakh crore.',
      'The industry divides into houses running listed-market funds and private managers. SIP inflows hit a record ₹32,087 crore a month.',
    ],
    segments: [
      'Mutual funds in listed markets: equity, debt, liquid and money market',
      'Private market funds: angel, VC, PE and hedge funds',
      'Alternative investment funds in real assets (REITs, InvITs, PEREs), commodities, coins and antiques, and crypto',
      'Asset reconstruction companies, which take on distressed assets',
    ],
    valueChain: chain([
      ['Setting up the fund', 'Defining sponsor, manager and trustee roles', 'Offshore and pooled structures', 'Choosing the theme and objective'],
      ['Raising money', 'Marketing and distributing the fund', 'Roadshows for institutions and HNIs'],
      ['Investing', 'Picking sectors and strategy', 'Screening opportunities', 'Closing deals'],
      ['Managing the portfolio', 'Ongoing monitoring', 'Running the assets', 'Selling once the target IRR is reached'],
      ['Returning money', 'Splitting returns between investor classes in private funds', 'Meeting redemptions in open-ended funds'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Retail and institutional investors can put their money in many places.'],
      ['buyers', 'Low', 'Fund managers have plenty of assets and asset classes to choose from.'],
      ['entrants', 'Low', 'A track record and reputation matter, and the rules are strict.'],
      ['substitutes', 'Medium', 'ETFs, direct investing, robo-advisors and ULIPs are gaining ground.'],
      ['rivalry', 'High', 'Every asset class has many managers, including foreign ones.'],
    ]),
    pestel: pairs([
      ['Economic', 'Results swing with the economy and with how retail and institutional investors feel.'],
      ['Technological', 'Platforms like Smallcase and quant or algorithmic trading are breaking up traditional public-market fund management.'],
      ['Environmental', 'ESG investing is a growing niche.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Management fees', 'Performance fees', 'Distribution fees'] },
      { title: 'Cost drivers', items: ['Trading and brokerage', 'Staff costs', 'Running expenses'] },
    ],
    kpis: pairs([
      ['AUM', 'The money the firm manages.'],
      ['Hurdle', 'The minimum IRR promised to LPs before the GP shares in profit.'],
      ['Catch-up', 'The GP’s share once the hurdle is met, usually 20% of hurdle payouts to LPs and GPs together (25% in effect).'],
      ['Carry', 'Profit above the hurdle and catch-up, usually split 80:20 between LPs and the GP.'],
      ['Expense ratio', 'Fund running costs as a percentage of AUM.'],
    ]),
    terms: pairs([
      ['LP', 'Limited partner: an investor in the fund.'],
      ['GP or sponsor', 'General partner: the firm that launches the fund and puts in a sizeable stake.'],
      ['Trustee', 'Indian funds are often trusts. The trustee holds the assets for the investors and hires the manager.'],
    ]),
    growth: [
      'SIPs bring in a record ₹32,087 crore a month and make up 20.5% of industry assets.',
      'Domestic funds bought more than ₹5 lakh crore of equity in FY26, a record that offset foreign selling.',
      'Jio BlackRock launched and ICICI Prudential AMC went public.',
    ],
    challenges: [
      'In March and April 2026 more SIPs closed than opened, pushing the stoppage ratio above 100%.',
      'Index funds and direct plans keep driving fees down.',
    ],
    models: pairs([
      ['How managers get paid', 'Fund houses take a fixed share of assets. Private managers get paid only above a minimum return, then share the profit.'],
      ['Family office', 'Runs the money of very wealthy families and company promoters.'],
      ['PMS and wealth management', 'Manages an HNI’s wealth across asset classes as one portfolio.'],
      ['Investment advisory', 'Advises retail and HNI investors but does not manage their money.'],
    ]),
    facts: [
      'Passive funds are winning: index funds and ETFs took in ₹30,768 crore in March 2026, more than twice February’s figure.',
      'A fund’s manager can be its own staff or an outside firm the trustee hires. In India it is usually an outside firm.',
      'Assets rose sixfold in a decade, from ₹15.18 lakh crore in 2016 to ₹85.76 lakh crore in July 2026.',
      'Tax breaks at GIFT IFSC are meant to bring the management of India-focused funds back onshore.',
    ],
    news: [
      'March 2026: SIP inflows set a record of ₹32,087 crore, with SIP assets at ₹15.10 lakh crore.',
      'March and April 2026: for the first time, SIP closures outnumbered new SIPs.',
    ],
    caseIds: ['investment-platform-arpu', 'phillies-buyout'],
  },
  {
    id: 'automobile', name: 'Automobiles', tag: 'Manufacturing', ...base(414),
    summary: 'A record 28.3 million vehicles in FY26, up 10.4%. Two-wheelers bring the volume; cars bring the value.',
    overview: [
      'Many makers compete, but each segment has an obvious leader. FY26 set a record of 28.3 million units, 10.4% up, the first record since FY19.',
      'Most vehicles sold are two-wheelers, while passenger vehicles earn most of the value.',
    ],
    segments: [
      'Two-wheelers: 21.7 million, up 10.7%, with scooters up 18.5%',
      'Passenger vehicles: 4.64 million, up 7.9%, about two-thirds of them SUVs',
      'Commercial vehicles: 1.08 million, up 12.6%. Light trucks for last-mile delivery, heavier ones for infrastructure',
      'Three-wheelers: 0.84 million, up 12.8%, and the quickest to go electric',
    ],
    valueChain: chain([
      ['Inbound logistics', 'Buying steel, aluminium, rubber, plastics and electronics', 'Managing vendors', 'Handling the warehouse'],
      ['Manufacturing', 'Casting, forming and stamping', 'Machining, welding and painting', 'Assembly', 'Quality checks'],
      ['Outbound logistics', 'Warehousing', 'Distribution by several modes', 'Running the dealer network'],
      ['Marketing and sales', 'Advertising', 'Pricing and promotions', 'Digital and dealer marketing', 'Incentives for the channel'],
      ['After sales', 'Repairs', 'Servicing', 'Warranties, extended plans and connected services'],
    ]),
    forces: forces([
      ['suppliers', 'Low', 'There are many component suppliers.'],
      ['buyers', 'High', 'Buyers watch price, compare brands and research online.'],
      ['entrants', 'Low', 'It takes huge capital, regulatory approval, a dealer network and years to break even.'],
      ['substitutes', 'Medium', 'Better public transport, shared rides and remote work.'],
      ['rivalry', 'High', 'Incumbents and new EV makers launch models at a fast pace.'],
    ]),
    pestel: pairs([
      ['Technological', 'Ethanol blending targets, and a move to electric (LFP and NMC batteries), CNG and hybrids.'],
      ['Legal', 'From April 2027, CAFE-3 treats EVs and flex-fuel cars alike. Rules also cover six airbags, OBD-II and scrapping old vehicles.'],
      ['Environmental', 'Cutting emissions and making batteries sustainable over their life.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Vehicle sales', 'Servicing', 'Extended warranties, accessories and maintenance contracts', 'Vehicle finance'] },
      { title: 'Cost drivers', items: ['Raw materials', 'Labour', 'Dealer margins and retail incentives', 'Advertising and marketing'] },
    ],
    kpis: pairs([
      ['Utilisation', 'Vehicles actually built as a share of what the plant could build.'],
      ['Cycle time', 'How long one vehicle takes to go through the line.'],
      ['Effective labour rate', 'Revenue earned for each billed hour of labour.'],
    ]),
    terms: pairs([
      ['Fuel economy', 'Fuel used per mile.'],
      ['Emissions', 'Pollutants given off.'],
      ['Safety rating', 'How well the vehicle protects occupants in a crash.'],
      ['Technology features', 'How many tech features the vehicle has, and what kind.'],
      ['Warranty claims', 'How many claims are filed against the warranty.'],
    ]),
    growth: [
      'GST 2.0 and lower rates lifted FY26 to a record 28.3 million units, 10.4% higher.',
      'Exports rose 24% to 6.65 million units.',
      'The auto PLI scheme was doubled to US$672 million in Budget 2026-27.',
    ],
    challenges: [
      'Supply chain disruption, geopolitics and commodity prices are raising input costs.',
      'Rules keep changing on emissions (Fit for 55, BS-VI Phase 2), airbags and axle loads.',
      'Charging points and the grid need to be ready for EVs.',
    ],
    models: pairs([
      ['Dealer network', 'Vehicles are sold through dealers, who also sell insurance and loans.'],
      ['Mobility as a service', 'One digital channel to plan, book and pay for several ways of getting around.'],
      ['Subscription or lease', 'A monthly fee plus a deposit, instead of buying the vehicle.'],
      ['Shared mobility', 'Several riders use the same vehicle, together or in turn.'],
    ]),
    facts: [
      'R&D is shifting toward EASCY vehicles: electrified, autonomous, shared, connected and updated every year.',
      'By 2030, one car sold in ten could be a shared vehicle. Governments of dense cities already push for this.',
      'Dealers are going digital to personalise buying, and digital now drives over half of OEM sales.',
      'GST 2.0 cut rates on small vehicles, which lifted FY26 volumes in every segment.',
    ],
    news: [
      'FY26: wholesales hit a record 28.3 million units, 10.4% higher, with every segment at a new peak.',
      'FY26: exports grew 24% to 6.65 million units on the back of GST 2.0 and rate cuts.',
      'Q1 FY27: every segment set a first-quarter record, and SIAM expects a steady festive season.',
    ],
    caseIds: ['ev-launch-timing', 'electric-bus-entry', 'vietire-tariff'],
  },
  {
    id: 'banking', name: 'Banking', tag: 'Financial services', ...base(416),
    summary: 'Loans grew 16.1% in FY26 to ₹213.6 lakh crore, faster than deposits at 13.4%.',
    overview: [
      'Public sector banks own about 59% of banking assets.',
      'India has 12 public sector banks, 21 private, 44 foreign and 11 small finance banks.',
    ],
    segments: [
      'Public sector banks, with SBI first and Bank of Baroda second',
      'Private banks, with HDFC first and ICICI second',
      'Foreign banks such as Citibank and HSBC, holding about US$230 billion of assets in FY25',
      'Regional rural banks, 28 in all',
    ],
    valueChain: chain([
      ['Marketing', 'Advertising', 'Brand and promotion'],
      ['Sales', 'Product offers', 'Winning customers', 'Keeping them', 'Cross-selling'],
      ['Funding', 'Deposits'],
      ['Investing', 'Loans', 'Securities', 'Financial products'],
      ['Services', 'Account management', 'Securities services', 'Asset management', 'IPOs and issuance'],
      ['Transactions', 'Payments', 'Clearing', 'Settlement', 'Trading'],
    ]),
    forces: forces([
      ['suppliers', 'Low', 'The RBI controls money supply and liquidity.'],
      ['buyers', 'Low', 'Individual customers have little leverage, though it grows with income and credit quality.'],
      ['entrants', 'Low', 'Licences, capital and trust are hard to get, and a few PSBs dominate.'],
      ['substitutes', 'Medium', 'NBFCs, mutual funds, online banking and other financial services.'],
      ['rivalry', 'High', 'Big banks compete, and customers spread accounts across several.'],
    ]),
    pestel: pairs([
      ['Technology', 'In May 2026 UPI handled 23.2 billion transactions worth $315 billion. India makes about 49% of the world’s real-time payments.'],
      ['Economic', 'The RBI has cut the repo rate by 125 bps to 5.25%.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Interest on loans', 'Investment income', 'Balances held with the RBI', 'Fees and commissions'] },
      { title: 'Cost drivers', items: ['Interest paid', 'Staff', 'Advertising', 'Provisions for bad loans'] },
    ],
    kpis: pairs([
      ['Net interest margin', 'Interest earned less interest paid, as a share of average loans.'],
      ['Return on assets', 'Profit the bank makes from its assets.'],
      ['Efficiency ratio', 'How tightly the bank controls overheads and other non-interest costs.'],
      ['Loan to deposit ratio', 'Loans as a share of deposits, a read on liquidity.'],
    ]),
    terms: pairs([
      ['CASA ratio', 'Current and savings account deposits as a share of all deposits.'],
      ['NPA', 'A loan whose interest is more than 90 days overdue.'],
    ]),
    growth: [
      'Lending rose 16.1% in FY26 to ₹213.6 lakh crore, led by retail, NBFCs and industry.',
      'Public sector banks earned a record ₹1.98 lakh crore in FY26.',
      '125 bps of RBI cuts have made funding cheaper.',
    ],
    challenges: [
      'Pricier deposits and lower lending rates squeeze margins.',
      'Rural and underserved areas are still poorly covered.',
      'Deposits grew only 13.4% against 16.1% for loans, taking the loan-deposit ratio to about 82%.',
    ],
    models: pairs([
      ['Retail-funded bank', 'Serves the public and small firms with personal loans, current accounts and similar products.'],
      ['Wholesale-funded bank', 'Serves MNCs, governments and property developers with large-scale capital, risk management and investment banking.'],
      ['Differentiated bank', 'Small finance and payments banks hold narrow licences. SFBs must put 60% of loans into priority sectors, and payments banks may not lend.'],
    ]),
    facts: [
      'Bank lending to NBFCs jumped 26% in FY26 to ₹20.7 lakh crore, far quicker than overall credit.',
      'Gold loans grew 123% in FY26, the fastest retail product, as lenders moved away from unsecured personal loans.',
      'In FY26 UPI rose 30% to US$3.3 trillion and card spending 12% to US$248 billion, while debit card use kept shrinking.',
      'By March 2026 PSB gross NPAs were down to 1.93% and net NPAs to 0.39%, with over 90% provision cover.',
      'Foreign money is arriving: Emirates NBD paid US$2.75 billion for 60% of RBL, and SMBC owns about 25% of Yes Bank.',
    ],
    news: [
      'August 2026: an amendment to the Payment and Settlement Systems Act scrapped zero-MDR, so UPI fees can now be charged to large merchants.',
      '5 August 2026: the RBI left the repo rate at 5.25% with a neutral stance, raised its FY27 growth forecast to 6.7% and lowered inflation to 5.0%.',
      '27 April 2026: the RBI finalised Expected Credit Loss rules, starting 1 April 2027 and phased in to 31 March 2031.',
    ],
    caseIds: ['campus-bank-branch'],
  },
  {
    id: 'cement', name: 'Cement', tag: 'Materials', ...base(418),
    summary: 'The world’s second-biggest producer: about 663 MTPA of capacity, 491 MT made in FY26, 70-72% used.',
    overview: [
      'India has about 663 MTPA of capacity and ranks second in the world for cement output.',
      'Output rose 8.6% in FY26 to 491 MT. The five largest firms own about 60% of capacity, and plants run at roughly 70-72%.',
    ],
    segments: [
      'By product: OPC 43 and 53 grade; blended PPC, PSC and composite; white cement and wall putty; specialty grades (SRC, rapid-hardening, oil-well)',
      'By buyer: retail housing in bags; bulk, ready-mix and infrastructure; industrial and commercial',
      'By region: costs and prices differ, mostly because of freight',
    ],
    valueChain: chain([
      ['Raw material', 'Leasing limestone quarries for the long term', 'Long contracts for coal, fly ash and gypsum'],
      ['Inbound logistics', 'A small step, since plants sit next to the quarry', 'Rail, road and sea for other inputs'],
      ['Manufacturing', 'Crushing, pre-blending, raw milling, clinker, cooling, grinding, blending, storage and packing', 'Highly automated, with big scale advantages'],
      ['Distribution', 'Freight-heavy', 'A mix of rail and road, plus coastal and bulk terminals', 'Warehouses', 'Big orders shipped straight to dealers or customers'],
      ['Sales and marketing', 'Close ties with contractors', 'Distributors and dealers', 'Cheaper bulk prices and regional price lists', 'Technical help for contractors'],
    ]),
    forces: forces([
      ['suppliers', 'Medium', 'Government licenses coal and limestone and supplies grid power, so firms integrate backwards for the rest.'],
      ['buyers', 'Low', 'Large firms dominate and set prices, though institutional buyers bargain.'],
      ['entrants', 'Medium', 'Capex, mining clearances, a distribution network and limestone access all stand in the way.'],
      ['substitutes', 'Low', 'Few practical alternatives exist, so demand barely responds to price.'],
      ['rivalry', 'Medium', 'An oligopoly selling a commodity, with little pricing control.'],
    ]),
    pestel: pairs([
      ['Political', 'In September 2025 GST on cement fell from 28% to 18%, about ₹26-28 less per bag.'],
      ['Economic', 'Demand rises and falls with the economy.'],
      ['Environmental', 'Green cement is catching on for its insulation and fire resistance, and Indian producers rank among the greenest.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Cement sales (over 90%)', 'Realisation lifted by premium products (PSC, composite, white, putty) and trade sales', 'Interest income'] },
      { title: 'Cost drivers', items: ['Power and fuel (30%)', 'Selling and distribution, freight included (25%)', 'Materials (20%)'] },
    ],
    kpis: pairs([
      ['EBITDA per ton', 'The profit measure management tracks most.'],
      ['Availability factor', 'How much of a period the plant could run.'],
      ['Reliability factor', 'How well it runs without breakdowns.'],
      ['Performance factor', 'Actual output compared with what was expected.'],
    ]),
    terms: pairs([
      ['Clinker factor', 'Clinker used per tonne of cement.'],
      ['Specific heat', 'Kiln energy needed per kg of clinker, the main gauge of fuel efficiency.'],
      ['Lead distance', 'How far, on average, cement travels from plant or railhead to the buyer. It drives freight cost.'],
    ]),
    growth: [
      'Cutting GST from 28% to 18% in September 2025 added about 8% to FY26 volumes.',
      'Government infrastructure spending, PMAY and urban housing keep demand up.',
      'The industry adds 41-49 MTPA a year while keeping utilisation near 70-72%.',
    ],
    challenges: [
      'Too much capacity and weak demand are pulling prices down.',
      'Coal is scarce and volatile in price, and key inputs depend on imports.',
      'Rail wagons are hard to get and average haul distances are long.',
    ],
    models: pairs([
      ['Fully integrated', 'Mine to clinker to grinding. The cheapest way to make cement, but capital- and compliance-heavy.'],
      ['Clinker plant with satellite grinding units', 'Lets the firm follow demand. Transfer pricing and clinker supply decide the economics.'],
      ['Grinding only', 'Close to ports or big markets. Cheap to enter, but margins depend on clinker prices.'],
      ['Route to market', 'Retail brand and dealer schemes, or bulk sales to institutions (ready-mix, infrastructure).'],
      ['Adjacent businesses', 'Ready-mix concrete, white cement and putty, and building-materials shops.'],
    ]),
    facts: [
      'Cement is heavy and costly to move, so plants are built as near to buyers as possible.',
      'Freight is high relative to the product’s value, which shields regional markets from imports and creates local oligopolies.',
      'Retail buyers rarely tell brands apart, so the brand that reaches them first wins.',
      'Masons and shopkeepers steer most retail purchases.',
      'Wider reach gives better terms with suppliers, lower freight and a bigger market, which builds the brand.',
    ],
    news: [
      'Since GST fell to 18% from 28% in September 2025 (₹26-28 off each bag), cement prices have barely shifted.',
      'ICRA forecast: FY27 volumes up 7-8%, 35-37 MTPA of new capacity, utilisation holding at 70-72%.',
      'UltraTech keeps expanding through the downturn while Adani and Shree slow their spending.',
    ],
    caseIds: ['apartment-pricing'],
  },
]
