import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { ContractData } from './finance';
import { RentalData } from './rental';
import { BillOfSaleData } from './billOfSale';
import { Form130UData } from './form130U';

export type CustomerSection = 'financing' | 'rental' | 'billOfSale' | 'form130U';

export interface CustomerLinkData {
  s: CustomerSection; // section
  d: Record<string, unknown>; // dealer-filled data
  ds?: string; // dealer signature (base64)
  dd?: string; // dealer signature date
}

// Fields that the DEALER fills in for each section type
const dealerFields: Record<CustomerSection, string[]> = {
  financing: [
    'vehicleYear', 'vehicleMake', 'vehicleModel', 'vehicleVin', 'vehiclePlate', 'vehicleMileage',
    'cashPrice', 'downPayment', 'tax', 'titleFee', 'docFee',
    'apr', 'numberOfPayments', 'paymentFrequency', 'firstPaymentDate',
    'dueAtSigning',
  ],
  rental: [
    'vehicleYear', 'vehicleMake', 'vehicleModel', 'vehicleVin', 'vehiclePlate',
    'mileageOut', 'fuelLevelOut',
    'rentalRate', 'rentalPeriod', 'rentalStartDate', 'rentalEndDate',
    'securityDeposit', 'mileageAllowance', 'excessMileageCharge',
    'insuranceFee', 'additionalDriverFee', 'tax',
    'dueAtSigning',
  ],
  billOfSale: [
    'saleDate', 'stockNumber',
    'vehicleYear', 'vehicleMake', 'vehicleModel', 'vehicleTrim',
    'vehicleVin', 'vehiclePlate', 'vehicleColor', 'vehicleBodyStyle', 'vehicleMileage',
    'odometerReading', 'odometerStatus',
    'salePrice', 'tradeInAllowance', 'tradeInDescription', 'tradeInVin', 'tradeInPayoff',
    'tax', 'titleFee', 'docFee', 'registrationFee', 'otherFees', 'otherFeesDescription',
    'paymentMethod', 'paymentMethodOther',
    'conditionType', 'warrantyDuration', 'warrantyDescription',
  ],
  form130U: [
    'applicationType', 'vin', 'year', 'make', 'bodyStyle', 'model',
    'majorColor', 'minorColor', 'licensePlateNo', 'odometerReading', 'odometerBrand',
    'emptyWeight', 'carryingCapacity',
    'previousOwnerName', 'previousOwnerCity', 'previousOwnerState',
    'salesPrice', 'tradeInAllowance', 'taxRate', 'rebateOrIncentive',
    'tradeInDescription', 'tradeInVin', 'saleDate', 'remarks',
  ],
};

// Fields that the CUSTOMER fills in
export const customerFields: Record<CustomerSection, string[]> = {
  financing: [
    'buyerName', 'buyerAddress', 'buyerPhone', 'buyerEmail',
    'coBuyerName', 'coBuyerAddress', 'coBuyerPhone', 'coBuyerEmail',
  ],
  rental: [
    'renterName', 'renterAddress', 'renterPhone', 'renterEmail', 'renterLicense',
    'coRenterName', 'coRenterAddress', 'coRenterPhone', 'coRenterEmail', 'coRenterLicense',
    'mileageIn', 'fuelLevelIn',
  ],
  billOfSale: [
    'buyerName', 'buyerAddress', 'buyerCity', 'buyerState', 'buyerZip',
    'buyerPhone', 'buyerEmail', 'buyerLicense', 'buyerLicenseState',
    'coBuyerName', 'coBuyerAddress', 'coBuyerCity', 'coBuyerState', 'coBuyerZip',
    'coBuyerPhone', 'coBuyerEmail', 'coBuyerLicense', 'coBuyerLicenseState',
  ],
  form130U: [
    'applicantType', 'applicantIdNumber', 'applicantIdType', 'applicantIdState',
    'applicantFirstName', 'applicantMiddleName', 'applicantLastName', 'applicantSuffix',
    'applicantEntityName', 'coApplicantName',
    'mailingAddress', 'mailingCity', 'mailingState', 'mailingZip',
    'countyOfResidence', 'applicantDob', 'applicantPhone', 'applicantEmail',
    'vehicleLocationAddress', 'vehicleLocationCity', 'vehicleLocationState',
    'vehicleLocationZip', 'vehicleLocationCounty', 'vehicleLocationSameAsMailing',
    'hasLien', 'lienholderName', 'lienholderAddress', 'lienholderCity',
    'lienholderState', 'lienholderZip',
  ],
};

