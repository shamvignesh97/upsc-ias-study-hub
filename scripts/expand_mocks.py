#!/usr/bin/env python3
"""Expand GS1/CSAT mock pools and generate papers D/E/F."""
from __future__ import annotations
from pathlib import Path
import re, random
from collections import Counter, defaultdict

ROOT = Path("src/data/mocks")

def parse_qs(path: Path):
    text = path.read_text()
    pattern = re.compile(
        r'\{\s*id:\s*"(?P<id>[^"]+)",\s*subjectId:\s*"(?P<subjectId>[^"]+)",\s*paperId:\s*"(?P<paperId>[^"]+)",\s*question:\s*"(?P<question>(?:\\.|[^"\\])*)",\s*options:\s*\[(?P<options>.*?)\],\s*correctIndex:\s*(?P<correctIndex>\d+),\s*explanation:\s*"(?P<explanation>(?:\\.|[^"\\])*)",\s*illustrative:\s*true,\s*topicId:\s*"(?P<topicId>[^"]+)",\s*nextExamChance:\s*(?P<nextExamChance>\d+)(?:,\s*section:\s*"(?P<section>[^"]+)")?\s*,?\s*\}',
        re.S,
    )
    items = []
    for m in pattern.finditer(text):
        d = m.groupdict()
        d["options"] = re.findall(r'"((?:\\.|[^"\\])*)"', d["options"])
        d["correctIndex"] = int(d["correctIndex"])
        d["nextExamChance"] = int(d["nextExamChance"])
        items.append(d)
    return items

def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def fmt_q(q: dict) -> str:
    opts = ", ".join(f'"{esc(o)}"' for o in q["options"])
    lines = [
        "  {",
        f'    id: "{q["id"]}",',
        f'    subjectId: "{q["subjectId"]}",',
        f'    paperId: "{q["paperId"]}",',
        f'    question: "{esc(q["question"])}",',
        f"    options: [{opts}],",
        f'    correctIndex: {q["correctIndex"]},',
        f'    explanation: "{esc(q["explanation"])}",',
        "    illustrative: true,",
        f'    topicId: "{q["topicId"]}",',
        f'    nextExamChance: {q["nextExamChance"]},',
    ]
    if q.get("section"):
        lines.append(f'    section: "{q["section"]}",')
    lines.append("  },")
    return "\n".join(lines)

def write_export(path: Path, name: str, items: list):
    body = "\n".join(fmt_q(q) for q in items)
    path.write_text(
        f'import type {{ MockQuestion }} from "@/types";\n\nexport const {name}: MockQuestion[] = [\n{body}\n];\n'
    )

# Compact fact tuples: (subject, topic, chance, question, correct, wrong1, wrong2, wrong3, explanation)
GS1 = []

def g(sub, topic, ch, q, correct, w1, w2, w3, exp):
    GS1.append({
        "subjectId": sub, "paperId": "prelims-gs", "topicId": topic, "nextExamChance": ch,
        "question": q, "options": [correct, w1, w2, w3], "correctIndex": 0, "explanation": exp,
        "illustrative": True,
    })

# Polity (30)
for row in [
("polity","polity-const",88,"Which Part of the Constitution contains Fundamental Rights?","Part III","Part II","Part IV","Part IV-A","Part III Arts. 12–35."),
("polity","polity-const",86,"Money Bills can be introduced only in:","Lok Sabha","Rajya Sabha","Either House","Joint Sitting","Art. 109/110 — Lok Sabha only."),
("polity","polity-const",87,"Anti-defection provisions are in which Schedule?","Tenth","Eighth","Ninth","Eleventh","Tenth Schedule."),
("polity","polity-const",85,"Panchayats are under which Part?","Part IX","Part X","Part VI","Part VIII","Part IX (73rd Amendment)."),
("polity","polity-const",86,"Finance Commission is under Article:","280","263","312","315","Article 280."),
("polity","polity-const",84,"Languages recognized by Constitution are listed in:","Eighth Schedule","Seventh","Ninth","Tenth","Eighth Schedule."),
("polity","polity-parliament",86,"Who finally decides if a Bill is a Money Bill?","Speaker of Lok Sabha","President","Finance Minister","Rajya Sabha Chairman","Art. 110(3)."),
("polity","polity-exec",85,"President's ordinance power is under:","Article 123","Article 356","Article 72","Article 143","Art. 123."),
("polity","polity-fed",84,"Inter-State Council is under Article:","263","280","312","370","Art. 263."),
("polity","polity-fr",85,"Writ to question illegal claim to public office:","Quo warranto","Mandamus","Certiorari","Prohibition","Quo warranto."),
("polity","polity-const",84,"Voting age reduced to 18 by which Amendment?","61st","42nd","44th","73rd","61st Amendment."),
("polity","polity-const",83,"Sixth Schedule mainly deals with:","Tribal areas in some NE states","Official languages","Anti-defection","Land reforms","Sixth Schedule — Assam, Meghalaya, Tripura, Mizoram."),
("polity","polity-const",86,"C&AG is provided under Article:","148","76","324","280","Art. 148."),
("polity","polity-fr",87,"Right to Education is Article:","21A","19","32","51A","Art. 21A."),
("polity","polity-parliament",84,"Joint Sitting of Parliament is under Article:","108","123","356","370","Art. 108."),
("polity","polity-const",87,"Constitutional amendment procedure is mainly under:","Article 368","Article 356","Article 370 only","Article 1","Art. 368."),
("polity","polity-local",85,"Gram Sabha consists of:","Persons in electoral rolls of the Panchayat area","Only sarpanch family","Only MLAs","Only bureaucrats","Village electorate body."),
("polity","polity-parliament",86,"Anti-defection law inserted by:","52nd Amendment","42nd Amendment","1st Amendment","86th Amendment","52nd Amendment — Tenth Schedule."),
("polity","polity-judiciary",85,"Collegium system relates to:","Appointment of SC/HC judges","IAS cadre allocation","RBI board seats","UPSC interviews","Judicial appointments practice."),
("polity","polity-elections",83,"Delimitation is done by:","Delimitation Commission","CAG","UPSC","SEBI","Delimitation Commission redraws constituencies."),
("polity","polity-const",84,"Concurrent List is in which Schedule?","Seventh","Fifth","Sixth","Eleventh","Seventh Schedule."),
("polity","polity-fr",86,"Habeas Corpus is primarily for:","Producing a detained person before court","Quashing land records","Tax assessment","Election symbols","Personal liberty safeguard."),
("polity","polity-exec",84,"Impeachment of the President is under:","Article 61","Article 72","Article 123","Article 356","Art. 61 procedure."),
("polity","polity-bodies",83,"National Commission for SCs is a:","Constitutional body","Private NGO","UN agency","Company board","Constitutional body."),
("polity","polity-parliament",82,"Parliamentary privileges are in:","Articles 105 and 194","Only Ninth Schedule","Only Eighth Schedule","Only Preamble","Arts. 105/194."),
("polity","polity-fed",82,"Zonal Councils were set up under:","States Reorganisation Act framework","Only Article 370","Only Tenth Schedule","Only NITI resolution exclusivity","Statutory under SRA 1956."),
("polity","polity-bodies",81,"NITI Aayog is best described as:","Executive policy think-tank","Constitutional body under Art. 263","SEBI-like statutory regulator by definition","Judicial tribunal","Created by executive resolution."),
("polity","polity-const",80,"Union Territories are dealt under:","Part VIII","Part VII","Part IX-A","Part XI","Part VIII."),
("polity","polity-fr",85,"Right against exploitation includes prohibition of:","Traffic in human beings and forced labour","All private jobs","Religious conversion","Agricultural tenancy","Arts. 23–24."),
("polity","polity-fed",84,"Article 356 concerns:","Failure of constitutional machinery in a State","Money Bills only","Official languages only","Fundamental Duties only","President's Rule context."),
]:
    g(*row)

