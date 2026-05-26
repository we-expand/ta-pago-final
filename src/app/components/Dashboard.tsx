import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getDashboardMetrics } from '../../utils/supabase';
import { Calendar, Filter, Zap, Euro, TrendingUp, Users, Sparkles, ArrowUpRight, TrendingDown, MoreHorizontal, Clock, ArrowRight, Database, Plus, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import TTSStatusWidget from './TTSStatusWidget';

export default function Dashboard({ session }: { session: any }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="p-10 text-center">Carregando Dashboard...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Painel Principal</h1>
      <p>Bem-vindo ao seu painel. O sistema está operacional.</p>
    </motion.div>
  );
}