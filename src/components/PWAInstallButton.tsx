import React, { useState } from 'react';
import { Download, Share, PlusSquare, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundFx } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    soundFx.playClick();
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        title="تثبيت تطبيق نبراس النحو على هاتفك أو جهازك"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>تثبيت التطبيق</span>
      </button>

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
                  {isIOS ? 'تثبيت التطبيق على الآيفون والآيباد' : 'تثبيت التطبيق على الهاتف'}
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
                <p>لتثبيت «نِبرَاسُ النَّحْوِ» كتطبيق مستقل يعمل دون إنترنت على متصفح Safari:</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <Share className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>١. اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <PlusSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>٢. مرر للأسفل واختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>٣. اضغط على <strong>إضافة (Add)</strong> في الزاوية العلوية وسيظهر التطبيق فوراً على شاشتك.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>يمكنك تثبيت «نِبرَاسُ النَّحْوِ» على هاتفك الأندرويد أو جهازك ليفتح بملء الشاشة ويعمل دون إنترنت:</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>١. افتح التطبيق في متصفح <strong>Chrome</strong> أو <strong>Edge</strong> في نافذة مستقلة.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>٢. اضغط على قائمة المتصفح (<strong>⋮</strong>) أو أيقونة التثبيت في شريط العنوان.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>٣. اختر <strong>تثبيت التطبيق (Install app)</strong> أو <strong>إضافة إلى الشاشة الرئيسية</strong>.</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                setShowGuideModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};
