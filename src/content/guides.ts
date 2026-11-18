import type { Faq } from "@/lib/json-ld";

export type Guide = { paragraphs: string[]; faqs: Faq[] };

export const heatPumpGuide: Guide = {
  paragraphs: [
    "A heat pump is sized in BTU per hour and sold in nominal tons. One ton is 12,000 BTU/h. The number on the outdoor unit is the capacity the manufacturer rates under a test condition, not a measurement of your house. This calculator estimates the heating load and the cooling load you are asking that capacity to cover. It uses a screening method of the kind a contractor might sketch before a full Manual J: floor area, a climate band, and a few adjustments you can see in the result.",
    "Cooling starts from the rule of thumb that one ton serves about 400 to 750 square feet. Hotter houses sit toward 400. Milder climates and tighter houses can stretch toward 750. The climate table is this calculator’s point inside that range, written as BTU/h per square foot so the multiplication is obvious. Pick the band for your summer and winter. A mountain town and a desert city in the same state are different houses.",
    "Insulation, ceiling height, glass, and duct location scale that starting point. The bare rule of thumb quietly assumes ceilings near eight feet, so a ten-foot ceiling is entered as 10/8 of the load. Glass is applied to cooling only. Winter sun is a gain, and treating it as extra heating load would push the heat pump the wrong direction. Ducts in a hot attic or a cold crawlspace leak and exchange heat with the outdoors. The attic factor is a flat uplift, a stand-in for the duct load Manual J would build from leakage, insulation, and surface area. It is not a measurement of your ducts.",
    "The heat pump has to satisfy both seasons, and the larger screen governs. In a hot-humid house, cooling is usually larger. In a cold house, heating governs, and a unit chosen only from the cooling rule will be short on the design morning. Nameplate heating capacity is commonly rated near 47°F, and output falls as outdoor temperature falls. Compare the heating BTU on this page with the manufacturer’s capacity at your winter design temperature. A cold-climate model is built to hold more of its output then. Adding a full extra ton without that chart leads to short cycles and weak summer dehumidification.",
    "Try the default house: 1,800 square feet, mixed climate, average insulation, eight-foot ceilings, typical glass, ducts inside the conditioned space. Cooling is 1,800 / 550 tons, about 3.3 tons. Heating is 1,800 × 32 BTU/h per square foot, 57,600 BTU/h, or 4.8 tons. Heating governs, and the nearest half-ton at or above 4.8 is 5 tons. That is a large machine for this floor area. Look at the envelope, or at two smaller systems, before anyone orders a single 5-ton heat pump. Change the climate to hot-humid and cooling becomes 1,800 / 450, or 4.0 tons, while heating drops to 1,800 × 20. Cooling governs. The example is here so you can audit the arithmetic.",
    "This is not a Manual J, and it is not Manual S equipment selection. Manual J counts each surface, window direction, infiltration, people, appliances, and the real duct system. Manual S then limits how far the selected equipment may sit from that load, and the limit is not the same for an air conditioner and a heat pump. Use the result to frame the visit: roughly three tons or roughly five, ducts or ductless, cold-climate or not. Pair it with the CFM calculator if you want airflow, and with the replacement cost calculator if you want a planning range and a way to ask local contractors for quotes.",
  ],
  faqs: [
    {
      question: "Is this the same as a Manual J load calculation?",
      answer:
        "No. Manual J is the ACCA room-by-room procedure that counts surfaces, windows, infiltration, people, and ducts. This page is a floor-area screen with climate and envelope adjustments, useful before that calculation and not a replacement for it.",
    },
    {
      question: "Why is the heating estimate larger than the cooling estimate?",
      answer:
        "In mixed and cold climates the heating screen is often the bigger number, because a heat pump has to hold the house on the design winter morning, not only on a July afternoon. In hot climates the cooling screen usually governs. The page shows both and marks the larger one.",
    },
    {
      question: "Should I round up to the next ton?",
      answer:
        "The suggestion is the nearest common half-ton size at or above the governing screen. Rounding up another full ton without a load calculation causes short cycles and weak dehumidification. If the suggestion is above five tons, treat that as a prompt to improve the envelope or split the system, then confirm with Manual J and Manual S.",
    },
    {
      question: "What should I ask about cold weather capacity?",
      answer:
        "Ask for the manufacturer’s heating capacity at the local winter design temperature, and compare it with the heating BTU on this page. Capacity rated near 47°F will not all be available on a much colder morning. Cold-climate models are built to hold more of their output as the temperature drops.",
    },
    {
      question: "Can I use this for a straight air conditioner?",
      answer:
        "Use the cooling BTU and cooling tons for an air conditioner screen. Ignore the heating result, or treat it as a furnace conversation instead. An air conditioner does not have a heating mode, and the cooling screen is still not a Manual J.",
    },
  ],
};

