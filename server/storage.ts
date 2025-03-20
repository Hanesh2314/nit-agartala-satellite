import { 
  users, 
  departments, 
  applicants, 
  aboutUs,
  type User, 
  type InsertUser,
  type Department,
  type InsertDepartment,
  type Applicant,
  type InsertApplicant,
  type AboutUs,
  type InsertAboutUs
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Department methods
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Applicant methods
  getApplicants(): Promise<Applicant[]>;
  getApplicant(id: number): Promise<Applicant | undefined>;
  createApplicant(applicant: InsertApplicant, resumeFile?: Express.Multer.File): Promise<Applicant>;
  deleteApplicant(id: number): Promise<boolean>;
  
  // About Us methods
  getAboutUs(): Promise<AboutUs | undefined>;
  updateAboutUs(content: string): Promise<AboutUs>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  // Applicant methods
  async getApplicants(): Promise<Applicant[]> {
    return await db.select().from(applicants);
  }

  async getApplicant(id: number): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.id, id));
    return applicant;
  }

  async createApplicant(applicant: InsertApplicant, resumeFile?: Express.Multer.File): Promise<Applicant> {
    let resumePath = null;
    
    if (resumeFile) {
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${resumeFile.originalname}`;
      resumePath = path.join("uploads", filename);
      
      // Save file
      const filePath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(filePath, resumeFile.buffer);
    }
    
    const [newApplicant] = await db.insert(applicants)
      .values({
        ...applicant,
        resumePath: resumePath
      })
      .returning();
    
    return newApplicant;
  }

  async deleteApplicant(id: number): Promise<boolean> {
    // First get the applicant to check for resume file
    const applicant = await this.getApplicant(id);
    if (!applicant) return false;
    
    // Delete resume file if exists
    if (applicant.resumePath) {
      const filePath = path.join(__dirname, "..", applicant.resumePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Delete from database
    const result = await db.delete(applicants).where(eq(applicants.id, id)).returning();
    return result.length > 0;
  }

  // About Us methods
  async getAboutUs(): Promise<AboutUs | undefined> {
    const [aboutUsContent] = await db.select().from(aboutUs);
    return aboutUsContent;
  }

  async updateAboutUs(content: string): Promise<AboutUs> {
    // Check if an about us entry exists
    const exists = await this.getAboutUs();
    
    if (exists) {
      // Update existing entry
      const [updated] = await db
        .update(aboutUs)
        .set({ content, updatedAt: new Date() })
        .where(eq(aboutUs.id, exists.id))
        .returning();
      return updated;
    } else {
      // Create new entry
      const [newAboutUs] = await db
        .insert(aboutUs)
        .values({ content })
        .returning();
      return newAboutUs;
    }
  }
}

// Initialize storage with database implementation
export const storage = new DatabaseStorage();
