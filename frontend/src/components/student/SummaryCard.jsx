import { motion } from 'framer-motion';
import { Sparkles, FileCheck, CheckCircle } from 'lucide-react';

const icons = { sparkles: Sparkles, files: FileCheck, check: CheckCircle };

export default function SummaryCard({ type, value, label }) {
  const Icon = icons[type];
  const bg = type === 'sparkles' ? 'bg-blue-50 text-blue-600' : type === 'files' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-4">
        <div className={`${bg} rounded-lg p-3`}><Icon size={18} /></div>
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}