export const miniSplitGuide: Guide = {
  paragraphs: [
    "A ductless mini-split is sized room by room. Each indoor unit has a nameplate in BTU per hour, and the common catalog steps are 6,000, 9,000, 12,000, 15,000, 18,000, 24,000, 30,000, and 36,000. This calculator estimates a heating screen and a cooling screen for each room with the same climate factors as the whole-house heat pump tool, then picks the smallest standard nameplate that covers the larger of the two. The outdoor unit’s connected capacity is the sum of those nameplates.",
    "The room screen starts from floor area, climate, insulation, ceiling height, and glass. A kitchen gets an extra 4,000 BTU/h on the cooling side only. That adder shows up on many manufacturer worksheets as an allowance for cooking, and it is an allowance, not a measured range. A sunroom is treated as large-glass even if you marked the windows as typical, because the glass is the load. Heating does not get the kitchen adder and does not get the glass penalty. Sun through the glass reduces the heating load; counting it as extra heat loss would oversize the head for winter.",
    "Inverter heads can turn down, which is why a small mismatch is less punishing than it is with a single-stage central system. They cannot turn down to zero. The lowest continuous speed still has to match the room if you care about humidity. When the recommended nameplate is more than about 25 percent above the screen, the result says so. A small bedroom often lands on a 6,000 BTU/h head because that is the smallest common size, even when the screen is well below 6,000. That is a catalog limit, not a sign that the room needs 6,000 BTU/h. Ask the installer for the minimum capacity, not only the nameplate.",
    "For several rooms, add the selected indoor nameplates to see the connected capacity the outdoor unit has to support. This tool does not take a diversity credit. Diversity is the idea that the kitchen and the bedrooms will not all peak at the same hour, so the outdoor unit can be smaller than the sum. Sometimes that is reasonable, and sometimes every room peaks together on the same afternoon. Leaving the credit off keeps the screen conservative. A contractor who applies diversity should show you which rooms they assumed would not coincide.",
    "A room whose screen is above 36,000 BTU/h does not get a fake head size. That is a large open area, and it usually wants two indoor units or a ducted system so the air actually reaches the far side of the room. One oversized head in a corner leaves a stagnant zone. Placement, line-set length, and the outdoor unit’s capacity at the winter design temperature matter as much as the nameplate. Those are site conditions this page cannot see.",
    "Use the result as the agenda for the quote: which rooms, which head size, and whether the outdoor unit is being asked to heat on a cold morning. The whole-house heat pump calculator is the companion if you are comparing a ducted system. The CFM calculator is the companion if you are checking airflow against a sensible load. The replacement cost calculator turns a zone count into a planning range and is where you can request quotes from contractors.",
  ],
  faqs: [
    {
      question: "Why not one large mini-split for the whole house?",
      answer:
        "One head conditions the room it can throw air into. Closed bedrooms and a far living room will not share that air reliably. Multi-zone systems, or a ducted air handler, exist because distribution matters as much as total BTU.",
    },
    {
      question: "What if the recommended size is much larger than the BTU estimate?",
      answer:
        "The tool steps up to the next catalog size that covers the screen. If that jump is large, it is flagged. A modulating unit can run below its nameplate, but its minimum capacity still has to suit the room. For a small bedroom, a 6,000 BTU/h head is often the smallest unit sold, even when the screen is lower.",
    },
    {
      question: "How should the outdoor unit be sized for several rooms?",
      answer:
        "This page sums the indoor nameplates and does not apply a diversity factor. That connected total is the conservative screen. A contractor may select a smaller outdoor unit when the rooms will not peak together, and should say which rooms they left out of the peak.",
    },
    {
      question: "Do mini-splits still need a load calculation?",
      answer:
        "Yes. Room area and a climate factor are a screen. Manual J still counts the actual walls, windows, and infiltration, and Manual S still governs how the equipment is selected against that load. Line-set length and low-ambient capacity are part of that selection.",
    },
    {
      question: "Can I size a garage with this?",
      answer:
        "Not well. A garage is often uninsulated, leaky, and only heated occasionally, and it may be separated from the house for fumes. The factors here are for living space. A garage heater or a dedicated mini-split needs its own look at insulation and use.",
    },
    {
      question: "How many BTU does a mini-split need?",
      answer:
        "Use the room screen on this page, in BTU per hour, and take the smallest standard nameplate at or above it. One ton is 12,000 BTU/h. A screen under 6,000 BTU/h still lands on a 6,000 BTU/h head because that is a common smallest size. Above 36,000 BTU/h, one head is a poor way to cover the room. This is not a Manual J and it does not certify the BTU.",
    },
  ],
};

