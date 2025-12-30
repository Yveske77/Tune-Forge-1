import type { Express } from "express";
import { storage } from "./storage";
import {
  runUIFunctionalityCheck,
  searchBestPractices,
  analyzePromptQuality,
  runFullAssessment,
} from "./services/aiAgent";

// Bypass auth middleware - inject test user for development
const bypassAuth = (req: any, res: any, next: any) => {
  req.user = { claims: { sub: "test-user-123" } };
  next();
};

export function registerAgentRoutes(app: Express): void {
  // Get agent logs for current user
  app.get("/api/agent/logs", bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getAgentLogsByUser(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching agent logs:", error);
      res.status(500).json({ error: "Failed to fetch agent logs" });
    }
  });

  // Run QA check
  app.post("/api/agent/qa-check", bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { features, userActions } = req.body;
      const results = await runUIFunctionalityCheck({
        features: features || [],
        userActions: userActions || [],
      });

      await storage.createAgentLog({
        userId,
        runType: "manual_qa_check",
        status: "completed",
        summary: `QA check: ${results.filter((r) => r.passed).length}/${results.length} passed`,
        details: { results },
        suggestions: null,
      });

      res.json({ results });
    } catch (error) {
      console.error("Error running QA check:", error);
      res.status(500).json({ error: "Failed to run QA check" });
    }
  });

  // Search for best practices
  app.post("/api/agent/search-improvements", bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { topic } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const suggestions = await searchBestPractices(topic);

      await storage.createAgentLog({
        userId,
        runType: "improvement_search",
        status: "completed",
        summary: `Found ${suggestions.length} suggestions for: ${topic}`,
        details: { topic },
        suggestions,
      });

      res.json({ suggestions });
    } catch (error) {
      console.error("Error searching improvements:", error);
      res.status(500).json({ error: "Failed to search improvements" });
    }
  });

  // Analyze prompt quality
  app.post("/api/agent/analyze-prompt", bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const analysis = await analyzePromptQuality(prompt);

      await storage.createAgentLog({
        userId,
        runType: "prompt_analysis",
        status: "completed",
        summary: `Prompt score: ${analysis.score}/100`,
        details: { originalPrompt: prompt, ...analysis },
        suggestions: null,
      });

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing prompt:", error);
      res.status(500).json({ error: "Failed to analyze prompt" });
    }
  });

  // Run full assessment
  app.post("/api/agent/full-assessment", bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      res.json({ message: "Assessment started", status: "running" });
      runFullAssessment(userId).catch(console.error);
    } catch (error) {
      console.error("Error starting assessment:", error);
      res.status(500).json({ error: "Failed to start assessment" });
    }
  });
}
