import React, { useState } from 'react';
import { Download, Share, PlusSquare, Smartphone, X, Copy, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundFx } from '../utils/audio';

interface PWAInstallButtonProps {
  variant?: 'icon' | 'button';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'icon'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hide when already running as an installed standalone app
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    soundFx.playClick();
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        soundFx.playFanfare();
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const handleCopyUrl = async () => {
    soundFx.playClick();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={handleClick}
          title="تنزيل وتثبيت التطبيق على الهاتف"
          aria-label="تنزيل وتثبيت التطبيق"
          className="relative p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center"
        >
          <Download className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={handleClick}
          title="تنزيل وتثبيت التطبيق على هاتفك أو جهازك"
          className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>تنزيل التطبيق</span>
        </button>
      )}

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl text-right space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {isIOS ? 'تنزيل التطبيق على الآيفون والآيباد' : 'تنزيل وتثبيت التطبيق'}
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>لتنزيل «نِبرَاسُ النَّحْوِ» على شاشة هاتفك ليعمل دون إنترنت على Safari:</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <Share className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>١. اضغط على أيقونة <strong>المشاركة (Share)</strong> في شريط متصفح Safari.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <PlusSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>٢. اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>٣. اضغط <strong>إضافة (Add)</strong> وسيُثبَّت التطبيق فوراً على هاتفك.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>لتنزيل التطبيق مباشرة بنقرة واحدة عبر المتصفح على هاتفك الأندرويد أو حاسوبك:</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>١. إذا كنت تشاهد التطبيق داخل نافذة معاينة، انسخ الرابط أدناه وافتحه مباشرة في متصفح <strong>Chrome</strong> أو <strong>Edge</strong>.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>٢. اضغط على أيقونة التنزيل في شريط التطبيق أو من قائمة المتصفح (<strong>⋮</strong>) واختر <strong>تثبيت التطبيق</strong>.</span>
                </div>

                <button
                  onClick={handleCopyUrl}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">تم نسخ رابط التطبيق بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ رابط التطبيق لفتحه في متصفح الهاتف</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                setShowGuideModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
