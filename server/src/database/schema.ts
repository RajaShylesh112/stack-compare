import { pgTable, serial, text, varchar, timestamp, integer, pgEnum, boolean, date, unique } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin', 'premium']);
export const learningCurveEnum = pgEnum('learning_curve', ['beginner', 'intermediate', 'advanced']);
export const communitySizeEnum = pgEnum('community_size', ['small', 'medium', 'large']);
export const jobMarketDemandEnum = pgEnum('job_market_demand', ['low', 'medium', 'high']);
export const experienceLevelEnum = pgEnum('experience_level', ['beginner', 'intermediate', 'advanced', 'expert']);


export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').default('user'),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const technologyStacks = pgTable('technology_stacks', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    officialWebsite: varchar('official_website', { length: 255 }),
    githubUrl: varchar('github_url', { length: 255 }),
    license: varchar('license', { length: 100 }),
    firstReleaseDate: date('first_release_date'),
    latestVersion: varchar('latest_version', { length: 50 }),
    popularityScore: integer('popularity_score').default(0),
    learningCurve: learningCurveEnum('learning_curve'),
    communitySize: communitySizeEnum('community_size'),
    jobMarketDemand: jobMarketDemandEnum('job_market_demand'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const userStacks = pgTable('user_stacks', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    stackId: uuid('stack_id').notNull().references(() => technologyStacks.id, { onDelete: 'cascade' }),
    experienceLevel: experienceLevelEnum('experience_level'),
    yearsOfExperience: integer('years_of_experience').default(0),
    isFavorite: boolean('is_favorite').default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      unq: unique().on(table.userId, table.stackId),
    };
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  sourceUrl: text('source_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectStacks = pgTable('project_stacks', {
  projectId: integer('project_id').notNull().references(() => projects.id),
  technologyId: uuid('technology_id').notNull().references(() => technologyStacks.id),
});

// Alias for backward compatibility
export const technologies = technologyStacks;
