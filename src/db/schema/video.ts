import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './auth'
import { projects } from './project'

export const videoStatusEnum = pgEnum('videoStatus', ['PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUIRED'])

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: videoStatusEnum('videoStatus'),
  seenByAdmin: boolean('seenByAdmin').default(false),
  url: text('url').notNull(),
  uploadedById: text('uploadedBy')
    .notNull()
    .references(() => users.id),
  projectId: integer('projectId')
    .notNull()
    .references(() => projects.id),
  uploadedAt: timestamp('uploadedAt', { mode: 'date' }).defaultNow(),
})

/** Defining video relations */
export const usersRelations = relations(users, ({ many }) => ({
  videos: many(videos),
}))

export const videoRelations = relations(videos, ({ one }) => ({
  uploadedById: one(users, {
    fields: [videos.uploadedById],
    references: [users.id],
  }),
  projectId: one(projects, {
    fields: [videos.projectId],
    references: [projects.id],
  }),
}))
