import { Wind, Droplets, Eye, Gauge, Umbrella, Car, Zap, Bug } from 'lucide-react';
import { DetailedWeather, getLifestyleTips } from '@/lib/weather-utils';

export const DetailGrid = ({ weather }: { weather: DetailedWeather }) => {
  const tips = getLifestyleTips(weather);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-4">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GridItem icon={<Wind size={20}/>} label="Wind" value={`${weather.windSpeed} km/h`} sub={`${weather.windDirection}°`} />
        <GridItem icon={<Droplets size={20}/>} label="Humidity" value={`${weather.humidity}%`} sub="Dew Point 12°" />
        <GridItem icon={<Gauge size={20}/>} label="Pressure" value={`${weather.pressure}`} sub="hPa" />
        <GridItem icon={<Eye size={20}/>} label="Visibility" value={`${weather.visibility} km`} sub={weather.visibility > 9 ? 'Good' : 'Poor'} />
      </div>

      <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-md border border-white/5">
        <h3 className="text-white/60 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap size={14} className="text-yellow-400" /> Lifestyle Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl">
              <div className={`p-2 rounded-full bg-white/10 ${tip.color}`}>
                {tip.icon === 'car' && <Car size={18} />}
                {tip.icon === 'activity' && <Zap size={18} />}
                {tip.icon === 'bug' && <Bug size={18} />}
              </div>
              <div>
                <div className="text-xs text-white/50">{tip.label}</div>
                <div className="text-sm font-medium text-white">{tip.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GridItem = ({ icon, label, value, sub }: any) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="text-white/50 mb-2">{icon}</div>
    <div className="text-xs text-white/70 uppercase tracking-wide">{label}</div>
    <div className="text-xl font-semibold text-white mt-1">{value}</div>
    <div className="text-xs text-white/30 mt-1">{sub}</div>
  </div>
);