# Economy (30)
for row in [
("economy","eco-banking",86,"Repo rate is the rate at which:","RBI lends to banks against securities","Banks gift money to RBI","IMF lends to states","SEBI lends to brokers","Liquidity injection via repo."),
("economy","eco-tax",87,"GST in India is best described as:","Destination-based dual VAT on goods/services","Origin-only 1950s sales tax","Only customs duty","Only wealth tax","Destination-based dual GST."),
("economy","eco-budget",88,"Fiscal deficit equals:","Expenditure minus receipts excluding borrowings","Only revenue deficit","Primary surplus always","Forex minus imports","FD definition."),
("economy","eco-banking",85,"Reverse repo is the rate at which:","RBI absorbs liquidity from banks","Banks always gift to government","IMF sets income tax","SEBI bans IPOs","Liquidity absorption."),
("economy","eco-budget",84,"Primary deficit equals:","Fiscal deficit minus interest payments","Revenue deficit plus grants","CAD only","Budget surplus","FD − interest."),
("economy","eco-tax",86,"GST Council is chaired by:","Union Finance Minister","RBI Governor","CAG","CJI","FM chairs GST Council."),
("economy","eco-ext",85,"Current Account of BoP includes:","Goods, services, incomes and current transfers","Only FDI","Only FPI","Only gold reserves accounting","Current account components."),
("economy","eco-inflation",86,"CPI primarily reflects:","Consumer/retail price changes","Only wholesale inputs always","Stock volatility","Fiscal deficit ratio","Consumer Price Index."),
("economy","eco-planning",83,"NITI Aayog replaced:","Planning Commission","Finance Commission","Election Commission","UPSC","2015 replacement."),
("economy","eco-psu",82,"Disinvestment means:","Sale of government equity in PSUs","Printing notes","Only raising subsidies","Nationalising private banks always","Stake sale."),
("economy","eco-budget",85,"FRBM Act relates to:","Fiscal responsibility and budget management","Foreign trade only","Forest rights only","Food safety only","Fiscal discipline law."),
("economy","eco-markets",84,"SEBI regulates:","Securities markets","Only cooperative banks always","Only insurance agents exclusively","Only commodity mandis exclusively","Capital market regulator."),
("economy","eco-banking",86,"Monetary Policy Committee decides:","Policy repo rate framework","Income tax slabs","SEBI listing fees only","State GST rates alone","MPC rate decisions."),
("economy","eco-reform",84,"IBC primarily aims at:","Time-bound insolvency resolution","Raising stamp duty only","Banning all lending","Replacing RBI","Insolvency and Bankruptcy Code."),
("economy","eco-ext",83,"Twin deficits typically mean:","Fiscal deficit and current account deficit","Only primary and revenue as identical","Only NPA and CRAR","Trade and budget surpluses","Classic twin deficits."),
("economy","eco-banking",84,"Priority Sector Lending is guided by:","RBI norms","WHO","UNESCO","ICC","RBI PSL guidelines."),
("economy","eco-dev",80,"Gini coefficient measures:","Inequality of income/wealth","Inflation only","Literacy only","Forest cover only","Inequality index."),
("economy","eco-ext",85,"FDI differs from FPI mainly because:","FDI implies lasting interest/control","FDI is always illegal","FPI always builds factories","They are legally identical always","FDI vs portfolio."),
("economy","eco-banking",86,"NPAs are:","Non-performing assets on bank books","Only government bonds","Only forex reserves","Only IPOs","Overdue loans per norms."),
("economy","eco-banking",86,"Open market operations are done by:","RBI to manage liquidity","SEBI to ban IPOs always","IRDAI for premia","TRAI for spectrum only","OMO in G-secs."),
("economy","eco-budget",84,"Capital receipts include:","Borrowings and disinvestment proceeds","Tax revenue","Interest as always capital only","Grants always capital without exception","Capital receipt examples."),
("economy","eco-inflation",78,"Base effect in inflation refers to:","Impact of last year's price level on YoY rate","Only RBI capital base","Only GDP base year","Only tax base","YoY base comparison."),
("economy","eco-ext",80,"Masala bonds are:","Rupee-denominated bonds issued abroad","Only chili futures","Only Hindi municipal bonds","Only tax-free PPP exclusivity","Offshore INR bonds."),
("economy","eco-tax",78,"Laffer curve relates to:","Tax rate versus tax revenue hypothesis","Only Phillips curve","Only Lorenz curve","Only yield curve exclusivity","Tax-revenue trade-off idea."),
("economy","eco-agri",82,"PM-KISAN is primarily:","Income support to farmer families","Export subsidy to corporates only","Urban wage only","Defence procurement only","Direct farmer income support."),
("economy","eco-intl",80,"World Economic Outlook is published by:","IMF","WTO","ILO","UNICEF","IMF WEO."),
("economy","eco-banking",82,"MSF rate is typically:","Above the repo rate","Equal always to reverse repo only","Set by SEBI","Zero by statute","Marginal Standing Facility."),
("economy","eco-budget",81,"Crowding out refers to:","Govt borrowing possibly displacing private investment","Only exporting more","Only importing gold","Only printing textbooks","Fiscal–private credit debate."),
("economy","eco-inflation",83,"Core inflation often excludes:","Volatile food and fuel (definition varies)","Only wages","Only GDP","Only taxes","Core vs headline."),
("economy","eco-tax",79,"Windfall tax typically targets:","Unexpected excess profits in some sectors","Only agricultural MSP","Only municipal property tax","Only GST compensation always","Extra tax on windfalls."),
]:
    g(*row)

print("GS1 so far", len(GS1))

# Environment (30)
for row in [
("env","env-climate",88,"Paris Agreement aims to limit warming well below:","2°C (pursuing 1.5°C)","5°C always","0°C by statute","10°C","Well below 2°C, pursue 1.5°C."),
("env","env-wildlife",84,"Project Tiger was launched in:","1973","1952","1992","2005","Project Tiger 1973."),
("env","env-biodiversity",86,"IUCN Red List categorises:","Conservation status of species","Only GDP ranks","Only Olympic medals","Only patents","Extinction risk categories."),
("env","env-climate",86,"Montreal Protocol deals with:","Ozone-depleting substances","Trade tariffs","Refugee status","Cybercrime","ODS phase-out."),
("env","env-pollution",85,"Eutrophication is mainly caused by:","Nutrient enrichment and algal blooms","Only desert winds","Only ozone hole","Only noise","N/P enrichment."),
("env","env-law",84,"National Green Tribunal was established in:","2010","1972","1991","2020","NGT Act 2010."),
("env","env-wildlife",85,"CITES regulates:","International trade in endangered species","Domestic GST rates","Space launches","Bank interest","Wildlife trade convention."),
("env","env-law",85,"Wildlife Protection Act was enacted in:","1972","1950","2000","2015","WPA 1972."),
("env","env-climate",85,"IPCC provides:","Scientific assessments on climate change","Binding tariffs","Olympic rules","Bank licences","Climate assessment reports."),
("env","env-ecosystem",86,"Mangroves are important because they:","Protect coasts and support biodiversity","Only create deserts","Only bleach corals","Replace all freshwater wetlands","Coastal protection & nurseries."),
("env","env-biodiversity",85,"Biodiversity hotspots require:","High endemism and habitat loss","Only high GDP","Only deserts without species","Only ice sheets","Myers hotspot criteria."),
("env","env-law",86,"EIA stands for:","Environmental Impact Assessment","Economic Inflation Analysis","Export Import Act","Election Inquiry Authority","Project appraisal tool."),
("env","env-wetlands",86,"Ramsar sites are:","Wetlands of international importance","Nuclear test sites","Mountain peaks only","Desert parks by definition","Ramsar Convention."),
("env","env-climate",83,"Carbon credits relate to:","Market mechanisms for emission reductions","Voting rights","Food coupons","Spectrum auctions exclusivity","Tradable mitigation units."),
("env","env-pollution",84,"Biomagnification means:","Toxins increasing up the food chain","Soil formation only","Cloud seeding only","Biodiversity decrease from rain only","Trophic accumulation."),
("env","env-marine",83,"Coral bleaching is linked to:","Elevated sea temperatures/stress","Only inland floods","Only mountain ash","Only traffic noise","Zooxanthellae expulsion."),
("env","env-forest",81,"CAMPA relates to:","Compensatory afforestation fund management","Civil aviation only","Marine piracy courts","Crypto regulation","Afforestation funds."),
("env","env-climate",84,"NAPCC includes missions such as:","Solar and energy efficiency among others","Only Olympics prep","Only GST compensation","Only space tourism","Eight national missions framework."),
("env","env-pollution",80,"Fly ash is mainly from:","Coal thermal power plants","Only solar panel washing","Only wind turbines","Only biogas kitchens","Coal residue."),
("env","env-biodiversity",82,"Keystone species means:","Disproportionately large ecosystem impact","Only largest mammal always","Only invasive weeds","Only fossils","Outsized ecological role."),
("env","env-pollution",85,"BOD indicates:","Organic pollution / oxygen demand","Only salinity","Only Kelvin temperature","Only atomic numbers","Biochemical oxygen demand."),
("env","env-forest",84,"Forest Rights Act 2006 deals with:","Forest dwellers' rights","Urban zoning only","Coastal shipping only","Aviation only","FRA rights."),
("env","env-marine",84,"Ocean acidification is linked to:","CO2 absorption lowering pH","Only plastic colour","Only whale songs","Only tidal turbines","Carbonic acid pathway."),
("env","env-pollution",83,"Extended Producer Responsibility often covers:","Plastics/e-waste take-back duties","Income tax refunds","Election deposits","Railway tickets","EPR duties."),
("env","env-wildlife",82,"Cheetah reintroduction in India is associated with:","Kuno and related efforts","Only Sundarbans as cheetah habitat name","Antarctica","Only Andaman corals","Cheetah project."),
("env","env-climate",84,"Green hydrogen is ideally produced by:","Renewable-powered electrolysis","Coal gasification as green definition","Diesel generators as green","Natural seepages exclusivity","Green H2 definition."),
("env","env-wildlife",81,"Project Elephant aims to:","Protect elephants and corridors","Only tigers by that name","Only corals by that name","Only snow leopards by that name","Elephant conservation."),
("env","env-climate",85,"UNFCCC is:","UN Framework Convention on Climate Change","Only a food convention","Only a refugee convention","Only a trade court","Parent climate treaty."),
("env","env-pollution",82,"Smog often refers to:","Polluted haze (smoke/fog related)","Clear alpine air","Stratospheric ozone itself","Deep ocean water","Air pollution haze."),
("env","env-biodiversity",84,"Invasive alien species are:","Non-native species harming ecosystems","Only native keystones","Only fossils","All GM crops by definition","IAS impacts."),
]:
    g(*row)

