#!/usr/bin/env python3
"""Generate split quiz/mains TypeScript modules for UPSC Study Hub."""
from pathlib import Path
import json

ROOT = Path("src/data/quizzes")

def ts_str(s):
    return json.dumps(s, ensure_ascii=False)

def emit_mcq(path, export_name, questions):
    lines = ['import type { QuizQuestion } from "@/types";', "", f"export const {export_name}: QuizQuestion[] = ["]
    for q in questions:
        lines.append("  {")
        for k, v in q.items():
            if isinstance(v, str):
                lines.append(f"    {k}: {ts_str(v)},")
            elif isinstance(v, bool):
                lines.append(f"    {k}: {'true' if v else 'false'},")
            elif isinstance(v, list):
                lines.append(f"    {k}: [{', '.join(ts_str(x) for x in v)}],")
            else:
                lines.append(f"    {k}: {v},")
        lines.append("  },")
    lines.append("];\n")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))
    return len(questions)

def emit_mains(path, export_name, prompts):
    lines = ['import type { MainsPrompt } from "@/types";', "", f"export const {export_name}: MainsPrompt[] = ["]
    for q in prompts:
        lines.append("  {")
        for k, v in q.items():
            if isinstance(v, str):
                lines.append(f"    {k}: {ts_str(v)},")
            elif isinstance(v, bool):
                lines.append(f"    {k}: {'true' if v else 'false'},")
            elif isinstance(v, list):
                lines.append(f"    {k}: [{', '.join(ts_str(x) for x in v)}],")
            else:
                lines.append(f"    {k}: {v},")
        lines.append("  },")
    lines.append("];\n")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))
    return len(prompts)

def Q(id, subjectId, paperId, question, options, correctIndex, explanation, topicId=None, yearTag=None):
    d = dict(id=id, subjectId=subjectId, paperId=paperId, question=question, options=options,
             correctIndex=correctIndex, explanation=explanation, illustrative=True)
    if topicId: d["topicId"] = topicId
    if yearTag: d["yearTag"] = yearTag
    return d

def M(id, subjectId, paperId, question, tags, marksHint, modelOutline, keyPoints, topicId=None, yearTag=None):
    d = dict(id=id, subjectId=subjectId, paperId=paperId, question=question, tags=tags,
             marksHint=marksHint, modelOutline=modelOutline, keyPoints=keyPoints, illustrative=True)
    if topicId: d["topicId"] = topicId
    if yearTag: d["yearTag"] = yearTag
    return d

def build_mcqs(prefix, subjectId, paperId, rows):
    out = []
    for i, row in enumerate(rows, 1):
        q, opts, ci, exp, tid, yt = row
        out.append(Q(f"q-{prefix}-{i}", subjectId, paperId, q, opts, ci, exp, tid, yt))
    return out

counts = {}

