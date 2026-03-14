import { BillOfSaleData } from './billOfSale';

export interface Form130UData {
  // Application Type
  applicationType: 'titleAndRegistration' | 'titleOnly' | 'registrationOnly' | 'nontitle';

  // Vehicle Description
  vin: string;                    // Field 1
  year: string;                   // Field 2
  make: string;                   // Field 3
  bodyStyle: string;              // Field 4
  model: string;                  // Field 5
  majorColor: string;             // Field 6
  minorColor: string;             // Field 7
  licensePlateNo: string;         // Field 8
  odometerReading: string;        // Field 9
  odometerBrand: 'A' | 'N' | 'X'; // Field 10: A=Actual, N=Not Actual, X=Exceeds
  emptyWeight: string;            // Field 11
  carryingCapacity: string;       // Field 12

  // Applicant/Owner
  applicantType: 'Individual' | 'Business' | 'Government' | 'Trust' | 'Non-Profit'; // Field 14
  applicantIdNumber: string;      // Field 14 (DL#, FEIN, etc.)
  applicantIdType: string;        // Field 15
  applicantIdState: string;       // Field 15
  applicantFirstName: string;     // Field 16
  applicantMiddleName: string;    // Field 16
  applicantLastName: string;      // Field 16
  applicantSuffix: string;        // Field 16
  applicantEntityName: string;    // Field 16 (if business)
  coApplicantName: string;        // Field 17
  mailingAddress: string;         // Field 18
  mailingCity: string;            // Field 18
  mailingState: string;           // Field 18
  mailingZip: string;             // Field 18
  countyOfResidence: string;      // Field 19
  applicantDob: string;           // Field 20
  applicantPhone: string;         // Field 21
  applicantEmail: string;

  // Previous Owner (Seller)
  previousOwnerName: string;      // Field 22
  previousOwnerCity: string;      // Field 22
  previousOwnerState: string;     // Field 22

  // Vehicle Location (if different from mailing)
  vehicleLocationAddress: string; // Field 23
  vehicleLocationCity: string;
  vehicleLocationState: string;
  vehicleLocationZip: string;
  vehicleLocationCounty: string;
  vehicleLocationSameAsMailing: boolean;

  // Lienholder
  lienholderName: string;         // Field 34
  lienholderAddress: string;
  lienholderCity: string;
  lienholderState: string;
  lienholderZip: string;
  hasLien: boolean;

  // Motor Vehicle Tax / Sales & Use Tax
  salesPrice: number;             // Line (a)
  tradeInAllowance: number;       // Line (b)
  taxRate: number;                // Line (d) - default 6.25
  rebateOrIncentive: number;

  // Trade-In Vehicle
  tradeInDescription: string;     // Field 36
  tradeInVin: string;

  // Sale Date
  saleDate: string;

  // Remarks
  remarks: string;
}

export function calculateTax(data: Form130UData) {
  const netPrice = Math.max(0, data.salesPrice - data.tradeInAllowance - data.rebateOrIncentive);
  const taxDue = netPrice * (data.taxRate / 100);
  return { netPrice, taxDue };
}

export function prefillFromBillOfSale(bos: BillOfSaleData): Partial<Form130UData> {
  const odometerBrand: 'A' | 'N' | 'X' =
    bos.odometerStatus === 'actual' ? 'A' :
    bos.odometerStatus === 'exceeds' ? 'X' : 'N';

  // Parse buyer name into first/middle/last
  const nameParts = bos.buyerName.trim().split(/\s+/);
  let firstName = '';
  let middleName = '';
  let lastName = '';
  if (nameParts.length === 1) {
    firstName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else if (nameParts.length >= 3) {
    firstName = nameParts[0];
    middleName = nameParts.slice(1, -1).join(' ');
    lastName = nameParts[nameParts.length - 1];
  }

  return {
    // Vehicle
    vin: bos.vehicleVin,
    year: bos.vehicleYear,
    make: bos.vehicleMake,
    model: bos.vehicleModel,
    bodyStyle: bos.vehicleBodyStyle,
    majorColor: bos.vehicleColor,
    odometerReading: bos.odometerReading || bos.vehicleMileage,
    odometerBrand,

    // Applicant from Buyer
    applicantFirstName: firstName,
    applicantMiddleName: middleName,
    applicantLastName: lastName,
    applicantIdNumber: bos.buyerLicense,
    applicantIdType: 'DL',
    applicantIdState: bos.buyerLicenseState,
    mailingAddress: bos.buyerAddress,
    mailingCity: bos.buyerCity,
    mailingState: bos.buyerState,
    mailingZip: bos.buyerZip,
    applicantPhone: bos.buyerPhone,
    applicantEmail: bos.buyerEmail,

    // Co-Applicant
    coApplicantName: bos.coBuyerName,

    // Previous Owner (Triple J)
    previousOwnerName: 'Triple J Auto Investment LLC',
    previousOwnerCity: 'Houston',
    previousOwnerState: 'TX',

    // Tax
    salesPrice: bos.salePrice,
    tradeInAllowance: bos.tradeInAllowance,

    // Trade-In
    tradeInDescription: bos.tradeInDescription,
    tradeInVin: bos.tradeInVin,

    // Sale Date
    saleDate: bos.saleDate,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
