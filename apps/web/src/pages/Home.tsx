export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 p-12 text-center relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            TurfScore
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate platform for managing your turf and scoring. This is a production-ready monorepo starter using React, Vite, and Express.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95">
            Get Started
          </button>
          <button className="px-8 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all active:scale-95">
            Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