export const achGuide: Guide = {
  paragraphs: [
    "Air changes per hour is a rate, not a fan model. If a room has a known airflow in cubic feet per minute and a known volume in cubic feet, ACH = (CFM × 60) / volume. The 60 turns minutes into an hour. Reverse it and CFM = (ACH × volume) / 60. Both directions are on this page. A 20 by 15 foot room with an 8 foot ceiling has 2,400 cubic feet. At 200 CFM that room turns over (200 × 60) / 2,400 = 5 ACH. None of that tells you whether the air is outdoor air or air the system is recirculating. You have to know which fan you measured.",
    "Those two meanings get mixed up constantly. Ventilation ACH is outdoor air brought in to dilute odors, moisture, and pollutants. Supply-air turnover is the conditioned air the blower is moving, most of which was already inside the house. A comfortable cooling system often moves several air changes per hour of supply air. Doing the same thing with outdoor air would throw the heating and cooling bill away. If you are checking a supply register, you are in the second category. If you are checking a fresh-air fan or an ERV, you are in the first.",
    "Whole-dwelling outdoor air has a published formula, and this page shows two versions. ANSI/ASHRAE Standard 62.2, from the 2013 edition onward, sets Qtot = 0.03 × floor area + 7.5 × (bedrooms + 1), in CFM. Bedroom count is not taken below one, so a studio is treated as two people. That rate is the total before any blower-door infiltration credit. A fan that runs only part time must be larger while it is on. This tool skips the leakage credit and assumes continuous operation.",
    "Many adoptions of the International Residential Code use a lower floor-area term, 0.01 × area, with the same 7.5 CFM per assumed person. A 2,000 square foot, three-bedroom house is 90 CFM under the ASHRAE equation (0.03 × 2,000 + 7.5 × 4) and 50 CFM under the IRC-style equation (0.01 × 2,000 + 30). The page shows both so you can see the gap. The number that matters is the one in the code edition your state or city actually adopted, including local amendments. Bathroom and kitchen exhaust are separate. A long-standing IRC local-exhaust screen is 50 CFM intermittent or 20 CFM continuous for a bathroom, and 100 CFM intermittent or 25 CFM continuous for a kitchen. Confirm the edition before you buy a fan.",
    "An older rule of thumb said a house should have about 0.35 natural air changes per hour. That figure is not the current 62.2 procedure, and it is a poor substitute for the floor-area-plus-people equation. It is listed here so you can recognize it, not so you can design to it. Supply-air turnover is a different illustration: a house with eight-foot ceilings, 400 CFM per ton, and one ton per 500 square feet moves (400 × 60) / (500 × 8) = 6 ACH of supply air. That example is derived from those assumptions. It is not a target you have to hit in every room.",
    "If you have a measured CFM and want a duct, use the duct size calculator. If you have tons or a sensible BTU load and need CFM, use the CFM calculator, then come back here if you want that airflow expressed as ACH. Neither page replaces a blower-door test. A blower door measures leakage under a set pressure. This formula only converts a flow you already know into air changes.",
  ],
  faqs: [
    {
      question: "Is a higher air-change rate always better?",
      answer:
        "No. More outdoor air improves dilution and raises the heating and cooling load. More supply air can help mixing, but too much airflow is noisy and can hurt dehumidification. Match the rate to the job: ventilation, or conditioning, not a single bigger-is-better number.",
    },
    {
      question: "How is this different from the CFM calculator?",
      answer:
        "This page is the relationship between airflow and room volume. The CFM calculator also estimates airflow from equipment tons and from sensible heat. Use this page when you already have CFM, or when you are checking a ventilation standard. Use the CFM page when you are starting from tons or BTU.",
    },
    {
      question: "Why does the page show two ventilation rates?",
      answer:
        "ASHRAE 62.2 uses 0.03 CFM per square foot plus 7.5 CFM per assumed person. Recent IRC whole-dwelling formulas use 0.01 CFM per square foot with the same people term. They are different published rules. Your local code decides which one applies.",
    },
    {
      question: "Does the old 0.35 ACH rule still apply?",
      answer:
        "It is an older whole-house rule of thumb, not the current ASHRAE 62.2 equation. Houses are tighter than they were when that figure was common. Use the floor-area and bedroom formula, then apply any infiltration credit your code actually allows from a blower-door test.",
    },
    {
      question: "Can I measure air changes with this calculator?",
      answer:
        "You can convert a known CFM into ACH. Getting that CFM takes a flow hood, a calibrated fan, or the equipment’s measured airflow. A blower-door number is infiltration under pressure, which is a different test and is not what this formula computes.",
    },
  ],
};

