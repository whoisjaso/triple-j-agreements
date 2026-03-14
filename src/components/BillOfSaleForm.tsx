import React from 'react';
import { BillOfSaleData } from '../utils/billOfSale';
import { motion } from 'motion/react';
import AddressAutocomplete, { ParsedAddress } from './AddressAutocomplete';

interface Props {
  data: BillOfSaleData;
  onChange: (data: BillOfSaleData) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

const InputField = ({ label, name, type = "text", uppercase = false, step, min, value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      step={step}
      min={min}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm ${uppercase ? 'uppercase' : ''}`}
    />
  </div>
);

export default function BillOfSaleForm({ data, onChange }: Props) {
  const [isDecoding, setIsDecoding] = React.useState(false);

  const decodeVin = async () => {
    if (!data.vehicleVin || data.vehicleVin.length < 11) return;

    setIsDecoding(true);
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${data.vehicleVin}?format=json`);
      const result = await response.json();
      const v = result.Results[0];

      if (v) {
        onChange({
          ...data,
          vehicleYear: v.ModelYear || data.vehicleYear,
          vehicleMake: v.Make || data.vehicleMake,
          vehicleModel: v.Model || data.vehicleModel,
          vehicleTrim: v.Trim || data.vehicleTrim,
          vehicleBodyStyle: v.BodyClass || data.vehicleBodyStyle,
        });
      }
    } catch (error) {
      console.error("VIN Decode failed", error);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
      if (parsedValue < 0) parsedValue = 0;
    }
    onChange({ ...data, [name]: parsedValue });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {/* Buyer */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Buyer Details</h2>
        <InputField label="Full Name" name="buyerName" value={data.buyerName} onChange={handleChange} />
        <AddressAutocomplete label="Street Address" name="buyerAddress" value={data.buyerAddress} onChange={handleChange} onAddressSelect={(addr: ParsedAddress) => onChange({ ...data, buyerAddress: addr.street, buyerCity: addr.city, buyerState: addr.state, buyerZip: addr.zip })} />
        <div className="grid grid-cols-3 gap-4">
          <InputField label="City" name="buyerCity" value={data.buyerCity} onChange={handleChange} />
          <InputField label="State" name="buyerState" uppercase={true} value={data.buyerState} onChange={handleChange} />
          <InputField label="Zip" name="buyerZip" value={data.buyerZip} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Phone" name="buyerPhone" value={data.buyerPhone} onChange={handleChange} />
          <InputField label="Email" name="buyerEmail" type="email" value={data.buyerEmail} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Driver's License #" name="buyerLicense" uppercase={true} value={data.buyerLicense} onChange={handleChange} />
          <InputField label="DL State" name="buyerLicenseState" uppercase={true} value={data.buyerLicenseState} onChange={handleChange} />
        </div>
      </motion.div>

      {/* Co-Buyer */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Co-Buyer Details</h2>
        <InputField label="Full Name" name="coBuyerName" value={data.coBuyerName} onChange={handleChange} />
        <AddressAutocomplete label="Street Address" name="coBuyerAddress" value={data.coBuyerAddress} onChange={handleChange} onAddressSelect={(addr: ParsedAddress) => onChange({ ...data, coBuyerAddress: addr.street, coBuyerCity: addr.city, coBuyerState: addr.state, coBuyerZip: addr.zip })} />
        <div className="grid grid-cols-3 gap-4">
          <InputField label="City" name="coBuyerCity" value={data.coBuyerCity} onChange={handleChange} />
          <InputField label="State" name="coBuyerState" uppercase={true} value={data.coBuyerState} onChange={handleChange} />
          <InputField label="Zip" name="coBuyerZip" value={data.coBuyerZip} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Phone" name="coBuyerPhone" value={data.coBuyerPhone} onChange={handleChange} />
          <InputField label="Email" name="coBuyerEmail" type="email" value={data.coBuyerEmail} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Driver's License #" name="coBuyerLicense" uppercase={true} value={data.coBuyerLicense} onChange={handleChange} />
          <InputField label="DL State" name="coBuyerLicenseState" uppercase={true} value={data.coBuyerLicenseState} onChange={handleChange} />
        </div>
      </motion.div>

      {/* Vehicle */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <div className="flex justify-between items-center border-b border-luxury-ink/10 pb-4 mb-6">
          <h2 className="text-2xl font-serif text-luxury-ink">Vehicle Information</h2>
          <button
            onClick={decodeVin}
            disabled={isDecoding || !data.vehicleVin}
            className="text-[10px] font-bold tracking-widest uppercase bg-luxury-gold text-white px-3 py-1.5 rounded-full hover:bg-luxury-gold/90 transition-all disabled:opacity-50"
          >
            {isDecoding ? 'Decoding...' : 'NHTSA VIN Decode'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="VIN" name="vehicleVin" uppercase={true} value={data.vehicleVin} onChange={handleChange} />
          <InputField label="License Plate" name="vehiclePlate" uppercase={true} value={data.vehiclePlate} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Year" name="vehicleYear" value={data.vehicleYear} onChange={handleChange} />
          <InputField label="Make" name="vehicleMake" value={data.vehicleMake} onChange={handleChange} />
          <InputField label="Model" name="vehicleModel" value={data.vehicleModel} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Trim" name="vehicleTrim" value={data.vehicleTrim} onChange={handleChange} />
          <InputField label="Color" name="vehicleColor" value={data.vehicleColor} onChange={handleChange} />
          <InputField label="Body Style" name="vehicleBodyStyle" value={data.vehicleBodyStyle} onChange={handleChange} />
        </div>
        <InputField label="Mileage" name="vehicleMileage" value={data.vehicleMileage} onChange={handleChange} />
        <div className="border-t border-luxury-ink/10 pt-4 mt-2">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-3">Odometer Disclosure</h3>
          <InputField label="Odometer Reading" name="odometerReading" value={data.odometerReading} onChange={handleChange} />
          <div className="mt-3">
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Odometer Status</label>
            <select name="odometerStatus" value={data.odometerStatus} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
              <option value="actual">Actual Mileage</option>
              <option value="exceeds">Exceeds Mechanical Limits</option>
              <option value="not_actual">Not Actual (Odometer Discrepancy)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Pricing & Fees */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Sale Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Sale Date" name="saleDate" type="date" value={data.saleDate} onChange={handleChange} />
          <InputField label="Stock #" name="stockNumber" value={data.stockNumber} onChange={handleChange} />
        </div>
        <InputField label="Sale Price ($)" name="salePrice" type="number" min="0" value={data.salePrice} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Sales Tax ($)" name="tax" type="number" min="0" value={data.tax} onChange={handleChange} />
          <InputField label="Title Fee ($)" name="titleFee" type="number" min="0" value={data.titleFee} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Doc Fee ($)" name="docFee" type="number" min="0" value={data.docFee} onChange={handleChange} />
          <InputField label="Registration ($)" name="registrationFee" type="number" min="0" value={data.registrationFee} onChange={handleChange} />
          <InputField label="Other Fees ($)" name="otherFees" type="number" min="0" value={data.otherFees} onChange={handleChange} />
        </div>
        {data.otherFees > 0 && (
          <InputField label="Other Fees Description" name="otherFeesDescription" value={data.otherFeesDescription} onChange={handleChange} />
        )}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Payment Method</label>
          <select name="paymentMethod" value={data.paymentMethod} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
            <option value="Cash">Cash</option>
            <option value="Certified Check">Certified Check</option>
            <option value="Cashier Check">Cashier's Check</option>
            <option value="Zelle">Zelle</option>
            <option value="CashApp">CashApp</option>
            <option value="Financing">Financing (See Installment Contract)</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {data.paymentMethod === 'Other' && (
          <InputField label="Specify Payment Method" name="paymentMethodOther" value={data.paymentMethodOther} onChange={handleChange} />
        )}
      </motion.div>

      {/* Trade-In */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Trade-In Vehicle</h2>
        <InputField label="Trade-In Description" name="tradeInDescription" value={data.tradeInDescription} onChange={handleChange} placeholder="e.g. 2018 Honda Civic LX" />
        <InputField label="Trade-In VIN" name="tradeInVin" uppercase={true} value={data.tradeInVin} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Trade-In Allowance ($)" name="tradeInAllowance" type="number" min="0" value={data.tradeInAllowance} onChange={handleChange} />
          <InputField label="Trade-In Payoff ($)" name="tradeInPayoff" type="number" min="0" value={data.tradeInPayoff} onChange={handleChange} />
        </div>
      </motion.div>

      {/* Condition / Warranty */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Vehicle Condition</h2>
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Sale Type</label>
          <select name="conditionType" value={data.conditionType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
            <option value="as_is">As-Is — No Dealer Warranty</option>
            <option value="warranty">With Warranty</option>
          </select>
        </div>
        {data.conditionType === 'warranty' && (
          <>
            <InputField label="Warranty Duration" name="warrantyDuration" value={data.warrantyDuration} onChange={handleChange} placeholder="e.g. 30 Days / 1,000 Miles" />
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Warranty Coverage</label>
              <textarea
                name="warrantyDescription"
                value={data.warrantyDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Describe what the warranty covers..."
                className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm resize-none"
              />
            </div>
          </>
        )}
        {data.conditionType === 'as_is' && (
          <div className="border-2 border-red-900/20 p-5 bg-red-50/50 rounded-lg">
            <p className="text-xs text-red-900/80 leading-relaxed">
              <strong>AS-IS DISCLAIMER:</strong> The vehicle will be sold with no dealer warranty. The buyer acknowledges that the dealer assumes no responsibility for any repairs. This will be reflected in the Bill of Sale document.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
