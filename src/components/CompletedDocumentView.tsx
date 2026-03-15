import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Printer, ArrowLeft, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { CompletedLinkData } from '../utils/customerPortal';
import { ContractData } from '../utils/finance';
import { RentalData } from '../utils/rental';
import { BillOfSaleData } from '../utils/billOfSale';
import { Form130UData } from '../utils/form130U';
import { SignatureData } from '../utils/shared';
import ContractPreview from './ContractPreview';
import RentalPreview from './RentalPreview';
import BillOfSalePreview from './BillOfSalePreview';
import Form130UPreview from './Form130UPreview';

interface Props {
  data: CompletedLinkData;
}

const sectionTitles = {
  financing: 'Financing Contract',
  rental: 'Rental Agreement',
  billOfSale: 'Bill of Sale',
  form130U: 'Form 130-U',
};

export default function CompletedDocumentView({ data }: Props) {
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Merge dealer + customer data
  const mergedData = { ...data.dd, ...data.cd };

  // Reconstruct signatures from the completed link
  const signatures: SignatureData = {
    buyerIdPhoto: data.bi || '',
    buyerSignature: data.bs || '',
    buyerSignatureDate: data.bsd || '',
    coBuyerSignature: data.cs || '',
    coBuyerSignatureDate: data.csd || '',
    dealerSignature: data.ds || '',
    dealerSignatureDate: data.dsd || '',
  };

  const getClientName = () => {
    if (data.s === 'financing') return (mergedData.buyerName as string) || 'Document';
    if (data.s === 'rental') return (mergedData.renterName as string) || 'Document';
    if (data.s === 'billOfSale') return (mergedData.buyerName as string) || 'Document';
    return (mergedData.applicantFirstName as string) || 'Document';
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }, 500);
    });

    const el = previewRef.current;
    if (!el) { setDownloading(false); return; }
    const name = getClientName();
    const sLabel = { financing: 'Contract', rental: 'Rental', billOfSale: 'Bill_of_Sale', form130U: '130-U' }[data.s];
    const filename = `Triple_J_${sLabel}_${name.replace(/\s+/g, '_')}_COMPLETED.pdf`;
    try {
      const opt = {
        margin: 0, filename,
        image: { type: 'jpeg' as const, quality: 0.85 },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          logging: false,
          onclone: (clonedDoc: Document) => {
            clonedDoc.querySelectorAll('[data-pdf-skip]').forEach((node) => node.remove());
          },
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
        pagebreak: { mode: ['css', 'legacy'] },
      };
      await html2pdf().set(opt).from(el).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try using the Print button instead.');
    } finally {
      setDownloading(false);
    }
  };

  const handleBackToApp = () => {
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-luxury-bg">
      {downloading && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin" />
            <p className="text-sm font-semibold tracking-widest uppercase text-luxury-ink/70">Generating PDF...</p>
            <p className="text-xs text-luxury-ink/40">This may take a few seconds</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-luxury-bg/80 backdrop-blur-md border-b border-luxury-ink/10 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={handleBackToApp} className="flex items-center space-x-2 text-sm text-luxury-ink/70 hover:text-luxury-ink transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-green-700 mr-4">
              <CheckCircle size={16} />
              <span className="text-[10px] font-bold tracking-widest uppercase">Completed Document</span>
            </div>
            <button onClick={handleDownloadPDF} disabled={downloading} className="px-4 py-2 bg-luxury-ink text-luxury-gold rounded-full text-[10px] font-semibold tracking-wider uppercase hover:bg-luxury-ink/90 transition-all flex items-center space-x-1 border border-luxury-gold/30 disabled:opacity-50">
              <Download size={12} />
              <span>{downloading ? '...' : 'PDF'}</span>
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-luxury-gold text-white rounded-full text-[10px] font-semibold tracking-wider uppercase hover:bg-luxury-gold/90 transition-all flex items-center space-x-1 border border-luxury-gold-light">
              <Printer size={12} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="print:hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 pt-8"
        >
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle size={24} className="text-green-700" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-green-900">{sectionTitles[data.s]} — Fully Completed</h2>
              <p className="text-sm text-green-700/80 mt-1">
                Both the dealer and customer have signed this document. You can now print or download the finalized copy for your records.
              </p>
              <div className="flex space-x-4 mt-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${signatures.dealerSignature ? 'bg-green-500' : 'bg-red-400'}`}></div>
                  <span className="text-green-800/70 font-medium">Dealer Signed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${signatures.buyerSignature ? 'bg-green-500' : 'bg-red-400'}`}></div>
                  <span className="text-green-800/70 font-medium">Customer Signed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${signatures.buyerIdPhoto ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                  <span className="text-green-800/70 font-medium">ID on File</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Document Preview */}
      <div className="max-w-7xl mx-auto px-4 py-8 print:p-0 print:m-0 print:max-w-none">
        <div ref={previewRef} className="bg-white shadow-2xl shadow-luxury-ink/5 border border-luxury-ink/10 rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
          {data.s === 'financing' && <ContractPreview data={mergedData as unknown as ContractData} signatures={signatures} />}
          {data.s === 'rental' && <RentalPreview data={mergedData as unknown as RentalData} signatures={signatures} />}
          {data.s === 'billOfSale' && <BillOfSalePreview data={mergedData as unknown as BillOfSaleData} signatures={signatures} />}
          {data.s === 'form130U' && <Form130UPreview data={mergedData as unknown as Form130UData} signatures={signatures} />}
        </div>
      </div>
    </div>
  );
}
