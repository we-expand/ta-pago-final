import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getDashboardMetrics } from '../../utils/supabase';
// Nota: Removido import não utilizado 'projectId'
import { 
  Calendar, Filter, Zap, Euro, TrendingUp, Users, Sparkles,
  ArrowUpRight, TrendingDown, MoreHorizontal, Clock, ArrowRight,
  Database, Plus, FileText
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar, TooltipProps
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import TTSStatusWidget from './TTSStatusWidget';

// ----------------------------------------------------------------------
// Interfaces & Tipagem (O cinto de segurança do Dashboard)
// ----------------------------------------------------------------------
interface Session {
  access_token?: string;
  user?: {
    id: string;
    email: string;
  };
}

interface MetricTrend {
  month: string;
  ai: number;
  spontaneous: number;
}

interface ScoreDistribution {
  score: string;
  count: number;
  value: number;
  color: string;
}

interface ChannelRecovery {
  channel: string;
  value: number;
  roi: number;
  fill: string;
}

interface DelayedPayment {
  days: string;
  count: number;
}

interface DashboardMetricsData {
  totalDebt?: number;
  recoveredMonth?: number;
  activeDebtors?: number;
  successRate?: number;
  recoveryTrend?: MetricTrend[];
  scoreDistribution?: ScoreDistribution[];
  recoveryByChannel?: ChannelRecovery[];
  delayedPayments?: DelayedPayment[];
}

export default function Dashboard({ session }: { session: Session | null }) {
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      loadMetrics();
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  async function loadMetrics() {
    try {
      if (!session?.access_token) {
        console.error('[DASHBOARD] Sem access_token disponível');
        return;
      }
      
      const data = await getDashboardMetrics(session.access_token);
      setMetrics(data as DashboardMetricsData);
    } catch (error) {
      console.error('[DASHBOARD] Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  // ----------------------------------------------------------------------
  // Tratamento de Dados (Fallback e Normalização)
  // ----------------------------------------------------------------------
  const stats = metrics ? [
    { 
      label: 'Valor em Atraso', 
      value: `€ ${(metrics.totalDebt || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`, 
      change: '+12%', trend: 'up', icon: Euro, color: 'text-rose-600', bg: 'bg-rose-50'
    },
    { 
      label: 'Recuperado (Este Mês)', 
      value: `€ ${(metrics.recoveredMonth || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`, 
      change: '+23%', trend: 'up', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50'
    },
    { 
      label: 'Devedores Ativos', 
      value: (metrics.activeDebtors || 0).toString(), 
      change: '-5%', trend: 'down', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50'
    },
    { 
      label: 'Taxa de Sucesso', 
      value: `${metrics.successRate || 0}%`, 
      change: '+8%', trend: 'up', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50'
    },
  ] : [];

  const finalRecoveryTrend: MetricTrend[] = metrics?.recoveryTrend?.length ? metrics.recoveryTrend : [
    { month: 'Jan', ai: 12500, spontaneous: 8200 },
    { month: 'Fev', ai: 15800, spontaneous: 9100 },
    { month: 'Mar', ai: 18200, spontaneous: 10500 },
    { month: 'Abr', ai: 22100, spontaneous: 11800 },
    { month: 'Mai', ai: 26400, spontaneous: 13200 },
    { month: 'Jun', ai: 31200, spontaneous: 14500 },
  ];

  const finalScoreDistribution: ScoreDistribution[] = metrics?.scoreDistribution?.length ? metrics.scoreDistribution : [
    { score: 'Alto (80-100)', count: 47, value: 124500, color: '#10b981' },
    { score: 'Médio (50-79)', count: 83, value: 187200, color: '#f59e0b' },
    { score: 'Baixo (0-49)', count: 29, value: 89800, color: '#ef4444' },
  ];

  const finalRecoveryByChannel: ChannelRecovery[] = metrics?.recoveryByChannel?.length ? metrics.recoveryByChannel : [
    { channel: 'WhatsApp', value: 42500, roi: 3.2, fill: '#10b981' },
    { channel: 'SMS', value: 28300, roi: 1.8, fill: '#3b82f6' },
    { channel: 'Email', value: 19800, roi: 2.1, fill: '#8b5cf6' },
    { channel: 'Ligação', value: 15200, roi: 1.4, fill: '#f59e0b' },
  ];

  const criticalClients = metrics?.delayedPayments?.find(d => d.days === '90+')?.count || 0;

  // Custom Chart Components
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}: €{Number(entry.value).toLocaleString('pt-PT')}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <DashboardSkeleton />;

  // Se não houver dados estatísticos processados, exibe o Empty State
  if (!loading && stats.length === 0) return <DashboardEmptyState />;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto"
    >
      {/* 1. Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Painel Principal
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-light">
            Resumo em tempo real do desempenho de recuperação.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-10 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 px-4 focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Calendar className="mr-2 size-4" />
            Este Mês
          </Button>
          <Button variant="outline" className="h-10 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-10 p-0 focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Filter className="size-4" />
          </Button>
          <Button className="h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 px-6 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
            <Zap className="mr-2 size-4" />
            Nova Cobrança
          </Button>
        </div>
      </motion.div>

      {/* 2. KPI Cards - Clean & Minimal */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <article 
            key={idx} 
            className="group bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-16 opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110 duration-500 ${stat.color.replace('text-', 'bg-')}`} />
            
            <div className="flex items-center justify-between mb-4 relative">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
                <stat.icon className="size-5" aria-hidden="true" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="size-3" aria-hidden="true" /> : <TrendingDown className="size-3" aria-hidden="true" />}
              </div>
            </div>
            
            <div className="relative">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight truncate">{stat.value}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
              </div>
            </div>
          </article>
        ))}
      </motion.div>

      {/* 3. Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full border-none shadow-sm bg-white rounded-[32px] overflow-hidden flex flex-col">
            <CardHeader className="pb-0 pt-8 px-8 flex-shrink-0">
              <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Evolução da Recuperação</CardTitle>
                  <CardDescription className="text-slate-500 mt-1">Comparativo: IA Automática vs. Pagamentos Espontâneos</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                  <MoreHorizontal className="size-5 text-slate-400" aria-label="Mais opções" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={finalRecoveryTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpontaneous" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `€${value/1000}k`} dx={-10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ top: -20, right: 0 }} />
                  <Area type="monotone" dataKey="ai" name="IA Automática" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="spontaneous" name="Espontâneo" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpontaneous)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-6">
           <Card className="flex-1 border-none shadow-sm bg-white rounded-[32px] flex flex-col">
            <CardHeader className="pb-2 pt-6 px-6 flex-shrink-0">
              <CardTitle className="text-lg font-bold text-slate-900">Risco da Carteira</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex flex-col items-center justify-center flex-1">
               <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={finalScoreDistribution}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}
                        dataKey="count" cornerRadius={4}
                      >
                        {finalScoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-slate-900">
                      {finalScoreDistribution.reduce((acc, curr) => acc + curr.count, 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Clientes</span>
                  </div>
               </div>

               <div className="w-full space-y-3 mt-4">
                 {finalScoreDistribution.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between text-sm group cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{item.score}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs">{item.count} clientes</span>
                        <span className="font-bold text-slate-700">€{(item.value/1000).toFixed(1)}k</span>
                      </div>
                   </div>
                 ))}
               </div>
            </CardContent>
           </Card>

           {criticalClients > 0 && (
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="bg-amber-50 rounded-[24px] p-5 border border-amber-100 flex items-center justify-between"
             >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-900 text-sm">Atenção Necessária</p>
                    <p className="text-xs text-amber-700/80">{criticalClients} clientes com atraso {'>'} 90 dias</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg h-8 px-3 text-xs font-bold focus-visible:ring-2 focus-visible:ring-amber-500">
                  Ver <ArrowRight className="ml-1 size-3" />
                </Button>
             </motion.div>
           )}
        </motion.div>
      </div>

      {/* 4. Bottom Row: Channels & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <motion.div variants={item}>
           <Card className="h-full border-none shadow-sm bg-white rounded-[32px] overflow-hidden flex flex-col">
             <CardHeader className="px-6 sm:px-8 pt-8 pb-2 flex-shrink-0">
               <CardTitle className="text-lg font-bold text-slate-900">Canais de Maior Retorno</CardTitle>
               <CardDescription>Análise de ROI por meio de comunicação</CardDescription>
             </CardHeader>
             <CardContent className="p-6 sm:p-8 flex-1 flex flex-col">
               <div className="min-h-[220px] w-full flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={finalRecoveryByChannel} barSize={3