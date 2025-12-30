import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Bypass auth middleware - inject test user for development
const bypassAuth = (req: any, res: any, next: any) => {
  req.user = { claims: { sub: "test-user-123" } };
  next();
};

const UPLOAD_DIR = "./uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp3",
  "application/json",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export function registerFileRoutes(app: Express): void {
  // Get user's files
  app.get("/api/files", bypassAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const files = await storage.getUserFiles(userId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  // Upload file
  app.post("/api/files/upload", bypassAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const contentType = req.headers["content-type"] || "";
      const contentLength = parseInt(req.headers["content-length"] || "0", 10);

      if (contentLength > MAX_FILE_SIZE) {
        return res.status(413).json({ error: "File too large. Maximum size is 10MB." });
      }

      // Get filename from header or query
      const originalName = (req.headers["x-filename"] as string) || (req.query.filename as string) || "unnamed";
      const mimeType = (req.headers["x-content-type"] as string) || contentType.split(";")[0];

      if (!ALLOWED_TYPES.includes(mimeType)) {
        return res.status(400).json({ error: "File type not allowed" });
      }

      // Generate unique filename
      const ext = path.extname(originalName) || ".bin";
      const filename = `${randomUUID()}${ext}`;
      const userDir = path.join(UPLOAD_DIR, userId);
      
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      const filePath = path.join(userDir, filename);

      // Stream the raw body to file
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", async () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(filePath, buffer);

        const file = await storage.createUserFile({
          userId,
          filename,
          originalName,
          mimeType,
          size: buffer.length,
          path: filePath,
          projectId: req.query.projectId ? parseInt(req.query.projectId as string, 10) : null,
        });

        res.status(201).json(file);
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Download file
  app.get("/api/files/:id/download", bypassAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const fileId = parseInt(req.params.id, 10);

      if (isNaN(fileId)) {
        return res.status(400).json({ error: "Invalid file ID" });
      }

      const file = await storage.getUserFile(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      if (file.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(file.path)) {
        return res.status(404).json({ error: "File not found on disk" });
      }

      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
      res.setHeader("Content-Length", file.size.toString());
      
      const stream = fs.createReadStream(file.path);
      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // Delete file
  app.delete("/api/files/:id", bypassAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const fileId = parseInt(req.params.id, 10);

      if (isNaN(fileId)) {
        return res.status(400).json({ error: "Invalid file ID" });
      }

      const file = await storage.getUserFile(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      if (file.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Delete from disk
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // Delete from database
      await storage.deleteUserFile(fileId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });
}
