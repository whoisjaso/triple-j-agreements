import React from 'react';
import { motion } from 'motion/react';
import { SignatureData } from '../utils/shared';
import SignaturePad from './SignaturePad';
import IdUpload from './IdUpload';

interface Props {
  signatures: SignatureData;
  onChange: (signatures: SignatureData) => void;
  showCoBuyer?: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function SignatureBlock({ signatures, onChange, showCoBuyer = true }: Props) {
  const update = (field: keyof SignatureData, value: string) => {
    onChange({ ...signatures, [field]: value });
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto mt-8"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-8">
        <div className="border-b border-luxury-ink/10 pb-4">
          <h2 className="text-2xl font-serif text-luxury-ink">Digital Signatures & ID Verification</h2>
          <p className="text-xs text-luxury-ink/50 mt-1">Signatures and ID photos are applied across all documents for this transaction.</p>
        </div>

        {/* ID Photo */}
        <IdUpload
          label="Customer ID Photo (Driver's License / State ID)"
          value={signatures.buyerIdPhoto}
          onChange={(v) => update('buyerIdPhoto', v)}
        />

        {/* Signatures Grid */}
        <div className={`grid grid-cols-1 ${showCoBuyer ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          <SignaturePad
            label="Buyer / Renter Signature"
            value={signatures.buyerSignature}
            dateValue={signatures.buyerSignatureDate}
            onChange={(v) => update('buyerSignature', v)}
            onDateChange={(v) => update('buyerSignatureDate', v)}
          />
          {showCoBuyer && (
            <SignaturePad
              label="Co-Buyer / Additional Driver"
              value={signatures.coBuyerSignature}
              dateValue={signatures.coBuyerSignatureDate}
              onChange={(v) => update('coBuyerSignature', v)}
              onDateChange={(v) => update('coBuyerSignatureDate', v)}
            />
          )}
          <SignaturePad
            label="Dealer Representative"
            value={signatures.dealerSignature}
            dateValue={signatures.dealerSignatureDate}
            onChange={(v) => update('dealerSignature', v)}
            onDateChange={(v) => update('dealerSignatureDate', v)}
          />
        </div>
      </div>
    </motion.div>
  );
}
