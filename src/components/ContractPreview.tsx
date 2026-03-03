import React from 'react';
import { ContractData, calculatePayment, formatCurrency } from '../utils/finance';
import { addWeeks, addMonths, format } from 'date-fns';

interface Props {
  data: ContractData;
}

export default function ContractPreview({ data }: Props) {
  const totalCashPrice = data.cashPrice + data.tax + data.titleFee + data.docFee;
  const amountFinanced = Math.max(0, totalCashPrice - data.downPayment);
  const paymentAmount = calculatePayment(amountFinanced, data.apr, data.numberOfPayments, data.paymentFrequency);
  const totalOfPayments = paymentAmount * data.numberOfPayments;
  const financeCharge = totalOfPayments - amountFinanced;

  const generateSchedule = () => {
    if (!data.firstPaymentDate || data.numberOfPayments <= 0 || paymentAmount <= 0) return [];

    const schedule = [];
    let currentDate = new Date(data.firstPaymentDate);
    currentDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);

    for (let i = 1; i <= data.numberOfPayments; i++) {
      schedule.push({
        paymentNumber: i,
        date: format(currentDate, 'MM/dd/yyyy'),
        amount: paymentAmount,
      });

      if (data.paymentFrequency === 'Weekly') {
        currentDate = addWeeks(currentDate, 1);
      } else if (data.paymentFrequency === 'Bi-weekly') {
        currentDate = addWeeks(currentDate, 2);
      } else if (data.paymentFrequency === 'Monthly') {
        currentDate = addMonths(currentDate, 1);
      }
    }
    return schedule;
  };

  const schedule = generateSchedule();
  const estimatedCompletionDate = schedule.length > 0 ? schedule[schedule.length - 1].date : 'N/A';

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
              <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-2 text-luxury-ink">Retail Installment Contract</h1>
              <p className="text-xs tracking-widest uppercase text-luxury-ink/60 font-semibold">Security Agreement & Disclosure Statement</p>
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
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Buyer Information</h3>
            <p className="font-serif text-xl mb-1 min-h-[1.75rem]">{data.buyerName}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.buyerAddress}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.buyerPhone}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.buyerEmail}</p>
          </div>
          <div className="border border-luxury-ink/10 p-6 rounded-sm bg-luxury-bg/30">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Co-Buyer Information</h3>
            <p className="font-serif text-xl mb-1 min-h-[1.75rem]">{data.coBuyerName}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coBuyerAddress}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coBuyerPhone}</p>
            <p className="text-sm text-luxury-ink/80 min-h-[1.25rem]">{data.coBuyerEmail}</p>
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
                <th className="p-3 text-left font-semibold">Mileage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-luxury-ink/10">
                <td className="p-3">{data.vehicleYear}</td>
                <td className="p-3">{data.vehicleMake}</td>
                <td className="p-3">{data.vehicleModel}</td>
                <td className="p-3 uppercase font-mono text-xs">{data.vehicleVin}</td>
                <td className="p-3">{data.vehicleMileage}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Truth in Lending */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-2">Truth In Lending Disclosures</h3>
          <div className="grid grid-cols-4 border-2 border-luxury-ink divide-x-2 divide-luxury-ink">
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Annual Percentage Rate</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">The cost of your credit as a yearly rate.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{data.apr.toFixed(2)}%</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Finance Charge</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">The dollar amount the credit will cost you.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(financeCharge)}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Amount Financed</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">The amount of credit provided to you or on your behalf.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(amountFinanced)}</div>
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Total of Payments</div>
                <div className="text-[10px] text-luxury-ink/60 leading-tight">The amount you will have paid after you have made all payments as scheduled.</div>
              </div>
              <div className="text-2xl font-serif font-bold mt-6">{formatCurrency(totalOfPayments)}</div>
            </div>
          </div>
        </div>

        {/* Payment Schedule Summary */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-2">Payment Schedule</h3>
          <table className="w-full text-sm border-collapse border border-luxury-ink/20">
            <thead>
              <tr className="bg-luxury-bg/50 border-b border-luxury-ink/20">
                <th className="p-3 text-left font-semibold">Number of Payments</th>
                <th className="p-3 text-left font-semibold">Amount of Payments</th>
                <th className="p-3 text-left font-semibold">When Payments Are Due</th>
                <th className="p-3 text-left font-semibold">Est. Completion Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3">{data.numberOfPayments}</td>
                <td className="p-3 font-bold">{formatCurrency(paymentAmount)}</td>
                <td className="p-3">{data.paymentFrequency} beginning {data.firstPaymentDate ? format(new Date(data.firstPaymentDate + 'T12:00:00'), 'MM/dd/yyyy') : ''}</td>
                <td className="p-3 font-bold text-luxury-gold">{estimatedCompletionDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Itemization & Important Clauses */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-luxury-ink/50 mb-4">Itemization of Amount Financed</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>1. Cash Price of Vehicle</span>
                <span>{formatCurrency(data.cashPrice)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;a. Sales Tax</span>
                <span>{formatCurrency(data.tax)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;b. Title & Registration Fees</span>
                <span>{formatCurrency(data.titleFee)}</span>
              </div>
              <div className="flex justify-between text-luxury-ink/70">
                <span>&nbsp;&nbsp;&nbsp;c. Documentary Fee</span>
                <span>{formatCurrency(data.docFee)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-luxury-ink/10 pt-2">
                <span>2. Total Cash Price</span>
                <span>{formatCurrency(totalCashPrice)}</span>
              </div>
              <div className="flex justify-between border-b border-luxury-ink/20 pb-3">
                <span>3. Down Payment</span>
                <span className="text-red-700">- {formatCurrency(data.downPayment)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 text-lg font-serif">
                <span>4. Amount Financed (2 minus 3)</span>
                <span>{formatCurrency(amountFinanced)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-luxury-ink p-5 bg-luxury-bg/20">
              <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center">As Is - No Dealer Warranty</h3>
              <p className="text-xs text-justify leading-relaxed">
                <strong>THE VEHICLE IS SOLD AS IS.</strong> The dealer assumes no responsibility for any repairs regardless of any oral statements about the vehicle. All implied warranties, including any implied warranties of merchantability and fitness for a particular purpose, are expressly disclaimed.
              </p>
            </div>
            <div className="border border-red-900/20 p-5 bg-red-50/50">
              <h3 className="font-serif font-bold text-lg uppercase tracking-widest mb-2 text-center text-red-900">No Refund Policy</h3>
              <p className="text-xs text-justify leading-relaxed text-red-900/80">
                <strong>ALL SALES ARE FINAL.</strong> The Buyer acknowledges that no refunds, returns, or exchanges will be accepted under any circumstances. The down payment and any subsequent payments are strictly non-refundable.
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-16 text-[11px] text-justify space-y-3 text-luxury-ink/70 columns-2 gap-8">
          <p>
            <strong>PROMISE TO PAY:</strong> You promise to pay us the principal amount of {formatCurrency(amountFinanced)} plus interest at the Annual Percentage Rate of {data.apr.toFixed(2)}% until paid in full. You will make payments according to the Payment Schedule above.
          </p>
          <p>
            <strong>SECURITY INTEREST:</strong> You give us a security interest in the vehicle described above. This secures payment of all amounts you owe in this contract.
          </p>
          <p>
            <strong>LATE CHARGE:</strong> If a payment is not received in full within 10 days after it is due, you will pay a late charge of 5% of the unpaid part of the payment or $25.00, whichever is less.
          </p>
          <p>
            <strong>DEFAULT:</strong> You will be in default if you fail to make any payment when due. If you default, we may require you to pay at once the unpaid balance of the Amount Financed plus accrued interest, and we may repossess the vehicle.
          </p>
          <p>
            <strong>OWNERSHIP & INSURANCE:</strong> You must keep the vehicle fully insured against loss or damage, with us named as the loss payee, until the Amount Financed is paid in full. You may not sell, transfer, or abandon the vehicle without our prior written consent.
          </p>
        </div>

        {/* Signatures */}
        <div className="space-y-12 bg-luxury-bg/30 p-8 border border-luxury-ink/10">
          <div className="text-sm font-bold mb-8 text-center font-serif text-lg">
            By signing below, you agree to the terms of this contract. You acknowledge that you have read it completely before signing.
          </div>
          
          <div className="grid grid-cols-2 gap-16">
            <div>
              <div className="border-b border-luxury-ink h-10 mb-2"></div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-semibold">
                <span>Buyer Signature</span>
                <span>Date</span>
              </div>
            </div>
            <div>
              <div className="border-b border-luxury-ink h-10 mb-2"></div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-semibold">
                <span>Co-Buyer Signature</span>
                <span>Date</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-16 mt-8">
            <div>
              <div className="border-b border-luxury-ink h-10 mb-2"></div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-semibold">
                <span>Triple J Auto Representative</span>
                <span>Date</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Payment Schedule (Page Break for Print) */}
        {schedule.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-luxury-ink print:break-before-page">
            <h3 className="text-2xl font-serif font-bold mb-8 text-center uppercase tracking-widest">Amortization Schedule</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
              {schedule.map((payment) => (
                <div key={payment.paymentNumber} className="border-b border-luxury-ink/10 pb-2 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-luxury-ink/40 uppercase tracking-wider">Payment {payment.paymentNumber}</span>
                    <span className="font-medium">{payment.date}</span>
                  </div>
                  <span className="font-bold font-serif">{formatCurrency(payment.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
