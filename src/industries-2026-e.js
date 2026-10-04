// Continued: same source, same rules (own words, source facts only).
import { base, chain, forces, pairs } from './industries-2026-b.js'

export const INDUSTRIES_2026_E = [
  {
    id: 'insurance', name: 'Insurance', tag: 'Financial services', ...base(442),
    summary: 'Life new-business premium hit US$48 billion in FY26, up 15.7%. LIC still holds 57% of life insurance.',
    overview: [
      'Life insurers wrote US$48 billion of new business premium in FY26, 15.7% more. Non-life gross direct premium was US$35 billion, up 9.3%.',
      'LIC has 57% of life insurance and New India Assurance about 13% of non-life. SBI Life is another big name.',
    ],
    segments: [
      'Life: US$48 billion of new premium in FY26. LIC leads, but private insurers grow faster',
      'Non-life: gross direct premium up 9.3% to $35 billion, led by health, motor and crop. New India Assurance leads',
    ],
    valueChain: chain([
      ['Product and pricing', 'Designing products', 'Actuarial work', 'Premium pricing models'],
      ['Sales and distribution', 'Finding leads', 'Managing channels', 'Planning and automating the sales force'],
      ['Underwriting', 'Assessing risk', 'Managing risk', 'Investing the float', 'Reinsurance'],
      ['Claims', 'Assessing claims', 'Catching fraud', 'Paying out', 'Automatic adjudication'],
      ['Service', 'Managing relationships', 'Support across channels', 'Data-driven marketing'],
    ]),
    forces: forces([
      ['suppliers', 'Medium', 'A few large IT firms run the technology, and reinsurers are limited.'],
      ['buyers', 'Medium', 'Individuals and small firms have little clout; large companies have some.'],
      ['entrants', 'Medium', 'Fintechs and big tech could come in, but the industry is regulated.'],
      ['substitutes', 'Low', 'Nothing really replaces insurance, products differ little, and a big sales force is hard to build.'],
      ['rivalry', 'High', 'Many insurers, with insurtechs adding competition.'],
    ]),
    pestel: pairs([
      ['Political', 'PM-JAY and PM Fasal Bima Yojana, IRDAI’s Bima Sugam and Bima Vahak, zero GST and FDI raised to 100%.'],
      ['Economic', 'People understand finance better, but insurance is used less as an investment now that there are other options.'],
      ['Technological', 'More insurtech, and AI and automation in underwriting and claims.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Underwriting', 'Investment income', 'Cash value on cancelled policies'] },
      { title: 'Cost drivers', items: ['Claims', 'Investment and other operating costs', 'Acquisition and general expenses'] },
    ],
    kpis: pairs([
      ['Renewal rate', 'Share of policyholders who renew at the end of the term.'],
      ['Claims settlement ratio', 'Claims settled as a share of claims made.'],
      ['Gross written premium', 'Premium written before reinsurance and commissions.'],
      ['Expense ratio', 'Share of premium spent on running costs.'],
      ['Loss ratio', 'Claims incurred as a share of premium.'],
    ]),
    terms: pairs([
      ['Sum assured', 'What the policy pays if the insured event happens.'],
      ['Policy term', 'How long the cover lasts.'],
    ]),
    growth: [
      'A growing digital economy and more insurtechs.',
      'City dwellers know more about money and insurance.',
      'Zero GST from September 2025 cut individual premiums about 18% and lifted FY26 new business premium growth to 15.7%.',
    ],
    challenges: [
      'Few rural customers.',
      'Fraud, false claims and misrepresentation.',
      'Claims handling is often complicated, slow and opaque.',
      'IRDAI now requires higher payouts on early surrender, so portfolios need rebalancing.',
    ],
    models: pairs([
      ['B2B and B2C', 'The traditional models: tailored cover for businesses, or policies for individuals.'],
      ['P2P', 'A newer idea that pools similar people to settle claims among themselves.'],
      ['Public versus private', 'Public insurers seem cheaper and more reliable, but buyers increasingly pick private ones for convenience and quick resolution.'],
    ]),
    facts: [
      'More than 150 insurtechs operate in India. Investors value B2C and online-first insurers more highly, and insurtechs adopt AI faster.',
      'With 100% FDI allowed, products should get cheaper and small insurers should benefit.',
    ],
    news: [
      'From 22 September 2025, individual life and health policies carry no GST, though insurers lost input tax credit.',
      'The Sabka Bima Sabki Raksha Act, 2025 lifted the FDI cap to 100%, but did not allow composite licences.',
      'IRDAI’s 2026 reforms relaxed capital and share-transfer rules and created a policyholder protection fund.',
    ],
    caseIds: ['india-postal-insurance'],
  },
  {
    id: 'it-ites', name: 'IT and ITeS', tag: 'Technology', ...base(444),
    summary: 'Revenue passed US$315 billion in FY26, up 6.1%, while headcount grew only 2.3% as AI decouples revenue from hiring.',
    overview: [
      'TCS, Infosys and HCL Tech lead. Revenue passed US$315 billion in FY26, 6.1% higher, with US$246 billion from exports.',
      'Headcount is near 6 million but grew only 2.3%, because AI breaks the link between revenue and hiring. AI revenue is about US$12 billion.',
    ],
    segments: [
      'IT services: consulting, software development and infrastructure management, about 48%',
      'BPM: outsourced processes such as customer support and finance, about 19%',
      'Engineering R&D and software products: industrial design, enterprise software and SaaS, about 27%',
    ],
    valueChain: chain([
      ['Product design', 'Vision and research', 'Choosing platforms and software', 'Platform integration'],
      ['Development', 'Building the product', 'Using data as input'],
      ['Features and services', 'Choosing the subscription type', 'Onboarding and service'],
      ['Marketing and sales', 'Online and usage-based billing', 'Relationship management', 'Retention', 'Measuring engagement'],
      ['Service', 'Billing and subscriptions', 'Support and upgrades', 'Maintenance', 'Warranty'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Cloud providers and licence holders have leverage.'],
      ['buyers', 'Medium', 'Many vendors to choose from, but switching is costly.'],
      ['entrants', 'Medium', 'Projects need heavy investment, though talent is easy to find.'],
      ['substitutes', 'High', 'Cheaper outsourcing countries, and AI tools that replace billable work.'],
      ['rivalry', 'High', 'A few large firms offering much the same thing.'],
    ]),
    pestel: pairs([
      ['Technological', 'AI has moved from pilots to scale and now brings in US$10-12 billion.'],
      ['Political', 'Trump 2.0 is a real risk through tariffs and immigration limits.'],
      ['Economic', 'The rupee fell 9.9% in FY26, its sharpest drop in 14 years, which reduced the rupee value of exports.'],
      ['Environmental', 'Power and water use are under scrutiny.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['On-premise delivery', 'Software as a service', 'Support and maintenance'] },
      { title: 'Cost drivers', items: ['Salaries', 'Software licences and other tech stack spend', 'Servers, cloud and utilities'] },
    ],
    kpis: pairs([
      ['First call resolution', 'Share of issues fixed on the first contact.'],
      ['CSAT', 'How satisfied IT customers are.'],
      ['Mean time to recovery', 'Average time to repair something that failed.'],
    ]),
    terms: pairs([
      ['SaaS', 'Software delivered online by subscription and hosted centrally.'],
      ['IP', 'Intellectual property: intangible things people create.'],
      ['TCV', 'Total contract value of a deal, the main gauge of order book strength.'],
    ]),
    growth: [
      'Growth of 6.1% in FY26, to US$315 billion, came mainly from AI work and GCCs.',
      'Clients are cutting vendor numbers, which concentrates spending with the big players.',
      'Data centre capacity should reach 1.8 GW by 2027 and 4,500 MW by 2030, and public digital programmes add demand.',
    ],
    challenges: [
      'About 60% of tech exports go to the US, leaving the industry exposed to tariffs and visa policy.',
      'Skills are short in AI, ML, analytics and cloud, and reskilling is expensive.',
      'Attrition is high.',
    ],
    models: pairs([
      ['Knowledge process outsourcing', 'Data analysis, market intelligence and business strategy consulting.'],
      ['Business process outsourcing', 'Running functions such as CRM, ERP and HR for clients.'],
      ['IT services', 'IT consulting, R&D, infrastructure management and development.'],
    ]),
    facts: [
      'The sector contributes 7.3% of India’s GDP.',
      'A large, technically skilled, English-speaking workforce makes India the low-cost hub for IT work.',
      'BFSI is a key vertical and a big share of software and service exports.',
      'AI is now real revenue: TCS reports US$1.8 billion of AI revenue and Infosys 5.5% of revenue. The AI-led market could reach US$300-400 billion by 2030.',
      'GCCs and engineering R&D now grow faster than core services, and the Union Budget pushes Tier-2 cities.',
    ],
    news: [
      'For a third straight year GCCs out-hired IT services firms: about 200,000 net hires in FY26 versus 110,000.',
      'Bain warned that business as usual could wipe out 30% of tech services revenue and 5-7 points of EBIT through discounting.',
      'Emkay now sees IT services exports growing less than 4%, blaming H-1B costs and the spread of GCCs.',
    ],
    caseIds: ['saas-plateau', 'saas-logistics-expansion', 'call-center-ai'],
  },
  {
    id: 'logistics', name: 'Logistics', tag: 'Transport', ...base(446),
    summary: 'About US$244 billion in 2025, highly fragmented and price-sensitive, with 3PL at about 48%.',
    overview: [
      'Local, regional and national firms all compete in a fragmented market that is getting more price-sensitive.',
      'The market was about US$244 billion in 2025, and third-party logistics is about 48% of it.',
    ],
    segments: [
      'Freight: mostly by road (about 55%), with rail slowly gaining',
      'Warehousing and fulfilment: general warehouses, cold chain and e-commerce fulfilment',
      'Contract logistics or 3PL: outside providers running several functions together',
    ],
    valueChain: chain([
      ['Demand and network design', 'Segmenting customers and forecasting demand', 'Designing the network of routes and hubs', 'Setting SLAs and prices'],
      ['Capacity and marketing', 'Securing road, rail, air or sea capacity', 'Carrier contracts', 'A customer platform', 'Marketing'],
      ['First mile', 'Collecting orders', 'Scanning and labelling', 'Packing where needed'],
      ['Sorting and linehaul', 'Long-haul runs to hubs, often multimodal', 'Sorting by destination and order type', 'Tracking for clients', 'Customs for international loads'],
      ['Last mile and support', 'Delivering to the customer', 'Returns', 'Billing', 'Claims and support'],
    ]),
    forces: forces([
      ['suppliers', 'Medium', 'Vehicle makers affect costs, but competition among them limits it.'],
      ['buyers', 'High', 'Plenty of choice lets customers bargain on rates and service.'],
      ['entrants', 'Medium', 'Capital and rules are barriers, but digital tools make entry easier.'],
      ['substitutes', 'Medium', 'Few direct substitutes, though firms can run logistics in-house.'],
      ['rivalry', 'High', 'Fragmented, with tough competition on price and service.'],
    ]),
    pestel: pairs([
      ['Political', 'PM Gati Shakti, freight corridors and 35 multimodal logistics parks. Logistics now costs 8% of GDP.'],
      ['Economic', 'E-commerce and quick commerce keep demand strong.'],
      ['Social', 'Customers want same-day or next-day delivery.'],
      ['Technological', 'IoT, warehouse automation and robotics.'],
      ['Environmental', 'A push for EVs and green warehouses.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Transport, priced by mode and order type', 'Extras: packing, labelling, home pick-up', 'Logistics technology and software', 'Supply chain consulting'] },
      { title: 'Cost drivers', items: ['Transport: fuel, leases, tolls, permits', 'People in the fleet and at hubs', 'Warehouse and hub rent'] },
    ],
    kpis: pairs([
      ['Cost per km', 'The cost of every kilometre travelled, the efficiency benchmark.'],
      ['Capacity utilisation', 'How full trucks and containers are.'],
      ['On time in full', 'Share of shipments delivered on time and complete.'],
      ['Damage and claims ratio', 'Share of orders with damage or service claims.'],
      ['Delivery time', 'Time from origin to destination.'],
    ]),
    terms: pairs([
      ['ePOD', 'Electronic proof of delivery.'],
      ['Green logistics', 'Running logistics with a smaller carbon footprint.'],
      ['FTL', 'Full truck load.'],
      ['Multimodal', 'Moving one shipment by several kinds of transport.'],
    ]),
    growth: [
      'E-commerce growth keeps logistics demand high.',
      'Governments are investing heavily in roads, ports and railways.',
      'More manufacturing in India needs dependable logistics.',
    ],
    challenges: [
      'Multimodal links are weak and will take time to build.',
      'Pressure to report emissions and go green raises costs.',
      'Little differentiation keeps rates very competitive.',
    ],
    models: pairs([
      ['Asset-light', 'Partners with others instead of owning, which keeps capex low.'],
      ['Tech-driven', 'Heavy use of technology for routing and tracking, offering logistics as a platform.'],
      ['3PL', 'Bundles transport, warehousing and distribution under long contracts.'],
      ['4PL', 'The client’s single point of contact, managing several 3PLs.'],
      ['E-commerce logistics', 'Serves online retailers, focusing on fast delivery and returns.'],
    ]),
    facts: [
      'GPS, RFID and IoT are transforming supply chain visibility and efficiency.',
      'FMCG, e-commerce and quick commerce leaders increasingly demand real-time tracking.',
      'Poor infrastructure in some regions causes delays and hurts service.',
      'GST and the Dedicated Freight Corridor aim to improve the whole system.',
      'Customers care most about support, tracking, and receiving orders safely.',
    ],
    news: [
      'H1 2026: logistics and industrial leasing reached a record 36.2 million sq ft, up 18% YoY, with 3PL taking 34%.',
      'Under the Gati Shakti Cargo Terminal policy, 142 terminals are running and private investors have put in about US$1.1 billion.',
      'The government puts logistics cost at 7.97% of GDP, and 2,672 million tonnes of freight have moved from road to rail since 2014.',
    ],
    caseIds: ['qexpress-due-diligence', 'saas-logistics-expansion', 'packaging-delays'],
  },
  {
    id: 'metals-steel', name: 'Metals and steel', tag: 'Materials', ...base(448),
    summary: 'The world’s second-largest producer: 168.4 MT of crude steel in FY26 from 220 MT of capacity, aiming for 300 MT by FY30.',
    overview: [
      'India is the second-biggest steel producer. FY26 output was 168.4 MT of crude steel against 220 MT of capacity, which is heading for 300 MT by FY30.',
      'Six groups make 57% of the steel, while smaller plants own 47% of capacity.',
    ],
    segments: [
      'Flat products: hot and cold rolled coils and sheets for cars, appliances and pipes',
      'Long products: bars, rods and structural steel for construction',
      'Specialty and alloy grades for electrical use, stainless and cars',
      'Inputs: mined iron ore, pellets and scrap that steel plants consume',
    ],
    valueChain: chain([
      ['Raw materials', 'Mining and upgrading iron ore', 'Coking coal, mostly imported', 'Collecting and sorting scrap'],
      ['Iron and steel making', 'Sintering and pelletising', 'Blast furnace to hot metal', 'Gas- or coal-based sponge iron', 'Making crude steel'],
      ['Rolling and finishing', 'Casting slabs and billets', 'Hot rolling coils and plates', 'Cold rolling and coating', 'Alloying special grades'],
      ['Distribution', 'Service centres and stockists', 'Direct sales to big buyers', 'Exports'],
      ['End use', 'Construction and infrastructure', 'Cars and engineering', 'Packaging, appliances and pipes'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Most coking coal comes from abroad, and a few hold the iron ore mining rights.'],
      ['buyers', 'Medium', 'Steel is a commodity, so big buyers push hard on price.'],
      ['entrants', 'Low', 'Building an integrated plant takes billions, plus mines, land and power.'],
      ['substitutes', 'Low', 'Aluminium, plastics and composites replace steel only at the edges.'],
      ['rivalry', 'High', 'Every producer sells the same thing, so they compete only on cost per tonne.'],
    ]),
    pestel: pairs([
      ['Political', 'The National Steel Policy aims for 300 MT of capacity by 2030-31, with a safeguard duty on imports and incentives for specialty steel.'],
      ['Economic', 'Prices follow global steel, and cheap imports hurt earnings until the safeguard duty arrived.'],
      ['Environmental', 'Europe’s carbon border tax will charge for emissions on exports. 89 plants are green-certified.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Tonnes sold times price per tonne', 'Product mix: flat, long, specialty', 'Exports', 'By-products: slag, power, chemicals'] },
      { title: 'Cost drivers', items: ['Iron ore and coking coal', 'Energy: coal, power, oxygen', 'Freight in and out', 'Conversion, labour and maintenance'] },
    ],
    kpis: pairs([
      ['Capacity utilisation', 'Output as a share of capacity, 77.2% in FY26.'],
      ['EBITDA per tonne', 'Operating profit on each tonne, the core profit measure.'],
      ['Realisation per tonne', 'Average selling price, which follows global prices.'],
      ['Energy per tonne', 'The main lever on both cost and emissions.'],
    ]),
    terms: pairs([
      ['Crude steel', 'Raw steel straight from the furnace, before rolling.'],
      ['Blast furnace vs electric arc', 'A blast furnace melts ore with coal. An electric arc furnace melts scrap with electricity and emits far less.'],
      ['Realisation', 'What a producer actually gets per tonne after discounts.'],
    ]),
    growth: [
      'Indian steel demand should grow 7.4% in 2026, faster than anywhere else.',
      'Capacity went from 179.5 MT to 220.4 MT in three years and is heading to 300 MT.',
      'Import protection is working: exports rose 35.8% and India became a net exporter in FY26.',
    ],
    challenges: [
      'Capacity grew faster than output, so utilisation slipped to 77.2%.',
      'The biggest input, coking coal, is imported, so costs swing often.',
      'Green steel costs US$2-4 billion per million tonnes to switch, and green hydrogen is still expensive.',
    ],
    models: pairs([
      ['Integrated producer', 'Owns ore, coal and furnaces. Cheapest per tonne at scale but the most capital-heavy (Tata Steel, JSW).'],
      ['Secondary or scrap-based', 'Melts scrap or sponge iron in electric furnaces. Much less capital and lower emissions, but depends on scrap supply and power prices.'],
      ['Converter or roller', 'Buys semi-finished steel and rolls or coats it. Little capital, thin margins, closest to the customer.'],
    ]),
    facts: [
      'Cost per tonne is everything: the product is the same everywhere, so the only lasting edge is making it cheaper.',
      'India became a net exporter with a 0.08 MT trade surplus in FY26, reversing the year before.',
      'At 115.7 kg of steel per person against a world average near 220 kg, consumption is low, and that is the growth story.',
      'Green steel is a trade issue: under Europe’s carbon border tax, high-emission steel will cost more to export.',
      'Small and MSME producers own 47% of capacity, which makes consolidation hard.',
    ],
    news: [
      'FY26 crude steel output reached 170.15 MT, and capacity rose from 179.5 MT to 220.4 MT.',
      'FY26 exports rose 35.8% while imports dropped, so India now sells more finished steel abroad than it buys.',
      'The safeguard duty ended a four-year fall in prices, with realisations up 0.8% in H1 FY26.',
    ],
    caseIds: ['iron-ore-expansion'],
  },
]