export const ductGuide: Guide = {
  paragraphs: [
    "Duct size on this page is the round metal diameter that carries a CFM at a friction rate you choose. The relationship is a power-law fit of the ASHRAE friction chart for smooth galvanized duct at standard air: friction loss in inches of water per 100 feet is about 0.109136 × CFM^1.9 / diameter^5.02, with diameter in inches. The calculator solves that fit for diameter, then rounds up to the next common size from 4 inches through 24 inches. Rounding up matters. A diameter that is a fraction short of the chart will spend slightly more static pressure than you budgeted.",
    "Friction rate is not a property of the room. It is how much pressure loss you are willing to spend per 100 feet of equivalent duct length. A common residential starting assumption is 0.08 to 0.10 inches of water per 100 feet, and 0.08 is the default here. The real budget comes from Manual D: available blower static pressure, minus the pressure the coil, filter, registers, and other devices already use, spread over the longest equivalent run. If you do not know that budget, leave 0.08 and treat the diameter as a screen. Changing the friction rate in the form shows you how sensitive the answer is.",
    "Velocity is CFM divided by the inside area of the round duct. Area in square feet is π × (diameter / 24)^2, because the radius in feet is the diameter in inches divided by 24. The page checks that velocity against ranges many residential designers use: about 700 to 900 feet per minute for a supply trunk, 500 to 700 for a supply branch, 500 to 700 for a return trunk, and 400 to 600 for a return branch. Those are comfort and noise ranges, not a code maximum. A velocity under the range is quiet and may be a larger duct than you need. A velocity over the range is the one to fix, usually by stepping up a size or by moving less air on that run.",
    "Rectangular sizes use the Huebner approximation for equivalent round diameter: 1.30 × (width × height)^0.625 / (width + height)^0.25, dimensions in inches. The three options are small sheet-metal pairs whose equivalent diameter is at least the round size already chosen, with the long side no more than four times the short side. Equivalent diameter is a friction comparison. It does not mean a flat 8×20 duct will be as quiet as a round duct of the same equivalent, because the flat shape can be noisier and harder to fit.",
    "Do not read this diameter as a flexible duct size. Flex has a higher pressure drop than smooth metal, and a sagging run is worse than a straight one. The chart fit is for smooth round metal. Keep flex short, pull it tight, support it, and size a long flex run from the manufacturer’s own friction data, which will usually call for a larger diameter than this page shows. A crushed flex section is a restriction no diameter formula will repair.",
    "You need a CFM before this page is useful. The CFM calculator can produce one from tons, from sensible heat, or from an air-change target. The air-changes page is the place to turn a room volume into that target. None of the three is a Manual D design. Manual D lays out every branch, the equivalent length of every fitting, and the available static pressure of the actual blower. Bring this diameter to that design as a check, not as the design.",
  ],
  faqs: [
    {
      question: "Is this a Manual D duct design?",
      answer:
        "No. Manual D starts from the blower’s available static pressure, subtracts the devices, and sizes every run for the room CFM from the load calculation. This page solves one friction-chart equation for one airflow. It is a screen you can audit, not a duct layout.",
    },
    {
      question: "What friction rate should I enter?",
      answer:
        "If you do not have a Manual D friction rate, 0.08 inches of water per 100 feet is a common residential starting assumption. The real rate depends on how much static pressure is left after the coil, filter, and grilles, and on how long the equivalent run is. Move the input and watch the diameter change.",
    },
    {
      question: "Why is the velocity outside the suggested range?",
      answer:
        "Rounding up to a standard diameter lowers velocity. A high velocity means the duct is small for that CFM and will be noisier and use more pressure. Step up a size or reduce the airflow on that run. A low velocity is usually acceptable; it just may be more metal than a tight design would use.",
    },
    {
      question: "Can I order flexible duct at this diameter?",
      answer:
        "Not as a direct substitution. The formula is for smooth round metal. Flexible duct, especially if it sags or takes a tight bend, loses more pressure. Size long flex runs from the duct manufacturer’s friction data and keep the runs short.",
    },
    {
      question: "Should I use round or rectangular duct?",
      answer:
        "Round metal is the shape the friction fit describes, and it is usually quieter for the same airflow. The rectangular options are equivalents when a joist bay or a chase will not take the round size. Stay away from very flat rectangles; the page limits the long side to four times the short side.",
    },
  ],
};

