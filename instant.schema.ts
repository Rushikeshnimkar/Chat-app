import { i } from "@instantdb/react";

const _schema = i.schema({
  // We inferred 12 attributes!
  // Take a look at this schema, and if everything looks good,
  // run `push schema` again to enforce the types.
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    contacts: i.entity({
      avatar: i.string(),
      contactEmail: i.string(),
      createdAt: i.number(),
      lastMessage: i.any(),
      lastSeen: i.string(),
      name: i.string(),
      status: i.string(),
      userEmail: i.string(),
    }),
    profiles: i.entity({
      email: i.string(),
      imageUrl: i.string(),
      lastUpdated: i.number(),
      phoneNumber: i.string(),
      username: i.string(),
    }),
  },
  // You can define links here.
  // For example, if `posts` should have many `comments`.
  // More in the docs:
  // https://www.instantdb.com/docs/modeling-data#3-links
  links: {},
  // If you use presence, you can define a room schema here
  // https://www.instantdb.com/docs/presence-and-topics#typesafety
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