# ---- GEO ----
geo_rows = [
("Which river is called the 'Sorrow of Bihar'?", ["Gandak", "Kosi", "Son", "Ghaghara"], 1, "Kosi's shifting course and floods earn it this name.", "geo-india", 2018),
("El Niño is associated with:", ["Cooling of eastern Pacific", "Warming of eastern equatorial Pacific waters", "Always stronger Indian monsoon", "Ozone hole formation"], 1, "El Niño = unusual warming of central/eastern equatorial Pacific; often weakens Indian monsoon.", "geo-physical", 2019),
("Black soils (Regur) in India are predominantly found in:", ["Indo-Gangetic plains", "Deccan Trap region", "Thar desert", "Eastern Ghats exclusively"], 1, "Regur soils on basaltic Deccan Traps are ideal for cotton.", "geo-india", 2017),
("The Troposphere is important because:", ["It contains the ozone layer peak", "Almost all weather phenomena occur here", "Satellites orbit only here", "It has no water vapour"], 1, "Weather and most clouds/water vapour are concentrated in the troposphere.", "geo-physical", 2020),
("Which current is a cold ocean current?", ["Gulf Stream", "Kuroshio", "Canary Current", "Agulhas"], 2, "Canary Current is a cold eastern-boundary current in the North Atlantic.", "geo-physical", 2021),
("Western Ghats are an example of:", ["Fold mountains only", "Block mountains exclusively", "Escarpment of ancient plateau edge (faulted/eroded)", "Volcanic island arc"], 2, "Western Ghats are primarily the western edge of the Deccan plateau.", "geo-india", 2022),
("Jet streams are:", ["Ocean currents in deep sea", "High-altitude fast westerly winds", "Local land-sea breezes only", "Tidal bores"], 1, "Jet streams are narrow bands of strong winds in the upper troposphere.", "geo-physical", 2016),
("Which pass connects Srinagar with Leh traditionally?", ["Nathu La", "Zoji La", "Shipki La", "Bomdi La"], 1, "Zoji La links Kashmir Valley with Ladakh.", "geo-india", 2023),
("Laterite soils in India are typically associated with:", ["High rainfall leaching regions", "Arid desert dunes", "Glacial moraines", "Permafrost"], 0, "Laterites form under intense leaching in tropical high-rainfall areas.", "geo-india", 2018),
("The continental shelf is economically important mainly because:", ["It is the deepest ocean trench", "It hosts fisheries and hydrocarbon potential", "It has no sediments", "Ships cannot navigate there"], 1, "Shelves are shallow, productive for fisheries and often hydrocarbon-rich.", "geo-physical", 2019),
("Which planet's axial tilt similarity is sometimes compared in NCERT-style earth science intros? (Earth tilt ~23.5°)", ["Mercury has identical seasons always", "Earth's tilt causes seasons", "Seasons are caused only by distance to Sun", "No planet has seasons"], 1, "Seasons arise primarily from axial tilt, not orbital distance variation alone.", "geo-physical", None),
("The Himalayas are primarily:", ["Volcanic mountains", "Young fold mountains", "Residual hills", "Block fault mountains only"], 1, "Himalayas are young fold mountains from Indian–Eurasian plate collision.", "geo-india", 2017),
("Which drainage pattern resembles a tree branching?", ["Radial", "Dendritic", "Trellis", "Centripetal"], 1, "Dendritic patterns develop on uniform lithology.", "geo-physical", 2020),
("Monsoon onset over Kerala typically occurs around:", ["1 January", "1 June", "1 September", "1 December"], 1, "Normal monsoon onset over Kerala is around 1 June (IMD normals).", "geo-india", 2021),
("Coral reefs are generally found in:", ["Cold polar waters only", "Warm, clear, shallow tropical seas", "Deep ocean trenches", "Freshwater lakes exclusively"], 1, "Reef-building corals need warm, clear, shallow marine waters.", "geo-physical", 2022),
("The Peninsular rivers compared to Himalayan rivers are generally:", ["More perennial and glacier-fed always", "More rain-fed with relatively graded profiles", "Longer always", "Without deltas ever"], 1, "Peninsular rivers are largely rain-fed with mature, graded courses.", "geo-india", 2018),
("Which local wind is a hot, dry wind in the northern plains of India in summer?", ["Mango shower", "Loo", "Kalbaisakhi", "Chinook"], 1, "Loo are hot dusty winds of the north Indian plains in summer.", "geo-india", 2019),
("Isotherms are lines joining places of equal:", ["Pressure", "Temperature", "Rainfall", "Salinity"], 1, "Isotherms = equal temperature; isobars = pressure; isohyets = rainfall.", "geo-physical", 2016),
("The Great Barrier Reef is located off the coast of:", ["India", "Australia", "Brazil", "South Africa"], 1, "World's largest coral reef system lies off Queensland, Australia.", "geo-world", 2020),
("Which mineral belt is associated with the Chota Nagpur region?", ["Only petroleum", "Coal and metallic minerals concentration", "Only diamonds", "Potash exclusively"], 1, "Chota Nagpur is rich in coal, iron ore, mica and other minerals.", "geo-india", 2023),
("Insolation is maximum at:", ["Poles throughout year", "Equator region broadly (with seasonal nuances)", "Only at Arctic circle", "Ocean trenches"], 1, "Low latitudes receive higher average insolation than poles.", "geo-physical", 2017),
("Which type of rainfall is associated with mountains forcing air to rise?", ["Convectional", "Orographic", "Cyclonic only in poles", "Frontal exclusively in deserts"], 1, "Orographic rainfall occurs when moist air rises over highlands.", "geo-physical", 2021),
("The Deccan Trap is mainly composed of:", ["Granite batholiths only", "Basaltic lava flows", "Sandstone reefs", "Limestone caves exclusively"], 1, "Deccan Traps are vast basaltic flood basalts.", "geo-india", 2018),
("Which African desert is the largest hot desert?", ["Kalahari", "Sahara", "Namib", "Atacama"], 1, "Sahara is the largest hot desert; Antarctica is largest overall desert.", "geo-world", 2019),
("EEZ under UNCLOS generally extends up to:", ["12 nautical miles", "24 nautical miles", "200 nautical miles", "Entire ocean"], 2, "Exclusive Economic Zone extends up to 200 nm from baselines.", "geo-physical", 2022),
("Which Indian river forms a large delta shared with Bangladesh?", ["Narmada", "Ganga–Brahmaputra system", "Luni", "Mahi"], 1, "Sundarbans delta is formed by Ganga–Brahmaputra–Meghna system.", "geo-india", 2020),
("Temperature inversion near surface can worsen:", ["Soil fertility", "Air pollution trapping", "Ocean salinity always", "Monsoon onset certainty"], 1, "Inversions trap pollutants near the ground, worsening smog.", "geo-physical", 2024),
("Which crop is most associated with black soil regions traditionally?", ["Tea", "Cotton", "Apple", "Saffron"], 1, "Cotton thrives in moisture-retentive black soils of Deccan.", "geo-india", 2016),
("The Ring of Fire refers to:", ["Sahara sandstorms", "Circum-Pacific belt of earthquakes and volcanoes", "Only Atlantic hurricanes", "Himalayan snowfall"], 1, "Pacific Ring of Fire is a major seismic/volcanic belt.", "geo-world", 2021),
("Which latitude belt is associated with horse latitudes / subtropical highs?", ["Equator", "Around 30° N/S", "60° N/S only", "Poles only"], 1, "Subtropical high-pressure belts near 30° are linked to deserts and calms.", "geo-physical", 2018),
("Chilika Lake is best described as:", ["A freshwater Himalayan lake", "A coastal lagoon in Odisha", "A crater lake in Maharashtra", "An artificial reservoir in Gujarat only"], 1, "Chilika is Asia's large brackish coastal lagoon in Odisha.", "geo-india", 2023),
("Meanders are typically associated with:", ["Youthful mountain streams only", "Mature river courses in plains", "Glacial cirques", "Ocean trenches"], 1, "Meanders develop in gentler gradients of mature rivers.", "geo-physical", 2019),
("Which state is a leading producer of natural rubber in India?", ["Rajasthan", "Kerala", "Punjab", "Haryana"], 1, "Kerala dominates natural rubber production in India.", "geo-india", 2017),
("Tsunami waves are most often triggered by:", ["Lunar eclipses", "Undersea earthquakes / disturbances", "Trade winds alone", "River floods inland"], 1, "Most tsunamis follow undersea quakes, landslides, or volcanic events.", "geo-physical", 2020),
("The Tropic of Cancer passes through how many Indian states (as commonly taught in recent maps)?", ["2", "5", "8", "All states"], 2, "Tropic of Cancer passes through 8 Indian states (standard textbook count).", "geo-india", 2022),
("Savanna climate is characterised by:", ["Rainforest canopy year-round only", "Distinct wet and dry seasons with grasslands", "Permanent ice cover", "No vegetation"], 1, "Tropical savanna has seasonal rainfall and grassland with scattered trees.", "geo-world", 2018),
("Which soil is generally most suitable for intensive agriculture among Indian alluvial soils?", ["Pure desert sand", "Alluvial soils of plains", "Bare rock outcrops", "Highly saline rann crust only"], 1, "Alluvial soils of Indo-Gangetic plains support intensive farming.", "geo-india", 2016),
("Contour ploughing helps mainly in:", ["Increasing wind speed", "Reducing soil erosion on slopes", "Deepening ocean trenches", "Creating isotherms"], 1, "Ploughing along contours reduces runoff and soil loss.", "geo-physical", 2024),
("Which is an inland drainage river in India?", ["Godavari", "Luni", "Mahanadi", "Kaveri"], 1, "Luni drains into the Rann of Kutch (inland drainage).", "geo-india", 2021),
("The concept of 'isostasy' relates to:", ["Ocean tide prediction only", "Equilibrium of Earth's crust floating on denser material", "Monsoon forecasting exclusively", "Soil pH balance"], 1, "Isostasy describes crustal balance over denser mantle material.", "geo-physical", 2019),
("Which region is known for fjord coastlines?", ["Western Norway", "Thar desert", "Deccan plateau interior", "Indo-Gangetic plain"], 0, "Fjords are glacial valleys drowned by sea, classic in Norway.", "geo-world", 2020),
("Indian Standard Time is based on which longitude?", ["68°E", "82°30'E", "97°E", "0°"], 1, "IST is 82°30'E (near Allahabad/Prayagraj meridian).", "geo-india", 2017),
("Which layer of atmosphere contains the ozone layer peak?", ["Troposphere", "Stratosphere", "Mesosphere", "Exosphere"], 1, "Ozone layer is concentrated in the stratosphere.", "geo-physical", 2022),
("Bhabar belt is found:", ["Along Himalayan foothills where streams disappear into porous debris", "Only in coastal Kerala", "In Andaman trenches", "In Thar exclusively as clay"], 0, "Bhabar is porous pebble belt at Himalayan foothills; streams go underground.", "geo-india", 2018),
("Which factor most influences ocean salinity locally near mouths of large rivers?", ["Moon phase only", "Freshwater influx diluting salinity", "Forest canopy inland", "Airports"], 1, "River discharge lowers salinity near mouths (e.g., Bay of Bengal).", "geo-physical", 2023),
("The Andes are located in:", ["Africa", "South America", "Australia", "Europe"], 1, "Andes run along western South America.", "geo-world", 2016),
("Which Indian lake is a famous saline lake in Rajasthan?", ["Wular", "Sambhar", "Loktak", "Dal"], 1, "Sambhar is a major saline lake in Rajasthan.", "geo-india", 2021),
("Cyclones in the Bay of Bengal are more frequent than Arabian Sea mainly due to:", ["Higher average SSTs and favourable conditions more often", "Absence of Coriolis force in Arabian Sea", "No rivers entering Bay", "Bay being freshwater"], 0, "Bay of Bengal's warmer waters and configuration favour more cyclogenesis historically.", "geo-physical", 2024),
("Map projection that preserves shape locally for small areas is often called:", ["Equal-area only", "Conformal", "Azimuthal equidistant always", "Cylindrical equal-area only"], 1, "Conformal projections preserve local angles/shapes (e.g., Mercator locally).", "geo-physical", None),
("Which cropping pattern refers to growing two or more crops simultaneously on same field?", ["Monoculture", "Mixed/Intercropping", "Fallowing", "Sericulture"], 1, "Intercropping/mixed cropping grows multiple crops together.", "geo-india", 2019),
("The Strait of Malacca is strategically important because it:", ["Connects Arctic to Atlantic", "Links Indian Ocean to South China Sea / Pacific trade routes", "Is India's only inland river", "Separates Africa from Europe"], 1, "Malacca Strait is a critical chokepoint for East–West maritime trade.", "geo-world", 2022),
("Which process forms ox-bow lakes?", ["Glacial plucking only", "Meander cutoff in river plains", "Volcanic crater collapse only", "Wind deflation in deserts only"], 1, "Ox-bow lakes form when meander loops are cut off.", "geo-physical", 2017),
("Red soils in India typically develop on:", ["Basaltic traps only", "Crystalline igneous/metamorphic rocks in peninsular areas", "Pure alluvium only", "Coastal mangrove mud only"], 1, "Red soils from weathering of crystalline rocks are widespread in peninsula.", "geo-india", 2020),
("Which pressure belt is associated with doldrums?", ["Subpolar low", "Equatorial low / ITCZ region", "Polar high", "Subtropical high exclusively named horse"], 1, "Doldrums refer to calm conditions near equatorial low/ITCZ.", "geo-physical", 2018),
("Palk Strait lies between:", ["India and Sri Lanka", "India and Maldives", "India and Myanmar", "India and Indonesia"], 0, "Palk Strait separates India and Sri Lanka.", "geo-india", 2023),
]
counts["geo"] = emit_mcq(ROOT/"prelims-gs"/"geo.ts", "geoQuestions", build_mcqs("geo", "geo", "prelims-gs", geo_rows))

