import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './components/DashboardView';
import { POSView } from './components/POSView';
import { InventoryView } from './components/InventoryView';
import { InvoicesView } from './components/InvoicesView';
import { CustomersView } from './components/CustomersView';
import { InquiriesView } from './components/InquiriesView';
import { ShopGalleryView } from './components/ShopGalleryView';
import { LocationMapView } from './components/LocationMapView';
import { ContactView } from './components/ContactView';
import { DigitalFinancialsView } from './components/DigitalFinancialsView';
import { RepairLabView } from './components/RepairLabView';
import { LoansInstallmentsView } from './components/LoansInstallmentsView';
import { InvoiceModal } from './components/InvoiceModal';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { RepairReceiptModal } from './components/RepairReceiptModal';
import { LoanStatementModal } from './components/LoanStatementModal';
import { AuthModal } from './components/AuthModal';

function MainLayout() {
  const { activeTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'pos':
        return <POSView />;
      case 'financials':
        return <DigitalFinancialsView />;
      case 'repairs':
        return <RepairLabView />;
      case 'loans':
        return <LoansInstallmentsView />;
      case 'inventory':
        return <InventoryView />;
      case 'invoices':
        return <InvoicesView />;
      case 'customers':
        return <CustomersView />;
      case 'inquiries':
        return <InquiriesView />;
      case 'gallery':
        return <ShopGalleryView />;
      case 'map':
        return <LocationMapView />;
      case 'contact':
        return <ContactView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Slide-over Nav & Bottom Nav */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Invoice Receipt Thermal Modal */}
      <InvoiceModal />

      {/* Global Digital Financials Receipt Modal */}
      <DigitalReceiptModal />

      {/* Global Mobile Repair Job Slip Modal */}
      <RepairReceiptModal />

      {/* Global Loan & Installments Statement Modal */}
      <LoanStatementModal />

      {/* Auth Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
