import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

interface PlantIdentifyResult {
  identified: boolean;
  name_common: string;
  name_scientific: string;
  confidence: number;
  safety_status: "Safe" | "Caution" | "Toxic";
  uses: string[];
  warnings: string[];
  traditional_uses: string[];
  local_names: Record<string, string>;
  description: string;
}

router.post("/plant-identify", async (req, res) => {
  const { image_base64 } = req.body as { image_base64?: string };

  if (!image_base64) {
    res.status(400).json({ error: "image_base64 is required" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are an expert botanist specializing in African plants and traditional plant medicine. 
Analyze plant images and return structured JSON data.
Always return valid JSON with no markdown formatting.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image_base64}`,
                detail: "low",
              },
            },
            {
              type: "text",
              text: `Identify this plant and return ONLY a JSON object with exactly these fields:
{
  "identified": true or false (whether you can identify a plant in the image),
  "name_common": "Common name of the plant",
  "name_scientific": "Scientific name",
  "confidence": 0.0 to 1.0 (your confidence level),
  "safety_status": "Safe" or "Caution" or "Toxic",
  "uses": ["use 1", "use 2", "use 3", "use 4"],
  "warnings": ["warning 1", "warning 2"],
  "traditional_uses": ["traditional use 1 with African context", "traditional use 2"],
  "local_names": {"Language": "Name"},
  "description": "Brief 1-2 sentence description"
}
If no plant is visible or you cannot identify it, set identified to false and use "Unknown Plant" for names.
Focus on African plant knowledge when providing traditional uses and local names.`,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";

    let result: PlantIdentifyResult;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        identified: false,
        name_common: "Unknown Plant",
        name_scientific: "Unknown",
        confidence: 0,
        safety_status: "Caution",
        uses: ["Consult a botanist for proper identification"],
        warnings: ["Do not consume unidentified plants"],
        traditional_uses: ["Traditional knowledge requires proper plant identification"],
        local_names: {},
        description: "Could not identify this plant. Please consult an expert.",
      };
    }

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Plant identification failed");
    res.status(500).json({ error: "Plant identification failed. Please try again." });
  }
});

export default router;