# ---- POLITY ----
pol_rows = [
("Which Part of the Constitution deals with Fundamental Rights?", ["Part II", "Part III", "Part IV", "Part IV-A"], 1, "Part III (Arts. 12–35) — Fundamental Rights.", "polity-const", 2018),
("A Money Bill can be introduced only in:", ["Rajya Sabha", "Lok Sabha", "Either House", "Joint Sitting"], 1, "Money Bill only in Lok Sabha on President's recommendation.", "polity-institutions", 2019),
("Basic structure doctrine was propounded in:", ["Golaknath", "Kesavananda Bharati", "Minerva Mills", "SR Bommai"], 1, "Kesavananda Bharati (1973) established basic structure doctrine.", "polity-const", 2017),
("Finance Commission is constituted under:", ["Article 280", "Article 312", "Article 324", "Article 148"], 0, "Art. 280 — Finance Commission; 324 EC; 148 CAG.", "polity-institutions", 2020),
("Which amendment added Fundamental Duties?", ["42nd", "44th", "73rd", "86th"], 0, "42nd Amendment 1976 added Part IV-A Fundamental Duties.", "polity-const", 2021),
("Writ of Habeas Corpus is associated with:", ["Production of a detained person before court", "Quo warranto only", "Preventing a lower court from exceeding jurisdiction (Prohibition)", "Certifying records (Certiorari) exclusively"], 0, "Habeas Corpus — produce the body; protects personal liberty.", "polity-const", 2016),
("The President of India is elected by:", ["Universal adult suffrage directly", "An electoral college of elected MPs and elected MLAs", "Only Rajya Sabha", "Supreme Court judges"], 1, "Art. 54 — electoral college of elected MPs + elected MLAs of states/UTs as provided.", "polity-institutions", 2022),
("Which schedule lists languages?", ["7th", "8th", "9th", "10th"], 1, "Eighth Schedule — recognised languages.", "polity-const", 2018),
("CAG of India is appointed by:", ["Prime Minister", "President", "Speaker", "Chief Justice"], 1, "CAG appointed by the President under Art. 148.", "polity-institutions", 2019),
("Anti-defection provisions are in which Schedule?", ["8th", "9th", "10th", "11th"], 2, "Tenth Schedule — anti-defection.", "polity-const", 2020),
("Directive Principles are:", ["Fully justiciable like FRs", "Non-justiciable guidelines for state policy", "Applicable only to judiciary", "Repealed in 1976"], 1, "DPSPs (Part IV) are non-justiciable but fundamental in governance.", "polity-const", 2017),
("Joint Sitting of Parliament is provided under:", ["Article 108", "Article 123", "Article 356", "Article 368"], 0, "Art. 108 — joint sitting for certain legislative deadlocks (not Money Bills).", "polity-institutions", 2021),
("Which body conducts elections to Parliament and state legislatures?", ["NITI Aayog", "Election Commission of India", "Finance Commission", "UPSC"], 1, "ECI under Art. 324 superintends elections to Parliament and state legislatures.", "polity-institutions", 2016),
("Right to Property is currently:", ["A Fundamental Right under Art. 31", "A constitutional legal right under Art. 300A", "Not recognised at all", "Only a DPSP"], 1, "44th Amendment moved property to Art. 300A (legal right).", "polity-const", 2023),
("The concept of Judicial Review in India is borrowed largely from:", ["UK absolute parliamentary sovereignty only", "USA", "USSR", "Japan only"], 1, "Judicial review is a feature influenced by the US constitutional model.", "polity-const", 2018),
("Gram Sabha is defined in relation to:", ["73rd Amendment / Part IX", "Only 74th Amendment", "Fundamental Duties", "Emergency provisions"], 0, "73rd Amendment constitutionalised Panchayats; Gram Sabha is key institution.", "polity-governance", 2019),
("Which of the following is a Constitutional Body?", ["NITI Aayog", "National Human Rights Commission", "Union Public Service Commission", "Central Information Commission"], 2, "UPSC is constitutional (Part XIV); NITI, NHRC, CIC are statutory/executive.", "polity-institutions", 2022),
("Ordinance-making power of President is under:", ["Article 123", "Article 72", "Article 143", "Article 352"], 0, "Art. 123 — Presidential ordinances when Parliament not in session.", "polity-institutions", 2020),
("Federal features of Indian Constitution include:", ["Single citizenship only as proof of unitary", "Division of powers and written constitution", "Absence of independent judiciary", "No supremacy of constitution"], 1, "Federal features include written constitution, division of powers, independent judiciary.", "polity-const", 2017),
("The Speaker of Lok Sabha decides on:", ["Money Bill certification under Art. 110", "Appointment of CAG", "Dissolution of Rajya Sabha", "Election of President alone"], 0, "Speaker's certificate that a bill is a Money Bill is final.", "polity-institutions", 2021),
("Article 32 is described by Ambedkar as:", ["Heart and soul of the Constitution", "A mere DPSP", "Temporary provision", "Only applicable to states"], 0, "Art. 32 — constitutional remedies; called heart and soul by Ambedkar.", "polity-const", 2016),
("Which emergency is related to financial stability?", ["National Emergency Art. 352", "President's Rule Art. 356", "Financial Emergency Art. 360", "None"], 2, "Art. 360 provides for Financial Emergency.", "polity-const", 2024),
("Rajya Sabha members from states are elected by:", ["All citizens of the state directly", "Elected members of state legislative assemblies", "Lok Sabha only", "Governors alone"], 1, "State RS seats filled by elected MLAs via proportional representation.", "polity-institutions", 2018),
("Which amendment is related to Panchayati Raj?", ["42nd", "44th", "73rd", "52nd"], 2, "73rd Amendment 1992 — Panchayats.", "polity-governance", 2019),
("The Attorney General of India holds office during the pleasure of:", ["Chief Justice", "President", "Parliament by simple majority only", "Prime Minister's Office as a constitutional court"], 1, "AG appointed by President; holds office during President's pleasure.", "polity-institutions", 2020),
("Concurrent List subjects allow legislation by:", ["Only Centre", "Only States", "Both Centre and States", "Only Judiciary"], 2, "Seventh Schedule Concurrent List — both can legislate; Union prevails in conflict (Art. 254).", "polity-const", 2022),
("Impeachment of the President requires:", ["Simple majority in one House", "Special majority process in each House as prescribed", "Only Supreme Court order", "State assemblies' ratification only"], 1, "Art. 61 — impeachment for violation of Constitution with prescribed special majorities.", "polity-institutions", 2017),
("NHRC is a:", ["Constitutional body under Art. 280", "Statutory body", "Private NGO only", "UN organ"], 1, "NHRC is a statutory body under Protection of Human Rights Act.", "polity-governance", 2021),
("Which case is associated with striking down NJAC?", ["Kesavananda", "Minerva Mills", "Supreme Court Advocates-on-Record Assn. (2015)", "Golaknath"], 2, "SC struck down NJAC and 99th Amendment in 2015, restoring collegium.", "polity-institutions", 2023),
("Fundamental Duties are:", ["Enforceable by writ directly always", "Non-justiciable but educational/constitutional obligations", "Applicable only to foreigners", "Part of Seventh Schedule"], 1, "Duties are non-justiciable; guide citizens and legislation.", "polity-const", 2018),
("Zero Hour in Parliament refers to:", ["Budget presentation only", "Time after Question Hour for raising matters without prior notice (practice)", "Joint sitting", "President's address"], 1, "Zero Hour is an Indian parliamentary practice after Question Hour.", "polity-institutions", 2019),
("Which Article deals with amendment of the Constitution?", ["Article 32", "Article 226", "Article 368", "Article 370 only"], 2, "Art. 368 — power and procedure to amend the Constitution.", "polity-const", 2016),
("Local self-government in urban areas was constitutionalised by:", ["73rd Amendment", "74th Amendment", "42nd Amendment", "1st Amendment"], 1, "74th Amendment — Municipalities.", "polity-governance", 2020),
("The Vice-President is the ex-officio Chairman of:", ["Lok Sabha", "Rajya Sabha", "NITI Aayog", "UPSC"], 1, "Vice-President is ex-officio Chairman of Rajya Sabha.", "polity-institutions", 2022),
("Which of the following is NOT a Fundamental Right?", ["Right to Equality", "Right to Freedom of Religion", "Right to Property (presently)", "Right against Exploitation"], 2, "Right to Property is no longer a FR; it is Art. 300A legal right.", "polity-const", 2017),
("Collegium system relates to appointment of:", ["Election Commissioners only", "Judges of the Supreme Court and High Courts", "Chief Ministers", "Governors exclusively by judiciary"], 1, "Collegium recommends appointments/transfers of SC/HC judges.", "polity-institutions", 2024),
("Article 21 has been interpreted to include:", ["Only trial procedures narrowly", "Expanded rights including livelihood, dignity, privacy (as held)", "Only property rights", "Only voting rights"], 1, "Expansive interpretation of Art. 21 includes dignity, livelihood, privacy, etc.", "polity-const", 2021),
("Which majority is generally required to pass an ordinary bill in a House (assuming quorum)?", ["Two-thirds of total membership always", "Majority of members present and voting (subject to rules)", "Unanimous consent only", "State ratification"], 1, "Ordinary bills: majority of members present and voting.", "polity-institutions", 2018),
("The idea of 'Procedure established by law' in Art. 21 is closer originally to:", ["Japanese constitution influence often cited", "Only unwritten UK conventions without text", "French Declaration alone", "None"], 0, "Art. 21's phrase is often linked to Japanese constitutional influence; due process evolved via case law.", "polity-const", 2019),
("Governor's ordinance-making power for a state is under:", ["Article 123", "Article 213", "Article 356", "Article 360"], 1, "Art. 213 — Governor's ordinances.", "polity-institutions", 2020),
("Which body prepares the Union Budget traditionally presented by Finance Minister?", ["RBI alone", "Ministry of Finance", "NITI Aayog alone", "CAG alone"], 1, "Budget is prepared by Ministry of Finance and presented in Parliament.", "polity-institutions", 2016),
("Public Interest Litigation in India is closely associated with:", ["Relaxation of locus standi for rights enforcement", "Abolition of writs", "Removal of FRs", "Only criminal appeals"], 0, "PIL liberalised standing so public-spirited citizens can approach courts.", "polity-governance", 2022),
("Which Schedule deals with allocation of seats in Rajya Sabha?", ["3rd", "4th", "5th", "6th"], 1, "Fourth Schedule — RS seat allocation to states/UTs.", "polity-const", 2023),
("The Inter-State Council is provided under:", ["Article 263", "Article 280", "Article 312", "Article 370"], 0, "Art. 263 — Inter-State Council.", "polity-governance", 2018),
("Which of the following statements about Lame-duck session is correct?", ["It is a session after new Lok Sabha is elected but old House still sits until dissolution formalities", "It elects the President only", "It is Rajya Sabha exclusive", "It passes only Money Bills"], 0, "Lame-duck refers to the sitting of an outgoing House after elections.", "polity-institutions", 2021),
("Secularism in the Indian Constitution implies:", ["State religion is Hinduism", "No state religion; equal respect / non-establishment ethos as interpreted", "Ban on all religions", "Only minority religions protected"], 1, "India has no state religion; secularism interpreted as equal respect/treatment.", "polity-const", 2017),
("Which writ is issued to a public office holder asking by what authority they hold office?", ["Habeas Corpus", "Mandamus", "Quo Warranto", "Prohibition"], 2, "Quo Warranto questions authority to hold a public office.", "polity-const", 2019),
("Starred questions in Parliament require:", ["Oral answers", "Only written answers", "No answers", "Judicial review first"], 0, "Starred questions are answered orally; supplementary questions allowed.", "polity-institutions", 2020),
("Which amendment reduced voting age from 21 to 18?", ["42nd", "44th", "61st", "73rd"], 2, "61st Amendment reduced voting age to 18.", "polity-const", 2024),
("Union Territory of Delhi's legislative powers are specially dealt with under:", ["Article 239AA", "Article 370", "Article 356 only", "Article 32"], 0, "Art. 239AA provides special provisions for NCT of Delhi.", "polity-governance", 2022),
("Which of the following is correct about Rajya Sabha?", ["It can be dissolved every 5 years", "It is a permanent House; members have staggered terms", "All members are nominated", "It has equal powers on Money Bills"], 1, "RS is permanent; 1/3 members retire every 2 years.", "polity-institutions", 2016),
("Doctrine of pith and substance is used to:", ["Interpret federal legislative competence when laws overlap", "Appoint judges", "Conduct elections", "Grant pardons"], 0, "Pith and substance helps uphold legislation if its true nature falls in the enacting legislature's list.", "polity-const", 2023),
("Which Article guarantees Freedom of Speech and Expression?", ["Article 14", "Article 19(1)(a)", "Article 21 only", "Article 32 only"], 1, "Art. 19(1)(a) — freedom of speech and expression (with reasonable restrictions).", "polity-const", 2018),
("The Estimates Committee of Parliament is a:", ["Financial control committee examining estimates", "Judicial body", "State legislature only", "UN committee"], 0, "Estimates Committee scrutinises budgetary estimates for economies/efficiency.", "polity-institutions", 2021),
("Which of the following is a Gandhian principle reflected in DPSPs?", ["Uniform Civil Code alone", "Organisation of village panchayats (Art. 40)", "International peace only", "Promotion of scientific temper as FR"], 1, "Art. 40 — organise village panchayats; classic Gandhian DPSP.", "polity-const", 2019),
]
counts["polity"] = emit_mcq(ROOT/"prelims-gs"/"polity.ts", "polityQuestions", build_mcqs("pol", "polity", "prelims-gs", pol_rows))

print("geo", counts["geo"], "polity", counts["polity"])
