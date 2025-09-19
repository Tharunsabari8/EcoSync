import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCollectionSchema, 
  insertBatchSchema, 
  insertProcessingStepSchema,
  insertQualityTestSchema,
  insertProductSchema,
  insertBlockchainTransactionSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Herb Species
  app.get("/api/herb-species", async (req, res) => {
    try {
      const species = await storage.getAllHerbSpecies();
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch herb species" });
    }
  });

  // Collections
  app.get("/api/collections", async (req, res) => {
    try {
      const { collectorId } = req.query;
      
      let collections;
      if (collectorId) {
        collections = await storage.getCollectionsByCollector(collectorId as string);
      } else {
        collections = await storage.getAllCollections();
      }
      
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      
      // Log blockchain transaction
      await storage.createBlockchainTransaction({
        txId: collection.blockchainTxId!,
        entityType: "collection",
        entityId: collection.id,
        action: "create",
        data: collection,
        timestamp: new Date(),
        userId: collection.collectorId
      });
      
      res.status(201).json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid collection data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create collection" });
      }
    }
  });

  // Batches
  app.get("/api/batches", async (req, res) => {
    try {
      const { processorId, status } = req.query;
      
      let batches;
      if (processorId) {
        batches = await storage.getBatchesByProcessor(processorId as string);
      } else if (status) {
        batches = await storage.getBatchesByStatus(status as string);
      } else {
        batches = await storage.getAllBatches();
      }
      
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  });

  app.post("/api/batches", async (req, res) => {
    try {
      const validatedData = insertBatchSchema.parse(req.body);
      const batch = await storage.createBatch(validatedData);
      
      // Log blockchain transaction
      await storage.createBlockchainTransaction({
        txId: batch.blockchainTxId!,
        entityType: "batch",
        entityId: batch.id,
        action: "create",
        data: batch,
        timestamp: new Date(),
        userId: batch.processorId
      });
      
      res.status(201).json(batch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid batch data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create batch" });
      }
    }
  });

  app.patch("/api/batches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const batch = await storage.updateBatch(id, updates);
      res.json(batch);
    } catch (error) {
      res.status(500).json({ error: "Failed to update batch" });
    }
  });

  // Processing Steps
  app.get("/api/processing-steps/:batchId", async (req, res) => {
    try {
      const { batchId } = req.params;
      const steps = await storage.getProcessingStepsByBatch(batchId);
      res.json(steps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch processing steps" });
    }
  });

  app.post("/api/processing-steps", async (req, res) => {
    try {
      const validatedData = insertProcessingStepSchema.parse(req.body);
      const step = await storage.createProcessingStep(validatedData);
      
      // Log blockchain transaction
      await storage.createBlockchainTransaction({
        txId: step.blockchainTxId!,
        entityType: "processing",
        entityId: step.id,
        action: "create",
        data: step,
        timestamp: new Date(),
        userId: "system" // In real app, get from auth
      });
      
      res.status(201).json(step);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid processing step data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create processing step" });
      }
    }
  });

  // Quality Tests
  app.get("/api/quality-tests", async (req, res) => {
    try {
      const { batchId, labId } = req.query;
      
      let tests: any[];
      if (batchId) {
        tests = await storage.getQualityTestsByBatch(batchId as string);
      } else if (labId) {
        tests = await storage.getQualityTestsByLab(labId as string);
      } else {
        tests = [];
      }
      
      res.json(tests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quality tests" });
    }
  });

  app.post("/api/quality-tests", async (req, res) => {
    try {
      const validatedData = insertQualityTestSchema.parse(req.body);
      const test = await storage.createQualityTest(validatedData);
      
      // Log blockchain transaction
      await storage.createBlockchainTransaction({
        txId: test.blockchainTxId!,
        entityType: "test",
        entityId: test.id,
        action: "create",
        data: test,
        timestamp: new Date(),
        userId: test.labId
      });
      
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid quality test data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create quality test" });
      }
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { manufacturerId } = req.query;
      
      let products;
      if (manufacturerId) {
        products = await storage.getProductsByManufacturer(manufacturerId as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/qr/:qrCode", async (req, res) => {
    try {
      const { qrCode } = req.params;
      const product = await storage.getProductByQRCode(qrCode);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Get full traceability data
      const batchIds = product.batchIds as string[];
      const batches = await Promise.all(
        batchIds.map(id => storage.getBatch(id)).filter(Boolean)
      );
      
      const collections = await Promise.all(
        batches.flatMap(batch => batch!.collectionIds as string[])
          .map(id => storage.getCollection(id))
          .filter(Boolean)
      );
      
      const qualityTests = await Promise.all(
        batchIds.map(id => storage.getQualityTestsByBatch(id))
      ).then(results => results.flat());
      
      const processingSteps = await Promise.all(
        batchIds.map(id => storage.getProcessingStepsByBatch(id))
      ).then(results => results.flat());
      
      const traceabilityData = {
        product,
        batches,
        collections,
        qualityTests,
        processingSteps
      };
      
      res.json(traceabilityData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product traceability" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      
      // Log blockchain transaction
      await storage.createBlockchainTransaction({
        txId: product.blockchainTxId!,
        entityType: "product",
        entityId: product.id,
        action: "create", 
        data: product,
        timestamp: new Date(),
        userId: product.manufacturerId
      });
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid product data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create product" });
      }
    }
  });

  // Blockchain Transactions
  app.get("/api/blockchain/transactions", async (req, res) => {
    try {
      const { entityId } = req.query;
      
      let transactions;
      if (entityId) {
        transactions = await storage.getBlockchainTransactionsByEntity(entityId as string);
      } else {
        transactions = await storage.getAllBlockchainTransactions();
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blockchain transactions" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query;
      
      let users: any[];
      if (role) {
        users = await storage.getUsersByRole(role as string);
      } else {
        users = [];
      }
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
