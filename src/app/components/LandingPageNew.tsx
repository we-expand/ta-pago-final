import { ProductInteractiveDemoLarge } from "./landing/ProductInteractiveDemoLarge";
import { ComparisonSection } from "./landing/ComparisonSection";
import { RiskFreeGuarantee } from "./landing/RiskFreeGuarantee";
import { motion, AnimatePresence } from "motion/react";
import { useState, ReactNode } from "react";
import { 
  ArrowRight, CheckCircle2, Blocks, CreditCard, Bot, 
  BarChart3, MessageCircle, Sparkles, Fingerprint, Mic
} from "lucide-react";
import { EtherealBackground } from "./ui/EtherealBackground";
import { Logo } from "./Logo";
import CallRecordingWidget from "./CallRecordingWidget";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "./ui/dialog";

// Tipagem estrita adicionada para segurança do código
interface FeatureDetails {
  title: string;
  content: string;
}

interface Feature {
  id: string;
  title: string;
  desc: string;
  icon: ReactNode;
  color: string;
  bg: string;
  illustration: ReactNode;
  hasDetails?: boolean;
  details?: FeatureDetails;
}

export default function LandingPageNew({ onLogin, onGetStarted }: { onLogin: () => void, onGetStarted: () => void }) {
  
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const features: Feature[] = [
    {
      id: "ai",
      title: "Agentes de IA Humanizados",
      desc: "Negociação empática e eficiente disponível 24/7 em todos os canais digitais.",
      icon: <Bot className="w-6 h-6" />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      illustration: (
        <div className="flex flex-col gap-4 max-w-[300px] w-full" aria-hidden="true">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="self-start bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl rounded-tl-none text-white text-sm"
          >
            Olá! Notei que a fatura #4092 vence amanhã.
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="self-end bg-indigo-500 text-white p-4 rounded-2xl rounded-tr-none text-sm shadow-lg"
          >
            Pode gerar uma referência MB?
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="self-start bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl rounded-tl-none text-white text-xs flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Gerando referência...
          </motion.div>
        </div>
      )
    },
    {
      id: "payments",
      title: "Pagamentos Nacionais",
      desc: "Referências Multibanco e MB WAY geradas nativamente durante o chat.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      illustration: (
        <div className="relative" aria-hidden="true">
          <motion.div 
             animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
             className="w-64 h-40 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-2xl flex flex-col p-6 text-white justify-between z-10 relative"
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg opacity-80">MB WAY</span>
              <CreditCard className="w-8 h-8 opacity-50" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-32 bg-white/20 rounded-full"></div>
              <div className="h-2 w-20 bg-white/20 rounded-full"></div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 20, opacity: 1 }} transition={{ delay: 0.2 }}
            className="absolute -bottom-8 -right-4 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-slate-500">Pagamento Confirmado</div>
              <div className="font-bold">€ 1.250,00</div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: "integration",
      title: "Integração Universal",
      desc: "Conectores prontos para PHC, Primavera, Sage e qualquer ERP via API.",
      icon: <Blocks className="w-6 h-6" />,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      illustration: (
        <div className="grid grid-cols-2 gap-4" aria-hidden="true">
          {["PHC", "SAGE", "SAP", "API"].map((erp, i) => (
            <motion.div
              key={erp}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
            >
              {erp}
            </motion.div>
          ))}
          <motion.div 
             animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-cyan-400/30 rounded-full pointer-events-none"
          />
        </div>
      )
    },
    {
      id: "omni",
      title: "Omnicanalidade Real",
      desc: "Orquestração inteligente entre WhatsApp, SMS, Email e Voz.",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      illustration: (
        <div className="relative w-full max-w-xs flex justify-center" aria-hidden="true">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl z-10 relative">
             <Bot className="w-8 h-8 text-indigo-600" />
           </div>
           {[0, 72, 144, 216, 288].map((deg, i) => (
             <motion.div
               key={i}
               className="absolute top-0 left-1/2 w-10 h-10 -ml-5 origin-[50%_400%]" 
               animate={{ rotate: [deg, deg + 360] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             >
               <div 
                 className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg"
                 style={{ transform: `rotate(-${deg}deg)` }} 
               >
                 <MessageCircle className="w-5 h-5" />
               </div>
             </motion.div>
           ))}
        </div>
      )
    },
    {
      id: "risk",
      title: "Scoring de Risco",
      desc: "Análise preditiva que identifica potenciais inadimplentes antes da venda.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      illustration: (
        <div className="w-full max-w-xs" aria-hidden="true">
          <div className="flex items-end gap-2 h-40 mb-4 justify-center">
             <motion.div initial={{ height: 0 }} animate={{ height: "40%" }} className="w-12 bg-emerald-500/30 rounded-t-lg" />
             <motion.div initial={{ height: 0 }} animate={{ height: "60%" }} className="w-12 bg-emerald-500/60 rounded-t-lg" />
             <motion.div initial={{ height: 0 }} animate={{ height: "80%" }} className="w-12 bg-emerald-500 rounded-t-lg" />
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
            <span className="text-white text-sm">Score de Crédito</span>
            <span className="text-emerald-400 font-bold text-xl">94/100</span>
          </div>
        </div>
      )
    },
    {
      id: "behavior",
      title: "Perfil Comportamental",
      desc: "Enriquecimento automático de dados com histórico financeiro pregresso.",
      icon: <Fingerprint className="w-6 h-6" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      hasDetails: true,
      illustration: (
        <div className="relative flex items-center justify-center" aria-hidden="true">
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
             className="w-32 h-32 border-2 border-rose-500/50 rounded-full flex items-center justify-center"
           >
              <Fingerprint className="w-16 h-16 text-rose-500" />
           </motion.div>
           <motion.div 
             animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute left-0 right-0 h-1 bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.8)] opacity-80"
           />
           <div className="absolute -bottom-12 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-rose-500/30 text-rose-300 text-xs font-mono">
             MATCH FOUND: 98%
           </div>
        </div>
      ),
      details: {
        title: "Como funciona o Perfil Comportamental?",
        content: "Ao digitar o NIF, nosso sistema consulta automaticamente bases de dados públicas (bancos, tribunais) e privadas em tempo real. Identificamos padrões de comportamento dos últimos 5 anos, como atrasos recorrentes ou preferências de pagamento, criando um perfil único que permite à IA prever a melhor abordagem de cobrança com 94% de precisão."
      }
    },
    {
      id: "voip",
      title: "Gravação VoIP Auditável",
      desc: "Integração nativa com Twilio e Aircall. Grava, transcreve e anexa chamadas à ficha do devedor automaticamente.",
      icon: <Mic className="w-6 h-6" />,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      illustration: (
        <div className="w-full flex justify-center scale-90 sm:scale-100" aria-hidden="true">
          <CallRecordingWidget />
        </div>
      ),
      hasDetails: true,
      details: {
        title: "Compliance e Auditoria Automática",
        content: "Conecte sua central telefônica (Twilio, Aircall, Ringover) e transforme cada interação em dados. O sistema grava a chamada, gera uma transcrição via IA para análise de sentimentos e anexa o arquivo legalmente válido ao histórico do devedor, garantindo compliance e material para treinamento."
      }
    }
  ];

  const pricing = [
    {
      name: "Indie",
      price: "0",
      period: "/mês",
      desc: "Ideal para freelancers e validação de MVP.",
      features: ["Até 10 devedores ativos", "Cobrança via Email (Manual)", "Dashboard Básico", "Taxa de 1.9% por sucesso"],
      cta: "Começar Grátis",
      highlight: false
    },
    {
      name: "Essential",
      price: "24",
      period: "/mês",
      desc: "Automação essencial para pequenas empresas.",
      features: ["Até 100 devedores", "Emails Automáticos (Régua)", "Integração WhatsApp (Link)", "Relatórios PDF", "Taxa de 1.5% por sucesso"],
      cta: "Escolher Essential",
      highlight: false
    },
    {
      name: "Growth",
      price: "59",
      period: "/mês",
      desc: "IA e multicanal para escalar recuperação.",
      features: ["Devedores ilimitados", "WhatsApp Automático (API)", "IA de Negociação (Chat)", "SMS Gateway Incluído", "API de Integração"],
      cta: "Escolher Growth",
      highlight: true
    },
    {
      name: "Corporate",
      price: "149",
      period: "/mês",
      desc: "Alta performance e gestão de equipas.",
      features: ["Tudo do Growth", "Múltiplos Usuários", "Whitelabel (Sua Marca)", "Gestor de Conta Dedicado", "SLA Premium"],
      cta: "Falar com Vendas",
      highlight: false
    }
  ];

  return (
    <main className="relative min-h-screen text-slate-900 overflow-x-hidden selection:bg-indigo-100">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="fixed inset-0 z-[100] bg-white pointer-events-none"
      />

      <EtherealBackground />

      <header className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <div className="scale-110 origin-left">
            <Logo size="default" />
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={onLogin} 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              Criar Conta
            </button>
          </nav>
        </div>
      </header>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 z-10 flex flex-col items-start text-left lg:pl-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              IA Preditiva & Machine Learning
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              O fim da <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                inadimplência.
              </span>
            </h1>
            <p className="text-xl text-slate-500 mb-8 max-w-lg leading-relaxed">
              Algoritmos de Machine Learning que organizam e recuperam capital através de interações humanizadas.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto group px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-medium text-lg hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200">
                Ver Demonstração
              </button>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="lg:w-1/2 relative w-full flex justify-center items-center"
          >
            <ProductInteractiveDemoLarge />
          </motion.div>
        </div>
      </section>

      <section className="pt-32 pb-12 relative overflow-hidden bg-white/30 backdrop-blur-sm">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-