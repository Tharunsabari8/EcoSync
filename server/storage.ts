import { 
  type User, type InsertUser,
  type HerbSpecies, type InsertHerbSpecies,
  type Collection, type InsertCollection,
  type Batch, type InsertBatch,
  type ProcessingStep, type InsertProcessingStep,
  type QualityTest, type InsertQualityTest,
  type Product, type InsertProduct,
  type BlockchainTransaction, type InsertBlockchainTransaction
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;

  // Herb Species
  getAllHerbSpecies(): Promise<HerbSpecies[]>;
  getHerbSpecies(id: string): Promise<HerbSpecies | undefined>;
  createHerbSpecies(species: InsertHerbSpecies): Promise<HerbSpecies>;

  // Collections
  getAllCollections(): Promise<Collection[]>;
  getCollectionsByCollector(collectorId: string): Promise<Collection[]>;
  getCollection(id: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: string, updates: Partial<Collection>): Promise<Collection>;

  // Batches
  getAllBatches(): Promise<Batch[]>;
  getBatchesByProcessor(processorId: string): Promise<Batch[]>;
  getBatchesByStatus(status: string): Promise<Batch[]>;
  getBatch(id: string): Promise<Batch | undefined>;
  createBatch(batch: InsertBatch): Promise<Batch>;
  updateBatch(id: string, updates: Partial<Batch>): Promise<Batch>;

  // Processing Steps
  getProcessingStepsByBatch(batchId: string): Promise<ProcessingStep[]>;
  createProcessingStep(step: InsertProcessingStep): Promise<ProcessingStep>;

  // Quality Tests
  getQualityTestsByBatch(batchId: string): Promise<QualityTest[]>;
  getQualityTestsByLab(labId: string): Promise<QualityTest[]>;
  createQualityTest(test: InsertQualityTest): Promise<QualityTest>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByManufacturer(manufacturerId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductByQRCode(qrCode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;

  // Blockchain Transactions
  getAllBlockchainTransactions(): Promise<BlockchainTransaction[]>;
  getBlockchainTransactionsByEntity(entityId: string): Promise<BlockchainTransaction[]>;
  createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction>;

  // Analytics
  getDashboardStats(): Promise<{
    activeBatches: number;
    collectionsToday: number;
    qualityTests: number;
    blockchainTransactions: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private herbSpecies: Map<string, HerbSpecies> = new Map();
  private collections: Map<string, Collection> = new Map();
  private batches: Map<string, Batch> = new Map();
  private processingSteps: Map<string, ProcessingStep> = new Map();
  private qualityTests: Map<string, QualityTest> = new Map();
  private products: Map<string, Product> = new Map();
  private blockchainTransactions: Map<string, BlockchainTransaction> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial data for demo
    const species1: HerbSpecies = {
      id: "species-1",
      name: "Ashwagandha",
      scientificName: "Withania somnifera",
      description: "Adaptogenic herb used for stress relief",
      harvestingSeason: "Winter"
    };
    
    const species2: HerbSpecies = {
      id: "species-2", 
      name: "Brahmi",
      scientificName: "Bacopa monnieri",
      description: "Brain tonic and memory enhancer",
      harvestingSeason: "Monsoon"
    };

    this.herbSpecies.set(species1.id, species1);
    this.herbSpecies.set(species2.id, species2);

    // Sample users
    const collector: User = {
      id: "user-1",
      username: "rajesh_collector",
      password: "password",
      role: "collector",
      name: "Rajesh Kumar",
      location: "Maharashtra, India"
    };

    const processor: User = {
      id: "user-2",
      username: "processor_facility",
      password: "password", 
      role: "processor",
      name: "Ayurvedic Processing Facility",
      location: "Maharashtra, India"
    };

    this.users.set(collector.id, collector);
    this.users.set(processor.id, processor);

    // Add demo supply chain data for QR demonstration
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    // Demo collection
    const demoCollection: Collection = {
      id: "demo-collection-1",
      collectorId: "user-1",
      speciesId: "species-1",
      latitude: "19.7515",
      longitude: "75.7139",
      quantity: "2.5",
      qualityGrade: "excellent",
      collectionDate: new Date("2024-12-01"),
      notes: "Organic Ashwagandha harvested from certified farm",
      photos: null,
      blockchainTxId: "tx-demo-001"
    };

    // Demo collection for pending batch
    const demoCollection2: Collection = {
      id: "demo-collection-2",
      collectorId: "user-1",
      speciesId: "species-2",
      latitude: "19.7515",
      longitude: "75.7139",
      quantity: "1.8",
      qualityGrade: "good",
      collectionDate: new Date("2024-12-07"),
      notes: "Fresh Brahmi collected for processing",
      photos: null,
      blockchainTxId: "tx-demo-007"
    };

    // Demo batch
    const demoBatch: Batch = {
      id: "demo-batch-1",
      batchNumber: "ASW-2024-001",
      collectionIds: ["demo-collection-1"],
      processorId: "user-2", 
      status: "completed",
      totalQuantity: "2.5",
      createdAt: new Date("2024-12-01"),
      completedAt: new Date("2024-12-05"),
      blockchainTxId: "tx-demo-002"
    };

    // Demo pending batch for processor demonstration
    const demoPendingBatch: Batch = {
      id: "demo-batch-2", 
      batchNumber: "BRA-2024-001",
      collectionIds: ["demo-collection-2"],
      processorId: "user-2",
      status: "pending",
      totalQuantity: "1.8",
      createdAt: new Date("2024-12-07"),
      completedAt: null,
      blockchainTxId: "tx-demo-006"
    };

    // Demo processing step
    const demoProcessingStep: ProcessingStep = {
      id: "demo-step-1",
      batchId: "demo-batch-1",
      stepType: "drying",
      temperature: "60",
      humidity: "30",
      duration: 720,
      notes: "Controlled drying at optimal temperature and humidity",
      processedAt: new Date("2024-12-02"),
      blockchainTxId: "tx-demo-003"
    };

    // Demo quality test
    const demoQualityTest: QualityTest = {
      id: "demo-test-1",
      batchId: "demo-batch-1",
      labId: "lab-1",
      testType: "moisture",
      testValue: "8.5",
      unit: "%",
      acceptableRange: "6-10%",
      result: "pass",
      certificateUrl: "https://example.com/cert-001.pdf",
      testedAt: new Date("2024-12-03"),
      notes: "Moisture content within acceptable limits",
      blockchainTxId: "tx-demo-004"
    };

    // Demo product with demo QR code
    const demoProduct: Product = {
      id: "demo-product-1",
      productNumber: "ASW-TAB-001",
      name: "Ashwagandha Premium Tablets",
      productType: "tablets",
      manufacturerId: "mfr-1",
      batchIds: ["demo-batch-1"],
      batchSize: 500,
      units: "bottles",
      manufacturingDate: new Date("2024-12-06"),
      expiryDate: new Date("2027-12-06"),
      qrCode: "DEMO-QR-ASW001",
      notes: "Premium quality Ashwagandha extract tablets",
      blockchainTxId: "tx-demo-005"
    };

    // Store demo data
    this.collections.set(demoCollection.id, demoCollection);
    this.collections.set(demoCollection2.id, demoCollection2);
    this.batches.set(demoBatch.id, demoBatch);
    this.batches.set(demoPendingBatch.id, demoPendingBatch);
    this.processingSteps.set(demoProcessingStep.id, demoProcessingStep);
    this.qualityTests.set(demoQualityTest.id, demoQualityTest);
    this.products.set(demoProduct.id, demoProduct);

    // Add corresponding blockchain transactions
    const transactions = [
      { id: "tx-demo-001", txId: "tx-demo-001", entityType: "collection", entityId: "demo-collection-1", action: "create", data: demoCollection, timestamp: new Date("2024-12-01"), userId: "user-1" },
      { id: "tx-demo-002", txId: "tx-demo-002", entityType: "batch", entityId: "demo-batch-1", action: "create", data: demoBatch, timestamp: new Date("2024-12-01"), userId: "user-2" },
      { id: "tx-demo-003", txId: "tx-demo-003", entityType: "processing", entityId: "demo-step-1", action: "create", data: demoProcessingStep, timestamp: new Date("2024-12-02"), userId: "user-2" },
      { id: "tx-demo-004", txId: "tx-demo-004", entityType: "test", entityId: "demo-test-1", action: "create", data: demoQualityTest, timestamp: new Date("2024-12-03"), userId: "lab-1" },
      { id: "tx-demo-005", txId: "tx-demo-005", entityType: "product", entityId: "demo-product-1", action: "create", data: demoProduct, timestamp: new Date("2024-12-06"), userId: "mfr-1" },
      { id: "tx-demo-006", txId: "tx-demo-006", entityType: "batch", entityId: "demo-batch-2", action: "create", data: demoPendingBatch, timestamp: new Date("2024-12-07"), userId: "user-2" },
      { id: "tx-demo-007", txId: "tx-demo-007", entityType: "collection", entityId: "demo-collection-2", action: "create", data: demoCollection2, timestamp: new Date("2024-12-07"), userId: "user-1" }
    ];

    transactions.forEach(tx => this.blockchainTransactions.set(tx.id, tx));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      location: insertUser.location || null
    };
    this.users.set(id, user);
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async getAllHerbSpecies(): Promise<HerbSpecies[]> {
    return Array.from(this.herbSpecies.values());
  }

  async getHerbSpecies(id: string): Promise<HerbSpecies | undefined> {
    return this.herbSpecies.get(id);
  }

  async createHerbSpecies(species: InsertHerbSpecies): Promise<HerbSpecies> {
    const id = randomUUID();
    const herbSpecies: HerbSpecies = { 
      ...species, 
      id,
      description: species.description || null,
      harvestingSeason: species.harvestingSeason || null
    };
    this.herbSpecies.set(id, herbSpecies);
    return herbSpecies;
  }

  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollectionsByCollector(collectorId: string): Promise<Collection[]> {
    return Array.from(this.collections.values()).filter(c => c.collectorId === collectorId);
  }

  async getCollection(id: string): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const id = randomUUID();
    const newCollection: Collection = { 
      ...collection, 
      id,
      notes: collection.notes || null,
      photos: collection.photos || null,
      blockchainTxId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.collections.set(id, newCollection);
    return newCollection;
  }

  async updateCollection(id: string, updates: Partial<Collection>): Promise<Collection> {
    const existing = this.collections.get(id);
    if (!existing) throw new Error("Collection not found");
    const updated = { ...existing, ...updates };
    this.collections.set(id, updated);
    return updated;
  }

  async getAllBatches(): Promise<Batch[]> {
    return Array.from(this.batches.values());
  }

  async getBatchesByProcessor(processorId: string): Promise<Batch[]> {
    return Array.from(this.batches.values()).filter(b => b.processorId === processorId);
  }

  async getBatchesByStatus(status: string): Promise<Batch[]> {
    return Array.from(this.batches.values()).filter(b => b.status === status);
  }

  async getBatch(id: string): Promise<Batch | undefined> {
    return this.batches.get(id);
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    const id = randomUUID();
    const newBatch: Batch = { 
      ...batch, 
      id,
      completedAt: batch.completedAt || null,
      blockchainTxId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.batches.set(id, newBatch);
    return newBatch;
  }

  async updateBatch(id: string, updates: Partial<Batch>): Promise<Batch> {
    const existing = this.batches.get(id);
    if (!existing) throw new Error("Batch not found");
    const updated = { ...existing, ...updates };
    this.batches.set(id, updated);
    return updated;
  }

  async getProcessingStepsByBatch(batchId: string): Promise<ProcessingStep[]> {
    return Array.from(this.processingSteps.values()).filter(s => s.batchId === batchId);
  }

  async createProcessingStep(step: InsertProcessingStep): Promise<ProcessingStep> {
    const id = randomUUID();
    const newStep: ProcessingStep = { 
      ...step, 
      id,
      duration: step.duration || null,
      notes: step.notes || null,
      temperature: step.temperature || null,
      humidity: step.humidity || null,
      blockchainTxId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.processingSteps.set(id, newStep);
    return newStep;
  }

  async getQualityTestsByBatch(batchId: string): Promise<QualityTest[]> {
    return Array.from(this.qualityTests.values()).filter(t => t.batchId === batchId);
  }

  async getQualityTestsByLab(labId: string): Promise<QualityTest[]> {
    return Array.from(this.qualityTests.values()).filter(t => t.labId === labId);
  }

  async createQualityTest(test: InsertQualityTest): Promise<QualityTest> {
    const id = randomUUID();
    const newTest: QualityTest = { 
      ...test, 
      id,
      notes: test.notes || null,
      unit: test.unit || null,
      acceptableRange: test.acceptableRange || null,
      certificateUrl: test.certificateUrl || null,
      blockchainTxId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.qualityTests.set(id, newTest);
    return newTest;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByManufacturer(manufacturerId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.manufacturerId === manufacturerId);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByQRCode(qrCode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.qrCode === qrCode);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = { 
      ...product, 
      id,
      notes: product.notes || null,
      qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      blockchainTxId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async getAllBlockchainTransactions(): Promise<BlockchainTransaction[]> {
    return Array.from(this.blockchainTransactions.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getBlockchainTransactionsByEntity(entityId: string): Promise<BlockchainTransaction[]> {
    return Array.from(this.blockchainTransactions.values()).filter(t => t.entityId === entityId);
  }

  async createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction> {
    const id = randomUUID();
    const newTransaction: BlockchainTransaction = { ...transaction, id };
    this.blockchainTransactions.set(id, newTransaction);
    return newTransaction;
  }

  async getDashboardStats(): Promise<{
    activeBatches: number;
    collectionsToday: number;
    qualityTests: number;
    blockchainTransactions: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const collectionsToday = Array.from(this.collections.values()).filter(c => 
      new Date(c.collectionDate) >= today
    ).length;

    return {
      activeBatches: Array.from(this.batches.values()).filter(b => b.status === 'processing').length,
      collectionsToday,
      qualityTests: this.qualityTests.size,
      blockchainTransactions: this.blockchainTransactions.size
    };
  }
}

export const storage = new MemStorage();
