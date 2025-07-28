import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}-afiş.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl h-[90vh] mx-4 bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white truncate">
                {title} - Proje Afişi
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                  title="PDF İndir"
                >
                  <Download className="w-4 h-4" />
                  İndir
                </button>
                <button
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                  title="Yeni Sekmede Aç"
                >
                  <ExternalLink className="w-4 h-4" />
                  Yeni Sekme
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 h-full">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={`${title} Afiş`}
                style={{ height: 'calc(90vh - 80px)' }}
                onError={() => {
                  console.error('PDF yüklenemedi:', pdfUrl);
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 