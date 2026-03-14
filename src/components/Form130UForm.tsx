import React from 'react';
import { Form130UData } from '../utils/form130U';
import { motion } from 'motion/react';
import AddressAutocomplete, { ParsedAddress } from './AddressAutocomplete';

interface Props {
  data: Form130UData;
  onChange: (data: Form130UData) => void;
  onPrefill: () => void;
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

const InputField = ({ label, name, type = "text", uppercase = false, step, min, value, onChange, placeholder, disabled }: any) => (
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
      disabled={disabled}
      className={`w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm ${uppercase ? 'uppercase' : ''} ${disabled ? 'bg-luxury-bg/50 text-luxury-ink/50' : ''}`}
    />
  </div>
);

export default function Form130UForm({ data, onChange, onPrefill }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
      if (typeof parsedValue === 'number' && parsedValue < 0) parsedValue = 0;
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    onChange({ ...data, [name]: parsedValue });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Pre-fill Banner */}
      <motion.div variants={itemVariants} className="bg-luxury-gold/10 border border-luxury-gold/30 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-semibold text-luxury-ink">Auto-Fill from Bill of Sale</h2>
          <p className="text-xs text-luxury-ink/60 mt-1">Pull vehicle, buyer, and sale data from your Bill of Sale to pre-fill this 130-U form.</p>
        </div>
        <button
          onClick={onPrefill}
          className="px-6 py-3 bg-luxury-gold text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-luxury-gold/90 transition-all shadow-lg shadow-luxury-gold/20 border border-luxury-gold-light whitespace-nowrap"
        >
          Pre-Fill from Bill of Sale
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Application Type */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
          <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Application Type</h2>
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Applying For</label>
            <select name="applicationType" value={data.applicationType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
              <option value="titleAndRegistration">Title and Registration</option>
              <option value="titleOnly">Title Only</option>
              <option value="registrationOnly">Registration Purposes Only</option>
              <option value="nontitle">Nontitle Registration</option>
            </select>
          </div>
          <InputField label="Sale Date" name="saleDate" type="date" value={data.saleDate} onChange={handleChange} />
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">Remarks / Notes</label>
            <textarea
              name="remarks"
              value={data.remarks}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm resize-none"
            />
          </div>
        </motion.div>

        {/* Vehicle Description */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
          <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Vehicle Description</h2>
          <InputField label="1. Vehicle Identification Number (VIN)" name="vin" uppercase={true} value={data.vin} onChange={handleChange} />
          <div className="grid grid-cols-3 gap-4">
            <InputField label="2. Year" name="year" value={data.year} onChange={handleChange} />
            <InputField label="3. Make" name="make" value={data.make} onChange={handleChange} />
            <InputField label="4. Body Style" name="bodyStyle" value={data.bodyStyle} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="5. Model" name="model" value={data.model} onChange={handleChange} />
            <InputField label="6. Major Color" name="majorColor" value={data.majorColor} onChange={handleChange} />
            <InputField label="7. Minor Color" name="minorColor" value={data.minorColor} onChange={handleChange} />
          </div>
          <InputField label="8. Texas License Plate No." name="licensePlateNo" uppercase={true} value={data.licensePlateNo} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="9. Odometer Reading (no tenths)" name="odometerReading" value={data.odometerReading} onChange={handleChange} />
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">10. Odometer Brand</label>
              <select name="odometerBrand" value={data.odometerBrand} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
                <option value="A">A — Actual Mileage</option>
                <option value="N">N — Not Actual (Discrepancy)</option>
                <option value="X">X — Exceeds Mechanical Limits</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="11. Empty Weight (lbs)" name="emptyWeight" value={data.emptyWeight} onChange={handleChange} />
            <InputField label="12. Carrying Capacity (lbs)" name="carryingCapacity" value={data.carryingCapacity} onChange={handleChange} />
          </div>
        </motion.div>

        {/* Applicant/Owner */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
          <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Applicant / Owner</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70 mb-2">14. Applicant Type</label>
              <select name="applicantType" value={data.applicantType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-luxury-ink/10 rounded-lg focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm">
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
                <option value="Government">Government</option>
                <option value="Trust">Trust</option>
                <option value="Non-Profit">Non-Profit</option>
              </select>
            </div>
            <InputField label="14. ID / FEIN Number" name="applicantIdNumber" uppercase={true} value={data.applicantIdNumber} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="15. ID Type" name="applicantIdType" value={data.applicantIdType} onChange={handleChange} placeholder="DL, Passport, etc." />
            <InputField label="15. ID State" name="applicantIdState" uppercase={true} value={data.applicantIdState} onChange={handleChange} />
          </div>
          {data.applicantType === 'Individual' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="16. First Name" name="applicantFirstName" value={data.applicantFirstName} onChange={handleChange} />
                <InputField label="Middle Name" name="applicantMiddleName" value={data.applicantMiddleName} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Last Name" name="applicantLastName" value={data.applicantLastName} onChange={handleChange} />
                <InputField label="Suffix" name="applicantSuffix" value={data.applicantSuffix} onChange={handleChange} placeholder="Jr., Sr., III, etc." />
              </div>
            </>
          ) : (
            <InputField label="16. Entity Name" name="applicantEntityName" value={data.applicantEntityName} onChange={handleChange} />
          )}
          <InputField label="17. Co-Applicant / Co-Owner Name" name="coApplicantName" value={data.coApplicantName} onChange={handleChange} />
          <AddressAutocomplete label="18. Mailing Address" name="mailingAddress" value={data.mailingAddress} onChange={handleChange} onAddressSelect={(addr: ParsedAddress) => onChange({ ...data, mailingAddress: addr.street, mailingCity: addr.city, mailingState: addr.state, mailingZip: addr.zip, countyOfResidence: addr.county })} />
          <div className="grid grid-cols-3 gap-4">
            <InputField label="City" name="mailingCity" value={data.mailingCity} onChange={handleChange} />
            <InputField label="State" name="mailingState" uppercase={true} value={data.mailingState} onChange={handleChange} />
            <InputField label="Zip" name="mailingZip" value={data.mailingZip} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="19. County of Residence" name="countyOfResidence" value={data.countyOfResidence} onChange={handleChange} />
            <InputField label="20. Date of Birth" name="applicantDob" type="date" value={data.applicantDob} onChange={handleChange} />
            <InputField label="21. Phone" name="applicantPhone" value={data.applicantPhone} onChange={handleChange} />
          </div>
          <InputField label="Email" name="applicantEmail" type="email" value={data.applicantEmail} onChange={handleChange} />
        </motion.div>

        {/* Previous Owner + Lienholder + Vehicle Location */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
          <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Previous Owner / Seller</h2>
          <InputField label="22. Previous Owner Name" name="previousOwnerName" value={data.previousOwnerName} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="City" name="previousOwnerCity" value={data.previousOwnerCity} onChange={handleChange} />
            <InputField label="State" name="previousOwnerState" uppercase={true} value={data.previousOwnerState} onChange={handleChange} />
          </div>

          <div className="border-t border-luxury-ink/10 pt-6 mt-2">
            <h3 className="text-lg font-serif text-luxury-ink mb-4">Vehicle Location</h3>
            <label className="flex items-center space-x-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                name="vehicleLocationSameAsMailing"
                checked={data.vehicleLocationSameAsMailing}
                onChange={handleChange}
                className="w-4 h-4 accent-luxury-gold"
              />
              <span className="text-sm text-luxury-ink/70">Same as mailing address</span>
            </label>
            {!data.vehicleLocationSameAsMailing && (
              <>
                <AddressAutocomplete label="23. Vehicle Location Address" name="vehicleLocationAddress" value={data.vehicleLocationAddress} onChange={handleChange} onAddressSelect={(addr: ParsedAddress) => onChange({ ...data, vehicleLocationAddress: addr.street, vehicleLocationCity: addr.city, vehicleLocationState: addr.state, vehicleLocationZip: addr.zip, vehicleLocationCounty: addr.county })} />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <InputField label="City" name="vehicleLocationCity" value={data.vehicleLocationCity} onChange={handleChange} />
                  <InputField label="State" name="vehicleLocationState" uppercase={true} value={data.vehicleLocationState} onChange={handleChange} />
                  <InputField label="Zip" name="vehicleLocationZip" value={data.vehicleLocationZip} onChange={handleChange} />
                </div>
                <div className="mt-4">
                  <InputField label="County" name="vehicleLocationCounty" value={data.vehicleLocationCounty} onChange={handleChange} />
                </div>
              </>
            )}
          </div>

          <div className="border-t border-luxury-ink/10 pt-6 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif text-luxury-ink">34. First Lienholder</h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasLien"
                  checked={data.hasLien}
                  onChange={handleChange}
                  className="w-4 h-4 accent-luxury-gold"
                />
                <span className="text-sm text-luxury-ink/70">Vehicle has a lien</span>
              </label>
            </div>
            {data.hasLien ? (
              <>
                <InputField label="Lienholder Name" name="lienholderName" value={data.lienholderName} onChange={handleChange} />
                <div className="mt-4">
                  <AddressAutocomplete label="Address" name="lienholderAddress" value={data.lienholderAddress} onChange={handleChange} onAddressSelect={(addr: ParsedAddress) => onChange({ ...data, lienholderAddress: addr.street, lienholderCity: addr.city, lienholderState: addr.state, lienholderZip: addr.zip })} />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <InputField label="City" name="lienholderCity" value={data.lienholderCity} onChange={handleChange} />
                  <InputField label="State" name="lienholderState" uppercase={true} value={data.lienholderState} onChange={handleChange} />
                  <InputField label="Zip" name="lienholderZip" value={data.lienholderZip} onChange={handleChange} />
                </div>
              </>
            ) : (
              <p className="text-sm text-luxury-ink/50 italic">No lien — "NONE" will be printed on the form.</p>
            )}
          </div>
        </motion.div>

        {/* Motor Vehicle Tax / Sales Price */}
        <motion.div variants={itemVariants} className="md:col-span-2 bg-white p-8 rounded-2xl shadow-xl shadow-luxury-ink/5 border border-luxury-ink/5 space-y-6">
          <h2 className="text-2xl font-serif text-luxury-ink border-b border-luxury-ink/10 pb-4 mb-6">Motor Vehicle Tax Statement</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InputField label="(a) Sales Price ($)" name="salesPrice" type="number" min="0" value={data.salesPrice} onChange={handleChange} />
            <InputField label="(b) Trade-In Allowance ($)" name="tradeInAllowance" type="number" min="0" value={data.tradeInAllowance} onChange={handleChange} />
            <InputField label="(d) Tax Rate (%)" name="taxRate" type="number" step="0.01" min="0" value={data.taxRate} onChange={handleChange} />
            <InputField label="Rebate / Incentive ($)" name="rebateOrIncentive" type="number" min="0" value={data.rebateOrIncentive} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Trade-In Description" name="tradeInDescription" value={data.tradeInDescription} onChange={handleChange} placeholder="e.g. 2018 Honda Civic LX" />
            <InputField label="Trade-In VIN" name="tradeInVin" uppercase={true} value={data.tradeInVin} onChange={handleChange} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
