import React from 'react';
import { RentalData } from '../utils/rental';
import { motion } from 'motion/react';
import AddressAutocomplete, { ParsedAddress } from './AddressAutocomplete';

interface Props {
  data: RentalData;
  onChange: (data: RentalData) => void;
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

export default function RentalForm({ data, onChange }: Props) {
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
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Renter Details</h2>
        <InputField label="Full Name" name="renterName" value={data.renterName} onChange={handleChange} />
        <AddressAutocomplete label="Address" name="renterAddress" value={data.renterAddress} onChange={handleChange} onAddressSelect={(addr: ParsedAddress) => onChange({ ...data, renterAddress: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}` })} />
        <InputField label="Driver's License #" name="renterLicense" uppercase={true} value={data.renterLicense} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Phone" name="renterPhone" value={data.renterPhone} onChange={handleChange} />
          <InputField label="Email" name="renterEmail" type="email" value={data.renterEmail} onChange={handleChange} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Additional Driver</h2>
        <InputField label="Full Name" name="coRenterName" value={data.coRenterName} onChange={handleChange} />
        <AddressAutocomplete label="Address" name="coRenterAddress" value={data.coRenterAddress} onChange={handleChange} onAddressSelect={(addr: ParsedAddress) => onChange({ ...data, coRenterAddress: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}` })} />
        <InputField label="Driver's License #" name="coRenterLicense" uppercase={true} value={data.coRenterLicense} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Phone" name="coRenterPhone" value={data.coRenterPhone} onChange={handleChange} />
          <InputField label="Email" name="coRenterEmail" type="email" value={data.coRenterEmail} onChange={handleChange} />
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
          <InputField label="License Plate" name="vehiclePlate" uppercase={true} value={data.vehiclePlate} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Mileage Out" name="mileageOut" value={data.mileageOut} onChange={handleChange} />
          <InputField label="Mileage In" name="mileageIn" value={data.mileageIn} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Year" name="vehicleYear" value={data.vehicleYear} onChange={handleChange} />
          <InputField label="Make" name="vehicleMake" value={data.vehicleMake} onChange={handleChange} />
          <InputField label="Model" name="vehicleModel" value={data.vehicleModel} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Fuel Level Out</label>
            <select name="fuelLevelOut" value={data.fuelLevelOut} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
              <option value="Full">Full</option>
              <option value="3/4">3/4</option>
              <option value="1/2">1/2</option>
              <option value="1/4">1/4</option>
              <option value="Empty">Empty</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Fuel Level In</label>
            <select name="fuelLevelIn" value={data.fuelLevelIn} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
              <option value="Full">Full</option>
              <option value="3/4">3/4</option>
              <option value="1/2">1/2</option>
              <option value="1/4">1/4</option>
              <option value="Empty">Empty</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
        <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Rental Terms</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Rental Period</label>
            <select name="rentalPeriod" value={data.rentalPeriod} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <InputField label={`Rate per ${data.rentalPeriod === 'Daily' ? 'Day' : data.rentalPeriod === 'Weekly' ? 'Week' : 'Month'} ($)`} name="rentalRate" type="number" min="0" value={data.rentalRate} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Start Date" name="rentalStartDate" type="date" value={data.rentalStartDate} onChange={handleChange} />
          <InputField label="End Date" name="rentalEndDate" type="date" value={data.rentalEndDate} onChange={handleChange} />
        </div>
        <InputField label="Security Deposit ($)" name="securityDeposit" type="number" min="0" value={data.securityDeposit} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Mileage Allowance (per period)" name="mileageAllowance" type="number" min="0" value={data.mileageAllowance} onChange={handleChange} />
          <InputField label="Excess Mileage ($/mile)" name="excessMileageCharge" type="number" step="0.01" min="0" value={data.excessMileageCharge} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Insurance Fee ($/period)" name="insuranceFee" type="number" min="0" value={data.insuranceFee} onChange={handleChange} />
          <InputField label="Add'l Driver Fee ($/period)" name="additionalDriverFee" type="number" min="0" value={data.additionalDriverFee} onChange={handleChange} />
          <InputField label="Tax Rate (%)" name="tax" type="number" step="0.01" min="0" value={data.tax} onChange={handleChange} />
        </div>
        <InputField label="Total Due at Signing ($)" name="dueAtSigning" type="number" min="0" value={data.dueAtSigning} onChange={handleChange} />
      </motion.div>
    </motion.div>
  );
}
