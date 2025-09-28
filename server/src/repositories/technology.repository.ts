// src/repositories/technology.repository.ts
import { db } from '../database/connection';
import { technologyStacks } from '../database/schema';
import { eq } from 'drizzle-orm';
import { IBaseRepository } from './base.repository';

// The Technology type is inferred from the Drizzle schema
export type Technology = typeof technologyStacks.$inferSelect;
export type NewTechnology = typeof technologyStacks.$inferInsert;

class TechnologyRepository implements IBaseRepository<Technology> {
  async findAll(): Promise<Technology[]> {
    return await db.select().from(technologyStacks);
  }

  async findById(id: string): Promise<Technology | null> {
    const result = await db.select().from(technologyStacks).where(eq(technologyStacks.id, id));
    return result[0] || null;
  }

  async create(data: NewTechnology): Promise<Technology> {
    const result = await db.insert(technologyStacks).values(data).returning();
    return result[0];
  }

  async update(id: string, data: Partial<NewTechnology>): Promise<Technology | null> {
    const result = await db.update(technologyStacks)
      .set(data)
      .where(eq(technologyStacks.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(technologyStacks).where(eq(technologyStacks.id, id)).returning({ id: technologyStacks.id });
    return result.length > 0;
  }
}

export const technologyRepository = new TechnologyRepository();
