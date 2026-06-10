import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

interface PlantHealthResult {
  problem_identified: boolean;
  plant_name: string;
  condition_name: string;
  severity: "Mild" | "Moderate" | "Severe";
  description: string;
  symptoms: string[];
  natural_treatments: string[];
  prevention_tips: string[];
  urgency: string;
}

router.post("/plant-health", async (req, res) => {
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
          content: `You are an expert plant pathologist and agricultural advisor specialising in African plant health, crop diseases, nutrient deficiencies, pest damage, and natural organic treatment methods.
Analyse plant health issues from images and return structured JSON data.
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
              text: `Analyse this plant image for health problems and return ONLY a JSON object with exactly these fields:
{
  "problem_identified": true or false (whether a plant health problem is visible),
  "plant_name": "Common name of the plant species if identifiable, otherwise 'Unknown Plant'",
  "condition_name": "Name of the disease, deficiency, pest damage, or health condition observed",
  "severity": "Mild" or "Moderate" or "Severe",
  "description": "1-2 sentence description of what is affecting the plant and why it matters",
  "symptoms": ["visible symptom 1", "visible symptom 2", "visible symptom 3"],
  "natural_treatments": ["natural/organic treatment 1", "natural/organic treatment 2", "natural/organic treatment 3", "natural/organic treatment 4"],
  "prevention_tips": ["prevention tip 1", "prevention tip 2", "prevention tip 3"],
  "urgency": "A short phrase about how urgently action is needed, e.g. 'Act within 24-48 hours' or 'Monitor over next 2 weeks' or 'Immediate action required'"
}
If no plant health problem is visible, if no plant is in the image, or if the image is too unclear, set problem_identified to false and use "No Problem Detected" for condition_name and "Mild" for severity.
Focus on natural and organic treatment methods suitable for African growing conditions. Avoid recommending synthetic pesticides.`,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";

    let result: PlantHealthResult;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        problem_identified: false,
        plant_name: "Unknown Plant",
        condition_name: "Unable to Analyse",
        severity: "Mild",
        description: "Could not analyse the plant health from this image. Please try a clearer photo showing the affected area in good lighting.",
        symptoms: ["Image quality insufficient for analysis"],
        natural_treatments: [
          "Take a clearer photo in good natural lighting",
          "Focus on the affected leaves, stems or roots",
          "Ensure the problem area fills most of the frame",
        ],
        prevention_tips: ["Good lighting and focus produce the most accurate results"],
        urgency: "Retake photo for accurate analysis",
      };
    }

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Plant health analysis failed");
    res.status(500).json({ error: "Plant health analysis failed. Please try again." });
  }
});

export default router;