# History (30)
for row in [
("hist","hist-modern",86,"Non-Cooperation Movement launched in:","1920","1905","1942","1857","NCM 1920."),
("hist","hist-modern",84,"Brahmo Samaj founded by:","Raja Ram Mohan Roy","Dayananda Saraswati","Jyotiba Phule","Annie Besant","Rammohan Roy."),
("hist","hist-modern",85,"Battle of Plassey year:","1757","1764","1857","1526","Plassey 1757."),
("hist","hist-modern",84,"Permanent Settlement associated with:","Lord Cornwallis","Lord Dalhousie","Lord Curzon","Lord Mountbatten","Cornwallis 1793."),
("hist","hist-modern",86,"INA associated with:","Subhas Chandra Bose","Gokhale","Dadabhai Naoroji","Motilal Nehru","Azad Hind / INA."),
("hist","hist-modern",85,"Rowlatt Act year:","1919","1909","1935","1947","1919."),
("hist","hist-modern",86,"Chauri Chaura led Gandhi to:","Withdraw Non-Cooperation","Launch Quit India that day","Accept RTC as victory","Join Muslim League","1922 withdrawal."),
("hist","hist-modern",87,"Dandi March protested:","Salt tax/monopoly","Railway freight only","Indigo only that march","Rowlatt as sole issue that march","Salt Satyagraha 1930."),
("hist","hist-modern",84,"Gandhi-Irwin Pact year:","1931","1920","1942","1947","1931."),
("hist","hist-modern",85,"Subsidiary Alliance associated with:","Lord Wellesley","Lord Ripon","Lord Bentinck only for name","Lord Mountbatten","Wellesley system."),
("hist","hist-modern",86,"Simon Commission boycotted because:","No Indian member","It abolished salt tax","It granted independence","Gandhi headed it","All-British commission."),
("hist","hist-modern",87,"Drain of Wealth thesis linked to:","Dadabhai Naoroji","Curzon","Dalhousie","Wellesley","Naoroji."),
("hist","hist-modern",88,"Jallianwala Bagh year:","1919","1920","1918","1930","April 1919."),
("hist","hist-modern",85,"Morley-Minto Reforms year:","1909","1919","1935","1947","1909 Councils Act."),
("hist","hist-modern",86,"Poona Pact was between:","Ambedkar and Gandhi","Jinnah and Linlithgow only","Bose and Attlee only","Nehru and Mountbatten as Poona Pact","1932 Poona Pact."),
("hist","hist-modern",85,"Cripps Mission year:","1942","1919","1935","1909","1942."),
("hist","hist-modern",84,"Cabinet Mission year:","1946","1935","1919","1858","1946."),
("hist","hist-modern",85,"Arya Samaj founded by:","Dayananda Saraswati","Ram Mohan Roy","Vivekananda as Arya founder","Keshab Sen as Arya founder","1875 Arya Samaj."),
("hist","hist-modern",83,"Home Rule leagues associated with:","Annie Besant and Tilak","Cornwallis","Dalhousie","Curzon alone","Home Rule Movement."),
("hist","hist-modern",83,"First woman INC President:","Annie Besant","Sarojini Naidu","Vijaya Lakshmi Pandit","Indira Gandhi","Besant 1917."),
("hist","hist-modern",84,"Lucknow Pact 1916 was between:","Congress and Muslim League","British and French","Marathas and Mughals","Sikhs and Portuguese","Congress–League pact."),
("hist","hist-modern",82,"Ryotwari system associated with:","Munro (Madras/Bombay regions)","Only Permanent Settlement Bengal as same","Only Mahalwari as identical","Only zamindari Bengal as same","Direct cultivator settlement."),
("hist","hist-modern",81,"Vernacular Press Act year:","1878","1909","1919","1935","1878."),
("hist","hist-modern",84,"First Round Table Conference:","1930","1942","1919","1946","1930–31."),
("hist","hist-modern",82,"Indigo revolt mainly in:","Bengal","Punjab exclusivity","Assam exclusivity","Mysore exclusivity","Nil revolt."),
("hist","hist-modern",84,"HSRA associated with:","Bhagat Singh and revolutionaries","Only early Moderates exclusivity","Only Viceroys","Only Chamber of Princes","Hindustan Socialist Republican Association."),
("hist","hist-modern",83,"Servants of India Society founded by:","Gopal Krishna Gokhale","Tilak","Lajpat Rai as founder","Bipin Pal as founder","Gokhale."),
("hist","hist-modern",81,"August Offer year:","1940","1858","1905","1947","1940."),
("hist","hist-modern",80,"Young Bengal Movement linked to:","Henry Vivian Derozio","Raja Ram Mohan as Young Bengal founder","Tilak","Gokhale","Derozio."),
("hist","hist-modern",82,"Discovery of India authored by:","Jawaharlal Nehru","Gandhi","Ambedkar","Tagore","Nehru."),
]:
    g(*row)

