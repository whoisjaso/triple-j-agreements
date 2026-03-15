import React, { useState, useRef, useEffect } from 'react';
import { Printer, FileText, Edit3, Download, Car, KeyRound, ScrollText, FileSignature, Send, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from 'html2pdf.js';
import ContractForm from './components/ContractForm';
import ContractPreview from './components/ContractPreview';
import RentalForm from './components/RentalForm';
import RentalPreview from './components/RentalPreview';
import BillOfSaleForm from './components/BillOfSaleForm';
import BillOfSalePreview from './components/BillOfSalePreview';
import Form130UForm from './components/Form130UForm';
import Form130UPreview from './components/Form130UPreview';
import CustomerPortal from './components/CustomerPortal';
import CompletedDocumentView from './components/CompletedDocumentView';
import { ContractData } from './utils/finance';
import { RentalData } from './utils/rental';
import { BillOfSaleData } from './utils/billOfSale';
import { Form130UData, prefillFromBillOfSale } from './utils/form130U';
import { SignatureData, emptySignatures } from './utils/shared';
import SignatureBlock from './components/SignatureBlock';
import { encodeCustomerLink, decodeCustomerLink, decodeCompletedLink, CustomerLinkData, CompletedLinkData } from './utils/customerPortal';

type Section = 'financing' | 'rental' | 'billOfSale' | 'form130U';

const initialContractData: ContractData = {
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
  vehiclePlate: '',
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
  dueAtSigning: 0,
};

const initialRentalData: RentalData = {
  renterName: '',
  renterAddress: '',
  renterPhone: '',
  renterEmail: '',
  renterLicense: '',
  coRenterName: '',
  coRenterAddress: '',
  coRenterPhone: '',
  coRenterEmail: '',
  coRenterLicense: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleVin: '',
  vehiclePlate: '',
  mileageOut: '',
  mileageIn: '',
  fuelLevelOut: 'Full',
  fuelLevelIn: 'Full',
  rentalRate: 0,
  rentalPeriod: 'Daily',
  rentalStartDate: new Date().toISOString().split('T')[0],
  rentalEndDate: '',
  securityDeposit: 0,
  mileageAllowance: 0,
  excessMileageCharge: 0,
  insuranceFee: 0,
  additionalDriverFee: 0,
  tax: 0,
  dueAtSigning: 0,
};

const initialBillOfSaleData: BillOfSaleData = {
  saleDate: new Date().toISOString().split('T')[0],
  stockNumber: '',
  buyerName: '',
  buyerAddress: '',
  buyerCity: '',
  buyerState: '',
  buyerZip: '',
  buyerPhone: '',
  buyerEmail: '',
  buyerLicense: '',
  buyerLicenseState: '',
  coBuyerName: '',
  coBuyerAddress: '',
  coBuyerCity: '',
  coBuyerState: '',
  coBuyerZip: '',
  coBuyerPhone: '',
  coBuyerEmail: '',
  coBuyerLicense: '',
  coBuyerLicenseState: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleTrim: '',
  vehicleVin: '',
  vehiclePlate: '',
  vehicleColor: '',
  vehicleBodyStyle: '',
  vehicleMileage: '',
  odometerReading: '',
  odometerStatus: 'actual',
  salePrice: 0,
  tradeInAllowance: 0,
  tradeInDescription: '',
  tradeInVin: '',
  tradeInPayoff: 0,
  tax: 0,
  titleFee: 0,
  docFee: 0,
  registrationFee: 0,
  otherFees: 0,
  otherFeesDescription: '',
  paymentMethod: 'Cash',
  paymentMethodOther: '',
  conditionType: 'as_is',
  warrantyDuration: '',
  warrantyDescription: '',
};

const initialForm130UData: Form130UData = {
  applicationType: 'titleAndRegistration',
  vin: '',
  year: '',
  make: '',
  bodyStyle: '',
  model: '',
  majorColor: '',
  minorColor: '',
  licensePlateNo: '',
  odometerReading: '',
  odometerBrand: 'A',
  emptyWeight: '',
  carryingCapacity: '',
  applicantType: 'Individual',
  applicantIdNumber: '',
  applicantIdType: 'DL',
  applicantIdState: 'TX',
  applicantFirstName: '',
  applicantMiddleName: '',
  applicantLastName: '',
  applicantSuffix: '',
  applicantEntityName: '',
  coApplicantName: '',
  mailingAddress: '',
  mailingCity: '',
  mailingState: '',
  mailingZip: '',
  countyOfResidence: '',
  applicantDob: '',
  applicantPhone: '',
  applicantEmail: '',
  previousOwnerName: 'Triple J Auto Investment LLC',
  previousOwnerCity: 'Houston',
  previousOwnerState: 'TX',
  vehicleLocationAddress: '',
  vehicleLocationCity: '',
  vehicleLocationState: '',
  vehicleLocationZip: '',
  vehicleLocationCounty: '',
  vehicleLocationSameAsMailing: true,
  lienholderName: '',
  lienholderAddress: '',
  lienholderCity: '',
  lienholderState: '',
  lienholderZip: '',
  hasLien: false,
  salesPrice: 0,
  tradeInAllowance: 0,
  taxRate: 6.25,
  rebateOrIncentive: 0,
  tradeInDescription: '',
  tradeInVin: '',
  saleDate: new Date().toISOString().split('T')[0],
  remarks: '',
};

const sectionLabels: Record<Section, string> = {
  financing: 'Contract',
  rental: 'Rental',
  billOfSale: 'Bill_of_Sale',
  form130U: '130-U',
};

export default function App() {
  const [customerMode, setCustomerMode] = useState<CustomerLinkData | null>(null);
  const [completedMode, setCompletedMode] = useState<CompletedLinkData | null>(null);
  const [section, setSection] = useState<Section>('financing');
  const [contractData, setContractData] = useState<ContractData>(initialContractData);
  const [rentalData, setRentalData] = useState<RentalData>(initialRentalData);
  const [billOfSaleData, setBillOfSaleData] = useState<BillOfSaleData>(initialBillOfSaleData);
  const [form130UData, setForm130UData] = useState<Form130UData>(initialForm130UData);
  const [signatures, setSignatures] = useState<SignatureData>(emptySignatures);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [downloading, setDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Detect customer mode or completed mode from URL hash
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#customer/')) {
        const data = decodeCustomerLink(hash);
        if (data) {
          setCustomerMode(data);
          setCompletedMode(null);
        }
      } else if (hash.startsWith('#completed/')) {
        const data = decodeCompletedLink(hash);
        if (data) {
          setCompletedMode(data);
          setCustomerMode(null);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // If in customer mode, render the customer portal
  if (customerMode) {
    return <CustomerPortal linkData={customerMode} />;
  }

  // If in completed mode, render the finalized document with both parties' data
  if (completedMode) {
    return <CompletedDocumentView data={completedMode} />;
  }

  const handlePrint = async () => {
    const prevView = view;
    setView('preview');
    await new Promise(r => setTimeout(r, 400));
    window.print();
    setView(prevView);
  };

  const getClientName = () => {
    if (section === 'financing') return contractData.buyerName || 'Document';
    if (section === 'rental') return rentalData.renterName || 'Document';
    if (section === 'billOfSale') return billOfSaleData.buyerName || 'Document';
    const n = form130UData.applicantType === 'Individual'
      ? [form130UData.applicantFirstName, form130UData.applicantLastName].filter(Boolean).join('_')
      : form130UData.applicantEntityName;
    return n || 'Document';
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const prevView = view;
    setView('preview');

    // Wait for AnimatePresence exit/enter + ensure loading overlay is painted
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }, 500);
    });

    const element = previewRef.current;
    if (!element) {
      setDownloading(false);
      return;
    }

    const name = getClientName();
    const filename = `Triple_J_${sectionLabels[section]}_${name.replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin: 0,
      filename,
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

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try using the Print button instead.');
    } finally {
      setView(prevView);
      setDownloading(false);
    }
  };

  const handlePrefill130U = () => {
    const prefilled = prefillFromBillOfSale(billOfSaleData);
    setForm130UData((prev) => ({ ...prev, ...prefilled }));
  };

  const switchSection = (s: Section) => {
    setSection(s);
    setView('edit');
  };

  const getCurrentData = () => {
    if (section === 'financing') return contractData;
    if (section === 'rental') return rentalData;
    if (section === 'billOfSale') return billOfSaleData;
    return form130UData;
  };

  const handleSendToCustomer = () => {
    const data = getCurrentData();
    const link = encodeCustomerLink(section, data, signatures.dealerSignature, signatures.dealerSignatureDate);
    setShareLink(link);
    setShowShareModal(true);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
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
              <img src="/logo.png" alt="Triple J Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold tracking-widest uppercase text-luxury-ink leading-tight">Triple J</h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-ink/60 font-medium">Auto Investment LLC</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-1.5"
          >
            {/* Section Switcher */}
            <div className="bg-luxury-ink/5 p-1 rounded-full border border-luxury-ink/10 flex mr-3">
              <button
                onClick={() => switchSection('financing')}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all flex items-center space-x-1 ${
                  section === 'financing' ? 'bg-luxury-gold text-white shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <Car size={12} />
                <span>Financing</span>
              </button>
              <button
                onClick={() => switchSection('rental')}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all flex items-center space-x-1 ${
                  section === 'rental' ? 'bg-luxury-gold text-white shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <KeyRound size={12} />
                <span>Rental</span>
              </button>
              <button
                onClick={() => switchSection('billOfSale')}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all flex items-center space-x-1 ${
                  section === 'billOfSale' ? 'bg-luxury-gold text-white shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <ScrollText size={12} />
                <span>Bill of Sale</span>
              </button>
              <button
                onClick={() => switchSection('form130U')}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all flex items-center space-x-1 ${
                  section === 'form130U' ? 'bg-luxury-gold text-white shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <FileSignature size={12} />
                <span>130-U</span>
              </button>
            </div>

            {/* View Switcher */}
            <div className="bg-white/50 p-1 rounded-full border border-luxury-ink/5 flex">
              <button
                onClick={() => setView('edit')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all flex items-center space-x-1 ${
                  view === 'edit' ? 'bg-luxury-ink text-luxury-gold shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setView('preview')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all flex items-center space-x-1 ${
                  view === 'preview' ? 'bg-luxury-ink text-luxury-gold shadow-md' : 'text-luxury-ink/60 hover:text-luxury-ink'
                }`}
              >
                <FileText size={12} />
                <span>Preview</span>
              </button>
            </div>

            {/* Send to Customer */}
            <button
              onClick={handleSendToCustomer}
              className="px-4 py-2 bg-green-700 text-white rounded-full text-[10px] font-semibold tracking-wider uppercase hover:bg-green-800 transition-all shadow-lg flex items-center space-x-1 ml-2 border border-green-600"
            >
              <Send size={12} />
              <span>Send to Customer</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 bg-luxury-ink text-luxury-gold rounded-full text-[10px] font-semibold tracking-wider uppercase hover:bg-luxury-ink/90 transition-all shadow-lg shadow-luxury-ink/10 flex items-center space-x-1 ml-1 border border-luxury-gold/30 disabled:opacity-50"
            >
              <Download size={12} />
              <span>{downloading ? '...' : 'PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-luxury-gold text-white rounded-full text-[10px] font-semibold tracking-wider uppercase hover:bg-luxury-gold/90 transition-all shadow-lg shadow-luxury-gold/20 flex items-center space-x-1 ml-1 border border-luxury-gold-light"
            >
              <Printer size={12} />
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
                key={`edit-${section}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-12 print:hidden"
              >
                {section === 'financing' && <ContractForm data={contractData} onChange={setContractData} />}
                {section === 'rental' && <RentalForm data={rentalData} onChange={setRentalData} />}
                {section === 'billOfSale' && <BillOfSaleForm data={billOfSaleData} onChange={setBillOfSaleData} />}
                {section === 'form130U' && <Form130UForm data={form130UData} onChange={setForm130UData} onPrefill={handlePrefill130U} />}
                <SignatureBlock signatures={signatures} onChange={setSignatures} mode="dealer" />
              </motion.div>
            )}

            {view === 'preview' && (
              <motion.div
                key={`preview-${section}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-12 print:block"
              >
                <div ref={previewRef} className="bg-white shadow-2xl shadow-luxury-ink/5 border border-luxury-ink/10 rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
                  {section === 'financing' && <ContractPreview data={contractData} signatures={signatures} />}
                  {section === 'rental' && <RentalPreview data={rentalData} signatures={signatures} />}
                  {section === 'billOfSale' && <BillOfSalePreview data={billOfSaleData} signatures={signatures} />}
                  {section === 'form130U' && <Form130UPreview data={form130UData} signatures={signatures} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Share Link Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-green-700" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Send to Customer</h3>
                <p className="text-sm text-luxury-ink/60 mt-2">Share this link with your customer. They'll fill in their personal information, upload their ID, sign, and can print their own copy.</p>
              </div>

              <div className="bg-luxury-bg rounded-xl p-4 space-y-3">
                <label className="text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/50">Customer Link</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="flex-1 px-3 py-2 bg-white border border-luxury-ink/10 rounded-lg text-xs font-mono text-luxury-ink/70 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center space-x-1 transition-all ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-luxury-ink text-luxury-gold hover:bg-luxury-ink/90 border border-luxury-gold/30'
                    }`}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-luxury-bg/50 rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/50">What the customer will do:</p>
                <ul className="text-xs text-luxury-ink/70 space-y-1.5">
                  <li className="flex items-start space-x-2">
                    <span className="w-4 h-4 bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">1</span>
                    <span>View vehicle details and terms you've set</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-4 h-4 bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">2</span>
                    <span>Fill in their personal information (name, address, phone, etc.)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-4 h-4 bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">3</span>
                    <span>Take a photo of their ID for verification</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-4 h-4 bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">4</span>
                    <span>Sign the document digitally</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-4 h-4 bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">5</span>
                    <span>Print or download their own copy</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 bg-luxury-ink text-luxury-gold rounded-full text-sm font-bold tracking-widest uppercase hover:bg-luxury-ink/90 transition-all border border-luxury-gold/30"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Generation Overlay */}
      {downloading && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin" />
            <p className="text-sm font-semibold tracking-widest uppercase text-luxury-ink/70">Generating PDF...</p>
            <p className="text-xs text-luxury-ink/40">This may take a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}
