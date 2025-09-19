import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for different stakeholders
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // collector, processor, laboratory, manufacturer, consumer
  name: text("name").notNull(),
  location: text("location"),
});

// Herb species master data
export const herbSpecies = pgTable("herb_species", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  scientificName: text("scientific_name").notNull(),
  description: text("description"),
  harvestingSeason: text("harvesting_season"),
});

// Collection events from farmers/collectors
export const collections = pgTable("collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collectorId: varchar("collector_id").notNull(),
  speciesId: varchar("species_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  qualityGrade: text("quality_grade").notNull(), // excellent, good, fair
  collectionDate: timestamp("collection_date").notNull(),
  notes: text("notes"),
  photos: jsonb("photos"), // array of photo URLs
  blockchainTxId: text("blockchain_tx_id"),
});

// Processing batches
export const batches = pgTable("batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchNumber: text("batch_number").notNull().unique(),
  collectionIds: jsonb("collection_ids").notNull(), // array of collection IDs
  processorId: varchar("processor_id").notNull(),
  status: text("status").notNull(), // pending, processing, completed
  totalQuantity: decimal("total_quantity", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  completedAt: timestamp("completed_at"),
  blockchainTxId: text("blockchain_tx_id"),
});

// Processing steps
export const processingSteps = pgTable("processing_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id").notNull(),
  stepType: text("step_type").notNull(), // cleaning, drying, grinding, sieving, packaging
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  duration: integer("duration"), // minutes
  notes: text("notes"),
  processedAt: timestamp("processed_at").notNull(),
  blockchainTxId: text("blockchain_tx_id"),
});

// Quality tests
export const qualityTests = pgTable("quality_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id").notNull(),
  labId: varchar("lab_id").notNull(),
  testType: text("test_type").notNull(), // moisture, pesticide, dna, heavymetals, microbial
  testValue: text("test_value").notNull(),
  unit: text("unit"),
  acceptableRange: text("acceptable_range"),
  result: text("result").notNull(), // pass, fail, retest
  certificateUrl: text("certificate_url"),
  testedAt: timestamp("tested_at").notNull(),
  notes: text("notes"),
  blockchainTxId: text("blockchain_tx_id"),
});

// Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productNumber: text("product_number").notNull().unique(),
  name: text("name").notNull(),
  productType: text("product_type").notNull(), // tablets, capsules, powder, syrup, oil
  manufacturerId: varchar("manufacturer_id").notNull(),
  batchIds: jsonb("batch_ids").notNull(), // array of batch IDs used
  batchSize: integer("batch_size").notNull(),
  units: text("units").notNull(),
  manufacturingDate: timestamp("manufacturing_date").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  qrCode: text("qr_code"),
  notes: text("notes"),
  blockchainTxId: text("blockchain_tx_id"),
});

// Blockchain transactions log
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  txId: text("tx_id").notNull().unique(),
  entityType: text("entity_type").notNull(), // collection, batch, processing, test, product
  entityId: varchar("entity_id").notNull(),
  action: text("action").notNull(), // create, update
  data: jsonb("data").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  userId: varchar("user_id").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertHerbSpeciesSchema = createInsertSchema(herbSpecies).omit({ id: true });
export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true, blockchainTxId: true });
export const insertBatchSchema = createInsertSchema(batches).omit({ id: true, blockchainTxId: true });
export const insertProcessingStepSchema = createInsertSchema(processingSteps).omit({ id: true, blockchainTxId: true });
export const insertQualityTestSchema = createInsertSchema(qualityTests).omit({ id: true, blockchainTxId: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, blockchainTxId: true });
export const insertBlockchainTransactionSchema = createInsertSchema(blockchainTransactions).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type HerbSpecies = typeof herbSpecies.$inferSelect;
export type InsertHerbSpecies = z.infer<typeof insertHerbSpeciesSchema>;
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Batch = typeof batches.$inferSelect;
export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type ProcessingStep = typeof processingSteps.$inferSelect;
export type InsertProcessingStep = z.infer<typeof insertProcessingStepSchema>;
export type QualityTest = typeof qualityTests.$inferSelect;
export type InsertQualityTest = z.infer<typeof insertQualityTestSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type BlockchainTransaction = typeof blockchainTransactions.$inferSelect;
export type InsertBlockchainTransaction = z.infer<typeof insertBlockchainTransactionSchema>;
