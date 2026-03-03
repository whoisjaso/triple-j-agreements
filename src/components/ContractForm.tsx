import React from 'react';
import { ContractData } from '../utils/finance';
import { motion } from 'motion/react';

interface Props {
  data: ContractData;
  onChange: (data: ContractData) => void;
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

const InputField = ({ label, name, type = "text", uppercase = false, step, min, value, onChange }: any) => (
  <div>
    <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      step={step}
      min={min}
      className={`w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm ${uppercase ? 'uppercase' : ''}`} 
    />
  </div>
);

export default function ContractForm({ data, onChange }: Props) {
  const [isDecoding, setIsDecoding] = React.useState(false);

  const decodeVin = async () => {
    if (!data.vehicleVin || data.vehicleVin.length < 11) return;
    
    setIsDecoding(true);
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${data.vehicleVin}?format=json`);
      const result = await response.json();
      const vehicle = result.Results[0];
      
      if (vehicle) {
        onChange({
          ...data,
          vehicleYear: vehicle.ModelYear || data.vehicleYear,
          vehicleMake: vehicle.Make || data.vehicleMake,
          vehicleModel: vehicle.Model || data.vehicleModel,
        });
      }
    } catch (error) {
      console.error("VIN Decode failed", error);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
      if (name === 'numberOfPayments' && parsedValue < 1) {
        parsedValue = 1;
      } else if (parsedValue < 0) {
        parsedValue = 0;
      }
    } else if (type === 'date') {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        parsedValue = today;
      }
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
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Buyer Details</h2>
        <InputField label="Full Name" name="buyerName" value={data.buyerName} onChange={handleChange} />
        <InputField label="Address" name="buyerAddress" value={data.buyerAddress} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Phone" name="buyerPhone" value={data.buyerPhone} onChange={handleChange} />
          <InputField label="Email" name="buyerEmail" type="email" value={data.buyerEmail} onChange={handleChange} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Co-Buyer Details</h2>
        <InputField label="Full Name" name="coBuyerName" value={data.coBuyerName} onChange={handleChange} />
        <InputField label="Address" name="coBuyerAddress" value={data.coBuyerAddress} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Phone" name="coBuyerPhone" value={data.coBuyerPhone} onChange={handleChange} />
          <InputField label="Email" name="coBuyerEmail" type="email" value={data.coBuyerEmail} onChange={handleChange} />
        </div>
      </motion.div>

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
          <InputField label="Mileage" name="vehicleMileage" value={data.vehicleMileage} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Year" name="vehicleYear" value={data.vehicleYear} onChange={handleChange} />
          <InputField label="Make" name="vehicleMake" value={data.vehicleMake} onChange={handleChange} />
          <InputField label="Model" name="vehicleModel" value={data.vehicleModel} onChange={handleChange} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Financials</h2>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Cash Price ($)" name="cashPrice" type="number" min="0" value={data.cashPrice} onChange={handleChange} />
          <InputField label="Down Payment ($)" name="downPayment" type="number" min="0" value={data.downPayment} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Tax ($)" name="tax" type="number" min="0" value={data.tax} onChange={handleChange} />
          <InputField label="Title/Reg Fee ($)" name="titleFee" type="number" min="0" value={data.titleFee} onChange={handleChange} />
          <InputField label="Doc Fee ($)" name="docFee" type="number" min="0" value={data.docFee} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="APR (%)" name="apr" type="number" step="0.01" min="0" value={data.apr} onChange={handleChange} />
          <InputField label="No. of Payments" name="numberOfPayments" type="number" min="1" value={data.numberOfPayments} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Frequency</label>
            <select name="paymentFrequency" value={data.paymentFrequency} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <InputField label="First Payment" name="firstPaymentDate" type="date" min={new Date().toISOString().split('T')[0]} value={data.firstPaymentDate} onChange={handleChange} />
        </div>
      </motion.div>
    </motion.div>
  );
}
