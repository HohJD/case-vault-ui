// Continued: same source, same rules (own words, source facts only).
import { base, chain, forces, pairs } from './industries-2026-b.js'

export const INDUSTRIES_2026_I = [
  {
    id: 'semiconductors', name: 'Semiconductors', tag: 'Technology', ...base(472),
    summary: 'Strong in chip design with about 120 centres, but only 3 of 12 approved plants are producing so far.',
    overview: [
      'India’s strength is design, with about 120 centres. Manufacturing is small: 12 units approved and 3 producing, so imports dominate.',
      'Globally, a few firms own the design IP, raw materials and chip production.',
    ],
    segments: [
      'Design: global and Indian firms, high-value and export-led, but reliant on others to fabricate',
      'Foundry and fab: little capacity today, with Tata entering',
      'OSAT (assembly and test): a practical way in, being built by Micron, Tata, HCL-Foxconn and CG Power-Renesas',
    ],
    valueChain: chain([
      ['Materials and supply', 'Silicon wafers, photomasks, chemicals and inert gases (a bottleneck)', 'Very expensive capital equipment'],
      ['Design', 'System specs (GPU, CPU, modem)', 'Logic and chip design', 'Verification, then handover to the fab'],
      ['Fabrication', 'Photolithography, where ASML is the only supplier', 'Deposition and etching', 'Wafer testing'],
      ['Outbound logistics', 'To device makers and Tier-1 integrators', 'Direct supply of specialised chips', 'Distributors for smaller orders'],
      ['End customers', 'Phones and laptops', 'EVs', 'Other electronics'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Materials are all imported, and equipment makers are near-monopolies.'],
      ['buyers', 'Medium', 'Brands face high switching costs, but Indian fabs must compete on price.'],
      ['entrants', 'Low', 'Enormous capex and strong IP protection.'],
      ['substitutes', 'Low', 'Nothing does what a chip does.'],
      ['rivalry', 'High', 'No large fabs run in India yet, and they will have to beat global players.'],
    ]),
    pestel: pairs([
      ['Political', 'ISM 2.0 was approved in July 2026 with US$13.4 billion, extending support to equipment, materials, design IP and R&D.'],
      ['Social', 'Plenty of chip design engineers (working for Nvidia and Qualcomm), but few fab process engineers. The effort is seen as nation-building.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Chip sales (80%): logic chips such as CPUs and GPUs (45%) and high-volume memory (30%)', 'Wafer manufacturing (15%)', 'IP licensing and royalties (5%)'] },
      { title: 'Cost drivers', items: ['Capital expenditure (35-40%)', 'Raw materials (20-25%)', 'R&D (15-20%)'] },
    ],
    kpis: pairs([
      ['Fab utilisation', 'Share of capacity in use. Low utilisation sharply raises cost per chip.'],
      ['Yield', 'Share of working chips per wafer. A 1% change can swing profit enormously.'],
    ]),
    terms: pairs([
      ['Fab', 'A plant that makes semiconductor wafers.'],
      ['Foundry', 'A company that makes chips for others, such as TSMC or GlobalFoundries.'],
      ['OSAT', 'Outsourced semiconductor assembly and test.'],
    ]),
    growth: [
      'Demand is booming from GPUs, AI accelerators, data centres, EVs and phones.',
      'The India Semiconductor Mission is a strategic national investment.',
    ],
    challenges: [
      'Dependence on global supply chains for materials, and limits on access to technology.',
      'A leading-edge 3-5 nm fab costs $15-20 billion and needs steady demand to run.',
    ],
    models: pairs([
      ['Foundry', 'Makes chips for others with no designs of its own (TSMC, GlobalFoundries, UMC).'],
      ['IDM', 'An integrated device maker that designs and makes its own chips (Intel, Micron, Texas Instruments).'],
      ['Fabless', 'Designs chips and outsources production (Qualcomm, NVIDIA, AMD). India is shifting from design toward foundry work.'],
    ]),
    facts: [
      'Three countries hold the chain together: TSMC in Taiwan, Samsung and SK Hynix in Korea, and ASML in the Netherlands.',
      'India has about 120 global design centres but very few fab process and yield engineers.',
      'Assembly and test plants are early wins with lower barriers than advanced fabs, and three now ship commercially.',
      'US tariff threats on imported chips speed up China+1 and Taiwan+1 sourcing.',
      'Nothing below 7 nm is made in India, and probably will not be before 2030. Dholera targets 28-110 nm.',
      'India imports more than 90% of its fab equipment and most specialty chemicals.',
    ],
    news: [
      'July 2026: the Union Cabinet approved Semicon 2.0 with US$13.4 billion across six pillars.',
      'Three plants now ship commercially, all in Gujarat: Micron Sanand, Kaynes Semicon and CG Semi’s OSAT.',
      '12 units have ISM approval and more than US$17 billion pledged. The first front-end fab is due in 2028.',
    ],
    caseIds: [],
  },
  {
    id: 'telecom', name: 'Telecom', tag: 'Infrastructure', ...base(474),
    summary: 'The world’s 2nd largest market: 1,330 million subscribers, 93% tele-density, and 91.5% held by private operators.',
    overview: [
      'India is the world’s second-biggest telecom market, with 1,330 million subscribers and 93% tele-density.',
      'Private operators hold 91.5% of the market and PSUs 8.5%.',
    ],
    segments: [
      'Wireless (50-60%): mobile calls and data, against fixed-line voice and internet (40-50%)',
      'B2C versus B2B: monthly plans for consumers, and unified communications for enterprises',
    ],
    valueChain: chain([
      ['Towers', 'Building and owning towers, shared with operators under infra-sharing deals'],
      ['Equipment', 'Selling network hardware such as cables and routers', 'Distribution to end users'],
      ['Integrators', 'Software for 4G and 5G', 'Fitting software and hardware together for operators'],
      ['Network operators', 'Owning spectrum bought at auction', 'Trading spectrum'],
      ['Service providers', 'Buying capacity from operators to serve the public', 'Selling calls, messaging and internet'],
    ]),
    forces: forces([
      ['suppliers', 'Medium', 'Switching is costly, but there are many suppliers.'],
      ['buyers', 'High', 'Customers are price-sensitive and can switch cheaply.'],
      ['entrants', 'Low', 'High capex and complex regulation.'],
      ['substitutes', 'Medium', 'Internet calling and satellite communication are growing.'],
      ['rivalry', 'High', 'A saturated, oligopolistic market that competes on price.'],
    ]),
    pestel: pairs([
      ['Technology', '5G combined with IoT and cloud, and satellite communication.'],
      ['Legal', 'Rules differ by country, and leading players raise competition concerns.'],
      ['Economic', 'Heavy 5G and spectrum spending. Ind-Ra says ARPU must rise about US$0.40 more for a 15% ROCE.'],
      ['Political', 'Satellite spectrum is assigned administratively, and Starlink, Jio-SES and OneWeb await clearance.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Call, SMS and data plans (prepaid, postpaid, roaming)', 'Broadband and DTH', 'Data monetisation, spectrum leases and OTT partnerships'] },
      { title: 'Cost drivers', items: ['Spectrum and infrastructure', 'Running the network', 'Acquiring customers'] },
    ],
    kpis: pairs([
      ['ARPU', 'Revenue per user.'],
      ['Churn', 'Share of users who leave.'],
      ['Network uptime', 'Share of time the network works.'],
      ['Data per user', 'Average data each subscriber uses.'],
      ['Customer acquisition cost', 'What each new user costs to win.'],
    ]),
    terms: pairs([
      ['MSISDN', 'The mobile phone number.'],
      ['BTS', 'Base transceiver station: the mobile tower.'],
      ['MNP', 'Mobile number portability: keeping your number when you switch.'],
    ]),
    growth: [
      'IoT in smart cities and industry needs the fast connections 5G provides.',
      'More investment, and moves into satellite broadband.',
    ],
    challenges: [
      'High interest rates make capital-heavy 4G and 5G rollouts dearer.',
      'Price wars in markets like India push ARPU down.',
      'A saturated market leads to price battles and little innovation.',
    ],
    models: pairs([
      ['Prepaid and postpaid', 'Pay in advance with a recharge, or pay after use each month.'],
      ['Bundling', 'Several services in one, such as fast internet, OTT and music, data packs and offers.'],
      ['Broadband', 'Fast home and business internet with add-ons.'],
      ['B2B', 'Cloud, IoT, voice and collaboration, landline, connectivity and security for companies (Jio, Airtel, Verizon).'],
    ]),
    facts: [
      'Each country’s telecom department regulates operators (DoT in India, the FCC in the US).',
      'Infrastructure means towers, switches, lines, routers and modems.',
      'Operators share sites or lease spectrum to cut costs.',
      'Bundles combine broadband, voice, OTT and cable in one package.',
      'Mergers of smaller firms have created oligopolies in many markets.',
      'Prepaid ARPU overtook postpaid for the first time in March 2026, as premium prepaid packs grew faster.',
    ],
    news: [
      'TRAI: wireless ARPU was US$2.1 a month in Q4 FY26, up 7.2% YoY, across 1.33 billion subscribers.',
      'The market may be close to saturation, so growth is shifting from new users to earning more from existing ones.',
      'Satellite players have provisional spectrum but are waiting for final clearance to launch.',
    ],
    caseIds: [],
  },
  {
    id: 'travel-tourism', name: 'Travel and tourism', tag: 'Services', ...base(476),
    summary: 'About US$221 billion of GDP in 2024 (about 7%) and 46.5 million jobs. 99% of Indian trips are domestic.',
    overview: [
      'Tourism added about US$221 billion to GDP in 2024, roughly 7% of the economy, and supports 46.5 million jobs, 9.1% of employment.',
      'It is fragmented across transport and stays, and 99% of trips by Indians are domestic.',
    ],
    segments: [
      'Stays: hotels, resorts and homestays, about US$60 billion by 2028',
      'Transport: air, rail and road, the biggest slice of trip spend',
      'Intermediaries: OTAs, tour operators, DMCs and corporate travel desks',
      'Experiences and MICE: guides, attractions, wellness, food and convention venues',
    ],
    valueChain: chain([
      ['Creating demand', 'State tourism boards and Incredible India', 'Social discovery, influencers and user content', 'Visa policy and air links as levers'],
      ['Planning and booking', 'OTAs and metasearch', 'Tour operators and DMCs building packages', 'Corporate travel desks', 'Payments, forex and travel insurance'],
      ['Getting there', 'Airlines, airports and UDAN routes', 'IRCTC and Vande Bharat', 'Buses, cabs and self-drive', 'Cruises and inland waterways'],
      ['At the destination', 'Hotels, homestays, resorts and hostels', 'Guides, attractions, activities and wellness', 'Local food, shopping and transfers'],
      ['After the trip', 'Reviews', 'Loyalty and repeat bookings', 'Claims, refunds and complaints'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Airlines and hotels control perishable capacity, and intermediaries depend on it.'],
      ['buyers', 'Medium', 'Travellers are price-sensitive, except premium loyalty members.'],
      ['entrants', 'Low', 'High investment, fixed costs and regulation.'],
      ['substitutes', 'High', 'Airbnb and Couchsurfing are popular, and switching is cheap.'],
      ['rivalry', 'High', 'OTA discounting keeps take rates thin.'],
    ]),
    pestel: pairs([
      ['Political', 'E-visas for 165+ countries, Swadesh Darshan 2.0, PRASHAD and UDAN regional flights.'],
      ['Economic', 'Fuel and the rupee decide whether outbound trips are affordable, and TCS on remittances affects package prices.'],
      ['Social', 'Spiritual circuits, destination weddings and experience travel are changing demand.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Commission or take rate on bookings', 'Package and tour margins', 'Add-ons: insurance, visas, forex, transfers', 'Advertising and preferred listings'] },
      { title: 'Cost drivers', items: ['Acquiring customers (discounts, ads)', 'Payment gateways and cancellations', 'Staff and operations'] },
    ],
    kpis: pairs([
      ['Gross booking value', 'Total value booked before cancellations, the top line.'],
      ['Take rate', 'Net revenue divided by GBV: thin for flights, higher for hotels and packages.'],
      ['Average trip spend', 'Spend per traveller per trip, which turns volume into value.'],
      ['Foreign exchange earnings', 'Dollars earned from foreign tourists, the sector’s exports.'],
    ]),
    terms: pairs([
      ['OTA', 'An online travel agency for booking hotels and travel.'],
      ['MICE', 'Meetings, incentives, conferences and exhibitions.'],
      ['FTA and FEE', 'Foreign tourist arrivals and foreign exchange earnings.'],
    ]),
    growth: [
      'New airports, UDAN routes and expressways widen reach.',
      'Pilgrimage circuits and weddings bring repeat domestic travel.',
      'Higher incomes and first-time travellers from smaller towns should double domestic visits by 2030.',
    ],
    challenges: [
      'Indians spend US$23 billion abroad, while foreign arrivals are still below 2019.',
      'Demand bunches in a few states and months, leaving capacity idle.',
      'Guides and destination staff are hard to find.',
    ],
    models: pairs([
      ['Asset owner', 'Owns hotels, resorts or buses and sells by the night or seat. High fixed costs and perishable inventory (IHCL, VRL).'],
      ['Asset-light brand and management', 'Runs or franchises other people’s properties for a fee, or groups unbranded stays under one brand (Marriott, OYO).'],
      ['Distribution and packaging', 'OTAs take a cut of bookings without holding inventory, while tour operators buy in advance and resell packages for more margin (MakeMyTrip, Thomas Cook).'],
    ]),
    facts: [
      'Outbound travel should grow about 11% a year to US$69 billion by 2036, and Thailand has made visa-free entry for Indians permanent.',
      'MakeMyTrip partnered with OpenAI in February 2026 to take travellers from chat-based planning straight to booking.',
      'MakeMyTrip bought a majority of Flamingo Transworld in March 2026 to strengthen packages.',
      'Among foreign visitors, medical, adventure, lighthouse and wellness trips are growing quickest.',
      'More than 1,300 DPIIT-recognised tourism startups now sit between demand and supply.',
    ],
    news: [
      'March 2026: MakeMyTrip took a majority stake in Flamingo Transworld and partnered with OpenAI on AI-led discovery.',
      'Indian tourism grew about 7% in 2026 on strong regional demand across Asia-Pacific.',
      'India is now Asia’s largest source of outbound travellers, ahead of China, South Korea and Japan.',
    ],
    caseIds: ['helicopter-shuttle'],
  },
]
