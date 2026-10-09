import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Smartphone, QrCode, X, Share2, PlusSquare, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const standaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isAppleDevice);

    // Listen for Chrome/Android PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    });

    // Generate QR code for mobile scanning
    const currentUrl = window.location.href;
    QRCode.toDataURL(currentUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      setQrCodeUrl(url);
    }).catch(err => {
      console.error('Failed to generate QR code', err);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowGuideModal(true);
    } else {
      setShowQRModal(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isStandalone) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
        <CheckCircle size={14} />
        <span>Mobile App Installed</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/25 transition-all"
          title="Install as native mobile app without cables"
        >
          <Smartphone size={15} />
          <span>Install Mobile App</span>
        </motion.button>

        <button
          onClick={() => setShowQRModal(true)}
          className="p-1.5 rounded-xl bg-brand-text/5 hover:bg-brand-text/10 text-brand-text/70 hover:text-brand-text transition-colors"
          title="Open directly on phone via QR code"
        >
          <QrCode size={16} />
        </button>
      </div>

      {/* QR Code Modal for No-Cable Instant Mobile Launch */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm glass bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-center text-white shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Smartphone size={26} />
              </div>

              <h4 className="text-xl font-black mb-1">Open on Your Phone</h4>
              <p className="text-xs text-slate-400 mb-5">
                Scan with your phone camera to launch & install the app without any cables!
              </p>

              {qrCodeUrl && (
                <div className="bg-white p-3.5 rounded-2xl inline-block shadow-inner mx-auto mb-4 border-2 border-slate-700">
                  <img src={qrCodeUrl} alt="Scan QR Code to open on mobile" className="w-56 h-56 rounded-lg" />
                </div>
              )}

              <div className="space-y-2 mt-2">
                <button
                  onClick={copyLink}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-2 text-slate-200 transition-colors"
                >
                  {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <ExternalLink size={14} />}
                  <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Mobile App Link'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    setShowGuideModal(true);
                  }}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  How to add to Home Screen on iOS / Android?
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* iOS & Android Home Screen Step-by-Step Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm glass bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white shadow-2xl"
            >
              <button
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center">
                  <Download size={22} />
                </div>
                <div>
                  <h4 className="font-black text-lg">Install to Phone</h4>
                  <p className="text-xs text-slate-400">Run as full-screen standalone app</p>
                </div>
              </div>

              <div className="space-y-3.5 my-4 text-xs text-slate-300">
                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <p className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-sm">
                    <span className="text-blue-400">🍎</span> iPhone / iPad (Safari):
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                    <li>Tap the <Share2 className="inline text-blue-400 mx-1" size={14} /> <strong>Share</strong> button in Safari's bottom toolbar</li>
                    <li>Scroll down and tap <PlusSquare className="inline text-emerald-400 mx-1" size={14} /> <strong>Add to Home Screen</strong></li>
                    <li>Tap <strong>Add</strong> in the top-right corner</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <p className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-sm">
                    <span className="text-emerald-400">🤖</span> Android (Chrome / Edge):
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                    <li>Tap the <strong>three dots menu (⋮)</strong> in Chrome</li>
                    <li>Select <strong>Add to Home screen</strong> or <strong>Install app</strong></li>
                    <li>Tap <strong>Install</strong> to add directly without any cables!</li>
                  </ol>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
