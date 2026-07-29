import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  User,
  Customer,
  Sale,
  Inquiry,
  SaleItem,
  UserRole,
  DigitalTransaction,
  AgentBalances,
  RepairTicket,
  RepairStatus,
  CustomerLoan,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_SALES,
  INITIAL_INQUIRIES,
  INITIAL_DIGITAL_TRANSACTIONS,
  INITIAL_AGENT_BALANCES,
  INITIAL_REPAIR_TICKETS,
  INITIAL_CUSTOMER_LOANS,
} from '../data/mockData';

interface AppContextType {
  // Auth
  currentUser: User;
  switchUser: (user: User) => void;
  hasRole: (roles: UserRole[]) => boolean;

  // Active View
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Mobile Repairs
  repairTickets: RepairTicket[];
  addRepairTicket: (
    ticket: Omit<RepairTicket, 'id' | 'ticketNumber' | 'receivedDate' | 'repairLogs'>
  ) => RepairTicket;
  updateRepairStatus: (ticketId: string, newStatus: RepairStatus, note?: string) => void;
  addRepairLogNote: (ticketId: string, note: string) => void;
  selectedRepairTicketForModal: RepairTicket | null;
  setSelectedRepairTicketForModal: (ticket: RepairTicket | null) => void;

  // Customer Loans & Installments
  customerLoans: CustomerLoan[];
  addCustomerLoan: (
    loanData: Omit<
      CustomerLoan,
      | 'id'
      | 'loanNumber'
      | 'createdAt'
      | 'installments'
      | 'status'
      | 'totalRepayableAmount'
      | 'monthlyInstallmentAmount'
      | 'loanPrincipalAmount'
    >
  ) => CustomerLoan;
  recordLoanPayment: (loanId: string, installmentNo: number, amountPaid: number) => void;
  selectedLoanForModal: CustomerLoan | null;
  setSelectedLoanForModal: (loan: CustomerLoan | null) => void;