# Geography (30)
for row in [
("geo","geo-india",86,"Tropic of Cancer passes through how many Indian states (common count)?","8","5","12","2","Eight states."),
("geo","geo-climate",87,"El Niño is associated with:","Warming of eastern Pacific surface waters","Only Arctic ozone hole","Only more Himalayan snow always","Atlantic hurricanes vanishing forever","ENSO warm phase."),
("geo","geo-soils",85,"Black/regur soils typically in:","Deccan Trap regions","Only Thar exclusivity","Only Sundarbans","Only Ladakh exclusivity","Basaltic Deccan soils."),
("geo","geo-india",86,"Standard Meridian of India:","82°30' E","0°","180°","23°30' N","IST reference meridian."),
("geo","geo-india",86,"Which is east-flowing Peninsular river?","Godavari","Narmada","Tapi","Mahi","Godavari to Bay of Bengal."),
("geo","geo-hazards",85,"Tsunamis primarily caused by:","Undersea earthquakes/displacements","Only lunar tides","Only river floods","Only desert winds","Seismic sea waves."),
("geo","geo-climate",86,"Rainshadow explains:","Dry leeward side of mountains","Wet windward as dry always","Only ocean upwelling rain","Only urban heat islands","Orographic leeward dryness."),
("geo","geo-climate",85,"Coriolis force is due to:","Earth's rotation","Only Moon gravity without rotation","Only sunspots","Only ocean salinity","Rotational deflection."),
("geo","geo-india",83,"Chilika Lake is in:","Odisha","Rajasthan","Punjab","Kerala","Odisha lagoon."),
("geo","geo-india",85,"Palk Strait separates:","India and Sri Lanka","India and Maldives","India and Myanmar","India and Indonesia","IN–SL."),
("geo","geo-india",86,"Narmada flows into:","Arabian Sea","Bay of Bengal","Ocean south of Lanka only","Caspian Sea","West-flowing Narmada."),
("geo","geo-climate",84,"Jet streams are:","Fast upper-air westerlies","Only named ocean surface jets","Only ground monsoon trough","Only river meanders","Upper tropospheric jets."),
("geo","geo-climate",84,"Mediterranean climate has:","Dry summers and wet winters","Equal rain daily","No seasons","Only polar night","Cs climate type."),
("geo","geo-climate",84,"Isobars join equal:","Pressure","Rainfall","Temperature as isobar meaning","Salinity","Equal pressure lines."),
("geo","geo-climate",82,"Isohyets join equal:","Rainfall","Temperature","Pressure","Salinity","Equal rainfall."),
("geo","geo-ocean",83,"Continental shelf is:","Shallow seabed bordering continents","Deep trench only","Mid-ocean ridge only","Only abyssal centre","Continental margin shelf."),
("geo","geo-india",84,"Western Ghats vs Eastern Ghats continuity:","Western Ghats more continuous","Eastern Ghats unbroken wall always","Identical continuity","Neither exists","WG more continuous."),
("geo","geo-india",84,"Aravallis are among:","Oldest fold mountain systems of India","Youngest Himalaya exclusivity","Only Andaman arcs exclusivity","Only glacial deposits","Ancient Aravallis."),
("geo","geo-india",83,"Loktak Lake is in:","Manipur","Rajasthan","Kerala","Goa","Manipur; phumdis."),
("geo","geo-india",84,"Kaziranga is famous for:","One-horned rhinoceros","Polar bears","Penguins","Olive ridley exclusive worldwide nesting claim","Assam rhino habitat."),
("geo","geo-soils",82,"Laterite forms under:","High temperature and rainfall with leaching","Only arid cold deserts","Only permafrost","Only overnight ash","Tropical leaching."),
("geo","geo-hazards",84,"Ring of Fire refers to:","Circum-Pacific seismic/volcanic belt","Sahara sand ring","Arctic circle","Indian monsoon trough","Pacific Ring of Fire."),
("geo","geo-geomorph",83,"Deltas form where:","Rivers deposit at mouths in low-energy settings","Glaciers always make fjords only","Wind only makes barchans","Waves only erode without deposit","Fluvial mouth deposits."),
("geo","geo-geomorph",82,"Meanders are features of:","River floodplain courses","Only glaciers by definition","Only deserts by definition","Only coasts by definition","Sinuous bends."),
("geo","geo-hazards",82,"Cloudburst means:","Intense rain over small area quickly","Only all-day drizzle","Only polar snow exclusivity","Only fog without rain","Extreme short rain."),
("geo","geo-ocean",83,"Gulf Stream is a:","Warm Atlantic ocean current","Peru cold current by that name","Only monsoon wind","Only atmospheric jet as Gulf Stream","Warm N Atlantic current."),
("geo","geo-india",80,"Duncan Passage lies between:","South Andaman and Little Andaman","India and Sri Lanka (Palk)","India and Maldives","Lakshadweep and Maldives as Duncan","Andaman passage."),
("geo","geo-india",83,"Siachen Glacier lies in:","Eastern Karakoram","Western Ghats","Nilgiris","Aravallis","Karakoram."),
("geo","geo-climate",84,"Horse latitudes associated with:","Subtropical high pressure belts","Only ITCZ always","Only polar easterlies exclusivity","Only equatorial westerlies exclusivity","~30° highs."),
("geo","geo-bio",84,"Tropical evergreen forests need:","High rainfall and temperature year-round","Only arid climate","Mediterranean dry summer as tropical evergreen","Only tundra","Hot wet evergreen."),
]:
    g(*row)

print("GS1 after geo", len(GS1))

# Science (30)
for row in [
("sci","sci-bio",86,"CRISPR is associated with:","Gene editing","Only radio astronomy","Only concrete curing","Only hash cryptography exclusivity","Genome editing tool."),
("sci","sci-energy",85,"Lithium-ion batteries matter for:","Portable electronics and EVs","Only steam engines","Only mechanical clocks","Only vacuum tubes","High energy-density storage."),
("sci","sci-bio",84,"DNA fingerprinting is used for:","Identity/forensic applications","Only BP measurement","Only GPS","Only steel hardening","DNA profiling."),
("sci","sci-atm",85,"Ozone layer mainly absorbs:","UV radiation","Only green visible exclusivity","Only radio","Only microwaves for cooking","Stratospheric UV absorption."),
("sci","sci-space",84,"NavIC is:","Indian regional navigation satellite system","Only a weather balloon","Only a submarine","Only a collider","IRNSS/NavIC."),
("sci","sci-energy",85,"Photovoltaic cells convert:","Light to electricity","Electricity to light by definition only","Heat to sound only","Wind to hydrogen always","PV effect."),
("sci","sci-bio",86,"Antibiotics primarily target:","Bacterial infections (not viruses generally)","All viruses always","Only genetic disorders","Only fractures","Antibacterial drugs."),
("sci","sci-tech",84,"Semiconductors underpin:","Modern electronics/chips","Only steam turbines","Only dams","Only gears","Transistor/IC basis."),
("sci","sci-tech",82,"3D printing is also called:","Additive manufacturing","Only subtractive CNC as same","Only casting without layers","Only forging","Layer-wise additive."),
("sci","sci-bio",83,"mRNA vaccines instruct cells to:","Produce antigen that trains immunity","Edit DNA permanently as purpose always","Replace all antibiotics","Measure blood sugar only","Antigen expression."),
("sci","sci-tech",83,"Internet of Things means:","Networked devices/sensors","Only social media posts","Only undersea cables as IoT definition","Only mainframe batch as IoT","Connected devices."),
("sci","sci-bio",86,"Vaccines generally work by:","Training immune memory","Replacing antibiotics for all infections","Germline editing as purpose","Measuring BMI only","Immunological memory."),
("sci","sci-tech",81,"Blockchain is:","Distributed ledger technology","Only one hospital DB exclusivity","Only paper cash","Only analog radio","Append-only ledgers."),
("sci","sci-bio",84,"MRI uses:","Magnetic fields and radio waves","Only ionising X-rays as MRI","Only ultrasound as MRI","Only PET isotopes as MRI","Non-ionising imaging."),
("sci","sci-space",82,"SSLV is associated with:","ISRO small satellite launcher","NASA Mars habitat as SSLV","SpaceX Starship as SSLV name","ESA Ariane as SSLV","ISRO SSLV."),
("sci","sci-bio",85,"Antibiotic resistance spreads via:","Selection pressure and gene transfer","Only mask-wearing","Only water purification as sole cause","Only exercise","AMR threat."),
("sci","sci-tech",82,"5G aims for:","Higher rates and lower latency","Only AM radio revival","Only telegraphy","Only dial-up","Mobile broadband gen."),
("sci","sci-mat",80,"Graphene is:","Single-layer carbon hexagonal lattice","A noble gas","Only a glass type","A protein enzyme","2D carbon allotrope."),
("sci","sci-bio",83,"Stem cells can:","Differentiate into specialised cells","Only be dead bone always","Only be viruses","Only be antibodies","Regenerative potential."),
("sci","sci-tech",80,"Nanotechnology deals with roughly:","1–100 nm scale structures","Only kilometre bridges","Only astronomical units","Only light-years","Nano scale."),
("sci","sci-energy",82,"Fusion energy seeks to:","Join light nuclei releasing energy","Only split heavy nuclei as fusion","Only burn coal cleaner","Only compressed air storage","Nuclear fusion."),
("sci","sci-tech",80,"LiDAR is used for:","Laser-based remote sensing","Only AM radio","Only blood tests","Only cooking","Light detection and ranging."),
("sci","sci-bio",79,"Probiotics are:","Beneficial live microbes (in context)","Only antibiotics","Only flu viruses","Only heavy metals","Live beneficial microbes."),
("sci","sci-physics",81,"Superconductivity is:","Zero electrical resistance below Tc","Infinite resistance always","Magnetism gone at all room temps always","Only semiconductor doping","Zero resistivity state."),
("sci","sci-tech",82,"LLMs/chatbots are examples of:","AI/machine learning language models","Only vacuum tube radios","Only steam governors","Only abacuses","Large language models."),
("sci","sci-methods",82,"Carbon dating estimates age of:","Organic archaeological samples (C-14)","Only billion-year igneous rocks via C-14","Only metal alloys","Only galaxies via C-14","Radiocarbon method."),
("sci","sci-physics",78,"Higgs boson relates to:","Mass mechanism in particle physics","Only weather prediction","Only vaccines","Only soil chemistry","Standard Model Higgs."),
("sci","sci-energy",81,"Biofuels include:","Ethanol/biodiesel from biomass","Only coal tar as biofuel","Only uranium","Only gas hydrates exclusivity","Biomass-derived fuels."),
("sci","sci-tech",80,"OLED displays use:","Organic light-emitting diodes","Only CRTs","Only mechanical shutters","Only neon as OLED","Self-emissive pixels."),
("sci","sci-bio",84,"Antibodies are produced by:","B/plasma cells","Only RBCs exclusivity","Only platelets exclusivity","Only osteocytes exclusivity","Humoral immunity."),
]:
    g(*row)

