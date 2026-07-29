/**
 * Types definition for Galaxy Mobile Shop & Inventory System
 */

export type UserRole = 'admin' | 'manager' | 'cashier';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  pin: string;
}

export type CategoryType =
  | 'Smartphones & Mobiles'
  | 'AirPods & Wireless Earbuds'
  | 'Handsfree & Wired Headsets'
  | 'Chargers & Adapters'
  | 'Power Banks'
  | 'Earbuds & Audio'
  | 'Mobile Covers'
  | 'Screen Protectors'
  | 'Networking & Routers'
  | 'Holders & Lights'
  | 'SIM & EasyLoad'
  | 'Repair Parts'
  | 'General Accessories';

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  brand: string;
  category: CategoryType;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
  image: string;
  description: string;
  locationInShop?: string; // e.g. "Rack A2", "Counter Glass 1"
  lastRestocked?: string;
}

export interface SaleItem {
  productId: string;
  sku: string;
  name: string;
  brand: string;
  qty: number;
  unitPrice: number;
  costPrice: number;
  total: number;
}

export type PaymentMethod = 'Cash' | 'EasyPaisa' | 'JazzCash' | 'HBL Konnect' | 'Bank Transfer' | 'Udhar / Credit';

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  cashierId: string;
  cashierName: string;
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  totalSpent: number;
  balanceDue: number; // Udhar ledger balance
  lastVisit: string;
  notes?: string;
}

