DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL
);

CREATE TABLE "properties" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "owner_id" INTEGER,
  "title" VARCHAR[255] NOT NULL,
  "description" TEXT,
  "thumbnail_photo_url" VARCHAR(255) NOT NULL,
  "cover_phot_url" VARCHAR(255) NOT NULL,
  "cost_per_night" INTEGER NOT NULL DEFAULT 0,
  "park_spaces" INTEGER NOT NULL DEFAULT 0,
  "number_of_bathrooms" INTEGER NOT NULL DEFAULT 0,
  "number_of_bedrooms" INTEGER NOT NULL DEFAULT 0,
  "country" VARCHAR(255) NOT NULL,
  "street" VARCHAR(255) NOT NULL,
  "city" VARCHAR(255) NOT NULL,
  "province" VARCHAR(255) NOT NULL,
  "post_code" VARCHAR(255) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE "reservations" (
  "id" serial PRIMARY KEY NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "guest_id" INTEGER,
  "property_id" INTEGER
);

CREATE TABLE "property_reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "guest_id" INTEGER,
  "reservation_id" INTEGER,
  "property_id" INTEGER,
  "rating" SMALLINT NOT NULL DEFAULT 0,
  "message" TEXT
);

ALTER TABLE "properties" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "reservations" ADD FOREIGN KEY ("guest_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "reservations" ADD FOREIGN KEY ("property_id") REFERENCES "properties" ("id") ON DELETE CASCADE; 

ALTER TABLE "property_reviews" ADD FOREIGN KEY ("guest_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "property_reviews" ADD FOREIGN KEY ("reservation_id") REFERENCES "reservations" ("id") ON DELETE CASCADE;

ALTER TABLE "property_reviews" ADD FOREIGN KEY ("property_id") REFERENCES "properties" ("id") ON DELETE CASCADE;