# Culture (25)
for row in [
("culture","cult-arts",84,"Nataraja bronzes are classic of:","Chola art","Only Mughal miniatures","Only Gandhara as Nataraja origin","Only Company paintings","Chola bronzes."),
("culture","cult-heritage",86,"Ajanta caves are famous for:","Buddhist murals and rock-cut halls","Only Dilwara marble exclusivity","Only Sikh fresco exclusivity","Only colonial oils","Ajanta paintings."),
("culture","cult-dance",85,"Kathakali is from:","Kerala","Punjab","Rajasthan as origin","Assam as origin","Kerala classical dance-drama."),
("culture","cult-dance",86,"Bharatanatyam originated in:","Tamil Nadu","Punjab","Kashmir as origin","Goa as origin","TN classical dance."),
("culture","cult-heritage",85,"Qutub Minar is in:","Delhi","Agra as Qutub location","Hyderabad as Qutub","Lucknow as Qutub","Delhi."),
("culture","cult-heritage",86,"Hampi was capital of:","Vijayanagara","Magadha as Hampi","Delhi Sultanate as Hampi capital","British Raj as Hampi capital","Vijayanagara."),
("culture","cult-heritage",84,"Khajuraho temples associated with:","Chandelas","Only Cholas exclusivity","Only Mughals","Only British Raj","Chandela temples."),
("culture","cult-heritage",84,"Konark Sun Temple built by:","Eastern Ganga (Narasimhadeva I often cited)","Only Ashoka","Only Akbar","Only Tipu","13th c. Konark."),
("culture","cult-heritage",86,"Ellora includes monuments of:","Buddhism, Hinduism and Jainism","Only Sikhism caves exclusivity","Only Christianity caves exclusivity","Only Zoroastrian caves exclusivity","Multi-faith Ellora."),
("culture","cult-ancient",85,"Gandhara art shows:","Greco-Roman influence with Buddhist themes","Only Olmec art","Only ukiyo-e origin","Only Aboriginal Australian origin","Hellenistic Buddhist art."),
("culture","cult-ancient",85,"Rigveda is mainly:","Hymns","Medieval chronicles","Colonial gazetteers","Modern statutes","Vedic hymns."),
("culture","cult-dance",82,"Sattriya is associated with:","Assam","Tamil Nadu only","Gujarat only","Goa only","Assam classical dance."),
("culture","cult-dance",84,"Mohiniyattam is from:","Kerala","Assam","Gujarat exclusivity","Punjab exclusivity","Kerala classical."),
("culture","cult-folk",83,"Madhubani painting is from:","Mithila (Bihar)","Only Kerala murals exclusivity","Only Kangra exclusivity","Only Deccani exclusivity","Mithila art."),
("culture","cult-folk",81,"Warli painting is associated with:","Maharashtra tribal art","Only Rajasthan court miniatures exclusivity","Only Mughal ateliers exclusivity","Only Tanjore exclusivity","Warli."),
("culture","cult-folk",81,"Kalbelia dance is from:","Rajasthan","Kerala","Manipur exclusivity","Goa exclusivity","Rajasthan; UNESCO ICH."),
("culture","cult-music",84,"Carnatic music is primarily:","South Indian classical tradition","Hindustani as identical name","Only Western opera","Only jazz","Carnatic."),
("culture","cult-music",84,"Hindustani classical is mainly of:","North India","Only Tamil Nadu as Hindustani","Only Kerala as Hindustani","Only Sri Lanka as Hindustani","North Indian classical."),
("culture","cult-heritage",86,"Golden Temple is in:","Amritsar","Varanasi","Madurai","Puri","Harmandir Sahib."),
("culture","cult-heritage",85,"Charminar is in:","Hyderabad","Delhi as Charminar","Jaipur as Charminar","Mysore as Charminar","Hyderabad."),
("culture","cult-arts",82,"Natya Shastra traditionally attributed to:","Bharata","Kalidasa as Natya author","Panini only","Kautilya","Bharata."),
("culture","cult-ancient",85,"Nalanda was a famous:","Ancient Buddhist learning centre","Only medieval European university as Nalanda","Only Mughal mint","Only British cantonment","Nalanda mahavihara."),
("culture","cult-bhakti",83,"Kabir is associated with:","Nirguna bhakti poetry","Only Vedic ritual manuals authorship","Only Sangam grammar","Only Mughal chronicles as sole identity","Nirguna bhakti."),
("culture","cult-folk",80,"Pattachitra is associated with:","Odisha traditional painting","Only Kangra exclusivity","Only Tanjore as Pattachitra name","Only Warli exclusivity","Odisha (also Bengal variants)."),
("culture","cult-dance",81,"Chhau is practised in parts of:","Odisha/Jharkhand/West Bengal region","Only Kerala as Chhau","Only Punjab as Chhau","Only Kashmir as Chhau","Eastern India Chhau."),
]:
    g(*row)

# Current affairs (25)
for row in [
("ca","ca-intl-orgs",84,"G20 is best described as:","Forum of major economies","NATO-like military alliance","A cricket board","A space agency","Economic cooperation forum."),
("ca","ca-nat-schemes",85,"PLI schemes aim to:","Incentivise domestic manufacturing","Only ban exports forever","Only raise income tax","Only regulate temples","Production Linked Incentive."),
("ca","ca-national",82,"NEP 2020 emphasises:","Multidisciplinary flexible education among reforms","Colonial curriculum freeze only","Abolishing higher education","Military training for all degrees only","NEP reforms."),
("ca","ca-digital",86,"UPI ecosystem is led with:","NPCI digital payments rails","Only IMF wires as UPI","Only SWIFT as UPI","Only hawala as UPI","UPI via NPCI."),
("ca","ca-digital",84,"Digital Public Infrastructure often cites:","Aadhaar, UPI, DigiLocker-type blocks","Only foreign undersea cables exclusivity","Only closed private gardens with no APIs","Only fax networks","India Stack/DPI."),
("ca","ca-intl",83,"QUAD members include:","India, USA, Japan, Australia","India, Russia, China, Pakistan","Only EU states","BRICS as QUAD name","Quad four."),
("ca","ca-nat-schemes",82,"PM Gati Shakti focuses on:","Multi-modal infrastructure coordination","Only midday meals exclusivity","Only vaccine cold chain exclusivity","Only space missions exclusivity","Infra coordination."),
("ca","ca-digital",83,"CBDC in India refers to:","Central Bank Digital Currency (e₹)","Only credit-card rewards","Only private crypto as RBI CBDC","Only postal stamps","Digital rupee."),
("ca","ca-tech-policy",82,"Semiconductor push aims at:","Domestic chip ecosystem","Only textiles","Only dairy exclusivity","Only tourism visas","Chip manufacturing incentives."),
("ca","ca-intl-orgs",80,"IMF quotas influence:","Voting power and resource access","Olympic hosts","WHO naming only","ICJ judges exclusively","Quota → votes."),
("ca","ca-nat-schemes",81,"Green bonds typically finance:","Environmentally beneficial projects","Coal expansion as definition","Only weapons","Only luxury imports always","Earmarked green finance."),
("ca","ca-climate",80,"Mission LiFE emphasises:","Lifestyle for Environment","Only lunar landing","Only GST audits","Only defence exports","Pro-planet lifestyles."),
("ca","ca-nat-schemes",80,"PM SVANidhi relates to:","Micro-credit for street vendors","Fighter jets","IIT admissions","Forest titles exclusivity","Street vendor credit."),
("ca","ca-intl",82,"Indus Waters Treaty is between:","India and Pakistan","India and China only","India and Bangladesh only","India and Nepal only","IWT 1960."),
("ca","ca-digital",81,"ONDC aims to:","Open-protocol digital commerce","Nationalise all kiranas by definition","Ban UPI","Create one private monopoly by law","Open Network for Digital Commerce."),
("ca","ca-intl",82,"SCO includes India as:","A member","Only forever-observer without membership","Unrelated to Eurasia","NATO military wing","Shanghai Cooperation Organisation."),
("ca","ca-climate",84,"Climate COP is under:","UNFCCC","WTO ministerial as climate COP","UNESCO heritage as COP","ICAO exclusivity","Conference of the Parties."),
("ca","ca-nat-schemes",81,"e-Shram portal relates to:","Unorganised worker database/services","IAS cadre only","Corporate boards only","Defence pensions exclusivity","e-Shram."),
("ca","ca-digital",81,"Account Aggregator enables:","Consent-based financial data sharing","Cash without ID","Tax evasion tools","Paper passbooks exclusivity","AA framework."),
("ca","ca-national",81,"Aspirational Districts Programme focuses on:","Improving lagging district indicators","Only metro skyscrapers","Only spaceports","Only embassies","Socio-economic catch-up."),
("ca","ca-climate",79,"Green Credit Programme relates to:","Incentivising pro-environment activities","Bank NPAs","GST credits identical by definition","Electoral bonds","MoEFCC green credits."),
("ca","ca-nat-schemes",80,"IREDA is associated with:","Financing renewable energy","Coal mining as IREDA","Defence offsets exclusivity","Film censorship","Renewable energy NBFC/agency."),
("ca","ca-health",80,"One Health links:","Human, animal and environmental health","Only stock markets","Only fiscal health exclusivity","Only soil pH exclusivity","Zoonoses/AMR nexus."),
("ca","ca-nat-schemes",79,"National Monetisation Pipeline relates to:","Unlocking brownfield public asset value","Printing currency","Farm loan waivers as NMP","Military pensions exclusivity","Asset monetisation."),
("ca","ca-intl",79,"BIMSTEC links:","Bay of Bengal regional cooperation","Only Arctic Council","Only OPEC","ASEAN as identical membership always","BIMSTEC."),
]:
    g(*row)

