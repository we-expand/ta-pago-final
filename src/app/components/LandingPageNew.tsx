import { motion } from "motion/react";
import { EtherealBackground } from "./ui/EtherealBackground";
import { Logo } from "./Logo";

export default function LandingPageNew({ onLogin, onGetStarted }: { onLogin: () => void, onGetStarted: () => void }) {
  return (
    <main className="relative min-h-screen text-slate-900">
      <EtherealBackground />
      <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center">
        <Logo size="default" />
        <div className="flex gap-4">
          <button onClick={onLogin} className="text-sm font-medium">Entrar</button>
          <button onClick={onGetStarted} className="px-5 py-2 bg-slate-900 text-white rounded-full">Criar Conta</button>
        </div>
      </header>
      <section className="pt-40 text-center">
        <h1 className="text-6xl font-bold mb-6">O fim da inadimplência.</h1>
        <button onClick={onGetStarted} className="px-8 py-4 bg-slate-900 text-white rounded-full">Começar Agora</button>
      </section>
    </main>
  );
}