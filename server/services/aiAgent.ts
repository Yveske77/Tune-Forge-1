import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface QACheckResult {
  passed: boolean;
  category: string;
  description: string;
  suggestions: string[];
}

export interface ImprovementSuggestion {
  area: string;
  currentState: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
  implementationHint: string;
}

export async function runUIFunctionalityCheck(context: {
  features: string[];
  userActions: string[];
}): Promise<QACheckResult[]> {
  const systemPrompt = `You are an AI QA assistant for DAiW (Digital AI Workstation), a musical intention engine for AI music generation.

Your task is to analyze the application's features and user actions to identify potential issues and improvements.

The app has these key features:
- Visual sequencer with timeline-based arrangement
- Instrument rack for global context (tempo, key, genres)
- Prompt preview and compilation for AI music platforms
- Project save/load functionality
- User authentication and data isolation

Respond with a JSON array of QA check results.`;

  const userPrompt = `Analyze these features and user actions for potential issues:

Features: ${JSON.stringify(context.features)}
User Actions: ${JSON.stringify(context.userActions)}

For each area, provide:
1. Whether it passes QA (true/false)
2. The category (UI, Functionality, Performance, Security, UX)
3. A description of the check
4. Suggestions for improvement (array of strings)

Return as JSON array with format:
[{"passed": boolean, "category": string, "description": string, "suggestions": []}]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed.results) ? parsed.results : Array.isArray(parsed) ? parsed : [];
    } catch {
      console.error("Failed to parse QA check response:", content);
      return [];
    }
  } catch (error) {
    console.error("Error running UI functionality check:", error);
    return [];
  }
}

export async function searchBestPractices(topic: string): Promise<ImprovementSuggestion[]> {
  const systemPrompt = `You are an AI improvement agent for DAiW (Digital AI Workstation), a musical intention engine.

Your task is to suggest best practices and improvements based on current software development standards, UX patterns, and music production workflows.

Focus areas:
- UI/UX patterns for creative tools
- Music production software best practices
- AI prompt engineering optimization
- Accessibility and performance
- Security and data protection

Provide actionable, specific suggestions that can be implemented.`;

  const userPrompt = `Research and suggest improvements for: "${topic}"

For DAiW's context as a musical AI prompt crafting tool, provide:
1. Area of improvement
2. Current state assessment
3. Specific suggestion
4. Priority (high/medium/low)
5. Implementation hint

Return as JSON with format:
{"suggestions": [{"area": string, "currentState": string, "suggestion": string, "priority": "high"|"medium"|"low", "implementationHint": string}]}`;

  try {
    console.log("Calling OpenAI for best practices on topic:", topic);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    console.log("OpenAI response for best practices:", content);
    try {
      const parsed = JSON.parse(content);
      const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
      console.log("Parsed suggestions count:", suggestions.length);
      return suggestions;
    } catch {
      console.error("Failed to parse best practices response:", content);
      return [];
    }
  } catch (error) {
    console.error("Error searching best practices:", error);
    return [];
  }
}

export interface CreativeSuggestion {
  category: 'instruments' | 'effects' | 'structure' | 'mood' | 'production';
  suggestion: string;
  reason: string;
  example: string;
}

export async function getCreativeSuggestions(prompt: string, context: { genres: string[]; tempo: number; key: string }): Promise<CreativeSuggestion[]> {
  const systemPrompt = `You are a creative AI music producer assistant. Analyze the given prompt and suggest creative enhancements that would make the music more interesting, unique, or emotionally impactful.

Focus on:
- Unique instrument combinations
- Textural effects and production techniques
- Structural innovations
- Mood enhancements
- Genre-blending opportunities

Be specific and actionable with suggestions.`;

  const userPrompt = `Analyze this AI music generation prompt and suggest creative improvements:

Prompt: "${prompt}"

Context:
- Genres: ${context.genres.join(', ')}
- Tempo: ${context.tempo} BPM
- Key: ${context.key}

Return JSON with format:
{"suggestions": [
  {"category": "instruments"|"effects"|"structure"|"mood"|"production", 
   "suggestion": "specific suggestion",
   "reason": "why this would improve the track",
   "example": "brief example of how to implement"}
]}

Provide 4-6 creative suggestions.`;

  try {
    console.log("Getting creative suggestions for prompt");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    } catch {
      console.error("Failed to parse creative suggestions:", content);
      return [];
    }
  } catch (error) {
    console.error("Error getting creative suggestions:", error);
    return [];
  }
}

export async function analyzePromptQuality(prompt: string): Promise<{
  score: number;
  feedback: string[];
  optimizedPrompt: string;
}> {
  const systemPrompt = `You are an AI music prompt quality analyzer. Analyze prompts intended for AI music generation platforms like Suno and Udio.

Evaluate:
- Clarity and specificity
- Musical terminology accuracy
- Structure and organization
- Genre/style consistency
- Technical parameters (tempo, key, instruments)

Provide a quality score (0-100) and specific feedback.`;

  const userPrompt = `Analyze this AI music generation prompt:

"${prompt}"

Return JSON with:
{
  "score": number (0-100),
  "feedback": ["string array of specific feedback points"],
  "optimizedPrompt": "an improved version of the prompt"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(content);
      return {
        score: typeof parsed.score === "number" ? parsed.score : 0,
        feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
        optimizedPrompt: typeof parsed.optimizedPrompt === "string" ? parsed.optimizedPrompt : prompt,
      };
    } catch {
      console.error("Failed to parse prompt analysis response:", content);
      return { score: 0, feedback: ["Analysis failed"], optimizedPrompt: prompt };
    }
  } catch (error) {
    console.error("Error analyzing prompt quality:", error);
    return { score: 0, feedback: ["Analysis failed"], optimizedPrompt: prompt };
  }
}

export async function runFullAssessment(userId: string): Promise<void> {
  const features = [
    "Timeline/Tube view for arrangement",
    "Instrument rack for global settings",
    "Prompt preview and compilation",
    "Project save/load",
    "User authentication",
    "Lane-based automation",
    "Multi-variant support (A/B arrangements)",
  ];

  const userActions = [
    "Add section to timeline",
    "Modify tempo and key",
    "Select genres and tags",
    "Copy prompt to clipboard",
    "Save project",
    "Load project",
    "Switch arrangement variants",
  ];

  console.log("Running full QA assessment...");
  const qaResults = await runUIFunctionalityCheck({ features, userActions });

  console.log("Searching for best practices...");
  const improvements = await searchBestPractices("music production software UI and AI prompt crafting");

  await storage.createAgentLog({
    userId,
    runType: "full_assessment",
    status: "completed",
    summary: `QA: ${qaResults.filter((r) => r.passed).length}/${qaResults.length} passed. Found ${improvements.length} improvement suggestions.`,
    details: { qaResults },
    suggestions: improvements,
  });

  console.log("Assessment complete and logged.");
}

export async function runScheduledCheck(userId: string): Promise<void> {
  const topics = [
    "prompt output optimization for AI music generation",
    "UI patterns for creative timeline-based tools",
    "user data security best practices",
    "accessibility in music production software",
  ];

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const suggestions = await searchBestPractices(randomTopic);

  await storage.createAgentLog({
    userId,
    runType: "scheduled_improvement_search",
    status: "completed",
    summary: `Searched for improvements on: ${randomTopic}`,
    details: { topic: randomTopic },
    suggestions,
  });
}
