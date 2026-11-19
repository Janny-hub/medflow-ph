/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { initMedFlowEngine } from './medflowEngine';
import { usePWAInstall } from './usePWAInstall';

export default function App() {
  const { isInstallable, install } = usePWAInstall();

  useEffect(() => {
    initMedFlowEngine();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Clinical Header Bar — Brand Logo & Name Positioned on the Left */}
      <header id="app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-16 gap-3">
            {/* Brand Identity Positioned on the Left */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => (window as any).switchView && (window as any).switchView('home')}
            >
              <img
                src="/assets/aistudio/Gemini_Generated_Image_jyo0aejyo0aejyo0_8ff5abe4.jpg"
                alt="MedFlow Logo"
                className="h-11 w-11 rounded-xl object-cover border border-slate-200 shadow-2xs bg-white shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="medflow-title text-lg font-extrabold tracking-wide text-slate-900">MedFlow PH</h1>
                </div>
                <p className="text-xs text-teal-700 font-semibold hidden sm:block">Honing the future 5-star physician!</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body Wrapper: Left Vertical Navigation Sidebar + Main Clinical Workspace */}
      <div className="flex-1 flex min-h-0">
        {/* Left Vertical Clinical Workflow Navigation Sidebar */}
        <nav
          id="bottom-nav"
          className="w-60 lg:w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-30 bg-white/95 backdrop-blur-md border-r border-slate-200/90 shadow-xs flex flex-col justify-between p-3 overflow-y-auto no-print"
        >
          {/* Top / Primary Vertical Navigation Links */}
          <div className="space-y-1">
            {/* Global Patient Search Bar & Quick Switcher */}
            <div id="sidebar-global-search-wrapper" className="relative mb-2.5 pb-2.5 border-b border-slate-200/80">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-800/90">
                  Patient Quick Find
                </span>
                <span
                  id="sidebar-total-patients-badge"
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/70"
                  title="Total Patient Records Across All Registries"
                >
                  0 Records
                </span>
              </div>
              <div className="relative">
                <svg
                  className="w-3.5 h-3.5 text-teal-700/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  id="sidebar-global-patient-search"
                  type="text"
                  autoComplete="off"
                  placeholder="Search patient name, ID..."
                  onInput={(e) =>
                    (window as any).handleGlobalPatientSearchInput &&
                    (window as any).handleGlobalPatientSearchInput((e.target as HTMLInputElement).value)
                  }
                  onFocus={() =>
                    (window as any).handleGlobalPatientSearchFocus &&
                    (window as any).handleGlobalPatientSearchFocus()
                  }
                  onKeyDown={(e) =>
                    (window as any).handleGlobalPatientSearchKeyDown &&
                    (window as any).handleGlobalPatientSearchKeyDown(e)
                  }
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition"
                />
                <button
                  id="sidebar-global-search-clear"
                  type="button"
                  onClick={() =>
                    (window as any).clearGlobalPatientSearch && (window as any).clearGlobalPatientSearch()
                  }
                  className="hidden absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 items-center justify-center text-xs font-bold cursor-pointer"
                  title="Clear search"
                >
                  ×
                </button>
              </div>

              {/* Active Patient Status Pill */}
              <div id="sidebar-active-patient-chip" className="mt-1.5"></div>

              {/* Global Patient Search Results List */}
              <div
                id="sidebar-global-search-results"
                className="hidden mt-1.5 bg-white rounded-xl border border-teal-300 shadow-lg max-h-72 overflow-y-auto divide-y divide-slate-100 z-50"
              ></div>
            </div>

            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-teal-800/80">
              Clinical Navigation
            </div>
            <button onClick={() => (window as any).switchView('home')} id="bnav-home" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span>Home</span>
            </button>
            <button onClick={() => (window as any).switchView('registration')} id="bnav-registration" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span>Registration</span>
            </button>
            <button onClick={() => (window as any).switchView('anc')} id="bnav-anc" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span>Antenatal Care</span>
            </button>
            <button onClick={() => (window as any).switchView('bakunxt')} id="bnav-bakunxt" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>BakuNxt</span>
            </button>
            <button onClick={() => (window as any).switchView('optplus')} id="bnav-optplus" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              <span>OPTPlus</span>
            </button>
            <button onClick={() => (window as any).switchView('soap')} id="bnav-soap" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>SOAP</span>
            </button>
            <button onClick={() => (window as any).switchView('rx')} id="bnav-rx" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              <span>Prescription</span>
            </button>
            <button onClick={() => (window as any).switchView('diagnostics')} id="bnav-diagnostics" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              <span>Lab &amp; Imaging</span>
            </button>
            <button onClick={() => (window as any).switchView('records')} id="bnav-records" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
              <span>Patient Records</span>
            </button>
            <button onClick={() => (window as any).switchView('cpg')} id="bnav-cpg" className="w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 cursor-pointer">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span>CPGs</span>
            </button>
          </div>

          {/* Bottom Actions in Left Sidebar: Settings & Sign Out */}
          <div className="pt-3 mt-4 border-t border-slate-200/90 space-y-2">
            {isInstallable && (
              <button
                onClick={install}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition cursor-pointer"
                title="Install MedFlow PH for Offline Clinical Use"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Install Offline App</span>
              </button>
            )}

            <div id="header-account-actions" className="flex flex-col gap-1.5">
              <button
                onClick={() => (window as any).openDoctorSettingsModal && (window as any).openDoctorSettingsModal()}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200/80 text-xs font-bold transition cursor-pointer"
                title="Account & Facility Settings"
                aria-label="Settings"
              >
                <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>
              <button
                id="header-signout-btn"
                onClick={() => (window as any).handleSignOut && (window as any).handleSignOut()}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                title="Sign Out"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Dynamic Workspace */}
        <main id="main-workspace" className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12"></main>
      </div>

      {/* Toast Notification Container */}
      <div id="toast-container" className="fixed bottom-6 right-5 z-50 flex flex-col gap-2 pointer-events-none no-print"></div>

      {/* Modal Container */}
      <div id="modal-overlay" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 hidden items-center justify-center p-4 no-print">
        <div id="modal-content" className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"></div>
      </div>
    </div>
  );
}
