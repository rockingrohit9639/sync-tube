import { boolean, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './auth'

export const projectStatusEnum = pgEnum('projectStatus', ['ONGOING', 'DONE'])

export const projects = pgTable('projects', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  admin: text('admin')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  deadline: timestamp('deadline', { mode: 'date' }),
  isArchive: boolean('isArchive').default(false),
  archivedOn: timestamp('archivedOn', { mode: 'date' }),
  status: projectStatusEnum('projectStatus'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
})

/** Defining many-to-many relation between project and members */
export const projectRelations = relations(projects, ({ many }) => ({
  projectsToMembers: many(projectsToMembers),
}))

export const usersRelations = relations(users, ({ many }) => ({
  projectsToMembers: many(projectsToMembers),
}))

export const projectsToMembers = pgTable(
  'projects_to_members',
  {
    projectId: text('projectId')
      .notNull()
      .references(() => projects.id),
    memberId: text('memberId')
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    pk: primaryKey(table.projectId, table.memberId),
  }),
)

export const projectsToMembersRelations = relations(projectsToMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectsToMembers.projectId],
    references: [projects.id],
  }),
  member: one(users, {
    fields: [projectsToMembers.memberId],
    references: [users.id],
  }),
}))
