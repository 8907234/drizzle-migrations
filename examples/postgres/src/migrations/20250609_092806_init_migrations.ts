
  import { sql } from 'drizzle-orm'
  import type { MigrationArgs } from '@drepkovsky/drizzle-migrations'

  export async function up({ db }: MigrationArgs<'postgresql'>): Promise<void> {
  await db.execute(sql`
          CREATE TABLE "books" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(64),
	"description" text,
	"user_id" integer
);

CREATE TABLE "posts_books" (
	"book_id" uuid,
	"post_id" integer,
	CONSTRAINT "posts_books_book_id_post_id_pk" PRIMARY KEY("book_id","post_id")
);

CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"new_column" varchar,
	"content" varchar,
	"user_id" integer
);

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"slug" uuid
);

ALTER TABLE "books" ADD CONSTRAINT "books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "posts_books" ADD CONSTRAINT "posts_books_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "posts_books" ADD CONSTRAINT "posts_books_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
        `);
  
  };

  export async function down({ db }: MigrationArgs<'postgresql'>): Promise<void> {
  await db.execute(sql`
          DROP TABLE "books" CASCADE;
DROP TABLE "posts_books" CASCADE;
DROP TABLE "posts" CASCADE;
DROP TABLE "users" CASCADE;
        `);
  
  };
  