print("Total base GS1 facts", len(GS1), Counter(x["subjectId"] for x in GS1))

CSAT = []

def c(section, subject, topic, ch, q, opts, correct, exp):
    CSAT.append({
        "subjectId": subject, "paperId": "prelims-csat", "topicId": topic, "nextExamChance": ch,
        "question": q, "options": opts, "correctIndex": correct, "explanation": exp,
        "illustrative": True, "section": section,
    })

# Comprehension (40)
comp = [
("Public transport cuts congestion externalities but needs land and fiscal capacity.", "Strongest inference?", ["Helps if capacity exists", "Congestion never falls", "Land irrelevant", "Fiscal capacity never matters"], 0, "Conditional benefit."),
("Open data aids reproducibility yet risks privacy if anonymisation fails.", "Conclusion?", ["Openness–privacy trade-off", "Open data always safe", "Privacy always impossible", "Research needs no data"], 0, "Trade-off."),
("Skill training raises employability when industry linkages exist.", "Assumption?", ["Skills–jobs matching matters", "Training always useless", "Industry never hires", "Linkages irrelevant"], 0, "Linkages matter."),
("Decentralised renewables can electrify remote areas faster than grid-only extension.", "Implication?", ["Off-grid can complement grids", "Grids never useful", "Renewables impossible remotely", "Remote areas need no power"], 0, "Complementarity."),
("Some studies find misinformation spreads faster than corrections.", "Weakens most?", ["Evidence corrections outpace falsehoods in key contexts", "Platforms exist", "Users read news", "Phones common"], 0, "Counter-evidence."),
("Urban wetlands mitigate floods but face encroachment.", "Tone stating both?", ["Balanced/concerned", "Pure celebration", "Denial of wetlands", "Indifference only"], 0, "Benefit + threat."),
("Cash transfers may improve nutrition if markets and knowledge work.", "Necessary hint?", ["Markets/knowledge mediate outcomes", "Cash always fails", "Nutrition unrelated to income", "Markets always irrelevant"], 0, "Mediators."),
("Algorithmic credit scoring expands access yet may embed bias.", "Best summary?", ["Efficiency with fairness risks", "Algorithms always fair", "Ban all credit", "Bias impossible in data"], 0, "Dual effects."),
("Community forest rights align conservation with livelihoods if governance is accountable.", "Inference?", ["Governance quality matters", "Rights always destroy forests", "Livelihoods never link to forests", "Accountability irrelevant"], 0, "Governance condition."),
("Heat early-warning saves lives if last-mile communication works.", "Assumption?", ["Warnings must reach the vulnerable", "Heat harmless", "Communication irrelevant", "Systems need no data"], 0, "Last-mile."),
("Remote sensing helps crop insurance but ground-truthing remains important.", "Conclusion?", ["Tech complements field checks", "Satellites never useful", "Ground surveys always obsolete", "Insurance impossible"], 0, "Complementarity."),
("Financial inclusion deepens when digital literacy accompanies accounts.", "Supports?", ["Accounts unused where literacy low", "Accounts alone always suffice", "Literacy irrelevant", "Banks must close"], 0, "Unused accounts evidence."),
("Circular economy reduces waste if design-for-reuse is incentivised.", "If incentives absent?", ["Design/behaviour may not change", "Waste always falls anyway", "Incentives never matter", "Reuse illegal"], 0, "Incentives matter."),
("Transparent procurement lowers corruption risk but needs audit capacity.", "Strongest inference?", ["Transparency plus capacity works better", "Transparency alone always enough", "Audits useless", "Procurement must be secret"], 0, "Joint necessity."),
("Remittances stabilise income yet may create local labour shortages.", "Stance?", ["Nuanced trade-offs", "Only praise remittances", "Only condemn migration", "Deny remittances"], 0, "Both effects."),
("Nature-based adaptation needs secure land tenure to succeed.", "Assumption?", ["Tenure insecurity can block projects", "Tenure irrelevant", "Adaptation unnecessary", "Land always secure"], 0, "Tenure condition."),
("Platform work offers flexibility with weaker social security in many places.", "Policy implication?", ["Social protection may need redesign", "Ban all platforms always", "Flexibility impossible", "Labour law forever obsolete without reform talk"], 0, "Policy redesign."),
("Groundwater depletion accelerates where pumping power is heavily subsidised without regulation.", "Claim type?", ["Incentive-driven over-extraction risk", "Rainfall alone explains all", "Subsidies never affect behaviour", "Regulation always perfect"], 0, "Incentives."),
("Civic tech improves grievance redress if offline options remain for digital have-nots.", "Equity concern?", ["Digital divide", "Only server uptime", "Only app colours", "Only CPU speed"], 0, "Inclusion."),
("Vaccine hesitancy falls when trusted local messengers explain side-effect rarity.", "Implication?", ["Trusted clear communication matters", "Force without information always best alone", "Messengers irrelevant", "Hide side effects"], 0, "Trust + clarity."),
("Fiscal federalism needs predictable transfers for state planning.", "Inference?", ["Predictability aids planning", "Transfers irrelevant", "States never plan", "Federalism impossible"], 0, "Predictability."),
("Microplastics enter food chains; source control beats end-of-pipe alone.", "Conclusion?", ["Prevention beats cleanup alone", "Cleanup always enough", "Food chains immune", "Plastics harmless"], 0, "Prevention focus."),
("Teacher absenteeism falls with community monitoring in some trials.", "Supports?", ["Monitoring can change behaviour", "Teachers never absent", "Community irrelevant", "Trials useless"], 0, "Behavioural evidence."),
("Export diversification reduces vulnerability to single-market shocks.", "Assumption?", ["Concentration raises risk", "Shocks never happen", "Diversification always harmful", "Markets always identical"], 0, "Risk concentration."),
("Heritage conservation can support tourism jobs if carrying capacity is respected.", "Tone?", ["Conditional optimism", "Absolute rejection", "Denial of tourism", "Ignore capacity"], 0, "Conditional."),
("Public health surveillance must balance privacy.", "Implies?", ["Tension between goals", "Privacy irrelevant", "Surveillance useless", "Laws never matter"], 0, "Balance language."),
("Remote work expands talent pools but may weaken informal mentoring.", "Conclusion?", ["Remote work has trade-offs", "Mentoring always impossible online", "Talent pools always shrink", "Offices lack mentoring always"], 0, "Trade-off."),
("Claim: higher literacy always raises national income.", "Weakens?", ["High-literacy regions may stagnate from other factors", "Literacy is good", "Surveys exist", "Schools teach"], 0, "Counterexample weakens 'always'."),
("Passage lists benefits and costs of a technology.", "Stance?", ["Nuanced", "Dogmatic rejection", "Pure sales", "Indifferent silence"], 0, "Nuanced."),
("Transparency reduces corruption risks but needs capacity.", "Inference?", ["Transparency helps; capacity still matters", "Transparency alone guarantees zero corruption", "Procurement must be secret", "Capacity irrelevant"], 0, "Balanced inference."),
("Urban heat islands raise night temperatures and cooling demand.", "Implication?", ["Cooling demand may rise", "Rural always hotter", "Energy demand always falls", "Heat islands cut power use"], 0, "Direct implication."),
("Financial literacy helps avoid predatory credit.", "Necessary assumption?", ["Some credit can harm if misunderstood", "All banks predatory", "Literacy removes all risk", "Credit illegal"], 0, "Harm possible."),
("Tone praising evidence-based policy while noting data gaps.", "Tone is:", ["Measured/balanced", "Uncritical celebration", "Hostile", "Only sarcastic"], 0, "Praise + caution."),
("Decentralisation improves accountability when information is public.", "Inference?", ["Public information supports accountability under decentralisation", "Decentralisation always fails", "Information never matters", "Accountability impossible"], 0, "Conditional."),
("Green belts cut urban heat if maintained and not encroached.", "Assumption?", ["Maintenance/encroachment affect outcomes", "Green belts always fail", "Heat islands imaginary", "Encroachment irrelevant"], 0, "Conditions matter."),
("Aadhaar-linked DBT reduces leakages if authentication and grievance systems work.", "Inference?", ["Design quality mediates savings", "DBT always leak-proof", "Authentication irrelevant", "Grievances never arise"], 0, "Implementation quality."),
("EV adoption rises with charging access and affordable finance.", "Missing if finance absent?", ["Adoption may stall for liquidity-constrained buyers", "Charging alone always enough", "Finance never matters", "EVs illegal"], 0, "Finance constraint."),
("Open school data can raise accountability yet may stigmatise weak schools without support.", "Stance?", ["Nuanced risk–benefit", "Only celebrate openness", "Only reject data", "Deny schools exist"], 0, "Both sides."),
("Biosecurity labs need transparency and security simultaneously.", "Implies?", ["Goals can tension", "Security irrelevant", "Transparency useless", "Labs need no rules"], 0, "Tension."),
("City bus priority lanes work if enforced against private encroachment.", "Assumption?", ["Enforcement matters for outcomes", "Lanes always work without enforcement", "Buses irrelevant", "Private cars never encroach"], 0, "Enforcement condition."),
]
for i, (passage, stem, opts, corr, exp) in enumerate(comp, 1):
    c("comp", "csat-comp", "csat-reading", 88 + (i % 3), f"Passage: '{passage}' {stem}", opts, corr, exp)

