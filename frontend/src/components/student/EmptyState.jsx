import { Sparkles } from 'lucide-react';

export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-50 rounded-full mb-4">
        <Sparkles size={26} className="text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      {action}
    </div>
  );
}