export const cfmGuide: Guide = {
  paragraphs: [
    "CFM is cubic feet per minute, the airflow number ducts, blowers, and ventilation fans are actually selected with. This page offers three standard ways to estimate it. They answer different questions, so the labels stay on the result. Tons tell you a rule-of-thumb equipment airflow. Sensible heat and a temperature difference tell you the airflow that carries a known BTU load. Room volume and a target air-change rate tell you the airflow that produces that rate. None of them measures the fan you already own.",
    "The equipment rule is CFM = tons × CFM per ton, with 400 as the default. The usual published band is about 350 to 450 CFM per ton of cooling. It lines up with a coil temperature drop near 15 to 20°F at typical indoor conditions. Lower airflow runs the coil colder and can pull more moisture, until it is low enough to risk freezing. Higher airflow moves more sensible heat and less latent heat. The input is yours to edit inside that band. A 3-ton system at 400 CFM per ton is 1,200 CFM. That is the blower target people mean when they say “400 a ton,” and it still has to be checked against the manufacturer’s fan table at the external static pressure of the duct system.",
    "The heat equation is BTU/h = 1.08 × CFM × ΔT, solved for CFM. The 1.08 is standard air at sea level: about 0.075 pounds per cubic foot, times about 0.24 BTU per pound per degree, times 60 minutes per hour. ΔT is the temperature difference between the supply air and the room air, not the thermostat setpoint by itself. For cooling, 18°F to 20°F is a common design difference. A heat pump in heating often has a smaller rise, sometimes 15°F to 30°F. A gas furnace rise is larger, often somewhere in the 35°F to 65°F range on the nameplate, and you should use the rise the furnace is designed for rather than a cooling number. If you enter 12,000 BTU/h of sensible load and a 20°F difference, CFM = 12,000 / (1.08 × 20), about 556 CFM.",
    "Sea level is built into the 1.08 factor. Air at elevation is less dense, so the same BTU needs more CFM. In mountain towns the gap is often on the order of 10 to 20 percent. This tool does not apply that correction. Above a few thousand feet, treat the sensible-heat CFM as a low estimate.",
    "The third mode is the air-change formula, CFM = ACH × length × width × height / 60. It matches the air-changes calculator in the other direction. Use a ventilation ACH, such as a number well under 1, only when you mean outdoor air. Use a higher ACH only when you mean supply air being recirculated. Mixing those up is how a fresh-air fan gets specified like a cooling blower. A worked supply-air illustration lives on the air-changes page: eight-foot ceilings, 400 CFM per ton, and one ton per 500 square feet come out to about 6 ACH.",
    "Once you have CFM, the duct calculator can turn it into a round diameter. The heat pump calculator is where tonnage gets its screen. Sensible load changes temperature. Latent load is moisture, and the 1.08 equation ignores it. Feeding total BTU into that equation overstates CFM when part of the load is latent.",
  ],
  faqs: [
    {
      question: "Is 400 CFM per ton a requirement?",
      answer:
        "It is a rule of thumb inside a band of about 350 to 450 CFM per ton, tied to a typical cooling temperature drop. The manufacturer’s fan data at your duct static pressure is the number the blower can actually deliver. Use 400 to start the conversation, then check the fan table.",
    },
    {
      question: "What temperature difference should I enter?",
      answer:
        "Use the supply-to-room difference, not the thermostat setting. Cooling designs are often near 18°F to 20°F. Heat-pump heating rises are often smaller. Gas furnace rises are larger and are printed as an allowable range on the furnace. Stay inside the range the equipment is built for.",
    },
    {
      question: "Where does the 1.08 factor come from?",
      answer:
        "It is 60 minutes per hour times the density of standard air, about 0.075 lb/ft³, times the specific heat of air, about 0.24 BTU/lb·°F. That product is about 1.08. It describes sea-level standard air and sensible heat only.",
    },
    {
      question: "Will more airflow fix a hot room?",
      answer:
        "Only if the room is short on supply air and the duct can carry more without robbing other rooms. More CFM at the blower does not help a closed room with a tiny branch. Size the branch from the room’s CFM, and look for a closed damper, a disconnected run, or a missing return.",
    },
    {
      question: "Does this include humidity?",
      answer:
        "The sensible equation moves temperature, not moisture. Latent load needs the moisture calculation from a full load procedure. If you put total BTU, sensible plus latent, into this equation, the CFM will be higher than the temperature difference alone would justify.",
    },
  ],
};

