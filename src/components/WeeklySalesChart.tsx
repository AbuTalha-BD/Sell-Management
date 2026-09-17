import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3 } from 'lucide-react';

export const WeeklySalesChart: React.FC = () => {
  const { sales, currentUser } = useApp();
  const isAdmin = currentUser?.role === 'ADMIN';

  const relevantSales = isAdmin ? sales : sales.filter((s) => s.agentId === currentUser?.id);

  // Compute 7 days of the week (standard Saturday to Friday in Bangladesh)
  const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Current day of the week in Bangladesh time (Asia/Dhaka)
  const now = Date.now();
  const todayWeekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
  }).format(new Date(now));

  const todayDhakaDate = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(now));

  // Initialize real daily amounts
  const dailyAmounts: Record<string, number> = {
    Sat: 0,
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
  };

  // Rolling 7 days window (last 7 x 24 hours)
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  relevantSales.forEach((s) => {
    let dateObj: Date | null = null;
    if (s.timestamp && !isNaN(s.timestamp)) {
      dateObj = new Date(s.timestamp);
    } else if (s.createdAtDate) {
      const parsed = new Date(s.createdAtDate);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }

    const isWithin7Days = dateObj ? dateObj.getTime() >= sevenDaysAgo : s.createdAtDate === todayDhakaDate;
    if (isWithin7Days && dateObj) {
      const day = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        weekday: 'short',
      }).format(dateObj);
      if (dailyAmounts[day] !== undefined) {
        dailyAmounts[day] += s.grandTotal;
      }
    } else if (s.createdAtDate === todayDhakaDate) {
      if (dailyAmounts[todayWeekday] !== undefined) {
        dailyAmounts[todayWeekday] += s.grandTotal;
      }
    }
  });

  const totalWeekly = Object.values(dailyAmounts).reduce((a, b) => a + b, 0);
  const maxAmount = Math.max(...Object.values(dailyAmounts), 100);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Weekly Sales Velocity</h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Rolling 7-day revenue performance comparison</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-600 font-medium">7-Day Total: </span>
          <span className="text-sm sm:text-base font-extrabold text-purple-700">৳{totalWeekly.toLocaleString()}</span>
        </div>
      </div>

      {/* Bar Chart Display */}
      <div className="h-44 sm:h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
        {daysOfWeek.map((day) => {
          const val = dailyAmounts[day] || 0;
          const heightPercent = maxAmount > 0 ? Math.round((val / maxAmount) * 100) : 0;
          const isToday = day === todayWeekday;

          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip / Value indicator */}
              <div
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap transition-all ${
                  isToday && val > 0
                    ? 'opacity-100 bg-purple-700 text-white font-extrabold shadow-sm'
                    : val > 0
                    ? 'opacity-80 group-hover:opacity-100 bg-purple-100 text-purple-800'
                    : 'opacity-0 group-hover:opacity-100 bg-slate-100 text-slate-600'
                }`}
              >
                ৳{val.toLocaleString()}
              </div>

              {/* Bar */}
              <div className="w-full max-w-[42px] bg-purple-50 rounded-xl h-full flex items-end p-1">
                <div
                  style={{ height: `${val > 0 ? Math.max(12, heightPercent) : 4}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isToday
                      ? val > 0
                        ? 'bg-gradient-to-t from-purple-700 to-indigo-600 shadow-md shadow-purple-500/30'
                        : 'bg-purple-200'
                      : val > 0
                      ? 'bg-purple-400 group-hover:bg-purple-500'
                      : 'bg-slate-200'
                  }`}
                />
              </div>

              {/* Day Label */}
              <div className="text-center">
                <span
                  className={`text-[11px] font-bold block ${
                    isToday ? 'text-purple-700 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  {day}
                </span>
                {isToday && <span className="text-[9px] text-purple-600 font-bold block -mt-1">Today</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
