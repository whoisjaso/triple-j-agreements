import React from 'react';
import { BillOfSaleData, calculateBillOfSale, formatCurrency } from '../utils/billOfSale';
import { format } from 'date-fns';
import { SignatureData, DEALER_LICENSE } from '../utils/shared';
import SignatureLinePreview from './SignatureLinePreview';

interface Props {
  data: BillOfSaleData;
  signatures: SignatureData;
}

export default function BillOfSalePreview({ data, signatures }: Props) {
  const calc = calculateBillOfSale(data);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return format(new Date(dateStr + 'T12:00:00'), 'MM/dd/yyyy');
  };

  const buyerFullAddress = [data.buyerAddress, data.buyerCity, data.buyerState, data.buyerZip].filter(Boolean).join(', ');
  const coBuyerFullAddress = [data.coBuyerAddress, data.coBuyerCity, data.coBuyerState, data.coBuyerZip].filter(Boolean).join(', ');
  const paymentDisplay = data.paymentMethod === 'Other' ? data.paymentMethodOther : data.paymentMethod;

  const odometerLabel =
    data.odometerStatus === 'actual' ? 'reflects the actual mileage of the vehicle' :
    data.odometerStatus === 'exceeds' ? 'exceeds the odometer\'s mechanical limits' :
    'IS NOT the actual mileage. ODOMETER DISCREPANCY.';

  return (
    <div className="bg-white p-10 md:p-16 text-luxury-ink font-sans max-w-5xl mx-auto relative">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="font-serif font-bold text-[400px] leading-none">JJJ</div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-luxury-ink pb-8 mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 border-2 border-luxury-gold p-1 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <img src="/logo.png" alt="Triple J Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-2 text-luxury-ink">Bill of Sale</h1>
              <p className="text-xs tracking-widest uppercase text-luxury-ink/60 font-semibold">Vehicle Purchase Agreement & Transfer of Ownership</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-serif font-semibold text-luxury-gold">Triple J Auto Investment LLC</h2>
            <p className="text-xs text-luxury-ink/70 mt-1">8774 Almeda Genoa Road, Houston, Texas 77075</p>
            <p className="text-xs text-luxury-ink/70">(281) 253-3602 | thetriplejauto.com</p>
            <div className="mt-3 flex justify-end space-x-6">
              <div className="text-[10px]">
                <span className="text-luxury-ink/50 uppercase tracking-wider font-semibold">Date: </span>
                <span className="font-medium">{formatDate(data.saleDate)}</span>
              </div>
              {data.stockNumber && (
                <div className="text-[10px]">
                  <span className="text-luxury-ink/50 uppercase tracking-wider font-semibold">Stock #: </span>
                  <span className="font-medium">{data.stockNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seller / Dealer */}
        <div className="mb-10 border border-luxury-gold/30 p-6 rounded-sm bg-luxury-gold/5">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-gold mb-3">Seller (Dealer)</h3>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-serif text-lg font-semibold">Triple J Auto Investment LLC</p>
              <p className="text-luxury-ink/80">8774 Almeda Genoa Road</p>
              <p className="text-luxury-ink/80">Houston, Texas 77075</p>
            </div>
            <div>
              <p className="text-luxury-ink/80">(281) 253-3602</p>
              <p className="text-luxury-ink/80">thetriplejauto.com</p>
            </div>
            <div>
              <p className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Texas Dealer License</p>
              <p className="text-luxury-ink/80 font-mono font-bold">{DEALER_LICENSE}</p>
            </div>
          </div>
        </div>

        {/* Buyer / Co-Buyer */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div className="border border-luxury-ink/10 p-6 rounded-sm bg-luxury-bg/30">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Buyer Information</h3>
            <p className="font-serif text-xl mb-1 min-h-[1.75rem]">{data.buyerName}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{buyerFullAddress}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.buyerPhone}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.buyerEmail}</p>
            <div className="mt-3 pt-3 border-t border-luxury-ink/10 flex space-x-6 text-sm">
              <span className="font-mono uppercase">DL# {data.buyerLicense}</span>
              {data.buyerLicenseState && <span className="text-luxury-ink/50">State: {data.buyerLicenseState}</span>}
            </div>
          </div>
          <div className="border border-luxury-ink/10 p-6 rounded-sm bg-luxury-bg/30">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Co-Buyer Information</h3>
            <p className="font-serif text-xl mb-1 min-h-[1.75rem]">{data.coBuyerName}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{coBuyerFullAddress}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coBuyerPhone}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coBuyerEmail}</p>
            <div className="mt-3 pt-3 border-t border-luxury-ink/10 flex space-x-6 text-sm">
              <span className="font-mono uppercase">DL# {data.coBuyerLicense}</span>
              {data.coBuyerLicenseState && <span className="text-luxury-ink/50">State: {data.coBuyerLicenseState}</span>}
            </div>
          </div>
        </div>

        {/* Vehicle Description */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-2">Vehicle Description</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-y border-luxury-ink/20 bg-luxury-bg/50">
                <th className="p-3 text-left font-semibold">Year</th>
                <th className="p-3 text-left font-semibold">Make</th>
                <th className="p-3 text-left font-semibold">Model</th>
                <th className="p-3 text-left font-semibold">Trim</th>
                <th className="p-3 text-left font-semibold">Color</th>
                <th className="p-3 text-left font-semibold">Body</th>
                <th className="p-3 text-left font-semibold">Mileage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-luxury-ink/10">
                <td className="p-3">{data.vehicleYear}</td>
                <td className="p-3">{data.vehicleMake}</td>
                <td className="p-3">{data.vehicleModel}</td>
                <td className="p-3">{data.vehicleTrim}</td>
                <td className="p-3">{data.vehicleColor}</td>
                <td className="p-3">{data.vehicleBodyStyle}</td>
                <td className="p-3">{data.vehicleMileage}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 text-sm">
            <span className="text-luxury-ink/50 font-semibold text-[10px] tracking-widest uppercase">VIN: </span>
            <span className="font-mono uppercase tracking-wider">{data.vehicleVin}</span>
          </div>
        </div>

        {/* Sale Summary Boxes (mirrors Truth in Lending) */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-2">Sale Summary</h3>
          <div className="grid grid-cols-4 border-2 border-luxury-ink divide-x-2 divide-luxury-ink">
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Vehicle Price</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Agreed purchase price of the vehicle.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(data.salePrice)}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Net Trade-In</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Trade-in credit after payoff deduction.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(calc.netTradeIn)}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Fees &amp; Tax</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Total taxes, title, registration, and fees.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(calc.feesSubtotal)}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Total Due</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">Total amount due from buyer at time of sale.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(calc.totalDue)}</div>
            </div>
          </div>
        </div>

        {/* Itemization & Condition */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          {/* Itemization */}
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Itemization of Sale Price</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>1. Vehicle Sale Price</span>
                <span>{formatCurrency(data.salePrice)}</span>
              </div>
              {(data.tradeInAllowance > 0 || data.tradeInPayoff > 0) && (
                <>
                  <div className="flex justify-between text-luxury-ink/70">
                    <span>&nbsp;&nbsp;&nbsp;a. Trade-In Allowance</span>
                    <span className="text-red-700">- {formatCurrency(data.tradeInAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-luxury-ink/70">
                    <span>&nbsp;&nbsp;&nbsp;b. Trade-In Payoff Owed</span>
                    <span>+ {formatCurrency(data.tradeInPayoff)}</span>
                  </div>
                  <div className="flex justify-between text-luxury-ink/70">
                    <span>&nbsp;&nbsp;&nbsp;c. Net Trade-In Credit</span>
                    <span className="text-red-700">- {formatCurrency(calc.netTradeIn)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-semibold border-t border-luxury-ink/10 pt-2">
                <span>2. Balance After Trade</span>
                <span>{formatCurrency(calc.balanceAfterTrade)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;a. Sales Tax</span>
                <span>{formatCurrency(data.tax)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;b. Title Fee</span>
                <span>{formatCurrency(data.titleFee)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;c. Documentary Fee</span>
                <span>{formatCurrency(data.docFee)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;d. Registration Fee</span>
                <span>{formatCurrency(data.registrationFee)}</span>
              </div>
              {data.otherFees > 0 && (
                <div className="flex justify-between text-luxury-ink/70">
                  <span>&nbsp;&nbsp;&nbsp;e. {data.otherFeesDescription || 'Other Fees'}</span>
                  <span>{formatCurrency(data.otherFees)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 text-lg font-serif border-t-2 border-luxury-ink mt-2 pt-3">
                <span>3. Total Amount Due</span>
                <span>{formatCurrency(calc.totalDue)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/60 text-xs pt-1">
                <span>Payment Method</span>
                <span className="font-semibold uppercase tracking-wider">{paymentDisplay}</span>
              </div>
            </div>
          </div>

          {/* Condition / As-Is / Warranty */}
          <div className="space-y-6">
            {data.conditionType === 'as_is' ? (
              <>
                <div className="border-2 border-luxury-ink p-5 bg-luxury-bg/20">
                  <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center">As Is — No Dealer Warranty</h3>
                  <p className="text-xs text-justify leading-relaxed">
                    <strong>THE VEHICLE IS SOLD "AS IS."</strong> The seller, Triple J Auto Investment LLC, hereby disclaims all warranties, either express or implied, including any implied warranties of merchantability and fitness for a particular purpose. The buyer has inspected the vehicle and accepts it in its present condition. The seller assumes no responsibility for any repairs regardless of any oral statements about the vehicle.
                  </p>
                </div>
                <div className="border border-red-900/20 p-5 bg-red-50/50">
                  <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center text-red-900">No Refund Policy</h3>
                  <p className="text-xs text-justify leading-relaxed text-red-900/80">
                    <strong>ALL SALES ARE FINAL.</strong> The Buyer acknowledges that no refunds, returns, or exchanges will be accepted under any circumstances. All payments made are strictly non-refundable. The Buyer waives any right to rescind this transaction after signing.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="border-2 border-luxury-gold p-5 bg-luxury-gold/5">
                  <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center text-luxury-gold">Limited Warranty</h3>
                  <p className="text-xs text-justify leading-relaxed">
                    <strong>WARRANTY PERIOD:</strong> {data.warrantyDuration || '_______________'}
                  </p>
                  <p className="text-xs text-justify leading-relaxed mt-2">
                    <strong>COVERAGE:</strong> {data.warrantyDescription || 'As described in separate warranty document.'}
                  </p>
                </div>
                <div className="border border-red-900/20 p-5 bg-red-50/50">
                  <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center text-red-900">No Refund Policy</h3>
                  <p className="text-xs text-justify leading-relaxed text-red-900/80">
                    <strong>ALL SALES ARE FINAL.</strong> The Buyer acknowledges that no refunds, returns, or exchanges will be accepted under any circumstances. All payments made are strictly non-refundable.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Trade-In Details (if applicable) */}
        {(data.tradeInDescription || data.tradeInVin) && (
          <div className="mb-10 border border-luxury-ink/10 p-6 rounded-sm bg-luxury-bg/20">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-3">Trade-In Vehicle</h3>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold">Description</span>
                <p className="font-medium mt-1">{data.tradeInDescription}</p>
              </div>
              <div>
                <span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold">VIN</span>
                <p className="font-mono uppercase mt-1">{data.tradeInVin}</p>
              </div>
              <div>
                <span className="text-luxury-ink/50 text-[10px] uppercase tracking-wider font-semibold">Allowance / Payoff</span>
                <p className="font-medium mt-1">{formatCurrency(data.tradeInAllowance)} / {formatCurrency(data.tradeInPayoff)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Odometer Disclosure Statement */}
        <div className="mb-10 border-2 border-luxury-ink p-6">
          <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-4 text-center">Federal Odometer Disclosure Statement</h3>
          <p className="text-xs text-justify leading-relaxed mb-4">
            In accordance with federal law (49 U.S.C. § 32705) and applicable state law, the seller hereby discloses that the odometer of the vehicle described herein reads <strong className="font-mono text-sm">{data.odometerReading || '___________'}</strong> miles, and to the best of the seller's knowledge, said odometer reading <strong>{odometerLabel}</strong>.
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm border-t border-luxury-ink/20 pt-4">
            <div>
              <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Odometer Reading</span>
              <p className="font-mono font-bold text-lg">{data.odometerReading || '—'}</p>
            </div>
            <div>
              <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Status</span>
              <p className={`font-bold text-sm uppercase tracking-wider ${data.odometerStatus === 'not_actual' ? 'text-red-700' : ''}`}>
                {data.odometerStatus === 'actual' ? 'Actual Mileage' : data.odometerStatus === 'exceeds' ? 'Exceeds Mechanical Limits' : 'NOT ACTUAL — Discrepancy'}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Vehicle</span>
              <p className="font-medium">{data.vehicleYear} {data.vehicleMake} {data.vehicleModel}</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-16 text-[11px] text-justify space-y-3 text-luxury-ink/70 columns-2 gap-8">
          <p>
            <strong>TRANSFER OF TITLE:</strong> The Seller agrees to transfer title and all rights of ownership of the above-described vehicle to the Buyer upon receipt of full payment. The Seller warrants that they hold clear title to the vehicle, free of all liens and encumbrances, except as otherwise noted herein.
          </p>
          <p>
            <strong>REPRESENTATIONS:</strong> The Buyer acknowledges that they have had the opportunity to inspect the vehicle and have accepted it in its current condition. The Buyer has not relied on any representations made by the Seller other than those expressly set forth in this Bill of Sale.
          </p>
          <p>
            <strong>GOVERNING LAW:</strong> This Bill of Sale shall be governed by and construed in accordance with the laws of the State of Texas. Any disputes arising under this agreement shall be resolved in Harris County, Texas.
          </p>
          <p>
            <strong>RISK OF LOSS:</strong> Risk of loss and damage to the vehicle transfers to the Buyer upon execution of this Bill of Sale and delivery of the vehicle. The Buyer is responsible for obtaining insurance coverage effective immediately upon taking possession.
          </p>
          <p>
            <strong>ENTIRE AGREEMENT:</strong> This Bill of Sale constitutes the entire agreement between the parties. No modifications shall be binding unless made in writing and signed by both parties. This agreement is binding upon the heirs, executors, administrators, and assigns of both parties.
          </p>
        </div>

        {/* Customer ID Photo */}
        {signatures.buyerIdPhoto && (
          <div className="mb-10 border border-luxury-ink/10 p-4 rounded-sm bg-luxury-bg/20 flex items-center space-x-6">
            <img src={signatures.buyerIdPhoto} alt="Customer ID" className="h-28 object-contain rounded border border-luxury-ink/10" />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50">Customer ID on File</p>
              <p className="text-sm font-medium mt-1">{data.buyerName}</p>
              {data.buyerLicense && <p className="text-xs text-luxury-ink/60 font-mono uppercase">DL# {data.buyerLicense} — {data.buyerLicenseState}</p>}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="space-y-12 bg-luxury-bg/30 p-8 border border-luxury-ink/10">
          <div className="text-sm font-bold mb-8 text-center font-serif text-lg">
            By signing below, all parties acknowledge and agree to the terms set forth in this Bill of Sale. Each party confirms they have read and understood this document in its entirety.
          </div>

          <div className="grid grid-cols-2 gap-16">
            <SignatureLinePreview label="Buyer Signature" signatureImage={signatures.buyerSignature} signatureDate={signatures.buyerSignatureDate} printedName={data.buyerName} />
            <SignatureLinePreview label="Co-Buyer Signature" signatureImage={signatures.coBuyerSignature} signatureDate={signatures.coBuyerSignatureDate} printedName={data.coBuyerName} />
          </div>

          <div className="grid grid-cols-2 gap-16 mt-8">
            <SignatureLinePreview label={`Seller — Triple J Auto — DL# ${DEALER_LICENSE}`} signatureImage={signatures.dealerSignature} signatureDate={signatures.dealerSignatureDate} />
            <SignatureLinePreview label="Witness / Notary" />
          </div>
        </div>

        {/* Buyer Acknowledgment Page (print page break) */}
        <div className="mt-20 pt-12 border-t-2 border-luxury-ink print:break-before-page">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-serif font-bold uppercase tracking-widest">Buyer Acknowledgment</h3>
            <p className="text-xs text-luxury-ink/60 mt-2 tracking-wider uppercase">Retain this copy for your records</p>
          </div>

          <div className="border-2 border-luxury-ink p-8 mb-8">
            <div className="grid grid-cols-2 gap-8 text-sm mb-6">
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Buyer</span>
                <p className="font-serif text-lg font-semibold">{data.buyerName || '________________________'}</p>
              </div>
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Date of Sale</span>
                <p className="font-serif text-lg font-semibold">{formatDate(data.saleDate) || '________________________'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 text-sm mb-6">
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Vehicle</span>
                <p className="font-medium">{data.vehicleYear} {data.vehicleMake} {data.vehicleModel} {data.vehicleTrim}</p>
              </div>
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">VIN</span>
                <p className="font-mono uppercase">{data.vehicleVin}</p>
              </div>
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Odometer</span>
                <p className="font-mono">{data.odometerReading} mi</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 text-sm border-t border-luxury-ink/20 pt-6">
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Sale Price</span>
                <p className="font-serif font-bold text-lg">{formatCurrency(data.salePrice)}</p>
              </div>
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Fees &amp; Tax</span>
                <p className="font-serif font-bold text-lg">{formatCurrency(calc.feesSubtotal)}</p>
              </div>
              <div>
                <span className="text-[10px] text-luxury-ink/50 uppercase tracking-wider font-semibold">Total Paid</span>
                <p className="font-serif font-bold text-lg text-luxury-gold">{formatCurrency(calc.totalDue)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs text-luxury-ink/70">
            <p>
              <strong>I, the undersigned Buyer, acknowledge:</strong>
            </p>
            <div className="space-y-2 ml-4">
              <p>&#9744; I have inspected the vehicle and accept it in its present condition.</p>
              <p>&#9744; I understand this vehicle is sold <strong>{data.conditionType === 'as_is' ? '"AS IS" with NO dealer warranty' : 'with a LIMITED WARRANTY as described'}</strong>.</p>
              <p>&#9744; I have received a copy of this Bill of Sale for my records.</p>
              <p>&#9744; I understand <strong>ALL SALES ARE FINAL</strong> — no refunds, returns, or exchanges.</p>
              <p>&#9744; I have been informed of the odometer reading and its accuracy status.</p>
              <p>&#9744; I accept full responsibility for the vehicle upon delivery, including insurance and registration.</p>
              {data.paymentMethod === 'Financing' && (
                <p>&#9744; I understand this purchase is financed under a separate Retail Installment Contract.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 mt-12">
            <div className="border border-luxury-ink/10 p-6 bg-luxury-bg/20">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Buyer Acknowledgment</h4>
              <SignatureLinePreview label="Buyer Signature" signatureImage={signatures.buyerSignature} signatureDate={signatures.buyerSignatureDate} />
            </div>
            <div className="border border-luxury-ink/10 p-6 bg-luxury-bg/20">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Dealer Copy</h4>
              <SignatureLinePreview label="Triple J Representative" signatureImage={signatures.dealerSignature} signatureDate={signatures.dealerSignatureDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