export const waterHeaterGuide: Guide = {
  paragraphs: [
    "A storage water heater is sized by first hour rating, not by the number painted on the tank. First hour rating is the gallons of hot water the heater can supply in an hour, starting full, including what the burner or element can recover during that hour. A 50-gallon gas heater often has a first hour rating well above 50 because the burner keeps up. A 50-gallon electric heater is often closer to the tank volume because recovery is slower. The EnergyGuide label lists first hour rating for conventional storage heaters. Heat pump water heaters may list it in the product data instead. Shop for that rating, then check the tank volume.",
    "The worksheet is the AHRI peak-hour method that DOE sizing guidance has long used. Count the single busiest hour, not the whole day. Published gallons, assuming no conservation, are 20 for a shower, 20 for a bath, 2 for shaving, 4 for hands and face, 4 for shampoo, 4 for hand dishwashing, 14 for a dishwasher, 5 for food preparation, 26 for a wringer washer, and 32 for an automatic clothes washer. Three showers, one shave, one shampoo, and one hand dishwashing is 60 + 2 + 4 + 4 = 70 gallons. DOE says to look for a first hour rating within about 1 or 2 gallons of that peak.",
    "The low-flow button does not pretend those AHRI numbers changed. It substitutes planning allowances where fixtures actually got more efficient, and it leaves a note on each one. A shower drops from 20 to 10 as a short shower at a 2.0 gpm showerhead. A tub stays at 20. An automatic dishwasher drops from 14 to 6, and an automatic washer from 32 to 14, as allowances for modern machines. You can type any gallon figure yourself. If you do, the total is your worksheet, not AHRI’s. Using the high, no-conservation column is the safer screen for a heater that may stay in the house for more than a decade, which is why the AHRI notes recommend the high end of the range.",
    "Tankless heaters are sized by flow and temperature rise, which is the other half of this page. List the fixtures that will run at the same time and add their gallons per minute. DOE’s own example is a 2.5 gpm shower plus a 0.75 gpm faucet, 3.25 gpm together. Rise is the delivery temperature minus the inlet temperature. Unless you know the inlet, DOE says to assume 50°F, and 120°F is the delivery temperature it cites for most uses. That is a 70°F rise. Groundwater in the northern US is often colder than 50°F in winter, and groundwater in the deep South can be warmer. Edit the inlet. Do not leave 50°F in a climate where the winter main is closer to 40°F.",
    "DOE notes that a 70°F rise is typically available at about 5 gpm on gas demand heaters and about 2 gpm on electric ones. That is an illustration in the federal sizing guide, not a model to buy. Use the manufacturer’s chart at your rise. A flow measured at a mild 35°F rise will not hold when the inlet is cold. Electric tankless units often need a large electrical service, which this page does not size.",
    "A heat pump water heater with a tank is still chosen by first hour rating. The room also has to meet the manufacturer’s volume requirement, and condensate needs a drain. The replacement cost page can send a water-heater quote request. It does not know your utility rate or local code.",
  ],
  faqs: [
    {
      question: "Is first hour rating the same as tank size?",
      answer:
        "No. Tank size is the stored volume. First hour rating is what the heater can deliver in the first hour, including recovery. Gas storage heaters often deliver more than their tank volume in that hour. Electric storage heaters often deliver less extra, because the elements recover more slowly.",
    },
    {
      question: "Which gallon column should I use?",
      answer:
        "The AHRI column assumes no water conservation and matches the published worksheet, including the 70-gallon example. The low-flow column is this site’s planning allowances for efficient fixtures and is labeled as such. Editing a number yourself makes the total your own worksheet. The safer purchase screen is a first hour rating that can cover the higher total.",
    },
    {
      question: "What flow rate does a tankless water heater need?",
      answer:
        "Add the gallons per minute of the fixtures that will run together. A DOE example is 2.5 gpm for a shower plus 0.75 gpm for a faucet. Then compare that flow with the manufacturer’s chart at your temperature rise, not at a milder rise than your winter inlet will require.",
    },
    {
      question: "Should the water heater be set to 140°F?",
      answer:
        "The sizing default here is 120°F delivery, which is the figure DOE cites for most household uses. Higher storage temperatures increase available hot water and scald risk. Dishwashers that heat their own water do not need 140°F from the tank. Follow the manufacturer and local code, and use a mixing valve if storage temperature is raised.",
    },
    {
      question: "Does this size a heat pump water heater?",
      answer:
        "Use the first hour rating for a heat pump water heater with a tank, the same way you would for any storage heater. Also confirm the room volume the manufacturer requires and a place for condensate. This worksheet does not check either one.",
    },
  ],
};

