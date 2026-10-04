// Continued from industries-2026.js: same source, same rules (own words, source facts only).
const FORCE = { suppliers: 'Supplier power', buyers: 'Buyer power', entrants: 'Threat of new entrants', substitutes: 'Threat of substitutes', rivalry: 'Competitive rivalry' }
export const forces = list => list.map(([key, level, note]) => ({ name: FORCE[key], level, note }))
export const chain = list => list.map(([stage, ...items]) => ({ stage, items }))
export const pairs = list => list.map(([term, note]) => ({ term, note }))
export const base = page => ({ editions: ['2026-27'], source: [{ ref: 'prep2026', page }] })

export const INDUSTRIES_2026_B = [
  {
    id: 'chemicals', name: 'Chemicals and specialty chemicals', tag: 'Materials', ...base(420),
    summary: 'Specialty chemicals are worth about ₹4.5 lakh crore, grow about 9.3% a year and make up 80% of chemical exports.',
    overview: [
      'India wants 5-6% of the global chemical value chain by 2030.',
      'Specialty and fine chemicals come to about ₹4.5 lakh crore and grow roughly 9.3% a year. They account for 80% of the country’s chemical exports.',
    ],
    segments: [
      'Agrochemicals: crop protection and intermediates, a US$5.5 billion market',
      'Pharma intermediates: ingredients and custom synthesis for drug makers',
      'Performance chemicals: paints, surfactants, water treatment',
      'Petrochemicals and commodities: polymers and bulk chemicals',
    ],
    valueChain: chain([
      ['Feedstock and inputs', 'Crude derivatives and natural gas', 'Intermediates, mostly imported from China', 'Bio-based and recycled inputs'],
      ['Manufacturing', 'Batch and continuous plants', 'Custom synthesis for one client', 'Effluent treatment and safety'],
      ['Formulation and packaging', 'Blending to the customer’s spec', 'Drums and tankers', 'Batch traceability', 'Hazard labels'],
      ['Distribution', 'Direct to industrial buyers', 'Distributors and traders', 'Exports and port logistics', 'Regulatory paperwork'],
      ['Technical service', 'Support at the customer’s site', 'Reformulating and fixing problems', 'Quality and regulatory testing'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Many key intermediates still come from China.'],
      ['buyers', 'Medium', 'Specialty buyers stay once a product is approved; commodity buyers switch on price.'],
      ['entrants', 'Low', 'Plants are costly, environmental clearances slow, and customer approval takes years.'],
      ['substitutes', 'Medium', 'Bio-based and green chemistry is replacing some older products.'],
      ['rivalry', 'High', 'A fragmented field with global competitors.'],
    ]),
    pestel: pairs([
      ['Political', 'Incentives for specialty chemicals and bulk drug parks, and dedicated chemical investment regions.'],
      ['Environmental', 'Tighter pollution rules make effluent and emission compliance a real cost.'],
      ['Economic', 'Global buyers spreading orders away from China keep sending work to Indian producers.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Tonnes sold times price per tonne', 'Custom synthesis and contract manufacturing', 'Exports', 'Technical service and licensing'] },
      { title: 'Cost drivers', items: ['Raw materials and intermediates', 'Energy: power, steam, fuel', 'Effluent treatment and compliance', 'R&D and plant upkeep'] },
    ],
    kpis: pairs([
      ['Capacity utilisation', 'Output as a share of capacity, and the biggest lever on unit cost.'],
      ['Gross margin per tonne', 'Price minus raw material cost. This is where specialty and commodity players differ.'],
      ['Revenue from new products', 'Tells you whether R&D is turning into chemistry customers buy.'],
      ['Customer approval cycle', 'How long a buyer takes to qualify a product, often two to three years.'],
    ]),
    terms: pairs([
      ['Specialty vs commodity', 'Specialty products are bought for what they do and made to a customer’s spec. Commodities are bought on price.'],
      ['Custom synthesis', 'Making a molecule only for one customer, to its recipe, under contract.'],
      ['CDMO', 'A company that develops and manufactures products for another firm.'],
    ]),
    growth: [
      'Buyers are leaving China, and specialty exports could almost triple to US$86 billion by 2035.',
      'Construction, water treatment and farming are all raising domestic demand.',
      'Incentives and chemical investment regions are attracting new plants.',
    ],
    challenges: [
      'Key intermediates are still imported from China, so supply shocks hit costs.',
      'Effluent treatment and clearances add capital and slow projects down.',
      'Getting a new product approved can take two to three years.',
    ],
    models: pairs([
      ['Specialty maker', 'Develops its own molecules. The best margins and pricing power, but R&D never stops.'],
      ['Custom synthesis and contract manufacturing', 'Makes a molecule to one client’s recipe. Steady volumes and low selling cost, but the client owns the product.'],
      ['Commodity and petrochemicals', 'High-volume standard chemicals sold on price. Scale and cheap feedstock decide the winners.'],
    ]),
    facts: [
      'Specialty products make up 80% of chemical exports even though petrochemicals are bigger by value.',
      'Approval is the moat: once a chemical is qualified into a customer’s product, switching is slow and expensive, so sales stick.',
      'Agrochemicals, a US$5.5 billion market, could be about 40% of chemical exports by 2040.',
      'Green chemistry, including bio-based solvents, biodegradable surfactants and green polymers, is heading past US$15 billion by 2027.',
      'India has built fluorine chemistry capability that few countries can match.',
    ],
    news: [
      'Specialty chemical exports are forecast to almost triple to US$86.2 billion by 2035 as buyers move away from China.',
      'Production incentives and chemical investment regions are pulling in new greenfield plants.',
      'China+1 sourcing keeps directing orders to Indian specialty and agrochemical firms, with fluorochemicals in front.',
    ],
    caseIds: ['chemicals-share'],
  },
  {
    id: 'data-centres', name: 'Data centres and digital infrastructure', tag: 'Technology', ...base(422),
    summary: 'About 1,900 MW in FY26, 2.4 times FY23, and on course for more than 6.5 GW by 2030.',
    overview: [
      'India is Asia-Pacific’s second-largest data centre market.',
      'Capacity grew from 778 MW in FY23 to about 1,900 MW in FY26 and should pass 6.5 GW by 2030.',
      'Colocation brings in US$7.3 billion in 2026 and grows 25.5% a year.',
    ],
    segments: [
      'Hyperscale: big campuses for cloud and AI companies, where most growth comes from',
      'Colocation: shared space rented by the rack or the MW, still about 85% of the market',
      'Enterprise captive: sites a company builds and runs for itself',
      'Edge: small sites in tier-2 cities that cut latency for nearby users',
    ],
    valueChain: chain([
      ['Site and power', 'Land close to fibre and grid capacity', 'Grid connection and backup generators', 'State incentives and approvals'],
      ['Design and build', 'Facility design (tier, racks)', 'Air or liquid cooling', 'Transformers and UPS', 'Building in 10-20 MW phases'],
      ['Fit-out and commissioning', 'Racks, servers and network equipment', 'Fibre and cable landing links', 'Testing and tier certification', 'Security and access control'],
      ['Leasing and contracts', 'Leasing by the MW to cloud firms', 'Retail colocation by the rack', 'Long contracts with price escalators'],
      ['Operations and sustainability', 'Uptime and incident management', 'Power and water efficiency', 'Buying renewable power'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Grid connections, land near fibre and server equipment are all in short supply.'],
      ['buyers', 'High', 'A few cloud companies take most of the capacity and bargain hard.'],
      ['entrants', 'Low', 'A 100 MW campus costs US$0.7-1.1 billion and needs years of approvals.'],
      ['substitutes', 'Low', 'Computing has to run somewhere physical, and data rules keep it in India.'],
      ['rivalry', 'Medium', 'Demand runs ahead of supply, so operators do not compete on price.'],
    ]),
    pestel: pairs([
      ['Political', 'The FY27 Budget gave foreign firms serving global cloud customers from India a 20-year tax holiday, and states compete with power and land.'],
      ['Legal', 'The data protection law encourages keeping Indian data in India, which adds demand.'],
      ['Environmental', 'Power and water use are under scrutiny, and big bids now require renewable supply.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Rent per contracted MW', 'Retail colocation per rack', 'Power passed through to customers', 'Cross-connect and network fees'] },
      { title: 'Cost drivers', items: ['Build cost of US$6-8 million per MW', 'Electricity, the biggest running cost', 'Cooling and water', 'Interest and land'] },
    ],
    kpis: pairs([
      ['Contracted MW and vacancy', 'Power sold compared with power built.'],
      ['Power usage effectiveness', 'Total power divided by the power the servers use. Nearer 1.0 is better.'],
      ['Uptime and tier', 'How much downtime the design permits. Higher tiers earn higher rent.'],
      ['Revenue per MW', 'Yearly revenue for each contracted MW.'],
    ]),
    terms: pairs([
      ['Colocation', 'Renting space, power and cooling in another firm’s facility instead of building one.'],
      ['Rack density', 'Power drawn per rack: 20-50 kW for AI servers against 5-10 kW for ordinary ones.'],
      ['Hyperscaler', 'A very large cloud company such as AWS or Microsoft.'],
    ]),
    growth: [
      'Firms are moving workloads from their own server rooms to the cloud.',
      'AI and high-performance computing need more capacity.',
      'More digital use means more data to process and store.',
    ],
    challenges: [
      'Without enough grid power, a site may be unusable.',
      'Returns hinge on capex per MW, financing costs and how long construction takes.',
      'Approval and construction delays push revenue back.',
    ],
    models: pairs([
      ['Retail colocation', 'Racks or cages rented to many enterprise customers.'],
      ['Wholesale colocation or build-to-suit', 'Large MW blocks leased, or dedicated capacity built for one firm.'],
      ['Captive or hyperscaler self-build', 'The customer owns and runs the site and earns from it indirectly through cloud, banking, telecom or digital services.'],
      ['Managed hosting and interconnection', 'Extra income from cloud links, cross-connects, security, disaster recovery and operations support.'],
      ['GPU cloud', 'The provider owns GPUs and sells compute by use, usually per GPU-hour.'],
    ]),
    facts: [
      'The scarce asset is land with power: a good site also needs fibre, approvals, room to expand and nearby customers.',
      'Leasing capacity before it is finished makes revenue more predictable and eases debt financing and phasing.',
      'Interconnection has network effects: the more carriers, clouds and customers connect, the more valuable the facility.',
      'AI capacity can charge more, but needs more power, advanced cooling and specialised operations.',
    ],
    news: [
      'April 2026: Google started building its Visakhapatnam AI hub, a five-year, US$15 billion project covering gigawatt-scale compute, energy and connectivity.',
      'Budget 2026-27 gave eligible foreign firms providing global cloud services from notified Indian data centres a tax holiday until 2047.',
      '2025: operational capacity passed about 1.5 GW, with Mumbai holding 53% of it.',
    ],
    caseIds: [],
  },
  {
    id: 'defence', name: 'Defence', tag: 'Manufacturing', ...base(424),
    summary: 'Output reached US$19 billion in FY26 and exports US$4 billion, with private firms at a record 24% share.',
    overview: [
      'State-owned DPSUs make 76% of output by value. The private sector’s share is a record 24%, about US$4.4 billion.',
      'Production reached US$19 billion in FY26. Foreign OEMs come in through JVs and technology transfer.',
      'Exports reached US$4 billion across more than 80 countries.',
    ],
    segments: [
      'Weapons and armaments: missiles, artillery and ammunition, the biggest export category',
      'Platforms: aircraft, warships, submarines, tanks and vehicles, the biggest segment by value',
      'Electronics and communication: radar, AEW&C, drones, cyber and electronic warfare, growing fastest',
    ],
    valueChain: chain([
      ['R&D', 'Research in materials, technology and processes', 'Licences, JVs and absorbing technology'],
      ['Production', 'Setting up facilities, lines and instruments', 'Managing a reliable supply chain'],
      ['Quality assurance', 'Meeting certification and standards', 'High-precision engineering'],
      ['Sales and contracting', 'RFPs and bids', 'Price negotiation and local compliance', 'Defence expos and trade shows'],
      ['Delivery and MRO', 'Delivering and integrating with existing systems', 'Maintenance, repair and overhaul after the sale'],
    ]),
    forces: forces([
      ['suppliers', 'High', 'Dependence on foreign OEMs, though indigenisation is reducing it.'],
      ['buyers', 'High', 'The government is the only buyer and controls procurement completely.'],
      ['entrants', 'Low', 'Regulation, capital and technology are big barriers, though new private players are appearing.'],
      ['substitutes', 'Low', 'Nothing really replaces defence equipment.'],
      ['rivalry', 'Medium', 'DPSUs dominate, but private Indian firms and foreign suppliers add competition.'],
    ]),
    pestel: pairs([
      ['Political', 'Atmanirbhar Bharat and Make in India push local production, and DPM 2025 sets aside 75% of the modernisation budget for Indian industry.'],
      ['Economic', 'The defence budget is US$88.7 billion, and the DAC has approved over US$68 billion of AoNs for Indian-made systems.'],
      ['Technological', 'A move toward drones, AI and cyber, with a 52-satellite surveillance constellation planned by 2030.'],
    ]),
    drivers: [
      { title: 'Revenue drivers', items: ['Government contracts', 'Exports', 'After-sales support'] },
      { title: 'Cost drivers', items: ['Plant and machinery', 'R&D and licences', 'Manufacturing', 'Raw materials'] },
    ],
    kpis: pairs([
      ['Order book', 'The value of contracts in hand, a guide to future revenue.'],
      ['Delivery compliance', 'Share of projects delivered on time and to spec.'],
      ['Indigenous content', 'Share of a system’s components made in India.'],
      ['R&D intensity', 'R&D spend as a share of revenue, a sign of innovation.'],
      ['Cost per unit', 'The full cost of making one unit.'],
    ]),
    terms: pairs([
      ['Offset obligation', 'A foreign supplier must reinvest part of the contract value in India’s defence sector.'],
      ['Transfer of technology', 'A foreign OEM passes licences or know-how to a named Indian partner.'],
    ]),
    growth: [
      'DAP 2020 pushes local production, and the fifth Positive Indigenisation List says 346 items may only be bought from Indian makers.',
      'Startups, MSMEs and private companies are entering, with FDI allowed up to 74%.',
      'Exports grew 63% in FY26 to US$4 billion, against a US$5.3 billion target for FY29.',
    ],
    challenges: [
      'Critical, high-value technology is still mostly imported.',
      'Buying and developing equipment takes a long time.',
      'There is no real military-industrial complex yet, and skilled labour is short.',
    ],
    models: pairs([
      ['OEM or engineer-to-order', 'OEMs design and build in-house or under licence. ETO firms redesign existing platforms or create new ones to a requirement.'],
      ['JVs and strategic partnerships', 'Companies team up to develop or build, meeting technology-transfer and local-content rules (for example Tata and Airbus building the C-295).'],
      ['MRO', 'Maintaining, upgrading and managing equipment over its life.'],
    ]),
    facts: [
      'New fronts: drone swarms, AI-driven surveillance and electronic warfare, and in space, resilient satellites and anti-satellite systems.',
      'New Indian platforms include the AMCA fifth-generation fighter, Tejas Mk-II, new carriers, next-generation submarines and long-range missiles.',
      'iDEX backs more than 450 startups and MSMEs, and corridors in UP and Tamil Nadu cluster aerospace, missiles and electronics.',
      'The export mix flipped: DPSU exports rose 151% to 55% of FY26 exports, while private exports grew 14%.',
      'Akash, BrahMos and Akashteer performed in combat during Operation Sindoor, which helps the export case.',
    ],
    news: [
      'FY26: defence output reached a record US$19 billion, with a record 24% from private firms.',
      'FY26: exports grew 63% to a record US$4 billion and reached more than 80 countries.',
      'At the SIDM conference, Rajnath Singh said private participation in defence production keeps rising.',
    ],
    caseIds: [],
  },
]