# Reasoning (50)
for i in range(1, 21):
    a, b = 2 + i, 3 + i
    nxt = i + a + b + (b + 2) + (b + 4)
    c("lr", "csat-lr", "csat-reasoning", 80 + (i % 5),
      f"Number series set {i}: {i}, {i+a}, {i+a+b}, {i+a+b+(b+2)}, ?",
      [str(nxt), str(nxt + 1), str(i * 10), str(i + a)], 0,
      f"Increments grow; next add {b+4} → {nxt}.")

for i in range(1, 16):
    c("lr", "csat-lr", "csat-reasoning", 81,
      f"Syllogism set {i}: All M{i} are N{i}. Some N{i} are P{i}. Conclusions: I Some M{i} are P{i} II All P{i} are M{i}",
      ["Neither follows", "Only I", "Only II", "Both"], 0,
      "I not necessary; II illicit conversion.")

for i in range(1, 11):
    c("lr", "csat-lr", "csat-reasoning", 82,
      f"Directions set {i}: Walk {i+1} km east, {i+2} km north, {i+1} km west. Net north from start?",
      [f"{i+2} km north", f"{i+1} km south", f"{2*i} km east", "At start"], 0,
      f"E/W cancel; net north {i+2} km.")

lr_extra = [
("If all analysts are graduates and some graduates are coders, which must be true?", ["Some analysts may be coders (not must)", "All coders are analysts", "No graduate is a coder", "All analysts are coders"], 0, "Possibility ≠ necessity."),
("A>B; C<B; D>A. Tallest among A,B,C,D?", ["D", "A", "B", "C"], 0, "D>A>B>C."),
("Odd one out: Square, Circle, Triangle, Rectangle", ["Circle", "Square", "Triangle", "Rectangle"], 0, "Circle not a polygon."),
("If + means × and × means −, then 4 + 3 × 2 = ?", ["10", "5", "14", "6"], 0, "4×3−2=10."),
("Series 2,6,12,20,30,?", ["42", "40", "36", "32"], 0, "+4,+6,+8,+10,+12."),
("All citizens have duties. X has duties. So X is a citizen.", ["Does not follow", "Follows", "Partial", "Duties unique so follows"], 0, "Affirming the consequent."),
("Coding CAT=24 (sum of positions), BAT=?", ["23", "22", "25", "20"], 0, "2+1+20=23."),
("Five in a row: A left of B; C between A and B; D right of B; E left of A. Middle?", ["C", "A", "B", "D"], 0, "E-A-C-B-D."),
("All parks green. Some green noisy. Some parks noisy?", ["Does not necessarily follow", "Must follow", "All noisy are parks", "No park green"], 0, "No forced overlap."),
("Only a few reforms succeed; all successes praised. Then:", ["Some reforms may be praised", "All reforms praised", "No success praised", "All praise are reforms"], 0, "Successful reforms praised."),
]
for q, opts, corr, exp in lr_extra:
    c("lr", "csat-lr", "csat-reasoning", 83, q, opts, corr, exp)

# Quant (55)
quant_base = [
("A number increased by 20% becomes 180. Original?", ["150", "160", "144", "120"], 0, "1.2x=180 → 150."),
("SI on 2000 at 10% for 2 years?", ["400", "200", "440", "220"], 0, "PRT/100=400."),
("Average of 5,10,15,20,25?", ["15", "12", "18", "20"], 0, "75/5=15."),
("If 3x+2=17, x=?", ["5", "4", "6", "3"], 0, "x=5."),
("Ratio 2:3 sum 50; larger part?", ["30", "20", "25", "35"], 0, "3/5×50=30."),
("25% of 240?", ["60", "50", "40", "80"], 0, "60."),
("Train 120 m at 18 km/h crosses pole in?", ["24 s", "20 s", "12 s", "30 s"], 0, "5 m/s → 24 s."),
("LCM of 4 and 6?", ["12", "24", "8", "10"], 0, "12."),
("Square root of 144?", ["12", "14", "10", "16"], 0, "12."),
("CP=80 SP=100; profit %?", ["25%", "20%", "15%", "30%"], 0, "20/80=25%."),
]
for q, opts, corr, exp in quant_base:
    c("quant", "csat-quant", "csat-numeracy", 85, q, opts, corr, exp)

for i in range(1, 31):
    cp = 50 + i * 3
    sp = cp + 10 + (i % 7)
    profit = sp - cp
    pct = round(profit / cp * 100)
    c("quant", "csat-quant", "csat-numeracy", 82 + (i % 4),
      f"Profit set {i}: CP=₹{cp}, SP=₹{sp}. Approx profit %?",
      [f"{pct}%", f"{pct+5}%", f"{pct-3}%", f"{pct+10}%"], 0,
      f"Profit={profit}; ≈{pct}%.")

for i in range(1, 16):
    speed = 4 + i
    length = speed * (8 + i % 5)
    t = length // speed
    c("quant", "csat-quant", "csat-numeracy", 83,
      f"Time-speed set {i}: length {length} m at {speed} m/s. Time to cross a point?",
      [f"{t} s", f"{t+2} s", f"{t+5} s", f"{max(1,t-3)} s"], 0,
      f"t={length}/{speed}={t}s.")

for i in range(1, 11):
    p, r, t = 1000 + i * 100, 5 + (i % 5), 2 + (i % 3)
    si = p * r * t // 100
    c("quant", "csat-quant", "csat-numeracy", 84,
      f"SI set {i}: P=₹{p}, R={r}%, T={t}y. SI?",
      [f"₹{si}", f"₹{si+50}", f"₹{si+100}", f"₹{max(10,si-40)}"], 0,
      f"SI={si}.")

