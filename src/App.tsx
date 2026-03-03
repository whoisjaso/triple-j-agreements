import React, { useState, useRef } from 'react';
import { Printer, FileText, Edit3, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from 'html2pdf.js';
import ContractForm from './components/ContractForm';
import ContractPreview from './components/ContractPreview';
import { ContractData } from './utils/finance';

const initialData: ContractData = {
  buyerName: '',
  buyerAddress: '',
  buyerPhone: '',
  buyerEmail: '',
  coBuyerName: '',
  coBuyerAddress: '',
  coBuyerPhone: '',
  coBuyerEmail: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleVin: '',
  vehicleMileage: '',
  cashPrice: 0,
  downPayment: 0,
  tax: 0,
  titleFee: 0,
  docFee: 0,
  apr: 0,
  numberOfPayments: 36,
  paymentFrequency: 'Monthly',
  firstPaymentDate: new Date().toISOString().split('T')[0],
};

export default function App() {
  const [data, setData] = useState<ContractData>(initialData);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const prevView = view;
    setView('preview');

    // Wait for the preview to render
    await new Promise((r) => setTimeout(r, 300));

    const element = previewRef.current;
    if (!element) {
      setDownloading(false);
      return;
    }

    const buyerName = data.buyerName || 'Contract';
    const filename = `Triple_J_Contract_${buyerName.replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      setView(prevView);
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-ink font-sans selection:bg-luxury-gold selection:text-white">
      <header className="bg-luxury-bg/80 backdrop-blur-md border-b border-luxury-ink/10 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
              <img
                src="/logo.png"
                alt="Triple J Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold tracking-widest uppercase text-luxury-ink leading-tight">Triple J</h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-ink/60 font-medium">Auto Investment LLC</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="bg-white/50 p-1 rounded-full border border-luxury-ink/5 flex">
              <button
                onClick={() => setView('edit')}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center space-x-2 ${
                  view === 'edit' ? 'bg-luxury-ink text-luxury-gold shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setView('preview')}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center space-x-2 ${
                  view === 'preview' ? 'bg-luxury-ink text-luxury-gold shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <FileText size={14} />
                <span>Preview</span>
              </button>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-6 py-2.5 bg-luxury-ink text-luxury-gold rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-luxury-ink/90 transition-all shadow-lg shadow-luxury-ink/10 flex items-center space-x-2 ml-4 border border-luxury-gold/30 disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-luxury-gold text-white rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-luxury-gold/90 transition-all shadow-lg shadow-luxury-gold/20 flex items-center space-x-2 ml-2 border border-luxury-gold-light"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:p-0 print:m-0 print:max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 print:block">
          <AnimatePresence mode="wait">
            {view === 'edit' && (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-12 print:hidden"
              >
                <ContractForm data={data} onChange={setData} />
              </motion.div>
            )}
            
            {view === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-12 print:block"
              >
                <div ref={previewRef} className="bg-white shadow-2xl shadow-luxury-ink/5 border border-luxury-ink/10 rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
                  <ContractPreview data={data} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
