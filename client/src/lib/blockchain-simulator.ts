import { randomUUID } from "crypto";

export interface BlockchainTransaction {
  id: string;
  txId: string;
  entityType: string;
  entityId: string;
  action: string;
  data: any;
  timestamp: Date;
  userId: string;
  blockHeight?: number;
  gasUsed?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface BlockchainBlock {
  height: number;
  hash: string;
  previousHash: string;
  transactions: BlockchainTransaction[];
  timestamp: Date;
  merkleRoot: string;
  nonce: number;
}

export class BlockchainSimulator {
  private static instance: BlockchainSimulator;
  private blocks: BlockchainBlock[] = [];
  private pendingTransactions: BlockchainTransaction[] = [];
  private currentBlockHeight = 0;

  private constructor() {
    this.initializeGenesisBlock();
  }

  static getInstance(): BlockchainSimulator {
    if (!BlockchainSimulator.instance) {
      BlockchainSimulator.instance = new BlockchainSimulator();
    }
    return BlockchainSimulator.instance;
  }

  private initializeGenesisBlock() {
    const genesisBlock: BlockchainBlock = {
      height: 0,
      hash: this.generateHash('genesis'),
      previousHash: '0',
      transactions: [],
      timestamp: new Date(),
      merkleRoot: this.generateMerkleRoot([]),
      nonce: 0
    };
    
    this.blocks.push(genesisBlock);
  }

  private generateHash(data: string): string {
    // Simulate hash generation (in real blockchain, this would be SHA-256)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `hash_${timestamp}_${random}`;
  }

  private generateMerkleRoot(transactions: BlockchainTransaction[]): string {
    if (transactions.length === 0) return this.generateHash('empty');
    
    const txHashes = transactions.map(tx => tx.txId);
    return this.generateHash(txHashes.join(''));
  }

  private generateNonce(): number {
    return Math.floor(Math.random() * 1000000);
  }

  public createTransaction(
    entityType: string,
    entityId: string,
    action: string,
    data: any,
    userId: string
  ): BlockchainTransaction {
    const transaction: BlockchainTransaction = {
      id: randomUUID(),
      txId: `tx_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      entityType,
      entityId,
      action,
      data,
      timestamp: new Date(),
      userId,
      status: 'pending'
    };

    this.pendingTransactions.push(transaction);
    
    // Simulate transaction processing delay
    setTimeout(() => {
      this.processTransaction(transaction);
    }, Math.random() * 2000 + 1000); // 1-3 seconds delay

    return transaction;
  }

  private processTransaction(transaction: BlockchainTransaction) {
    // Simulate validation (could fail randomly for demo)
    const shouldFail = Math.random() < 0.05; // 5% failure rate
    
    if (shouldFail) {
      transaction.status = 'failed';
      return;
    }

    transaction.status = 'confirmed';
    transaction.gasUsed = Math.floor(Math.random() * 100000) + 21000;
    
    // Add to a block when we have enough transactions or after timeout
    if (this.pendingTransactions.filter(tx => tx.status === 'confirmed').length >= 5) {
      this.mineBlock();
    }
  }

  private mineBlock() {
    const confirmedTransactions = this.pendingTransactions.filter(tx => tx.status === 'confirmed');
    
    if (confirmedTransactions.length === 0) return;

    this.currentBlockHeight++;
    
    const newBlock: BlockchainBlock = {
      height: this.currentBlockHeight,
      hash: this.generateHash(`block_${this.currentBlockHeight}`),
      previousHash: this.blocks[this.blocks.length - 1].hash,
      transactions: confirmedTransactions,
      timestamp: new Date(),
      merkleRoot: this.generateMerkleRoot(confirmedTransactions),
      nonce: this.generateNonce()
    };

    // Update transaction block heights
    confirmedTransactions.forEach(tx => {
      tx.blockHeight = this.currentBlockHeight;
    });

    this.blocks.push(newBlock);
    
    // Remove processed transactions from pending
    this.pendingTransactions = this.pendingTransactions.filter(tx => tx.status === 'pending');
  }

  public getTransaction(txId: string): BlockchainTransaction | undefined {
    // Check pending transactions first
    const pending = this.pendingTransactions.find(tx => tx.txId === txId);
    if (pending) return pending;

    // Check confirmed transactions in blocks
    for (const block of this.blocks) {
      const tx = block.transactions.find(tx => tx.txId === txId);
      if (tx) return tx;
    }

    return undefined;
  }

  public getTransactionsByEntity(entityId: string): BlockchainTransaction[] {
    const transactions: BlockchainTransaction[] = [];
    
    // Add pending transactions
    transactions.push(...this.pendingTransactions.filter(tx => tx.entityId === entityId));
    
    // Add confirmed transactions from blocks
    for (const block of this.blocks) {
      transactions.push(...block.transactions.filter(tx => tx.entityId === entityId));
    }

    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getAllTransactions(): BlockchainTransaction[] {
    const transactions: BlockchainTransaction[] = [];
    
    // Add pending transactions
    transactions.push(...this.pendingTransactions);
    
    // Add confirmed transactions from blocks
    for (const block of this.blocks) {
      transactions.push(...block.transactions);
    }

    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getBlockchainStats() {
    const allTransactions = this.getAllTransactions();
    const confirmedTransactions = allTransactions.filter(tx => tx.status === 'confirmed');
    
    return {
      totalBlocks: this.blocks.length,
      totalTransactions: allTransactions.length,
      confirmedTransactions: confirmedTransactions.length,
      pendingTransactions: this.pendingTransactions.length,
      currentBlockHeight: this.currentBlockHeight,
      lastBlockTime: this.blocks[this.blocks.length - 1]?.timestamp
    };
  }

  public getBlock(height: number): BlockchainBlock | undefined {
    return this.blocks.find(block => block.height === height);
  }

  public getLatestBlocks(count: number = 10): BlockchainBlock[] {
    return this.blocks.slice(-count).reverse();
  }

  // Simulate smart contract validation
  public validateSmartContract(contractType: string, data: any): {
    isValid: boolean;
    errors: string[];
    gasEstimate: number;
  } {
    const errors: string[] = [];
    let gasEstimate = 50000; // Base gas

    switch (contractType) {
      case 'collection':
        if (!data.latitude || !data.longitude) {
          errors.push('GPS coordinates required');
        }
        if (!data.speciesId) {
          errors.push('Species identification required');
        }
        if (!data.quantity || data.quantity <= 0) {
          errors.push('Valid quantity required');
        }
        gasEstimate += 25000;
        break;

      case 'processing':
        if (!data.batchId) {
          errors.push('Batch ID required');
        }
        if (!data.stepType) {
          errors.push('Processing step type required');
        }
        gasEstimate += 35000;
        break;

      case 'quality_test':
        if (!data.testType) {
          errors.push('Test type required');
        }
        if (!data.result) {
          errors.push('Test result required');
        }
        gasEstimate += 40000;
        break;

      case 'product':
        if (!data.name) {
          errors.push('Product name required');
        }
        if (!data.batchIds || data.batchIds.length === 0) {
          errors.push('At least one batch required');
        }
        gasEstimate += 60000;
        break;

      default:
        errors.push('Unknown contract type');
    }

    return {
      isValid: errors.length === 0,
      errors,
      gasEstimate
    };
  }
}

// Export singleton instance
export const blockchainSimulator = BlockchainSimulator.getInstance();
