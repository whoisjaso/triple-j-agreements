import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Printer, ArrowLeft, Shield, Send, Copy, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { CustomerLinkData, customerFields, encodeCompletedLink } from '../utils/customerPortal';
import { ContractData, calculatePayment, formatCurrency as fcFinance } from '../utils/finance';
import { RentalData, calculateRentalTotal, calculateRentalDuration, formatCurrency as fcRental } from '../utils/rental';
import { BillOfSaleData, calculateBillOfSale, formatCurrency as fcBos } from '../utils/billOfSale';
import { Form130UData, calculateTax, formatCurrency as fcForm } from '../utils/form130U';
import { SignatureData, emptySignatures, DEALER_NAME, DEALER_ADDRESS, DEALER_PHONE } from '../utils/shared';
import ContractPreview from './ContractPreview';
import RentalPreview from './RentalPreview';
import BillOfSalePreview from './BillOfSalePreview';
import Form130UPreview from './Form130UPreview';
import AddressAutocomplete, { ParsedAddress } from './AddressAutocomplete';
import SignaturePad from './SignaturePad';
import IdUpload from './IdUpload';

interface Props {
  linkData: CustomerLinkData;
}

const InputField = ({ label, name, type = "text", uppercase = false, value, onChange, disabled, placeholder }: any) => (
  <div>
    <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm ${uppercase ? 'uppercase' : ''} ${disabled ? 'bg-luxury-bg/50 text-luxury-ink/50 cursor-not-allowed' : ''}`}
    />
  </div>
);

const sectionTitles = {
  financing: 'Financing Contract',
  rental: 'Rental Agreement',
  billOfSale: 'Bill of Sale',
  form130U: 'Form 130-U',
};

export default function CustomerPortal({ linkData }: Props) {
  const [customerData, setCustomerData] = useState<Record<string, unknown>>(() => {
    const fields = customerFields[linkData.s];
    const init: Record<string, unknown> = {};
    for (const f of fields) init[f] = '';
    return init;
  });
  const [signatures, setSignatures] = useState<SignatureData>({
    ...emptySignatures,
    dealerSignature: linkData.ds || '',
    dealerSignatureDate: linkData.dd || '',
  });
  const [view, setView] = useState<'fill' | 'preview'>('fill');
  const [downloading, setDownloading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [dealerReturnLink, setDealerReturnLink] = useState('');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let v: string | number | boolean = value;
    if (type === 'number') v = value === '' ? 0 : parseFloat(value);
    if (type === 'checkbox') v = (e.target as HTMLInputElement).checked;
    setCustomerData(prev => ({ ...prev, [name]: v }));
  };

  const handleAddressSelect = (prefix: string) => (addr: ParsedAddress) => {
    setCustomerData(prev => ({
      ...prev,
      [`${prefix}Address`]: addr.street,
      [`${prefix}City`]: addr.city,
      [`${prefix}State`]: addr.state,
      [`${prefix}Zip`]: addr.zip,
    }));
  };

  const updateSig = (field: keyof SignatureData, value: string) => {
    setSignatures(prev => ({ ...prev, [field]: value }));
  };

  const mergedData = { ...linkData.d, ...customerData };

  const getClientName = () => {
    if (linkData.s === 'financing') return (mergedData.buyerName as string) || 'Document';
    if (linkData.s === 'rental') return (mergedData.renterName as string) || 'Document';
    if (linkData.s === 'billOfSale') return (mergedData.buyerName as string) || 'Document';
    return (mergedData.applicantFirstName as string) || 'Document';
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    setView('preview');

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }, 500);
    });

    const el = previewRef.current;
    if (!el) { setDownloading(false); return; }
    const name = getClientName();
    const sLabel = { financing: 'Contract', rental: 'Rental', billOfSale: 'Bill_of_Sale', form130U: '130-U' }[linkData.s];
    const filename = `Triple_J_${sLabel}_${name.replace(/\s+/g, '_')}.pdf`;
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

  const handleSendToDealer = () => {
    const link = encodeCompletedLink(
      linkData.s,
      linkData.d,
      customerData,
      linkData.ds,
      linkData.dd,
      signatures.buyerSignature,
      signatures.buyerSignatureDate,
      signatures.coBuyerSignature,
      signatures.coBuyerSignatureDate,
      signatures.buyerIdPhoto,
    );
    setDealerReturnLink(link);
    setShowSendModal(true);
    setCopied(false);
  };

  const handleCopyReturnLink = async () => {
    try {
      await navigator.clipboard.writeText(dealerReturnLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = dealerReturnLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const renderDealerSummary = () => {
    const d = linkData.d;
    if (linkData.s === 'financing') {
      const price = fcFinance(d.cashPrice as number || 0);
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Vehicle</span>{d.vehicleYear} {d.vehicleMake} {d.vehicleModel}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">VIN</span><span className="font-mono uppercase">{d.vehicleVin as string}</span></div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Cash Price</span>{price}</div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">APR</span>{d.apr}%</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Payments</span>{d.numberOfPayments} {d.paymentFrequency}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Down Payment</span>{fcFinance(d.downPayment as number || 0)}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Mileage</span>{d.vehicleMileage}</div>
          </div>
        </div>
      );
    }
    if (linkData.s === 'rental') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Vehicle</span>{d.vehicleYear} {d.vehicleMake} {d.vehicleModel}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">VIN</span><span className="font-mono uppercase">{d.vehicleVin as string}</span></div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Rate</span>{fcRental(d.rentalRate as number || 0)} / {d.rentalPeriod}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Start</span>{d.rentalStartDate as string}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">End</span>{d.rentalEndDate as string}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Deposit</span>{fcRental(d.securityDeposit as number || 0)}</div>
          </div>
        </div>
      );
    }
    if (linkData.s === 'billOfSale') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Vehicle</span>{d.vehicleYear} {d.vehicleMake} {d.vehicleModel} {d.vehicleTrim}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">VIN</span><span className="font-mono uppercase">{d.vehicleVin as string}</span></div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Sale Price</span>{fcBos(d.salePrice as number || 0)}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Color</span>{d.vehicleColor as string}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Mileage</span>{d.vehicleMileage as string}</div>
            <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Condition</span>{d.conditionType === 'as_is' ? 'As-Is' : 'Warranty'}</div>
          </div>
        </div>
      );
    }
    // form130U
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Vehicle</span>{d.year} {d.make} {d.model}</div>
          <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">VIN</span><span className="font-mono uppercase">{d.vin as string}</span></div>
          <div><span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold block">Sale Price</span>{fcForm(d.salesPrice as number || 0)}</div>
        </div>
      </div>
    );
  };

  const renderCustomerForm = () => {
    if (linkData.s === 'financing') {
      return (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold border-b border-luxury-ink/10 pb-2">Your Information</h3>
            <InputField label="Full Name" name="buyerName" value={customerData.buyerName} onChange={handleChange} />
            <AddressAutocomplete label="Street Address" name="buyerAddress" value={customerData.buyerAddress as string} onChange={handleChange} onAddressSelect={handleAddressSelect('buyer')} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Phone" name="buyerPhone" value={customerData.buyerPhone} onChange={handleChange} />
              <InputField label="Email" name="buyerEmail" type="email" value={customerData.buyerEmail} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-serif font-semibold border-b border-luxury-ink/10 pb-2">Co-Buyer (if applicable)</h3>
            <InputField label="Full Name" name="coBuyerName" value={customerData.coBuyerName} onChange={handleChange} />
            <InputField label="Address" name="coBuyerAddress" value={customerData.coBuyerAddress} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Phone" name="coBuyerPhone" value={customerData.coBuyerPhone} onChange={handleChange} />
              <InputField label="Email" name="coBuyerEmail" type="email" value={customerData.coBuyerEmail} onChange={handleChange} />
            </div>
          </div>
        </>
      );
    }

    if (linkData.s === 'rental') {
      return (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold border-b border-luxury-ink/10 pb-2">Your Information</h3>
            <InputField label="Full Name" name="renterName" value={customerData.renterName} onChange={handleChange} />
            <AddressAutocomplete label="Street Address" name="renterAddress" value={customerData.renterAddress as string} onChange={handleChange} onAddressSelect={(addr) => setCustomerData(prev => ({ ...prev, renterAddress: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}` }))} />
            <InputField label="Driver's License #" name="renterLicense" uppercase value={customerData.renterLicense} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Phone" name="renterPhone" value={customerData.renterPhone} onChange={handleChange} />
              <InputField label="Email" name="renterEmail" type="email" value={customerData.renterEmail} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-serif font-semibold border-b border-luxury-ink/10 pb-2">Additional Driver (if applicable)</h3>
            <InputField label="Full Name" name="coRenterName" value={customerData.coRenterName} onChange={handleChange} />
            <InputField label="Address" name="coRenterAddress" value={customerData.coRenterAddress} onChange={handleChange} />
            <InputField label="Driver's License #" name="coRenterLicense" uppercase value={customerData.coRenterLicense} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Phone" name="coRenterPhone" value={customerData.coRenterPhone} onChange={handleChange} />
              <InputField label="Email" name="coRenterEmail" type="email" value={customerData.coRenterEmail} onChange={handleChange} />
            </div>
          </div>
        </>
      );
    }

    if (linkData.s === 'billOfSale') {
      return (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold border-b border-luxury-ink/10 pb-2">Your Information</h3>
            <InputField label="Full Name" name="buyerName" value={customerData.buyerName} onChange={handleChange} />
            <AddressAutocomplete label="Street Address" name="buyerAddress" value={customerData.buyerAddress as string} onChange={handleChange} onAddressSelect={handleAddressSelect('buyer')} />
            <div className="grid grid-cols-3 gap-4">
              <InputField label="City" name="buyerCity" value={customerData.buyerCity} onChange={handleChange} />
              <InputField label="State" name="buyerState" uppercase value={customerData.buyerState} onChange={handleChange} />
              <InputField label="Zip" name="buyerZip" value={customerData.buyerZip} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Phone" name="buyerPhone" value={customerData.buyerPhone} onChange={handleChange} />
              <InputField label="Email" name="buyerEmail" type="email" value={customerData.buyerEmail} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Driver's License #" name="buyerLicense" uppercase value={customerData.buyerLicense} onChange={handleChange} />
              <InputField label="DL State" name="buyerLicenseState" uppercase value={customerData.buyerLicenseState} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-serif font-semibold border-b border-luxury-ink/10 pb-2">Co-Buyer (if applicable)</h3>
            <InputField label="Full Name" name="coBuyerName" value={customerData.coBuyerName} onChange={handleChange} />
            <AddressAutocomplete label="Street Address" name="coBuyerAddress" value={customerData.coBuyerAddress as string} onChange={handleChange} onAddressSelect={handleAddressSelect('coBuyer')} />
            <div className="grid grid-cols-3 gap-4">
              <InputField label="City" name="coBuyerCity" value={customerData.coBuyerCity} onChange={handleChange} />
              <InputField label="State" name="coBuyerState" uppercase value={customerData.coBuyerState} onChange={handleChange} />
              <InputField label="Zip" name="coBuyerZip" value={customerData.coBuyerZip} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Phone" name="coBuyerPhone" value={customerData.coBuyerPhone} onChange={handleChange} />
              <InputField label="Email" name="coBuyerEmail" type="email" value={customerData.coBuyerEmail} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Driver's License #" name="coBuyerLicense" uppercase value={customerData.coBuyerLicense} onChange={handleChange} />
              <InputField label="DL State" name="coBuyerLicenseState" uppercase value={customerData.coBuyerLicenseState} onChange={handleChange} />
            </div>
          </div>
        </>
      );
    }

    // form130U
    return (
      <>
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold border-b border-luxury-ink/10 pb-2">Applicant / Owner</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Applicant Type</label>
              <select name="applicantType" value={customerData.applicantType as string || 'Individual'} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <InputField label="ID / FEIN Number" name="applicantIdNumber" uppercase value={customerData.applicantIdNumber} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="ID Type" name="applicantIdType" value={customerData.applicantIdType} onChange={handleChange} placeholder="DL, Passport, etc." />
            <InputField label="ID State" name="applicantIdState" uppercase value={customerData.applicantIdState} onChange={handleChange} />
          </div>
          {(customerData.applicantType as string || 'Individual') === 'Individual' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" name="applicantFirstName" value={customerData.applicantFirstName} onChange={handleChange} />
                <InputField label="Middle Name" name="applicantMiddleName" value={customerData.applicantMiddleName} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Last Name" name="applicantLastName" value={customerData.applicantLastName} onChange={handleChange} />
                <InputField label="Suffix" name="applicantSuffix" value={customerData.applicantSuffix} onChange={handleChange} placeholder="Jr., Sr., III" />
              </div>
            </>
          ) : (
            <InputField label="Entity Name" name="applicantEntityName" value={customerData.applicantEntityName} onChange={handleChange} />
          )}
          <InputField label="Co-Applicant / Co-Owner Name" name="coApplicantName" value={customerData.coApplicantName} onChange={handleChange} />
          <AddressAutocomplete label="Mailing Address" name="mailingAddress" value={customerData.mailingAddress as string} onChange={handleChange} onAddressSelect={(addr) => setCustomerData(prev => ({ ...prev, mailingAddress: addr.street, mailingCity: addr.city, mailingState: addr.state, mailingZip: addr.zip, countyOfResidence: addr.county }))} />
          <div className="grid grid-cols-3 gap-4">
            <InputField label="City" name="mailingCity" value={customerData.mailingCity} onChange={handleChange} />
            <InputField label="State" name="mailingState" uppercase value={customerData.mailingState} onChange={handleChange} />
            <InputField label="Zip" name="mailingZip" value={customerData.mailingZip} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="County of Residence" name="countyOfResidence" value={customerData.countyOfResidence} onChange={handleChange} />
            <InputField label="Date of Birth" name="applicantDob" type="date" value={customerData.applicantDob} onChange={handleChange} />
            <InputField label="Phone" name="applicantPhone" value={customerData.applicantPhone} onChange={handleChange} />
          </div>
          <InputField label="Email" name="applicantEmail" type="email" value={customerData.applicantEmail} onChange={handleChange} />
        </div>
      </>
    );
  };

  if (view === 'preview') {
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
        <div className="bg-luxury-bg/80 backdrop-blur-md border-b border-luxury-ink/10 sticky top-0 z-10 print:hidden">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => setView('fill')} className="flex items-center space-x-2 text-sm text-luxury-ink/70 hover:text-luxury-ink transition-colors">
              <ArrowLeft size={16} />
              <span>Back to Form</span>
            </button>
            <div className="flex items-center space-x-2">
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
        <div className="max-w-7xl mx-auto px-4 py-12 print:p-0 print:m-0 print:max-w-none">
          <div ref={previewRef} className="bg-white shadow-2xl shadow-luxury-ink/5 border border-luxury-ink/10 rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
            {linkData.s === 'financing' && <ContractPreview data={mergedData as unknown as ContractData} signatures={signatures} />}
            {linkData.s === 'rental' && <RentalPreview data={mergedData as unknown as RentalData} signatures={signatures} />}
            {linkData.s === 'billOfSale' && <BillOfSalePreview data={mergedData as unknown as BillOfSaleData} signatures={signatures} />}
            {linkData.s === 'form130U' && <Form130UPreview data={mergedData as unknown as Form130UData} signatures={signatures} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-ink font-sans">
      {/* Header */}
      <header className="bg-luxury-bg/80 backdrop-blur-md border-b border-luxury-ink/10">
        <div className="max-w-3xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
              <img src="/logo.png" alt="Triple J Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold tracking-widest uppercase text-luxury-ink leading-tight">Triple J</h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-ink/60 font-medium">Auto Investment LLC</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield size={14} className="text-green-600" />
            <span className="text-[10px] font-semibold tracking-wider uppercase text-green-700">Secure Document</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-3xl font-serif font-bold uppercase tracking-widest">{sectionTitles[linkData.s]}</h2>
          <p className="text-sm text-luxury-ink/60 mt-2">Please complete your information below to finalize this document.</p>
        </motion.div>

        {/* Dealer Summary (Read-Only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5">
          <div className="flex items-center justify-between border-b border-luxury-ink/10 pb-4 mb-6">
            <h3 className="text-lg font-serif font-semibold">Vehicle & Terms</h3>
            <span className="text-[9px] font-bold tracking-widest uppercase text-luxury-ink/40 bg-luxury-bg px-3 py-1 rounded-full">Dealer Filled</span>
          </div>
          {renderDealerSummary()}
          <div className="mt-4 pt-4 border-t border-luxury-ink/10 text-xs text-luxury-ink/50">
            <span className="font-semibold">Dealer:</span> {DEALER_NAME} &bull; {DEALER_ADDRESS} &bull; {DEALER_PHONE}
          </div>
        </motion.div>

        {/* Customer Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5">
          {renderCustomerForm()}
        </motion.div>

        {/* ID & Signatures */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-8">
          <div className="border-b border-luxury-ink/10 pb-4">
            <h3 className="text-lg font-serif font-semibold">ID Verification & Signature</h3>
            <p className="text-xs text-luxury-ink/50 mt-1">Upload a photo of your ID and sign below to complete the document.</p>
          </div>

          <IdUpload label="Your ID (Driver's License / State ID)" value={signatures.buyerIdPhoto} onChange={(v) => updateSig('buyerIdPhoto', v)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignaturePad
              label={linkData.s === 'rental' ? 'Renter Signature' : 'Buyer Signature'}
              value={signatures.buyerSignature}
              dateValue={signatures.buyerSignatureDate}
              onChange={(v) => updateSig('buyerSignature', v)}
              onDateChange={(v) => updateSig('buyerSignatureDate', v)}
            />
            <SignaturePad
              label={linkData.s === 'rental' ? 'Additional Driver Signature' : 'Co-Buyer Signature'}
              value={signatures.coBuyerSignature}
              dateValue={signatures.coBuyerSignatureDate}
              onChange={(v) => updateSig('coBuyerSignature', v)}
              onDateChange={(v) => updateSig('coBuyerSignatureDate', v)}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center space-y-4 pb-12">
          <div className="flex justify-center space-x-4">
            <button onClick={() => setView('preview')} className="px-8 py-4 bg-luxury-ink text-luxury-gold rounded-full text-sm font-bold tracking-widest uppercase hover:bg-luxury-ink/90 transition-all shadow-lg flex items-center space-x-2 border border-luxury-gold/30">
              <FileText size={16} />
              <span>Preview Document</span>
            </button>
            <button onClick={handleDownloadPDF} disabled={downloading} className="px-8 py-4 bg-luxury-gold text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-luxury-gold/90 transition-all shadow-lg flex items-center space-x-2 border border-luxury-gold-light disabled:opacity-50">
              <Download size={16} />
              <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
          <button onClick={handleSendToDealer} className="px-8 py-4 bg-green-700 text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-green-800 transition-all shadow-lg flex items-center space-x-2 border border-green-600">
            <Send size={16} />
            <span>Send Back to Dealer</span>
          </button>
          <p className="text-xs text-luxury-ink/40 text-center max-w-md">After completing your information and signing, click "Send Back to Dealer" to generate a link you can send back so they can view the finalized document.</p>
        </motion.div>
      </main>

      {/* Send to Dealer Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSendModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-green-700" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Document Ready</h3>
              <p className="text-sm text-luxury-ink/60 mt-2">Your information and signatures have been captured. Share this link with the dealer to complete the process.</p>
            </div>

            <div className="bg-luxury-bg rounded-xl p-4 space-y-3">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/50">Return Link for Dealer</label>
              <div className="flex items-center space-x-2">
                <input type="text" readOnly value={dealerReturnLink} className="flex-1 px-3 py-2 bg-white border border-luxury-ink/10 rounded-lg text-xs font-mono text-luxury-ink/70 truncate" />
                <button
                  onClick={handleCopyReturnLink}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center space-x-1 transition-all ${
                    copied ? 'bg-green-600 text-white' : 'bg-luxury-ink text-luxury-gold hover:bg-luxury-ink/90 border border-luxury-gold/30'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-luxury-bg/50 rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/50">What happens next:</p>
              <ul className="text-xs text-luxury-ink/70 space-y-1.5">
                <li className="flex items-start space-x-2">
                  <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">1</span>
                  <span>Copy this link and send it to the dealer (text, email, etc.)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">2</span>
                  <span>The dealer will see the completed document with both signatures</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">3</span>
                  <span>Both parties can print or download the final document</span>
                </li>
              </ul>
            </div>

            <div className="border border-luxury-ink/10 rounded-xl p-4 bg-luxury-bg/30">
              <p className="text-xs text-luxury-ink/50 text-center">You can also download your own copy using the "Preview" or "Download PDF" buttons above.</p>
            </div>

            <button onClick={() => setShowSendModal(false)} className="w-full py-3 bg-luxury-ink text-luxury-gold rounded-full text-sm font-bold tracking-widest uppercase hover:bg-luxury-ink/90 transition-all border border-luxury-gold/30">
              Done
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
