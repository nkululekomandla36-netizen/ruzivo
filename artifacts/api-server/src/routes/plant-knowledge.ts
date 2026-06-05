import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

interface PlantKnowledgeRequest {
  name_common: string;
  name_scientific: string;
  safety_status?: string;
}

interface PlantKnowledge {
  overview: string;
  traditional_knowledge: string[];
  medicinal_cultural_uses: string[];
  safety_information: string[];
  habitat_ecology: string[];
  conservation_notes: string[];
  nutritional_profile: string[];
  active_compounds: string[];
  health_benefits: string[];
}

router.post("/plant-knowledge", async (req, res) => {
  const { name_common, name_scientific, safety_status } =
    req.body as PlantKnowledgeRequest;

  if (!name_common || !name_scientific) {
    res.status(400).json({ error: "name_common and name_scientific are required" });
    return;
  }

  const prompt = `You are an expert in African ethnobotany, plant biochemistry, and traditional plant knowledge systems.

Provide detailed educational information about: ${name_common} (${name_scientific})${safety_status ? `, safety status: ${safety_status}` : ""}.

Focus specifically on:
- Southern African indigenous knowledge
- Traditional uses by African communities
- Cultural and historical significance
- Ecological role and habitat
- Conservation status where known
- Nutritional composition (vitamins, minerals, fiber, protein where applicable)
- Phytochemical profile (active plant compounds)
- Potential health associations supported by traditional use or research

Language guidelines (strictly follow these):
- Use "Traditionally used for..." not "treats" or "cures"
- Use "Historically associated with..." for historical context
- Use "Often used by communities for..." for community practices
- Use "Reported traditional uses include..." for documented traditional medicine
- Use "Contains compounds associated with..." for health benefit statements
- Use "Research suggests..." when citing scientific evidence
- Never state a plant cures or treats diseases
- Keep a respectful, educational tone

Return ONLY a JSON object with exactly these fields (no markdown, no extra text):
{
  "overview": "A rich 2-3 sentence overview of this plant's cultural and ecological significance in Africa",
  "traditional_knowledge": ["3-5 bullet points about indigenous knowledge systems and traditional use traditions"],
  "medicinal_cultural_uses": ["4-6 bullet points about traditional medicinal and cultural applications, using appropriate language"],
  "safety_information": ["2-4 bullet points about safe preparation, dosage considerations, and contraindications"],
  "habitat_ecology": ["2-3 bullet points about where it grows, its ecosystem role, and associated species in Africa"],
  "conservation_notes": ["1-3 bullet points about conservation status, threats, or sustainable harvesting"],
  "nutritional_profile": ["3-5 bullet points covering vitamins, minerals, fiber, and protein content where documented — start each with the nutrient category e.g. 'Vitamins: A, C, E...'"],
  "active_compounds": ["4-6 bullet points naming specific phytochemicals present — flavonoids, alkaloids, tannins, saponins, polyphenols, terpenoids as applicable — include the compound name and its plant role"],
  "health_benefits": ["3-5 educational bullet points on potential health associations using 'contains compounds associated with...', 'traditionally used for...', or 'research suggests...' — no disease cure or treatment claims"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const text = response.text ?? "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let knowledge: PlantKnowledge;
    try {
      knowledge = JSON.parse(cleaned);
    } catch {
      knowledge = {
        overview: `${name_common} (${name_scientific}) is a plant with traditional significance in African communities.`,
        traditional_knowledge: ["Traditional knowledge about this plant is documented across various African cultures."],
        medicinal_cultural_uses: ["Traditionally used in various ways by African communities."],
        safety_information: ["Always consult a qualified practitioner before use."],
        habitat_ecology: ["Found across various African ecosystems."],
        conservation_notes: ["Sustainable harvesting practices are encouraged."],
        nutritional_profile: ["Nutritional data is being compiled for this plant."],
        active_compounds: ["Phytochemical analysis is being compiled for this plant."],
        health_benefits: ["Traditional communities have historically valued this plant for general wellbeing."],
      };
    }

    res.json(knowledge);
  } catch (err) {
    req.log.error({ err }, "Plant knowledge enrichment failed");
    res.status(500).json({ error: "Knowledge enrichment unavailable." });
  }
});

export default router;
