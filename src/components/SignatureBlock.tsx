import React from 'react';
import { motion } from 'motion/react';
import { SignatureData } from '../utils/shared';
import SignaturePad from './SignaturePad';
import IdUpload from './IdUpload';

interface Props {
  signatures: SignatureData;
  onChange: (signatures: SignatureData) => void;
  showCoBuyer?: boolean;
  mode?: 'dealer' | 'customer' | 'all';
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function SignatureBlock({ signatures, onChange, showCoBuyer = true, mode = 'all' }: Props) {
  const update = (field: keyof SignatureData, value: string) => {
    onChange({ ...signatures, [field]: value });
  };

  const showCustomerSigs = mode === 'all' || mode === 'customer';
  const showDealerSig = mode === 'all' || mode === 'dealer';

  const title = mode === 'dealer'
    ? 'Dealer Signature'
    : mode === 'customer'
      ? 'Customer Signature & ID Verification'
      : 'Digital Signatures & ID Verification';

  const subtitle = mode === 'dealer'
    ? 'Sign your section below. Customer signatures will be collected separately via the shared link.'
    : mode === 'customer'
      ? 'Upload your ID and sign below to complete the document.'
      : 'Signatures and ID photos are applied across all documents for this transaction.';

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto mt-8"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-8">
        <div className="border-b border-luxury-ink/10 pb-4">
          <h2 className="text-2xl font-serif text-luxury-ink">{title}</h2>
          <p className="text-xs text-luxury-ink/50 mt-1">{subtitle}</p>
        </div>

        {/* ID Photo — only in customer or all mode */}
        {showCustomerSigs && (
          <IdUpload
            label="Customer ID Photo (Driver's License / State ID)"
            value={signatures.buyerIdPhoto}
            onChange={(v) => update('buyerIdPhoto', v)}
          />
        )}

        {/* Signatures Grid */}
        <div className={`grid grid-cols-1 ${
          mode === 'dealer' ? 'md:grid-cols-1 max-w-sm' :
          mode === 'customer' ? (showCoBuyer ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-sm') :
          (showCoBuyer ? 'md:grid-cols-3' : 'md:grid-cols-2')
        } gap-6`}>
          {showCustomerSigs && (
            <SignaturePad
              label="Buyer / Renter Signature"
              value={signatures.buyerSignature}
              dateValue={signatures.buyerSignatureDate}
              onChange={(v) => update('buyerSignature', v)}
              onDateChange={(v) => update('buyerSignatureDate', v)}
            />
          )}
          {showCustomerSigs && showCoBuyer && (
            <SignaturePad
              label="Co-Buyer / Additional Driver"
              value={signatures.coBuyerSignature}
              dateValue={signatures.coBuyerSignatureDate}
              onChange={(v) => update('coBuyerSignature', v)}
              onDateChange={(v) => update('coBuyerSignatureDate', v)}
            />
          )}
          {showDealerSig && (
            <SignaturePad
              label="Dealer Representative"
              value={signatures.dealerSignature}
              dateValue={signatures.dealerSignatureDate}
              onChange={(v) => update('dealerSignature', v)}
              onDateChange={(v) => update('dealerSignatureDate', v)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
