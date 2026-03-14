import React from 'react';
import { RentalData, calculateRentalTotal, calculateRentalDuration, generateRentalSchedule, formatCurrency } from '../utils/rental';
import { format } from 'date-fns';
import { SignatureData, DEALER_LICENSE } from '../utils/shared';
import SignatureLinePreview from './SignatureLinePreview';

interface Props {
  data: RentalData;
  signatures: SignatureData;
}

export default function RentalPreview({ data, signatures }: Props) {
  const totals = calculateRentalTotal(data);
  const duration = calculateRentalDuration(data.rentalStartDate, data.rentalEndDate, data.rentalPeriod);
  const schedule = generateRentalSchedule(data);
  const periodLabel = data.rentalPeriod === 'Daily' ? 'Day(s)' : data.rentalPeriod === 'Weekly' ? 'Week(s)' : 'Month(s)';
  const periodSingular = data.rentalPeriod === 'Daily' ? 'day' : data.rentalPeriod === 'Weekly' ? 'week' : 'month';
  const perPeriodAmount = schedule.length > 0 ? schedule[0].amountDue : 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return format(new Date(dateStr + 'T12:00:00'), 'MM/dd/yyyy');
  };

  return (
    <div className="bg-white p-10 md:p-16 text-luxury-ink font-sans max-w-5xl mx-auto relative">
      {/* Watermark / Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="font-serif font-bold text-[400px] leading-none">JJJ</div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-luxury-ink pb-8 mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 border-2 border-luxury-gold p-1 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <img
                src="/logo.png"
                alt="Triple J Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-2 text-luxury-ink">Vehicle Rental Agreement</h1>
              <p className="text-xs tracking-widest uppercase text-luxury-ink/60 font-semibold">Rental Contract & Terms of Use</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-serif font-semibold text-luxury-gold">Triple J Auto Investment LLC</h2>
            <p className="text-xs text-luxury-ink/70 mt-1">8774 Almeda Genoa Road, Houston, Texas 77075</p>
            <p className="text-xs text-luxury-ink/70">(281) 253-3602 | thetriplejauto.com</p>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div className="border border-luxury-ink/10 p-6 rounded-sm bg-luxury-bg/30">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Renter Information</h3>
            <p className="font-serif text-xl mb-1 min-h-[1.75rem]">{data.renterName}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.renterAddress}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.renterPhone}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.renterEmail}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem] mt-2 font-mono uppercase">DL# {data.renterLicense}</p>
          </div>
          <div className="border border-luxury-ink/10 p-6 rounded-sm bg-luxury-bg/30">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Additional Driver</h3>
            <p className="font-serif text-xl mb-1 min-h-[1.75rem]">{data.coRenterName}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coRenterAddress}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coRenterPhone}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coRenterEmail}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem] mt-2 font-mono uppercase">DL# {data.coRenterLicense}</p>
          </div>
        </div>

        {/* Vehicle */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-2">Vehicle Description</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-y border-luxury-ink/20 bg-luxury-bg/50">
                <th className="p-3 text-left font-semibold">Year</th>
                <th className="p-3 text-left font-semibold">Make</th>
                <th className="p-3 text-left font-semibold">Model</th>
                <th className="p-3 text-left font-semibold">VIN</th>
                <th className="p-3 text-left font-semibold">Mileage Out</th>
                <th className="p-3 text-left font-semibold">Mileage In</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-luxury-ink/10">
                <td className="p-3">{data.vehicleYear}</td>
                <td className="p-3">{data.vehicleMake}</td>
                <td className="p-3">{data.vehicleModel}</td>
                <td className="p-3 uppercase font-mono text-xs">{data.vehicleVin}</td>
                <td className="p-3">{data.mileageOut}</td>
                <td className="p-3">{data.mileageIn}</td>
              </tr>
            </tbody>
          </table>
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-luxury-ink/50 font-semibold text-[10px] tracking-widest uppercase">Fuel Out:</span>
              <span className="font-medium">{data.fuelLevelOut}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-luxury-ink/50 font-semibold text-[10px] tracking-widest uppercase">Fuel In:</span>
              <span className="font-medium">{data.fuelLevelIn}</span>
            </div>
          </div>
        </div>

        {/* Rental Summary Boxes (mirrors Truth in Lending) */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-2">Rental Summary</h3>
          <div className="grid grid-cols-4 border-2 border-luxury-ink divide-x-2 divide-luxury-ink">
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Rental Period</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Duration of the rental agreement.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{duration} {periodLabel}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Base Rental</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Total rental charges before fees and tax.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(totals.baseRental)}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Security Deposit</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Refundable deposit held for the rental term.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(data.securityDeposit)}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Total Due at Signing</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Total amount due including deposit, fees, and tax.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(totals.totalDue)}</div>
            </div>
          </div>
        </div>

        {/* Payment Schedule Summary (mirrors Payment Schedule in Financing) */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-2">Payment Schedule</h3>
          <table className="w-full text-sm border-collapse border border-luxury-ink/20">
            <thead>
              <tr className="bg-luxury-bg/50 border-b border-luxury-ink/20">
                <th className="p-3 text-left font-semibold">Number of Payments</th>
                <th className="p-3 text-left font-semibold">Amount per {periodSingular}</th>
                <th className="p-3 text-left font-semibold">When Payments Are Due</th>
                <th className="p-3 text-left font-semibold">Pickup Date</th>
                <th className="p-3 text-left font-semibold">Return Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3">{duration}</td>
                <td className="p-3 font-bold">{formatCurrency(perPeriodAmount)}</td>
                <td className="p-3">{data.rentalPeriod} beginning {formatDate(data.rentalStartDate)}</td>
                <td className="p-3">{formatDate(data.rentalStartDate)}</td>
                <td className="p-3 font-bold text-luxury-gold">{formatDate(data.rentalEndDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Itemization & Policies (mirrors Itemization & Important Clauses) */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Itemization of Charges</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>1. Base Rental ({duration} {periodLabel} @ {formatCurrency(data.rentalRate)})</span>
                <span>{formatCurrency(totals.baseRental)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;a. Insurance Fee</span>
                <span>{formatCurrency(totals.insuranceTotal)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;b. Additional Driver Fee</span>
                <span>{formatCurrency(totals.additionalDriverTotal)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-luxury-ink/10 pt-2">
                <span>2. Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;Sales Tax ({data.tax}%)</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-luxury-ink/10 pt-2">
                <span>3. Total Rental Charges</span>
                <span>{formatCurrency(totals.grandTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-luxury-ink/20 pb-3">
                <span>4. Security Deposit (Refundable)</span>
                <span>{formatCurrency(data.securityDeposit)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 text-lg font-serif">
                <span>5. Total Due at Signing</span>
                <span>{formatCurrency(totals.totalDue)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-luxury-ink p-5 bg-luxury-bg/20">
              <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center">Vehicle Condition</h3>
              <p className="text-xs text-justify leading-relaxed">
                <strong>THE VEHICLE IS PROVIDED IN ITS CURRENT CONDITION.</strong> The renter acknowledges inspecting the vehicle prior to rental and accepts its current condition. Any pre-existing damage has been documented on a separate vehicle condition report signed by both parties at the time of pickup.
              </p>
            </div>
            <div className="border border-red-900/20 p-5 bg-red-50/50">
              <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center text-red-900">Mileage Policy</h3>
              <p className="text-xs text-justify leading-relaxed text-red-900/80">
                <strong>MILEAGE ALLOWANCE:</strong> {data.mileageAllowance > 0 ? `${data.mileageAllowance} miles per ${data.rentalPeriod === 'Daily' ? 'day' : data.rentalPeriod === 'Weekly' ? 'week' : 'month'}` : 'Unlimited'}. {data.excessMileageCharge > 0 ? `Excess mileage will be charged at ${formatCurrency(data.excessMileageCharge)} per mile.` : ''} The renter is responsible for all fuel consumed during the rental period. Vehicle must be returned with the same fuel level as at pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-16 text-[11px] text-justify space-y-3 text-luxury-ink/70 columns-2 gap-8">
          <p>
            <strong>RENTAL AGREEMENT:</strong> The renter agrees to rent the vehicle described above for the period of {formatDate(data.rentalStartDate)} through {formatDate(data.rentalEndDate)} at the rate of {formatCurrency(data.rentalRate)} per {data.rentalPeriod === 'Daily' ? 'day' : data.rentalPeriod === 'Weekly' ? 'week' : 'month'}.
          </p>
          <p>
            <strong>AUTHORIZED DRIVERS:</strong> Only the renter and any additional authorized drivers listed in this agreement may operate the vehicle. All drivers must possess a valid driver's license. Unauthorized use voids all liability coverage.
          </p>
          <p>
            <strong>LATE RETURN:</strong> If the vehicle is not returned by the agreed-upon return date, additional charges will be assessed at the applicable daily rate plus a late fee of $50.00 per day. Failure to return the vehicle within 48 hours of the agreed return date may be reported as unauthorized use.
          </p>
          <p>
            <strong>PROHIBITED USE:</strong> The vehicle shall not be used for any illegal purpose, to tow or push anything, in any race or speed test, to carry persons or property for hire, off paved roads, or outside the state of Texas without prior written consent.
          </p>
          <p>
            <strong>LIABILITY & INSURANCE:</strong> The renter assumes full liability for any damage to, loss of, or theft of the vehicle during the rental period. The renter must maintain adequate insurance coverage or purchase optional coverage offered by Triple J Auto Investment LLC.
          </p>
        </div>

        {/* Customer ID Photo */}
        {signatures.buyerIdPhoto && (
          <div className="mb-10 border border-luxury-ink/10 p-4 rounded-sm bg-luxury-bg/20 flex items-center space-x-6">
            <img src={signatures.buyerIdPhoto} alt="Customer ID" className="h-28 object-contain rounded border border-luxury-ink/10" />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50">Customer ID on File</p>
              <p className="text-sm font-medium mt-1">{data.renterName}</p>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="space-y-12 bg-luxury-bg/30 p-8 border border-luxury-ink/10">
          <div className="text-sm font-bold mb-8 text-center font-serif text-lg">
            By signing below, you agree to the terms of this rental agreement. You acknowledge that you have read it completely before signing.
          </div>

          <div className="grid grid-cols-2 gap-16">
            <SignatureLinePreview label="Renter Signature" signatureImage={signatures.buyerSignature} signatureDate={signatures.buyerSignatureDate} printedName={data.renterName} />
            <SignatureLinePreview label="Additional Driver Signature" signatureImage={signatures.coBuyerSignature} signatureDate={signatures.coBuyerSignatureDate} printedName={data.coRenterName} />
          </div>

          <div className="grid grid-cols-2 gap-16 mt-8">
            <SignatureLinePreview label={`Triple J Auto Representative — DL# ${DEALER_LICENSE}`} signatureImage={signatures.dealerSignature} signatureDate={signatures.dealerSignatureDate} />
          </div>
        </div>

        {/* Full Payment Tracking Schedule (Page Break for Print) */}
        {schedule.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-luxury-ink print:break-before-page">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-bold uppercase tracking-widest">Payment Tracking Schedule</h3>
              <p className="text-xs text-luxury-ink/60 mt-2 tracking-wider uppercase">
                {data.renterName && <span className="font-semibold">{data.renterName}</span>}
                {data.renterName && ' — '}
                {data.vehicleYear} {data.vehicleMake} {data.vehicleModel}
                {data.vehicleVin && <span className="font-mono ml-2">({data.vehicleVin})</span>}
              </p>
              <p className="text-xs text-luxury-ink/50 mt-1">
                {formatCurrency(perPeriodAmount)} / {periodSingular} &bull; {duration} payments &bull; {formatDate(data.rentalStartDate)} – {formatDate(data.rentalEndDate)}
              </p>
            </div>

            <table className="w-full text-sm border-collapse border-2 border-luxury-ink">
              <thead>
                <tr className="bg-luxury-ink text-white">
                  <th className="p-3 text-left font-semibold text-[10px] tracking-wider uppercase w-10">#</th>
                  <th className="p-3 text-left font-semibold text-[10px] tracking-wider uppercase">Due Date</th>
                  <th className="p-3 text-right font-semibold text-[10px] tracking-wider uppercase">Rental</th>
                  <th className="p-3 text-right font-semibold text-[10px] tracking-wider uppercase">Ins. + Fees</th>
                  <th className="p-3 text-right font-semibold text-[10px] tracking-wider uppercase">Tax</th>
                  <th className="p-3 text-right font-semibold text-[10px] tracking-wider uppercase">Amount Due</th>
                  <th className="p-3 text-right font-semibold text-[10px] tracking-wider uppercase">Balance</th>
                  <th className="p-3 text-center font-semibold text-[10px] tracking-wider uppercase" style={{ minWidth: '100px' }}>Date Paid</th>
                  <th className="p-3 text-center font-semibold text-[10px] tracking-wider uppercase" style={{ minWidth: '80px' }}>Method</th>
                  <th className="p-3 text-center font-semibold text-[10px] tracking-wider uppercase" style={{ minWidth: '60px' }}>Initials</th>
                </tr>
              </thead>
              <tbody>
                {/* First row: Security deposit due at signing */}
                <tr className="border-b border-luxury-ink/20 bg-luxury-gold/5">
                  <td className="p-3 font-bold text-luxury-gold">—</td>
                  <td className="p-3 font-medium">{formatDate(data.rentalStartDate)}</td>
                  <td className="p-3 text-right text-luxury-ink/50">—</td>
                  <td className="p-3 text-right text-luxury-ink/50">—</td>
                  <td className="p-3 text-right text-luxury-ink/50">—</td>
                  <td className="p-3 text-right font-bold">{formatCurrency(data.securityDeposit)}</td>
                  <td className="p-3 text-right text-luxury-ink/50 text-[10px] uppercase tracking-wider">Deposit</td>
                  <td className="p-3 border-b border-dashed border-luxury-ink/30"></td>
                  <td className="p-3 border-b border-dashed border-luxury-ink/30"></td>
                  <td className="p-3 border-b border-dashed border-luxury-ink/30"></td>
                </tr>
                {schedule.map((payment, idx) => (
                  <tr key={payment.paymentNumber} className={`border-b border-luxury-ink/10 ${idx % 2 === 0 ? 'bg-white' : 'bg-luxury-bg/20'}`}>
                    <td className="p-3 font-bold text-luxury-ink/40">{payment.paymentNumber}</td>
                    <td className="p-3 font-medium">{formatDate(payment.dueDate)}</td>
                    <td className="p-3 text-right">{formatCurrency(payment.rental)}</td>
                    <td className="p-3 text-right">{formatCurrency(payment.insurance + payment.additionalDriver)}</td>
                    <td className="p-3 text-right">{formatCurrency(payment.tax)}</td>
                    <td className="p-3 text-right font-bold font-serif">{formatCurrency(payment.amountDue)}</td>
                    <td className="p-3 text-right font-serif">{formatCurrency(payment.balanceAfter)}</td>
                    <td className="p-3 border-b border-dashed border-luxury-ink/30"></td>
                    <td className="p-3 border-b border-dashed border-luxury-ink/30"></td>
                    <td className="p-3 border-b border-dashed border-luxury-ink/30"></td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-luxury-ink text-white font-bold">
                  <td className="p-3" colSpan={5}>
                    <span className="text-[10px] tracking-widest uppercase">Total</span>
                  </td>
                  <td className="p-3 text-right font-serif">{formatCurrency(totals.grandTotal)}</td>
                  <td className="p-3 text-right font-serif">{formatCurrency(0)}</td>
                  <td className="p-3" colSpan={3}></td>
                </tr>
              </tbody>
            </table>

            {/* Legend / Notes */}
            <div className="mt-6 grid grid-cols-2 gap-8 text-[10px] text-luxury-ink/60">
              <div>
                <p className="font-bold uppercase tracking-widest mb-1">Payment Methods</p>
                <p>Cash / Check / Zelle / CashApp / Card / Other</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-widest mb-1">Notes</p>
                <p>Late payments are subject to a $50.00 late fee per occurrence. Security deposit of {formatCurrency(data.securityDeposit)} is refundable upon vehicle return in satisfactory condition.</p>
              </div>
            </div>

            {/* Owner & Renter copy acknowledgment */}
            <div className="mt-10 grid grid-cols-2 gap-16">
              <div className="border border-luxury-ink/10 p-6 bg-luxury-bg/20">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Owner Copy</h4>
                <div className="border-b border-luxury-ink h-8 mb-2"></div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-semibold">
                  <span>Triple J Representative</span>
                  <span>Date</span>
                </div>
              </div>
              <div className="border border-luxury-ink/10 p-6 bg-luxury-bg/20">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Renter Copy</h4>
                <div className="border-b border-luxury-ink h-8 mb-2"></div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-semibold">
                  <span>Renter Signature</span>
                  <span>Date</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
