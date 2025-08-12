import React, { useState } from 'react';
import { importMockData } from '../lib/mockDataImporter';

const DataImporter: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus('Mengimpor data mock...');
    
    try {
      await importMockData();
      setImportStatus('Import berhasil! Data mock telah ditambahkan ke Supabase.');
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      setImportStatus('Gagal mengimpor data. Silakan coba lagi.');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4">
      <div className="w-full max-w-md p-8 text-center bg-brand-surface rounded-2xl shadow-lg border border-brand-border">
        <h2 className="text-2xl font-bold text-gradient mb-4">Setup Database</h2>
        <p className="text-brand-text-secondary mb-6">
          Klik tombol di bawah untuk mengimpor data contoh ke database Supabase Anda.
        </p>
        
        {importStatus && (
          <div className="mb-4 p-3 bg-brand-bg rounded-lg">
            <p className="text-sm text-brand-text-primary">{importStatus}</p>
          </div>
        )}
        
        <button
          onClick={handleImport}
          disabled={isImporting}
          className="button-primary w-full"
        >
          {isImporting ? 'Mengimpor...' : 'Import Data Mock'}
        </button>
      </div>
    </div>
  );
};

export default DataImporter;