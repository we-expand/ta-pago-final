import { motion } from "motion/react";
import { ArrowRight, Bot, CreditCard, Blocks, MessageCircle, BarChart3, Fingerprint, Mic } from "lucide-react";
import { EtherealBackground } from "./ui/EtherealBackground";
import { Logo } from "./Logo";

export default function LandingPageNew({ onLogin, onGetStarted }: { onLogin: () => void, onGetStarted: () => void }) {
  return (
    <main className="relative min-h-screen text-slate-900 overflow-x-hidden">
      <EtherealBackground />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <Logo size="default" />
          <nav className="flex items-center gap-6">
            <button onClick={onLogin} className="text-sm font-medium text-slate-600 hover:text-slate-900">Entrar</button>
            <button onClick={onGetStarted} className="px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all">Criar Conta</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-6 text-slate-900"
            >
              O fim da inadimplência.
            </motion.h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
              Algoritmos de Machine Learning que organizam e recuperam capital através de interações humanizadas.
            </p>
            <button 
              onClick={onGetStarted} 
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg hover:bg-slate-800 transition-all shadow-xl"
            >
              Começar Agora
            </button>
        </div>
      </section>

      {/* Seção de Features (Exemplo rápido de integração) */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                <Bot className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">IA Humanizada</h3>
                <p className="text-slate-500">Negociação 24/7 com inteligência emocional.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                <CreditCard className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Pagamentos MB</h3>
                <p className="text-slate-500">Referências geradas automaticamente no chat.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                <Blocks className="w-10 h-10 text-cyan-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Integração ERP</h3>
                <p className="text-slate-500">Conecte com PHC, Sage e Primavera via API.</p>
            </div>
        </div>
      </section>

      <footer className="bg-slate-50 py-20 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>Praça Infante Dom Pedro nº 12, Algés, Lisboa</p>
        <p className="mt-2">© 2026 Tá Pago.PT - Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}