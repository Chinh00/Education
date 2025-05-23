import { Card } from '@/app/components/ui/card';

interface StatsCardProps {
    title: string;
    value: string;
    subtitle: string;
    color: 'blue' | 'green' | 'purple' | 'pink';
}

const StatsCard = ({ title, value, subtitle, color }: StatsCardProps) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        pink: 'from-pink-500 to-pink-600',
    };

    return (
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-10`} />
            <div className="relative p-6">
                <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm text-gray-500">{subtitle}</div>
            </div>
        </Card>
    );
};

export default StatsCard;