export function encodeCustomerLink(
  section: CustomerSection,
  data: ContractData | RentalData | BillOfSaleData | Form130UData,
  dealerSignature?: string,
  dealerSignatureDate?: string,
): string {
  const fields = dealerFields[section];
  const dealerData: Record<string, unknown> = {};
  for (const key of fields) {
    dealerData[key] = (data as unknown as Record<string, unknown>)[key];
  }

  const payload: CustomerLinkData = {
    s: section,
    d: dealerData,
  };

  // Only include dealer signature if it's not too large (< 50KB)
  if (dealerSignature && dealerSignature.length < 50000) {
    payload.ds = dealerSignature;
    payload.dd = dealerSignatureDate;
  }

  const json = JSON.stringify(payload);
  const compressed = compressToEncodedURIComponent(json);
  return `${window.location.origin}${window.location.pathname}#customer/${compressed}`;
}

export function decodeCustomerLink(hash: string): CustomerLinkData | null {
  try {
    const prefix = '#customer/';
    if (!hash.startsWith(prefix)) return null;
    const compressed = hash.slice(prefix.length);
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json) as CustomerLinkData;
  } catch {
    return null;
  }
}

export function mergeCustomerData(
  section: CustomerSection,
  dealerData: Record<string, unknown>,
  customerData: Record<string, unknown>,
): Record<string, unknown> {
  return { ...dealerData, ...customerData };
}

// === COMPLETED DOCUMENT (Customer → Dealer return trip) ===

export interface CompletedLinkData {
  s: CustomerSection;
  dd: Record<string, unknown>; // dealer data
  cd: Record<string, unknown>; // customer data
  ds?: string;  // dealer signature
  dsd?: string; // dealer signature date
  bs?: string;  // buyer signature
  bsd?: string; // buyer signature date
  cs?: string;  // co-buyer signature
  csd?: string; // co-buyer signature date
  bi?: string;  // buyer ID photo
}

export function encodeCompletedLink(
  section: CustomerSection,
  dealerData: Record<string, unknown>,
  customerData: Record<string, unknown>,
  dealerSignature?: string,
  dealerSignatureDate?: string,
  buyerSignature?: string,
  buyerSignatureDate?: string,
  coBuyerSignature?: string,
  coBuyerSignatureDate?: string,
  buyerIdPhoto?: string,
): string {
  const payload: CompletedLinkData = {
    s: section,
    dd: dealerData,
    cd: customerData,
  };

  // Include signatures if not too large (< 50KB each)
  if (dealerSignature && dealerSignature.length < 50000) {
    payload.ds = dealerSignature;
    payload.dsd = dealerSignatureDate;
  }
  if (buyerSignature && buyerSignature.length < 50000) {
    payload.bs = buyerSignature;
    payload.bsd = buyerSignatureDate;
  }
  if (coBuyerSignature && coBuyerSignature.length < 50000) {
    payload.cs = coBuyerSignature;
    payload.csd = coBuyerSignatureDate;
  }
  // Include ID photo only if reasonably small (< 100KB)
  if (buyerIdPhoto && buyerIdPhoto.length < 100000) {
    payload.bi = buyerIdPhoto;
  }

  const json = JSON.stringify(payload);
  const compressed = compressToEncodedURIComponent(json);
  return `${window.location.origin}${window.location.pathname}#completed/${compressed}`;
}

export function decodeCompletedLink(hash: string): CompletedLinkData | null {
  try {
    const prefix = '#completed/';
    if (!hash.startsWith(prefix)) return null;
    const compressed = hash.slice(prefix.length);
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json) as CompletedLinkData;
  } catch {
    return null;
  }
}
