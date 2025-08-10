/**
 * Database Backup and Restore Utilities
 * Usage: node database/scripts/backup.js [backup|restore]
 */

const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prehistoric_vr';
const BACKUP_DIR = path.join(__dirname, '../backups');

class DatabaseBackup {
  constructor() {
    this.client = new MongoClient(MONGODB_URI);
    this.collections = ['users', 'tribes', 'artifacts', 'vrexperiences', 'aiconversations', 'config'];
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db();
    console.log('🔗 Connected to MongoDB');
  }

  async disconnect() {
    await this.client.close();
    console.log('🔌 Disconnected from MongoDB');
  }

  async ensureBackupDir() {
    try {
      await fs.access(BACKUP_DIR);
    } catch (error) {
      await fs.mkdir(BACKUP_DIR, { recursive: true });
      console.log('📁 Created backup directory');
    }
  }

  async backup() {
    try {
      await this.connect();
      await this.ensureBackupDir();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
      
      await fs.mkdir(backupPath, { recursive: true });
      console.log(`📦 Creating backup at: ${backupPath}`);

      const backupMetadata = {
        timestamp: new Date().toISOString(),
        database: this.db.databaseName,
        collections: [],
        totalDocuments: 0,
        version: '1.0.0'
      };

      for (const collectionName of this.collections) {
        console.log(`📋 Backing up collection: ${collectionName}`);
        
        try {
          const collection = this.db.collection(collectionName);
          const documents = await collection.find({}).toArray();
          
          const collectionFile = path.join(backupPath, `${collectionName}.json`);
          await fs.writeFile(collectionFile, JSON.stringify(documents, null, 2));
          
          console.log(`✅ Backed up ${documents.length} documents from ${collectionName}`);
          
          backupMetadata.collections.push({
            name: collectionName,
            documentCount: documents.length,
            size: JSON.stringify(documents).length
          });
          
          backupMetadata.totalDocuments += documents.length;
          
        } catch (error) {
          console.warn(`⚠️ Collection ${collectionName} not found or empty`);
          backupMetadata.collections.push({
            name: collectionName,
            documentCount: 0,
            size: 0,
            error: error.message
          });
        }
      }

      // Save backup metadata
      const metadataFile = path.join(backupPath, 'metadata.json');
      await fs.writeFile(metadataFile, JSON.stringify(backupMetadata, null, 2));

      console.log(`🎉 Backup completed successfully!`);
      console.log(`📊 Total documents backed up: ${backupMetadata.totalDocuments}`);
      console.log(`📁 Backup location: ${backupPath}`);

      return backupPath;

    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async restore(backupPath) {
    try {
      await this.connect();
      
      console.log(`📦 Restoring from backup: ${backupPath}`);

      // Read backup metadata
      const metadataFile = path.join(backupPath, 'metadata.json');
      let metadata;
      
      try {
        const metadataContent = await fs.readFile(metadataFile, 'utf8');
        metadata = JSON.parse(metadataContent);
        console.log(`📋 Backup metadata loaded (${metadata.totalDocuments} total documents)`);
      } catch (error) {
        console.warn('⚠️ No metadata file found, proceeding with restore...');
      }

      for (const collectionName of this.collections) {
        const collectionFile = path.join(backupPath, `${collectionName}.json`);
        
        try {
          const fileContent = await fs.readFile(collectionFile, 'utf8');
          const documents = JSON.parse(fileContent);
          
          if (documents.length === 0) {
            console.log(`📋 Collection ${collectionName} is empty, skipping...`);
            continue;
          }

          console.log(`📥 Restoring ${documents.length} documents to ${collectionName}`);
          
          const collection = this.db.collection(collectionName);
          
          // Clear existing data (optional - comment out to append instead)
          await collection.deleteMany({});
          console.log(`🧹 Cleared existing data in ${collectionName}`);
          
          // Insert backup data
          if (documents.length > 0) {
            await collection.insertMany(documents);
            console.log(`✅ Restored ${documents.length} documents to ${collectionName}`);
          }
          
        } catch (error) {
          if (error.code === 'ENOENT') {
            console.warn(`⚠️ No backup file found for collection: ${collectionName}`);
          } else {
            console.error(`❌ Error restoring collection ${collectionName}:`, error.message);
          }
        }
      }

      console.log('🎉 Database restore completed successfully!');
      
      // Verify restore
      const stats = await this.db.stats();
      console.log(`📊 Database now contains ${stats.collections} collections`);

    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async listBackups() {
    try {
      await this.ensureBackupDir();
      const backups = await fs.readdir(BACKUP_DIR);
      
      console.log('📁 Available backups:');
      
      if (backups.length === 0) {
        console.log('   No backups found');
        return [];
      }

      const backupDetails = [];
      
      for (const backup of backups) {
        const backupPath = path.join(BACKUP_DIR, backup);
        const stat = await fs.stat(backupPath);
        
        if (stat.isDirectory()) {
          const metadataFile = path.join(backupPath, 'metadata.json');
          let details = {
            name: backup,
            path: backupPath,
            created: stat.birthtime,
            size: 'Unknown'
          };
          
          try {
            const metadataContent = await fs.readFile(metadataFile, 'utf8');
            const metadata = JSON.parse(metadataContent);
            details.documents = metadata.totalDocuments;
            details.collections = metadata.collections.length;
          } catch (error) {
            // Metadata not available
          }
          
          backupDetails.push(details);
          console.log(`   📦 ${backup} (${stat.birthtime.toISOString()})`);
        }
      }
      
      return backupDetails;
      
    } catch (error) {
      console.error('❌ Error listing backups:', error);
      return [];
    }
  }

  async cleanOldBackups(keepCount = 5) {
    try {
      const backups = await this.listBackups();
      
      if (backups.length <= keepCount) {
        console.log(`📁 Only ${backups.length} backups found, no cleanup needed`);
        return;
      }

      // Sort by creation date (newest first)
      backups.sort((a, b) => b.created - a.created);
      
      const toDelete = backups.slice(keepCount);
      
      console.log(`🧹 Cleaning up ${toDelete.length} old backups (keeping ${keepCount} most recent)`);
      
      for (const backup of toDelete) {
        await fs.rmdir(backup.path, { recursive: true });
        console.log(`🗑️ Deleted old backup: ${backup.name}`);
      }
      
      console.log('✅ Backup cleanup completed');
      
    } catch (error) {
      console.error('❌ Error cleaning old backups:', error);
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const backup = new DatabaseBackup();

  try {
    switch (command) {
      case 'backup':
        await backup.backup();
        await backup.cleanOldBackups();
        break;
        
      case 'restore':
        const backupPath = args[1];
        if (!backupPath) {
          console.error('❌ Please provide backup path: node backup.js restore <backup-path>');
          process.exit(1);
        }
        await backup.restore(backupPath);
        break;
        
      case 'list':
        await backup.listBackups();
        break;
        
      case 'clean':
        const keepCount = parseInt(args[1]) || 5;
        await backup.cleanOldBackups(keepCount);
        break;
        
      default:
        console.log(`
🗄️ Database Backup Utility

Usage:
  node backup.js backup              - Create a new backup
  node backup.js restore <path>      - Restore from backup
  node backup.js list                - List available backups
  node backup.js clean [count]       - Clean old backups (keep 5 by default)

Examples:
  node backup.js backup
  node backup.js restore ./backups/backup-2024-01-15T10-30-00-000Z
  node backup.js list
  node backup.js clean 3
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseBackup; 