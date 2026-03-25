import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  DollarSign, Users, UserPlus, TrendingUp, Calendar, Target,
} from "lucide-react";
import { useCrmData } from "../../contexts/CrmDataContext";

const COLORS = ["#B87878", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}> = ({ icon: Icon, label, value, sub, color }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
      </div>
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { getStats, getMonthlyRevenue, prospects, clients } = useCrmData();
  const stats = getStats();
  const monthlyData = getMonthlyRevenue();

  // Pipeline data for pie chart
  const pipelineData = [
    { name: "Nouveau", value: prospects.filter((p) => p.status === "nouveau").length },
    { name: "Contacté", value: prospects.filter((p) => p.status === "contacte").length },
    { name: "RDV pris", value: prospects.filter((p) => p.status === "rdv_pris").length },
    { name: "Converti", value: prospects.filter((p) => p.status === "converti").length },
    { name: "Perdu", value: prospects.filter((p) => p.status === "perdu").length },
  ].filter((d) => d.value > 0);

  // Top services
  const serviceCount: Record<string, number> = {};
  clients.forEach((c) =>
    c.appointments.forEach((a) => {
      if (a.status === "termine") serviceCount[a.service] = (serviceCount[a.service] || 0) + 1;
    })
  );
  const topServices = Object.entries(serviceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Recent clients
  const recentClients = [...clients]
    .sort((a, b) => (b.lastVisit || "").localeCompare(a.lastVisit || ""))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Vue d'ensemble de votre activité bayaNail</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard icon={DollarSign} label="Chiffre d'affaires" value={`${stats.totalRevenue}€`} sub="Total cumulé" color="bg-emerald-500" />
        <StatCard icon={Users} label="Clients" value={stats.totalClients} sub="Clients actifs" color="bg-blue-500" />
        <StatCard icon={UserPlus} label="Prospects" value={stats.totalProspects} sub="En attente" color="bg-purple-500" />
        <StatCard icon={Target} label="Taux conversion" value={`${stats.conversionRate}%`} sub="Prospects → Clients" color="bg-amber-500" />
        <StatCard icon={TrendingUp} label="Panier moyen" value={`${stats.avgSpend}€`} sub="Par client" color="bg-rose-dark" />
        <StatCard icon={Calendar} label="RDV ce mois" value={stats.appointmentsThisMonth} sub="Mars 2026" color="bg-cyan-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Chiffre d'affaires mensuel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value}€`, "Revenu"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="revenue" fill="#B87878" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Pie */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Pipeline Prospects</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pipelineData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Clients par mois */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Clients actifs par mois</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clients" stroke="#8b5cf6" strokeWidth={2} name="Clients" dot={{ fill: "#8b5cf6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services + Recent clients */}
        <div className="space-y-6">
          {/* Top services */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Services les plus demandés</h3>
            <div className="space-y-3">
              {topServices.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: COLORS[i] }}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{s.name}</span>
                  <span className="text-sm font-bold text-gray-900">{s.count} RDV</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent clients */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Derniers clients vus</h3>
            <div className="space-y-3">
              {recentClients.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-light text-xs font-bold text-rose-dark">
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-gray-400">{c.preferredService}</p>
                  </div>
                  <span className="text-xs text-gray-400">{c.lastVisit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
