import { type Project, type InsertProject, type UserFile, type InsertUserFile, type AgentLog, type InsertAgentLog } from "@shared/schema";
import { db } from "./db";
import { projects, userFiles, agentLogs } from "@shared/schema";
import { eq, desc, and, isNull, or } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectsByUser(userId: string | null): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // User Files
  getUserFiles(userId: string): Promise<UserFile[]>;
  getUserFile(id: number): Promise<UserFile | undefined>;
  createUserFile(file: InsertUserFile): Promise<UserFile>;
  deleteUserFile(id: number): Promise<boolean>;
  
  // Agent Logs
  getAgentLogs(limit?: number): Promise<AgentLog[]>;
  createAgentLog(log: InsertAgentLog): Promise<AgentLog>;
}

export class DbStorage implements IStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.updatedAt));
  }

  async getProjectsByUser(userId: string | null): Promise<Project[]> {
    if (!userId) {
      return await db.select().from(projects).where(isNull(projects.userId)).orderBy(desc(projects.updatedAt));
    }
    return await db.select().from(projects).where(
      or(eq(projects.userId, userId), isNull(projects.userId))
    ).orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // User Files
  async getUserFiles(userId: string): Promise<UserFile[]> {
    return await db.select().from(userFiles).where(eq(userFiles.userId, userId)).orderBy(desc(userFiles.createdAt));
  }

  async getUserFile(id: number): Promise<UserFile | undefined> {
    const [file] = await db.select().from(userFiles).where(eq(userFiles.id, id));
    return file;
  }

  async createUserFile(file: InsertUserFile): Promise<UserFile> {
    const [newFile] = await db.insert(userFiles).values(file).returning();
    return newFile;
  }

  async deleteUserFile(id: number): Promise<boolean> {
    const result = await db.delete(userFiles).where(eq(userFiles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Agent Logs
  async getAgentLogs(limit: number = 50): Promise<AgentLog[]> {
    return await db.select().from(agentLogs).orderBy(desc(agentLogs.createdAt)).limit(limit);
  }

  async createAgentLog(log: InsertAgentLog): Promise<AgentLog> {
    const [newLog] = await db.insert(agentLogs).values(log).returning();
    return newLog;
  }
}

export const storage = new DbStorage();