# Decision (20)
dm = [
("Colleague fudges attendance. Best first step?", ["Counsel per rules; escalate with evidence if needed", "Ignore forever", "Shame on social media first", "Alter records illegally yourself"], 0, "Integrity + process."),
("Beneficiary lost documents in disaster. You:", ["Use hardship provisions; help obtain duplicates lawfully", "Reject without guidance", "Demand bribe", "Fabricate documents"], 0, "Lawful facilitation."),
("Conflict of interest in tender evaluation. You:", ["Recuse and disclose", "Hide and vote", "Tip favoured firm", "Destroy bids"], 0, "Recusal."),
("Urgent disaster relief vs incomplete paperwork. You:", ["Use emergency rules; document reasons", "Block all aid", "Divert to friends", "Wait forever ignoring lawful interim options"], 0, "Relief + record."),
("Whistle-blower alleges corruption with some evidence. You:", ["Inquire per rules; protect identity as required", "Leak name to accused first", "Dismiss without record", "Punish complainant illegally"], 0, "Due inquiry."),
("Two legal opinions differ. You:", ["Record both; seek clarification; decide with reasons", "Pick randomly", "Favour higher bribe", "Lose the file"], 0, "Reasoned decision."),
("Media seeks confidential investigation details. You:", ["Share only what law permits", "Reveal sealed materials", "Lie about known facts", "Threaten journalists illegally"], 0, "Lawful communication."),
("Staff asks to overlook safety violation for deadline. You:", ["Refuse; fix safety; replan", "Overlook hazard", "Falsify safety log", "Blame victims later"], 0, "Safety first."),
("Contractor offers gifts mid-tender. You:", ["Refuse; report per conduct rules", "Accept privately", "Accept and favour them", "Demand more"], 0, "Conduct rules."),
("Language barrier with applicant. You:", ["Arrange interpretation/plain-language help", "Reject for language alone unlawfully", "Mock accent", "Hide forms"], 0, "Access."),
]
for q, opts, corr, exp in dm:
    c("dm", "csat-dm", "csat-decision", 57, q, opts, corr, exp)

for i in range(1, 11):
    c("dm", "csat-dm", "csat-decision", 55 + (i % 4),
      f"Ethics scenario set {i}: Powerful person seeks unlawful queue priority. You:",
      ["Apply rules equally; explain courteously; record pressure", "Grant unlawful priority", "Insult publicly", "Close counter out of spite"],
      0, "Rule of law + courtesy.")

print("CSAT new", len(CSAT), Counter(x["section"] for x in CSAT))

def make_variants(facts, start):
    out = []
    n = start
    by = defaultdict(list)
    for f in facts:
        by[f["subjectId"]].append(f)
    for sub, flist in by.items():
        for i in range(0, len(flist) - 1, 2):
            a, b = flist[i], flist[i + 1]
            ca, cb = a["options"][0], b["options"][0]
            out.append({
                "id": f"tmp-{n}", "subjectId": sub, "paperId": "prelims-gs",
                "question": f"Consider the following statements:\n1. {ca}\n2. {cb}\nWhich of the statements given above is/are correct?",
                "options": ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
                "correctIndex": 2,
                "explanation": f"Both are Prelims-relevant: (1) {a['explanation']} (2) {b['explanation']}",
                "illustrative": True, "topicId": a["topicId"],
                "nextExamChance": max(76, min(a["nextExamChance"], b["nextExamChance"]) - 2),
            }); n += 1
            out.append({
                "id": f"tmp-{n}", "subjectId": sub, "paperId": "prelims-gs",
                "question": f"With reference to {sub}, which one of the following is correct?",
                "options": [ca, f"Opposite of: {ca}", "No relevance to Indian polity/economy/environment", "Applies only outside India with no domestic link"],
                "correctIndex": 0, "explanation": a["explanation"], "illustrative": True,
                "topicId": a["topicId"], "nextExamChance": max(75, a["nextExamChance"] - 3),
            }); n += 1
            out.append({
                "id": f"tmp-{n}", "subjectId": sub, "paperId": "prelims-gs",
                "question": f"Assertion (A): {ca}\nReason (R): {cb}\nSelect the correct option:",
                "options": ["Both A and R true and R explains A", "Both A and R true but R does not explain A", "A true, R false", "A false, R true"],
                "correctIndex": 1,
                "explanation": "Both statements plausible; R need not explain A — illustrative AR practice.",
                "illustrative": True, "topicId": a["topicId"],
                "nextExamChance": max(74, min(a["nextExamChance"], b["nextExamChance"]) - 4),
            }); n += 1
    return out

def main():
    gs1_pool = parse_qs(ROOT / "gs1-pool.ts")
    existing = {q["question"] for q in gs1_pool}
    to_add = []
    for f in GS1:
        if f["question"] not in existing:
            to_add.append(dict(f))
            existing.add(f["question"])
    for v in make_variants(GS1, 1):
        if v["question"] not in existing:
            to_add.append(v)
            existing.add(v["question"])
    nid = 351
    for q in to_add:
        q["id"] = f"mg1-new-{nid}"
        q["illustrative"] = True
        nid += 1
    gs1_ext = gs1_pool + to_add
    write_export(ROOT / "gs1-pool.ts", "gs1MockPool", gs1_ext)
    print("GS1 pool", len(gs1_ext), "added", len(to_add))

    csat_pool = parse_qs(ROOT / "csat-pool.ts")
    existing = {q["question"] for q in csat_pool}
    cadd = []
    cid = 1
    for q in CSAT:
        if q["question"] in existing:
            continue
        nq = dict(q)
        nq["id"] = f"mcs-new-{cid}"
        nq["illustrative"] = True
        cid += 1
        cadd.append(nq)
        existing.add(nq["question"])
    csat_ext = csat_pool + cadd
    write_export(ROOT / "csat-pool.ts", "csatMockPool", csat_ext)
    print("CSAT pool", len(csat_ext), "added", len(cadd), Counter(x["section"] for x in csat_ext))

    GS1_QUOTA = {"polity": 16, "economy": 15, "env": 15, "hist": 14, "geo": 13, "sci": 11, "culture": 8, "ca": 8}
    CSAT_QUOTA = {"csat-comp": 27, "csat-quant": 23, "csat-lr": 22, "csat-dm": 8}

    def used_from(kind, keys):
        used = set()
        for k in keys:
            p = ROOT / f"{kind}-paper-{k}.ts"
            if p.exists():
                for q in parse_qs(p):
                    used.add(q["question"])
        return used

    def pick(pool, quota, used, key="subjectId"):
        by = defaultdict(list)
        for q in pool:
            by[q[key]].append(q)
        rng = random.Random(len(used) * 17 + 101)
        chosen, newly = [], set()
        for sub, need in quota.items():
            cand = [q for q in by[sub] if q["question"] not in used and q["question"] not in newly]
            rng.shuffle(cand)
            if len(cand) < need:
                extra = [q for q in by[sub] if q["question"] not in newly]
                rng.shuffle(extra)
                for q in extra:
                    if q["question"] in {x["question"] for x in cand}:
                        continue
                    cand.append(q)
                    if len(cand) >= need * 3:
                        break
            take = cand[:need]
            if len(take) < need:
                raise SystemExit(f"Not enough for {sub}: {len(take)}/{need} (pool {len(by[sub])})")
            for q in take:
                newly.add(q["question"])
                chosen.append(q)
        rng.shuffle(chosen)
        return chosen

    def remap(qs, kind, key):
        out = []
        for i, q in enumerate(qs, 1):
            nq = dict(q)
            nq["id"] = f"{kind}-{key}-{i:03d}"
            out.append(nq)
        return out

    used = used_from("gs1", "abc")
    print("GS1 used A-C", len(used))
    for key in "def":
        paper = remap(pick(gs1_ext, GS1_QUOTA, used), "gs1", key)
        for q in paper:
            used.add(q["question"])
        write_export(ROOT / f"gs1-paper-{key}.ts", f"gs1Paper{key.upper()}", paper)
        print("GS1", key, Counter(q["subjectId"] for q in paper))

    used = used_from("csat", "abc")
    print("CSAT used A-C", len(used))
    for key in "def":
        paper = remap(pick(csat_ext, CSAT_QUOTA, used), "csat", key)
        for q in paper:
            used.add(q["question"])
        write_export(ROOT / f"csat-paper-{key}.ts", f"csatPaper{key.upper()}", paper)
        print("CSAT", key, Counter(q["subjectId"] for q in paper))

    for kind in ("gs1", "csat"):
        texts = {k: {q["question"] for q in parse_qs(ROOT / f"{kind}-paper-{k}.ts")} for k in "def"}
        print(kind, "D∩E", len(texts["d"] & texts["e"]), "D∩F", len(texts["d"] & texts["f"]), "E∩F", len(texts["e"] & texts["f"]))

if __name__ == "__main__":
    main()
