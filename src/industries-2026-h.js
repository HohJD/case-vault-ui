// Continued: same source, same rules (own words, source facts only).
import { base, chain, forces, pairs } from './industries-2026-b.js'

export const INDUSTRIES_2026_H = [
  {
    id: 'real-estate', name: 'Real estate, infrastructure and construction', tag: 'Materials', ...base(466),
    summary: '7.3% of GDP today and aiming for 15.5% by 2047. Homes above ₹90 lakh are now about a third of demand.',
    overview: [
      'The sector is 7.3% of GDP and is expected to reach 15.5% by 2047.',
      'It is fragmented but consolidating toward listed developers. Office leasing should reach 55 million sq ft in 2026, and listed REITs are worth more than ₹1 lakh crore.',
    ],
    segments: [
      'Residential, the largest: homes above ₹90 lakh are a third of demand',
      'Commercial: offices, malls and retail, with leasing of 55 million sq ft expected',
      'Industrial and warehousing: logistics parks and data centres',
      'Infrastructure and construction: roads, metros, ports and urban works',
    ],
    valueChain: chain([
      ['Land and project', 'Spotting land or projects', 'Buying land and checking title', 'RERA registration and building approvals'],
      ['Funding', 'Developer equity and land cost', 'Construction loans from banks and NBFCs', 'Advances from buyers on booking', 'Institutional and PE money'],
      ['Construction', 'Choosing and tendering contractors', 'Cement, steel and labour', 'Project management', 'Quality and safety checks'],
      ['Sales and leasing', 'Brokers and channel partners', 'Pricing and releasing inventory', 'Leasing offices, malls and warehouses'],
      ['Handover and assets', 'Possession and registration', 'Facility management and upkeep', 'Collecting rent or listing as a REIT'],
    ]),
    forces: forces([
      ['suppliers', 'Medium', 'Cement and steel prices swing widely and skilled labour is short.'],
      ['buyers', 'Medium', 'Homebuyers can pick from many projects, but for most infrastructure the government is the sole client.'],
      ['entrants', 'Low', 'Land is scarce, approvals take years, and projects lock up capital for a decade.'],
      ['substitutes', 'Low', 'Renting can replace buying, but nothing replaces built space.'],
      ['rivalry', 'High', 'Many developers in every city, and buyers now prefer those who deliver.'],
    ]),
    pestel: pairs([
      ['Political', 'Budget FY27 lifted capital spending to ₹12.2 lakh crore and added a guarantee fund and REITs for public assets.'],
      ['Legal', 'RERA governs registration and delivery dates, and stamp duty and GST shape what buying costs.'],
      ['Economic', 'Home loan rates decide affordability, and the repo cut to 5.25% has reduced EMIs.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Selling flats and plots', 'Rent from offices, malls and warehouses', 'Construction contract billing', 'Facility management fees'] },
      { title: 'Cost drivers', items: ['Land', 'Materials: cement, steel, fittings', 'Labour and contractors', 'Interest during construction'] },
    ],
    kpis: pairs([
      ['Pre-sales', 'Value of homes sold before completion, a developer’s true growth number.'],
      ['Collection efficiency', 'Cash actually received against bookings, which pays for construction.'],
      ['Occupancy and rental yield', 'Share of space let, and yearly rent as a share of asset value.'],
      ['Order book to revenue', 'For contractors, work in hand divided by yearly revenue.'],
    ]),
    terms: pairs([
      ['RERA', 'The regulator every project registers with, which fixes delivery timelines and escrow rules.'],
      ['REIT', 'A listed trust that owns rent-earning property and pays most of the rent to investors.'],
      ['Carpet area', 'Usable floor space inside a flat, not counting walls.'],
    ]),
    growth: [
      'Budget FY27 capital spending of ₹12.2 lakh crore raises land values in new corridors.',
      'Institutional money hit a record US$7.5 billion in 2025 and rose another 23% in H1.',
      'Buyers are trading up: 36% of demand is now for homes over ₹90 lakh, double the 18% before Covid.',
    ],
    challenges: [
      'Title and clearance delays lock up capital for years.',
      'Cement, steel and labour costs move faster than developers can reprice.',
      'Developers have moved to premium homes, leaving mass housing underserved.',
    ],
    models: pairs([
      ['Integrated developer', 'Buys land, builds and sells. The best margins, but the most capital tied up and the land risk (DLF, Lodha).'],
      ['Joint development', 'The landowner provides land and the developer builds, sharing revenue or profit. Far less capital needed (Godrej Properties).'],
      ['Contractor or asset owner', 'Contractors build for a fee and own nothing. Owners hold offices and malls, often in a REIT (L&T, Embassy REIT).'],
    ]),
    facts: [
      'Buyer advances pay for construction, so pre-sales and collections matter more than reported revenue.',
      'Listed REITs passed ₹1 lakh crore in value and could reach ₹10.8 lakh crore by 2029.',
      'Data centres are a new asset class, with capacity set to reach 1.7 GW by the end of 2026 as AI demand arrives.',
      'Buyers pay more for developers with a delivery record, which shifts share to listed players.',
      'Better roads and metros make land on city edges and in smaller cities much more viable.',
    ],
    news: [
      'The FY27 Budget lifted capex to ₹12.2 lakh crore and suggested putting public sector assets into REITs.',
      '2026 outlook: roughly 55 million sq ft of offices leased and 1.7 GW of data centre capacity.',
      'REIT reform, asset monetisation and a Tier-2 focus lifted sentiment after Budget 2026-27.',
    ],
    caseIds: ['apartment-pricing', 'highway-concessions-abroad', 'chicago-parking-meters', 'home-inspection-expansion'],
  },
  {
    id: 'retail', name: 'Retail', tag: 'Retail', ...base(468),
    summary: 'About US$1.12 trillion in 2025 and heading past US$1.6 trillion by 2030. Organised retail is only about 12%.',
    overview: [
      'Indian retail was about US$1.12 trillion in 2025 and should pass US$1.6 trillion by 2030.',
      'Organised retail is about 12% and should reach US$230 billion by 2030. Online retail hit US$80 billion in FY26.',
    ],
    segments: [
      'Grocery: supermarkets, hypermarkets, discounters, convenience stores and quick commerce',
      'Fashion: value fashion, department and specialty stores, D2C',
      'Electronics and appliances: big-box stores with assisted selling',
      'Beauty and pharmacy specialists',
      'Jewellery and watches',
      'Home and furniture',
      'Marketplaces, social commerce and ONDC',
    ],
    valueChain: chain([
      ['Inbound logistics', 'Choosing and managing vendors', 'Line planning', 'Forecasting demand and prices', 'Quality testing'],
      ['Network', 'Network optimisation', 'Transport', 'Cold chain', 'Receiving and unloading'],
      ['Outbound logistics', 'Storage and warehousing', 'Allotting and scheduling to stores', 'Merchandising', 'Restocking shelves'],
      ['Marketing and sales', 'Promotions and discounts', 'Cross-selling', 'Digital sales and marketing', 'Payment options'],
      ['After sales', 'On-time, in-full delivery', 'Route analysis', 'Order tracking', 'Warranty and service', 'Returns'],
    ]),
    forces: forces([
      ['suppliers', 'Medium', 'A few big players dominate organised retail and control margins.'],
      ['buyers', 'High', 'Supply is plentiful and shoppers can go to many retailers.'],
      ['entrants', 'Medium', 'Online entry is easy; offline needs property, supply chain and working capital.'],
      ['substitutes', 'High', 'Products often differ little, so they are easy to swap.'],
      ['rivalry', 'High', 'Traditional retail runs on high costs and expects low margins.'],
    ]),
    pestel: pairs([
      ['Political and legal', '100% FDI is allowed in online retail, and retail and wholesale traders now count as MSMEs for priority lending.'],
      ['Environmental', 'Sustainability and ecological concerns shape what shoppers buy.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Own-brand (private label) sales', 'Loyalty and rewards', 'Affiliate marketing', 'Cross-selling'] },
      { title: 'Cost drivers', items: ['Store leases', 'COGS and supply chain', 'Card fees', 'Omnichannel marketing', 'Utilities and staff'] },
    ],
    kpis: pairs([
      ['Sales per sq ft', 'Net sales divided by selling space.'],
      ['Average transaction value', 'Sales divided by transactions.'],
      ['Customer retention', 'Customers at period end, less new ones won, divided by customers at the start.'],
      ['Footfall vs digital traffic', 'Visits to stores against visits online.'],
      ['Inventory turnover', 'Net sales divided by average inventory.'],
    ]),
    terms: pairs([
      ['PoS', 'Point of sale system.'],
      ['CRM', 'Customer relationship management.'],
      ['Planogram', 'A plan showing how products sit on the shelf.'],
    ]),
    growth: [
      'Available labour, low costs and tax breaks attract FDI.',
      'UPI and BNPL make paying easy.',
      'Expansion into Tier-2 and Tier-3 towns, a value fashion and beauty boom, and omnichannel at scale.',
      'E-commerce and mobile shopping keep growing, and ONDC brings kiranas and small businesses online in more than 600 cities.',
    ],
    challenges: [
      'Promotions, last-mile costs and high returns make unit economics thin.',
      'Logistics is fragmented and property costs keep rising.',
      'Small retailers are slow to go digital, which may hold them back as e-commerce giants grow.',
    ],
    models: pairs([
      ['Independent retailer', 'Owner-run, usually one shop, with personal service.'],
      ['Retail chain', 'Many stores under one owner with central decisions. Low risk to start, with strong goodwill and brand.'],
      ['Franchise', 'Uses another firm’s proven model with its support (McDonald’s, Subway), in exchange for sharing revenue or profit.'],
      ['Retail cooperative', 'Independent shops pool money and know-how to handle wholesale buying.'],
      ['Omnichannel', 'A joined-up experience for shoppers, with food and entertainment drawing footfall.'],
    ]),
    facts: [
      'Online retail reached US$80 billion in FY26, and quick commerce alone US$13-14 billion, about 17% of online GMV and up about 120%.',
      'In quick commerce, Blinkit has about 46% of GMV, Instamart 24% and Zepto 22%, and the eight biggest cities turn profitable first.',
      'Digital payments, cashless and credit options have made paying simpler.',
      'Retailers have to plan stock and marketing around seasonal demand.',
      'Premium demand is rising, leasing is moving back to Grade-A malls, and rents stay firm.',
    ],
    news: [
      'RAI expects healthy sales growth in 2026, led by mass-market expansion and maturing omnichannel.',
      'Deloitte-FICCI: retail will reach US$1.93 trillion by 2030, with quick commerce at US$35 billion of GMV.',
      'BCG and RAI expect retail to more than double to ₹210-215 lakh crore by 2035.',
    ],
    caseIds: ['washing-machine-margins', 'unicloth-us-stores'],
  },
  {
    id: 'renewables', name: 'Renewable energy and storage', tag: 'Energy', ...base(470),
    summary: 'Non-fossil sources are over half of capacity: 140 GW of solar and 54.65 GW of wind, with storage the bottleneck.',
    overview: [
      'Non-fossil sources make up more than 50% of installed capacity. By January 2026 solar reached 140 GW and wind 54.65 GW.',
      'FY26 added 39.7 GW of renewables. 147.7 GW is being built, with about 300 GW more due by 2030.',
    ],
    segments: [
      'Solar: 140 GW, from utility-scale plants to rooftops (PM Surya Ghar) and open access',
      'Wind: 54.65 GW. Onshore is mature; offshore is still at the policy stage',
      'Hybrid and round-the-clock: solar, wind and storage bundled to bid for firm supply',
      'Storage: batteries and pumped hydro, the binding constraint',
    ],
    valueChain: chain([
      ['Resource and land', 'Assessing sun and wind', 'Assembling land and permits', 'Applying for grid connection'],
      ['Equipment and EPC', 'Modules, cells and wafers (ALMM)', 'Turbines, inverters and trackers', 'Battery cells and packs', 'Building and commissioning'],
      ['Project development', 'Bidding for tariffs (SECI, NTPC, states)', 'Signing PPAs and reaching financial close', 'Raising debt and sizing DSCR', 'Hitting commissioning dates'],
      ['Generation and storage', 'Solar, wind and hybrid output', 'Cycling batteries and pumped hydro', 'Round-the-clock and firm supply'],
      ['Offtake and evacuation', 'Selling to DISCOMs and businesses', 'ISTS evacuation and curtailment', 'O&M, cleaning and repowering'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Cells, wafers and battery chemistry are largely imported.'],
      ['buyers', 'High', 'DISCOMs buy most of the power and delay or renegotiate PPAs.'],
      ['entrants', 'Medium', 'The technology is standard, but land and evacuation are scarce.'],
      ['substitutes', 'Low', 'Clean-energy mandates and binding RPO targets leave no substitute.'],
      ['rivalry', 'High', 'Reverse auctions squeeze tariffs, and bids are won on cost of capital.'],
    ]),
    pestel: pairs([
      ['Political', 'Local-content rules through ALMM, production incentives for modules and cells, and waived ISTS charges for storage projects.'],
      ['Economic', 'Tariffs have fallen through reverse auctions, so returns now hinge on low-cost debt and size.'],
      ['Environmental', 'Renewables met a record 51.5% of demand on one day, and the target is 500 GW of non-fossil capacity by 2030.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['PPA tariff times units generated', 'Merchant and exchange sales', 'Renewable Energy Certificates', 'Storage capacity and arbitrage charges'] },
      { title: 'Cost drivers', items: ['Capex per MW (modules, turbines, batteries)', 'Cost of debt and DSCR', 'Land, evacuation and connection', 'O&M, cleaning and degradation'] },
    ],
    kpis: pairs([
      ['Capacity utilisation factor', 'Output as a share of rated capacity.'],
      ['LCOE', 'Levelised cost of energy: lifetime cost divided by lifetime output.'],
      ['Project IRR and DSCR', 'Equity return and debt-service cover, both driven by cost of capital.'],
      ['Curtailment rate', 'Share of output the grid could not take.'],
    ]),
    terms: pairs([
      ['PPA', 'A long-term contract, usually 25 years, fixing tariff and offtake.'],
      ['ALMM', 'The Approved List of Models and Manufacturers, the domestic-content gate for modules and cells.'],
      ['BESS', 'A battery energy storage system that moves solar power into the evening.'],
    ]),
    growth: [
      'The 500 GW non-fossil target for 2030, with about 300 GW of renewables due from 2026.',
      'Modules and batteries keep getting cheaper.',
      'Solar, wind and batteries together can now promise power around the clock and win contracts coal used to get.',
    ],
    challenges: [
      'Transmission and storage are falling behind the 147.7 GW of plants being built.',
      'DISCOMs sign the contracts, so whether they can pay is the real risk.',
      'Cells, wafers and battery chemistry still come mainly from China.',
    ],
    models: pairs([
      ['Independent power producer', 'Owns generating assets and sells power on long contracts, earning the spread between tariff and financing cost (Adani Green, ReNew).'],
      ['EPC and equipment', 'Earns a margin building plants or supplying panels, turbines and batteries, without signing up to sell power for decades (Waaree, Suzlon).'],
      ['C&I open access and rooftop', 'Sells straight to factories, offices or homes below the DISCOM rate, avoiding DISCOM payment risk.'],
    ]),
    facts: [
      'Reverse auctions turned solar into a commodity, so whoever borrows cheapest wins, not whoever builds best.',
      'Storage holds things back: solar output tops out at noon, demand tops out after dark, and batteries or pumped hydro have to cover the gap.',
      'When the grid cannot take the power, it is wasted and nobody pays for it, and this is happening more often.',
      'PM Surya Ghar has reached about 31 lakh homes against a goal of 1 crore, so households now buy and sell power.',
      'ALMM builds Indian factories but makes panels and projects more expensive.',
    ],
    news: [
      'India’s clean energy shift now depends on the grid, and storage is the biggest gap between capacity and supply.',
      'FY26 brought a record 52.5 GW of new capacity, 39.7 GW renewable. Solar stood at 3 GW in 2014 and is now 140 GW.',
      'Applications for storage projects in Rajasthan and Gujarat keep reaching the central transmission utility from private developers.',
    ],
    caseIds: [],
  },
]
