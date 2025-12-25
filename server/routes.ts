import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth";
import { registerAgentRoutes } from "./agentRoutes";
import { registerFileRoutes } from "./fileRoutes";
import { apiRateLimiter, agentRateLimiter, uploadRateLimiter } from "./middleware/rateLimit";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Apply rate limiting to specific routes BEFORE the general API limiter
  // Order matters - specific limiters first, then general
  app.use("/api/files/upload", uploadRateLimiter);
  app.use("/api/agent", agentRateLimiter);
  // General API limiter for all other routes
  app.use("/api/projects", apiRateLimiter);
  app.use("/api/files", apiRateLimiter);
  
  // Register AI agent routes
  registerAgentRoutes(app);
  
  // Register file management routes
  registerFileRoutes(app);
  
  // Get all projects for current user
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const projects = await storage.getProjectsByUser(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project (only if owned by user)
  app.get("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const userId = req.user?.claims?.sub;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Strict ownership check - projects without userId or with different userId are blocked
      if (project.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create project for current user
  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validated = insertProjectSchema.parse({
        ...req.body,
        userId,
      });
      const project = await storage.createProject(validated);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update project (only if owned by user)
  app.patch("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const userId = req.user?.claims?.sub;
      const existingProject = await storage.getProject(id);
      
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Strict ownership check - projects without userId or with different userId are blocked
      if (existingProject.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const validated = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validated);

      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete project (only if owned by user)
  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const userId = req.user?.claims?.sub;
      const existingProject = await storage.getProject(id);
      
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Strict ownership check - projects without userId or with different userId are blocked
      if (existingProject.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  return httpServer;
}
