import { useEffect, useState } from "react";

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(40), 100);
    const timer2 = setTimeout(() => setProgress(70), 400);
    const timer3 = setTimeout(() => setProgress(85), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors">
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 h-1 w-full bg-emerald-100 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loader animation */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated logo / spinner */}
        <div className="relative">
          <div className="page-loader-ring" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/logo.jpeg"
              alt="Tripzo"
              className="w-12 h-12 rounded-full object-cover ring-2 shadow-md mix-blend-multiply"
              style={{ background: 'transparent', '--tw-ring-color': '#00BC7D' }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
            Tripzo
          </h2>
          <div className="flex items-center gap-1">
            <span className="page-loader-dot" style={{ animationDelay: "0s" }} />
            <span className="page-loader-dot" style={{ animationDelay: "0.2s" }} />
            <span className="page-loader-dot" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
