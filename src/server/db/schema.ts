import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `koon.us_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  phone: varchar("phone").notNull(),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const colleges = createTable(
    "college",
    {
        id: varchar("id", { length: 255 })
            .notNull()
            .primaryKey(),
        name: varchar("name", { length: 255 })
            .notNull(),
        lat: doublePrecision("lat")
            .notNull(),
        lng: doublePrecision("lng")
            .notNull(),
    },
)

export const collegeRelations = relations(colleges, ({ many }) => ({
  buildings: many(buildings),
}));

export const buildings = createTable(
    "building",
    {
        id: varchar("id", { length: 255 })
            .notNull()
            .primaryKey(),
        collegeId: varchar("collegeId", { length: 255 })
            .notNull(),
        name: varchar("name", { length: 255 })
            .notNull(),
        removedAt: timestamp("removedAt"),
    },
)


export const buildingRelations = relations(buildings, ({ one, many }) => ({
  college: one(colleges, {
      fields: [buildings.collegeId],
      references: [colleges.id],
  }),
  points: many(buildingPoints),
  floors: many(floors),
}));

export const buildingPoints = createTable(
    "buildingPoint",
    {
        id: varchar("id", { length: 255 })
            .notNull()
            .primaryKey(),
        buildingId: varchar("buildingId", { length: 255 })
            .notNull(),
        lat: doublePrecision("lat")
            .notNull(),
        lng: doublePrecision("lng")
            .notNull(),
    },
)

export const pointRelations = relations(buildingPoints, ({ one }) => ({
  building: one(buildings, {
      fields: [buildingPoints.buildingId],
      references: [buildings.id],
  }),
}));

export const floors = createTable(
    "floor",
    {
        id: varchar("id", { length: 255 })
            .notNull()
            .primaryKey(),
        buildingId: varchar("buildingId", { length: 255 })
            .notNull(),
        label: varchar("label", { length: 255 })
            .notNull(),
        imageUrl: varchar("imageUrl", { length: 255 })
            .notNull(),
    },
)

export const floorRelations = relations(floors, ({ one }) => ({
  building: one(buildings, {
      fields: [floors.buildingId],
      references: [buildings.id],
  }),
}));