export interface Inquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  deviceModel?: string;
  issueCategory: 'Repair Request' | 'Product Availability' | 'Bulk Order' | 'General Query';
  message: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface ShopInfo {
  name: string;
  urduName: string;
  slogan: string;
  plusCode: string;
  address: string;
  city: string;
  country: string;
  phones: string[];
  email: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ShopPhoto {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  featuredProducts?: string[];
}

export type DigitalServiceType =
  | 'EasyPaisa'
  | 'JazzCash'
  | 'Utility Bill Payment'
  | 'Mobile EasyLoad & Network Cards'
  | 'NADRA e-Sahulat & Biometric';

export type FinancialTransactionType =
  | 'EasyPaisa Money Transfer'
  | 'EasyPaisa Cash-In (Deposit)'
  | 'EasyPaisa Cash-Out (Withdrawal)'
  | 'JazzCash Money Transfer'
  | 'JazzCash Cash-In (Deposit)'
  | 'JazzCash Cash-Out (Withdrawal)'
  | 'Electricity Bill Payment'
  | 'Gas Bill Payment'
  | 'Water Bill Payment'
  | 'Internet / PTCL Bill Payment'
  | 'Jazz EasyLoad'
  | 'Telenor Easyload'
  | 'Zong Load'
  | 'Ufone Easyload'
  | 'ONIC Digital Top-up'
  | 'Scratch Card / Super Card Bundle'
  | 'NADRA Biometric Verification'
  | 'ETD Punjab Vehicle Clearance'
  | 'CNIC Identity Verification'
  | 'SIM Biometric Ownership'
  | 'e-Sahulat Govt Fee Payment';

export interface UtilityBillCompany {
  id: string;
  name: string;
  category: 'Electricity' | 'Gas' | 'Water' | 'Internet & Landline';
  code: string;
  sampleReferenceLength: number;
}

export interface MobileLoadDetails {
  networkOperator: 'Jazz' | 'Telenor' | 'Zong' | 'Ufone' | 'ONIC';
  mobileNumber: string;
  loadType: 'EasyLoad' | 'Scratch Card' | 'Super Card / Hybrid Bundle' | 'Postpaid Bill';
  bundleName?: string;
  scratchCardPin?: string;
}

export interface NadraDetails {
  serviceCategory:
    | 'Biometric Verification'
    | 'ETD Punjab Vehicle Clearance'
    | 'CNIC Identity Verification'
    | 'SIM Biometric Verification'
    | 'e-Sahulat Govt Fee';
  citizenUrduName?: string;
  cnic: string;
  trackingId: string;
  eSahulatId: string;
  chassisNo?: string;
  verificationStatus: 'Verified' | 'Pending' | 'Failed';
  serviceCharges: number;
  issueDate: string;
  issueTime: string;
  barcodeNumber: string;
  helpLine: string;
}

export interface DigitalTransaction {
  id: string;
  trxId: string; // e.g. "EP-98210492", "JC-40192831", "BILL-109283", "LOAD-882190", "NADRA-10259278"
  serviceType: DigitalServiceType;
  type: FinancialTransactionType;
  senderName: string;
  senderPhone: string;
  receiverPhone?: string;
  cnic?: string;
  amount: number;
  feeCommission: number; // Commission earned by agent
  totalCollected: number; // amount + fee
  paymentMethodUsed: 'Cash' | 'EasyPaisa Account' | 'JazzCash Account' | 'Shop Float';
  status: 'Completed' | 'Pending' | 'Failed';
  billDetails?: {
    company: string;
    consumerNumber: string;
    billingMonth: string;
    dueDate: string;
    lateFeeAmount?: number;
    customerName?: string;
    paidStatus?: boolean;
  };
  mobileLoadDetails?: MobileLoadDetails;
  nadraDetails?: NadraDetails;
  agentId: string;
  agentName: string;
  createdAt: string;
  notes?: string;
}

export interface AgentBalances {
  easyPaisaBalance: number;
  jazzCashBalance: number;
  billFloatBalance: number;
  easyLoadBalance: number;
  eSahulatBalance: number;
  todayCommissionEarned: number;
}

// Mobile Repair Scheme Management Types
export type RepairStatus =
  | 'Received'
  | 'Diagnosing'
  | 'Waiting Parts'
  | 'In Repair'
  | 'Ready for Pickup'
  | 'Delivered'
  | 'Cancelled';

export type RepairCategory =
  | 'Screen / Display Replacement'
  | 'Battery Replacement'
  | 'Charging Port / Board'
  | 'Software / Flashing / Unlocking'
  | 'Water Damage Treatment'
  | 'Camera / Speaker Repair'
  | 'Motherboard BGA Reballing'
  | 'Other Hardware Issue';

export interface RepairLog {
  timestamp: string;
  note: string;
  performedBy: string;
}

export interface RepairTicket {
  id: string;
  ticketNumber: string; // e.g. "RPR-8012"
  customerName: string;
  customerPhone: string;
  deviceBrand: string; // e.g. "Samsung", "Apple", "Infinix", "Xiaomi"
  deviceModel: string; // e.g. "Galaxy S23 Ultra"
  imeiOrSerial?: string;
  faultDescription: string;
  category: RepairCategory;
  estimatedCost: number;
  advancePaid: number;
  sparePartsCost?: number;
  technicianName: string;
  status: RepairStatus;
  receivedDate: string;
  estimatedCompletionDate?: string;
  completedDate?: string;
  deliveredDate?: string;
  warrantyDays: number; // e.g. 30 days
  repairLogs: RepairLog[];
  passcodePattern?: string; // Unlock passcode or pattern note
  notes?: string;
}

// Customer Loan / Mobile Installment Scheme Types
export type LoanStatus = 'Active' | 'Paid Off' | 'Overdue' | 'Defaulted';

export interface LoanInstallment {
  installmentNo: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  paidDate?: string;
  status: 'Pending' | 'Paid' | 'Partial' | 'Late';
  receiptNo?: string;
}

export interface CustomerLoan {
  id: string;
  loanNumber: string; // e.g. "LN-1092"
  customerName: string;
  customerPhone: string;
  customerCnic: string;
  customerAddress: string;
  itemPurchased?: string; // e.g. "Vivo Y27 8GB/128GB"
  totalItemPrice: number;
  downPayment: number;
  loanPrincipalAmount: number; // Price - DownPayment
  markupPercentage: number; // Interest / Scheme rate e.g. 10%
  totalRepayableAmount: number; // Principal + Markup
  tenureMonths: number; // e.g. 3, 6, 12 months
  monthlyInstallmentAmount: number;
  startDate: string;
  guarantorName: string;
  guarantorPhone: string;
  guarantorCnic: string;
  guarantorRelation: string;
  status: LoanStatus;
  installments: LoanInstallment[];
  notes?: string;
  createdAt: string;
}


