import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Department model
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  requirements: json("requirements").notNull().$type<string[]>(),
  responsibilities: json("responsibilities").notNull().$type<string[]>(),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

// Applicant model
export const applicants = pgTable("applicants", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  departmentId: integer("department_id").notNull(),
  experience: text("experience").notNull(),
  skills: text("skills").notNull(),
  coverLetter: text("cover_letter"),
  resumePath: text("resume_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApplicantSchema = createInsertSchema(applicants).omit({
  id: true,
  createdAt: true,
});

// About Us content
export const aboutUs = pgTable("about_us", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAboutUsSchema = createInsertSchema(aboutUs).omit({
  id: true,
  updatedAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Applicant = typeof applicants.$inferSelect;
export type InsertApplicant = z.infer<typeof insertApplicantSchema>;

export type AboutUs = typeof aboutUs.$inferSelect;
export type InsertAboutUs = z.infer<typeof insertAboutUsSchema>;