  // Inventory
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number, reason?: string) => void;
  lowStockProducts: Product[];

  // POS & Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'invoiceNumber' | 'createdAt'>) => Sale;
  getSaleById: (id: string) => Sale | undefined;

  // POS Cart State
  cartItems: SaleItem[];
  addToCart: (product: Product, qty?: number) => void;
  updateCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartDiscount: number;
  setCartDiscount: (discount: number) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;

  // Digital Financials (EasyPaisa, JazzCash, Utility Bills, Mobile Load, NADRA e-Sahulat)
  digitalTransactions: DigitalTransaction[];
  agentBalances: AgentBalances;
  addDigitalTransaction: (
    dtrx: Omit<DigitalTransaction, 'id' | 'trxId' | 'createdAt' | 'status'>
  ) => DigitalTransaction;
  topUpAgentBalance: (
    provider: 'easyPaisa' | 'jazzCash' | 'billFloat' | 'easyLoad' | 'eSahulat',
    amount: number
  ) => void;
  selectedDigitalTrxForModal: DigitalTransaction | null;
  setSelectedDigitalTrxForModal: (trx: DigitalTransaction | null) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchases' | 'totalSpent' | 'lastVisit'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  settleCustomerBalance: (customerId: string, amount: number) => void;

  // Inquiries
  inquiries: Inquiry[];
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;

  // Invoice Modal trigger
  selectedInvoiceForModal: Sale | null;
  setSelectedInvoiceForModal: (sale: Sale | null) => void;

  // Notification Banner
  notifications: string[];
  addNotification: (msg: string) => void;
  dismissNotification: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('galaxy_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Active view
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('galaxy_products_v3');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Sales state
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('galaxy_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('galaxy_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('galaxy_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  // Digital Financials (EasyPaisa, JazzCash, Utility Bills) State
  const [digitalTransactions, setDigitalTransactions] = useState<DigitalTransaction[]>(() => {
    const saved = localStorage.getItem('galaxy_digital_trxs');
    return saved ? JSON.parse(saved) : INITIAL_DIGITAL_TRANSACTIONS;
  });

  const [agentBalances, setAgentBalances] = useState<AgentBalances>(() => {
    const saved = localStorage.getItem('galaxy_agent_balances');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          easyPaisaBalance: Number(parsed.easyPaisaBalance ?? INITIAL_AGENT_BALANCES.easyPaisaBalance),
          jazzCashBalance: Number(parsed.jazzCashBalance ?? INITIAL_AGENT_BALANCES.jazzCashBalance),
          billFloatBalance: Number(parsed.billFloatBalance ?? INITIAL_AGENT_BALANCES.billFloatBalance),
          easyLoadBalance: Number(parsed.easyLoadBalance ?? INITIAL_AGENT_BALANCES.easyLoadBalance),
          eSahulatBalance: Number(parsed.eSahulatBalance ?? INITIAL_AGENT_BALANCES.eSahulatBalance),
          todayCommissionEarned: Number(parsed.todayCommissionEarned ?? INITIAL_AGENT_BALANCES.todayCommissionEarned),
        };
      } catch (e) {
        return INITIAL_AGENT_BALANCES;
      }
    }
    return INITIAL_AGENT_BALANCES;
  });

  const [selectedDigitalTrxForModal, setSelectedDigitalTrxForModal] = useState<DigitalTransaction | null>(null);

  // Repair Tickets State
  const [repairTickets, setRepairTickets] = useState<RepairTicket[]>(() => {
    const saved = localStorage.getItem('galaxy_repair_tickets');
    return saved ? JSON.parse(saved) : INITIAL_REPAIR_TICKETS;
  });
  const [selectedRepairTicketForModal, setSelectedRepairTicketForModal] = useState<RepairTicket | null>(null);

  // Customer Loans & Installments State
  const [customerLoans, setCustomerLoans] = useState<CustomerLoan[]>(() => {
    const saved = localStorage.getItem('galaxy_customer_loans');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_LOANS;
  });
  const [selectedLoanForModal, setSelectedLoanForModal] = useState<CustomerLoan | null>(null);

  // POS Cart State
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Invoice Modal Trigger
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Sale | null>(null);

  // System Notifications
  const [notifications, setNotifications] = useState<string[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('galaxy_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('galaxy_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('galaxy_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('galaxy_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('galaxy_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('galaxy_digital_trxs', JSON.stringify(digitalTransactions));
  }, [digitalTransactions]);

  useEffect(() => {
    localStorage.setItem('galaxy_agent_balances', JSON.stringify(agentBalances));
  }, [agentBalances]);

  useEffect(() => {
    localStorage.setItem('galaxy_repair_tickets', JSON.stringify(repairTickets));
  }, [repairTickets]);

  useEffect(() => {
    localStorage.setItem('galaxy_customer_loans', JSON.stringify(customerLoans));
  }, [customerLoans]);

  // Auth Helper
  const switchUser = (user: User) => {
    setCurrentUser(user);
    addNotification(`Logged in as ${user.name} (${user.role.toUpperCase()})`);
  };

  const hasRole = (roles: UserRole[]) => {
    return roles.includes(currentUser.role);
  };

  const addNotification = (msg: string) => {
    setNotifications((prev) => [msg, ...prev]);
  };

  const dismissNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Low stock products filter
  const lowStockProducts = products.filter((p) => p.stock <= p.reorderLevel);

  // Product Actions
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod_${Date.now()}`;
    const product: Product = { ...newProd, id, lastRestocked: new Date().toISOString().split('T')[0] };
    setProducts((prev) => [product, ...prev]);
    addNotification(`Product "${product.name}" added to inventory.`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addNotification(`Product "${updated.name}" updated.`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const prod = prev.find((p) => p.id === id);
      if (prod) {
        addNotification(`Product "${prod.name}" removed from inventory.`);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const adjustStock = (id: string, delta: number, reason?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          addNotification(`Stock adjusted for "${p.name}": ${p.stock} → ${newStock}${reason ? ` (${reason})` : ''}`);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Cart Actions
  const addToCart = (product: Product, qty: number = 1) => {
    if (product.stock <= 0) {
      addNotification(`Cannot add "${product.name}" — Out of stock!`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.qty + qty);
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, qty: newQty, total: newQty * item.unitPrice }
            : item
        );
      } else {
        const initialQty = Math.min(product.stock, qty);
        return [
          ...prev,
          {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            brand: product.brand,
            qty: initialQty,
            unitPrice: product.sellingPrice,
            costPrice: product.costPrice,
            total: initialQty * product.sellingPrice,
          },
        ];
      }
    });
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const maxStock = product ? product.stock : qty;
    const finalQty = Math.min(maxStock, qty);

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: finalQty, total: finalQty * item.unitPrice }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartDiscount(0);
    setSelectedCustomer(null);
  };

  // Sales Action
  const addSale = (saleData: Omit<Sale, 'id' | 'invoiceNumber' | 'createdAt'>): Sale => {
    const invCount = sales.length + 1001;
    const invoiceNumber = `INV-2026-${String(invCount).padStart(4, '0')}`;
    const newSale: Sale = {
      ...saleData,
      id: `sale_${Date.now()}`,
      invoiceNumber,
      createdAt: new Date().toISOString(),
    };

    // 1. Deduct Stock in Real-Time
    setProducts((prev) =>
      prev.map((prod) => {
        const soldItem = newSale.items.find((item) => item.productId === prod.id);
        if (soldItem) {
          const remaining = Math.max(0, prod.stock - soldItem.qty);
          return { ...prod, stock: remaining };
        }
        return prod;
      })
    );

    // 2. Update Customer Record or Add Udhar if applicable
    if (newSale.customerId) {
      setCustomers((prev) =>
        prev.map((cust) => {
          if (cust.id === newSale.customerId) {
            const addedBalance = newSale.paymentMethod === 'Udhar / Credit' ? newSale.total : 0;
            return {
              ...cust,
              totalPurchases: cust.totalPurchases + 1,
              totalSpent: cust.totalSpent + newSale.total,
              balanceDue: cust.balanceDue + addedBalance,
              lastVisit: new Date().toISOString().split('T')[0],
            };
          }
          return cust;
        })
      );
    }

    // 3. Save Sale
    setSales((prev) => [newSale, ...prev]);

    // 4. Trigger Notifications & Modal
    addNotification(`Sale complete! Invoice #${invoiceNumber} generated.`);
    setSelectedInvoiceForModal(newSale);
    clearCart();

    return newSale;
  };

  const getSaleById = (id: string) => {
    return sales.find((s) => s.id === id);
  };

  // Customer Actions
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalPurchases' | 'totalSpent' | 'lastVisit'>) => {
    const id = `cust_${Date.now()}`;
    const newCust: Customer = {
      ...custData,
      id,
      totalPurchases: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    addNotification(`Customer "${newCust.name}" registered.`);
    return newCust;
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    addNotification(`Customer record for "${updated.name}" updated.`);
  };

  const settleCustomerBalance = (customerId: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBal = Math.max(0, c.balanceDue - amount);
          addNotification(`Payment of PKR ${amount.toLocaleString()} recorded for ${c.name}. Remaining balance: PKR ${newBal.toLocaleString()}`);
          return { ...c, balanceDue: newBal };
        }
        return c;
      })
    );
  };

  // Inquiry Actions
  const addInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const id = `inq_${Date.now()}`;
    const newInquiry: Inquiry = {
      ...inquiryData,
      id,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    addNotification(`New inquiry / repair ticket received from ${newInquiry.customerName}.`);
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    addNotification(`Inquiry status updated to ${status}.`);
  };

  // Digital Financial Actions (EasyPaisa, JazzCash, Utility Bills, Mobile Load, NADRA e-Sahulat)
  const addDigitalTransaction = (
    dtrxData: Omit<DigitalTransaction, 'id' | 'trxId' | 'createdAt' | 'status'>
  ): DigitalTransaction => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    let prefix = 'DTRX';
    if (dtrxData.serviceType === 'EasyPaisa') prefix = 'EP';
    else if (dtrxData.serviceType === 'JazzCash') prefix = 'JC';
    else if (dtrxData.serviceType === 'Utility Bill Payment') prefix = 'BILL';
    else if (dtrxData.serviceType === 'Mobile EasyLoad & Network Cards') prefix = 'LOAD';
    else if (dtrxData.serviceType === 'NADRA e-Sahulat & Biometric') prefix = 'NADRA';

    const trxId = `${prefix}-${randomDigits}`;
    const id = `dtrx_${Date.now()}`;

    const newTrx: DigitalTransaction = {
      ...dtrxData,
      id,
      trxId,
      status: 'Completed',
      createdAt: new Date().toISOString(),
    };

    // Update Agent Balances
    setAgentBalances((prev) => {
      let epBal = prev.easyPaisaBalance;
      let jcBal = prev.jazzCashBalance;
      let billBal = prev.billFloatBalance;
      let loadBal = prev.easyLoadBalance;
      let nadraBal = prev.eSahulatBalance;
      const commission = prev.todayCommissionEarned + dtrxData.feeCommission;

      if (dtrxData.serviceType === 'EasyPaisa') {
        if (dtrxData.type === 'EasyPaisa Cash-Out (Withdrawal)') {
          epBal += dtrxData.amount;
        } else {
          epBal = Math.max(0, epBal - dtrxData.amount);
        }
      } else if (dtrxData.serviceType === 'JazzCash') {
        if (dtrxData.type === 'JazzCash Cash-Out (Withdrawal)') {
          jcBal += dtrxData.amount;
        } else {
          jcBal = Math.max(0, jcBal - dtrxData.amount);
        }
      } else if (dtrxData.serviceType === 'Utility Bill Payment') {
        billBal = Math.max(0, billBal - dtrxData.amount);
      } else if (dtrxData.serviceType === 'Mobile EasyLoad & Network Cards') {
        loadBal = Math.max(0, loadBal - dtrxData.amount);
      } else if (dtrxData.serviceType === 'NADRA e-Sahulat & Biometric') {
        nadraBal = Math.max(0, nadraBal - dtrxData.amount);
      }

      return {
        easyPaisaBalance: epBal,
        jazzCashBalance: jcBal,
        billFloatBalance: billBal,
        easyLoadBalance: loadBal,
        eSahulatBalance: nadraBal,
        todayCommissionEarned: commission,
      };
    });

    setDigitalTransactions((prev) => [newTrx, ...prev]);
    setSelectedDigitalTrxForModal(newTrx);

    let msg = `${dtrxData.serviceType} transaction #${trxId} completed! PKR ${dtrxData.amount.toLocaleString()}`;
    if (dtrxData.billDetails) {
      msg = `${dtrxData.billDetails.company} Bill Paid! Ref #${dtrxData.billDetails.consumerNumber} (PKR ${dtrxData.amount.toLocaleString()})`;
    } else if (dtrxData.mobileLoadDetails) {
      msg = `${dtrxData.mobileLoadDetails.networkOperator} Load sent to ${dtrxData.mobileLoadDetails.mobileNumber} (PKR ${dtrxData.amount.toLocaleString()})`;
    } else if (dtrxData.nadraDetails) {
      msg = `NADRA e-Sahulat Biometric Verification processed for CNIC ${dtrxData.nadraDetails.cnic}!`;
    }
    addNotification(msg);

    return newTrx;
  };

  const topUpAgentBalance = (
    provider: 'easyPaisa' | 'jazzCash' | 'billFloat' | 'easyLoad' | 'eSahulat',
    amount: number
  ) => {
    setAgentBalances((prev) => {
      let ep = prev.easyPaisaBalance;
      let jc = prev.jazzCashBalance;
      let bill = prev.billFloatBalance;
      let load = prev.easyLoadBalance;
      let nadra = prev.eSahulatBalance;

      if (provider === 'easyPaisa') ep += amount;
      if (provider === 'jazzCash') jc += amount;
      if (provider === 'billFloat') bill += amount;
      if (provider === 'easyLoad') load += amount;
      if (provider === 'eSahulat') nadra += amount;

      return {
        ...prev,
        easyPaisaBalance: ep,
        jazzCashBalance: jc,
        billFloatBalance: bill,
        easyLoadBalance: load,
        eSahulatBalance: nadra,
      };
    });
    addNotification(`Agent balance topped up by PKR ${amount.toLocaleString()} for ${provider.toUpperCase()}`);
  };

  // Mobile Repair Functions
  const addRepairTicket = (
    ticketData: Omit<RepairTicket, 'id' | 'ticketNumber' | 'receivedDate' | 'repairLogs'>
  ): RepairTicket => {
    const randomNum = Math.floor(8000 + Math.random() * 1000);
    const ticketNumber = `RPR-${randomNum}`;
    const id = `rpr_${Date.now()}`;
    const nowStr = new Date().toISOString();

    const initialLog = {
      timestamp: nowStr,
      note: `Job ticket created by ${currentUser.name}. Fault: ${ticketData.faultDescription} (Advance Paid: PKR ${ticketData.advancePaid})`,
      performedBy: currentUser.name,
    };

    const newTicket: RepairTicket = {
      ...ticketData,
      id,
      ticketNumber,
      receivedDate: nowStr,
      repairLogs: [initialLog],
    };

    setRepairTickets((prev) => [newTicket, ...prev]);
    setSelectedRepairTicketForModal(newTicket);
    addNotification(`Repair Job Sheet #${ticketNumber} created for ${ticketData.deviceBrand} ${ticketData.deviceModel}`);
    return newTicket;
  };

  const updateRepairStatus = (ticketId: string, newStatus: RepairStatus, note?: string) => {
    const nowStr = new Date().toISOString();
    setRepairTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const updatedLogs = [
          ...t.repairLogs,
          {
            timestamp: nowStr,
            note: note || `Status updated from '${t.status}' to '${newStatus}'`,
            performedBy: currentUser.name,
          },
        ];

        let completedDate = t.completedDate;
        let deliveredDate = t.deliveredDate;

        if (newStatus === 'Ready for Pickup' || newStatus === 'Delivered') {
          completedDate = completedDate || nowStr;
        }

        if (newStatus === 'Delivered') {
          deliveredDate = deliveredDate || nowStr;
        }

        return {
          ...t,
          status: newStatus,
          completedDate,
          deliveredDate,
          repairLogs: updatedLogs,
        };
      })
    );
    addNotification(`Repair Job #${ticketId} status updated to '${newStatus}'`);
  };

  const addRepairLogNote = (ticketId: string, note: string) => {
    const nowStr = new Date().toISOString();
    setRepairTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          repairLogs: [
            ...t.repairLogs,
            {
              timestamp: nowStr,
              note,
              performedBy: currentUser.name,
            },
          ],
        };
      })
    );
    addNotification('Technician repair log appended.');
  };

  // Customer Loans & Installment Scheme Functions
  const addCustomerLoan = (
    loanData: Omit<
      CustomerLoan,
      | 'id'
      | 'loanNumber'
      | 'createdAt'
      | 'installments'
      | 'status'
      | 'totalRepayableAmount'
      | 'monthlyInstallmentAmount'
      | 'loanPrincipalAmount'
    >
  ): CustomerLoan => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const loanNumber = `LN-${randomNum}`;
    const id = `ln_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const principal = Math.max(0, loanData.totalItemPrice - loanData.downPayment);
    const markupAmt = (principal * loanData.markupPercentage) / 100;
    const totalRepayable = principal + markupAmt;
    const monthlyAmt = Math.round(totalRepayable / Math.max(1, loanData.tenureMonths));

    // Generate monthly installment schedule
    const installments = [];
    const startObj = new Date(loanData.startDate || createdAt);

    for (let i = 1; i <= loanData.tenureMonths; i++) {
      const dueObj = new Date(startObj);
      dueObj.setMonth(dueObj.getMonth() + i);

      installments.push({
        installmentNo: i,
        dueDate: dueObj.toISOString().split('T')[0],
        amountDue: monthlyAmt,
        amountPaid: 0,
        status: 'Pending' as const,
      });
    }

    const newLoan: CustomerLoan = {
      ...loanData,
      id,
      loanNumber,
      createdAt,
      loanPrincipalAmount: principal,
      totalRepayableAmount: totalRepayable,
      monthlyInstallmentAmount: monthlyAmt,
      status: 'Active',
      installments,
    };

    setCustomerLoans((prev) => [newLoan, ...prev]);
    setSelectedLoanForModal(newLoan);
    addNotification(`Mobile Loan & Installment account #${loanNumber} created for ${loanData.customerName}!`);
    return newLoan;
  };

  const recordLoanPayment = (loanId: string, installmentNo: number, amountPaid: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const receiptNo = `EMI-${Math.floor(100 + Math.random() * 900)}`;

    setCustomerLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== loanId) return loan;

        const updatedInstallments = loan.installments.map((inst) => {
          if (inst.installmentNo !== installmentNo) return inst;
          const totalPaidSoFar = inst.amountPaid + amountPaid;
          const isFullyPaid = totalPaidSoFar >= inst.amountDue;

          return {
            ...inst,
            amountPaid: totalPaidSoFar,
            paidDate: todayStr,
            status: isFullyPaid ? ('Paid' as const) : ('Partial' as const),
            receiptNo,
          };
        });

        // Check if all installments are fully paid
        const allPaid = updatedInstallments.every((inst) => inst.status === 'Paid');

        return {
          ...loan,
          status: allPaid ? ('Paid Off' as const) : loan.status,
          installments: updatedInstallments,
        };
      })
    );

    addNotification(`EMI Installment #${installmentNo} payment of PKR ${amountPaid.toLocaleString()} logged (Receipt #${receiptNo})`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        hasRole,
        activeTab,
        setActiveTab,
        repairTickets,
        addRepairTicket,
        updateRepairStatus,
        addRepairLogNote,
        selectedRepairTicketForModal,
        setSelectedRepairTicketForModal,
        customerLoans,
        addCustomerLoan,
        recordLoanPayment,
        selectedLoanForModal,
        setSelectedLoanForModal,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        lowStockProducts,
        sales,
        addSale,
        getSaleById,
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartDiscount,
        setCartDiscount,
        selectedCustomer,
        setSelectedCustomer,
        digitalTransactions,
        agentBalances,
        addDigitalTransaction,
        topUpAgentBalance,
        selectedDigitalTrxForModal,
        setSelectedDigitalTrxForModal,
        customers,
        addCustomer,
        updateCustomer,
        settleCustomerBalance,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        selectedInvoiceForModal,
        setSelectedInvoiceForModal,
        notifications,
        addNotification,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