export const costGuide: Guide = {
  paragraphs: [
    "This page builds a planning range. It does not report the average price of an air conditioner, a furnace, a heat pump, or a mini-split, because this site has not run a price survey and will not invent one. Every dollar figure starts as a round band written in the form. You can open the assumptions and change the low and the high before you read the total. The total is the sum of those bands after a few multipliers, which are also written out in the result. If a contractor’s number falls outside the range, the range was the wrong assumption, not a fact the contractor has violated.",
    "Capacity equipment is estimated per ton. The default central-air band is $1,800 to $3,200 per ton, and the default ducted heat pump band is $2,500 to $4,500 per ton, for equipment and a straightforward install with ducts reused. A gas furnace is a flat band rather than a per-ton band: $3,200 to $5,800 for a standard-efficiency furnace and $4,500 to $8,200 for a condensing furnace. A mini-split uses $3,500 to $7,000 for the first indoor unit and outdoor unit, plus $1,800 to $3,500 for each added indoor unit. Those are budgeting figures chosen so the math is easy to audit. Replace them with numbers from a local bid if you have one.",
    "Three multipliers sit on the install subtotal. The efficiency multiplier is 1.00, 1.15, or 1.30 for standard, higher-efficiency, or premium cold-climate equipment. They are not SEER2 ratings. It is applied to air conditioners, heat pumps, and mini-splits. It is not applied to the furnace, because the furnace band you picked is already the efficiency choice. The duct multiplier is 1.00 if the ducts stay, 1.10 for minor repairs, and 1.30 if main trunks are being replaced. That is not a full new duct system. It is not applied to a ductless system. The labor multiplier defaults to 1.00. It is a factor you set because you know your market, not a regional cost index. Leave it alone unless you have a reason.",
    "Permit and electrical work are flat bands added after those multipliers, and only if you check them. The permit default is $150 to $500. The electrical default is $800 to $3,000 for a new circuit or panel work. Unchecked, they add nothing. A long line set, a crane, a condensate pump, a pad, a new flue on a non-condensing swap, asbestos, and drywall are not in the model. Do not subtract IRC §25C. IRS FS-2025-05 does not allow that federal credit for property placed in service after December 31, 2025, including a 2026 installation. State and utility incentives are separate and are not estimated.",
    "Read the lines, not only the span. A 3-ton central air conditioner at the default band, standard efficiency, ducts reused, and labor at 1.00 is 3 × $1,800 to 3 × $3,200, or $5,400 to $9,600, before any permit or electrical box. The width is intentional. Two bids inside a wide band can both be honest. Two bids far apart usually mean the scope is not the same.",
    "The form sends a quote request. It does not reserve a price, and it does not schedule an install. You can attach the planning range as a note so the contractor sees the scope you had in mind. Use the heat pump, mini-split, and water heater calculators to decide that scope first. A useful request says what equipment, what size screen, and what ZIP. A licensed contractor still has to look at the house, the ducts, the electrical service, and the load.",
  ],
  faqs: [
    {
      question: "Are these average installed prices?",
      answer:
        "No. They are planning bands written into the calculator so you can see the arithmetic. They are not a national average, not a price index, and not a quote. Change the low and high figures if you have local numbers.",
    },
    {
      question: "Why is the range so wide?",
      answer:
        "The default bands are already wide, and the efficiency, duct, and labor multipliers stretch them further. Equipment brand, job difficulty, and what is included in “install” move real bids by as much as the band. A wide range is a better budgeting tool than a fake precise average.",
    },
    {
      question: "What costs are left out?",
      answer:
        "Line-set length beyond a simple install, cranes, pads, condensate pumps, flue changes, asbestos, drywall, and incentive paperwork are not line items unless you fold them into a band yourself. Permits and electrical work are included only when those boxes are checked.",
    },
    {
      question: "Does submitting the form lock in a price?",
      answer:
        "No. The form is a request to be contacted about a quote. The range on the page is not an offer. Any price comes from a contractor after they see the house and the scope.",
    },
    {
      question: "Who will contact me?",
      answer:
        "You are agreeing that this site and heating, cooling, and plumbing contractors it works with may call, text, or email you about the request. The request is stored for the operator and, if a lead webhook is configured, forwarded there. Consent is not required to use the calculators.",
    },
    {
      question: "What is the cost of AC replacement on this page?",
      answer:
        "For a central air conditioner only, the default planning band is $1,800 to $3,200 per ton before the efficiency, duct, and labor multipliers. A 3-ton unit at those defaults and a labor multiplier of 1.00 is $5,400 to $9,600. That span is the same in every ZIP. It is not the cost of AC replacement in your town. Replace the band if you have a bid.",
    },
    {
      question: "Does this find AC replacement near me?",
      answer:
        "No. There is no map, no contractor list, and no ZIP-based price. The quote form collects a ZIP so a request can be forwarded to contractors the operator works with. Sending it does not mean someone serves that ZIP, and it does not change the planning range.",
    },
  ],
};

export const guides = {
  "heat-pump-size-calculator": heatPumpGuide,
  "mini-split-size-calculator": miniSplitGuide,
  "air-changes-per-hour-calculator": achGuide,
  "duct-size-calculator": ductGuide,
  "cfm-calculator": cfmGuide,
  "water-heater-size-calculator": waterHeaterGuide,
  "hvac-replacement-cost-calculator": costGuide,
} as const;
