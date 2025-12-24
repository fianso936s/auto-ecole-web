import React from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  ADMIN_STATS,
  RECENT_LEADS,
  CRM_TASKS,
  CHART_DATA_LESSONS,
  CHART_DATA_CONVERSIONS,
} from "../../data/adminMockData";

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">
          Bienvenue dans votre espace d'administration.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {ADMIN_STATS.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {stat.label}
                </span>
                {stat.status === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-medium ${
                    stat.status === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Lessons Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Leçons par jour</CardTitle>
            <CardDescription>Volume de cours sur la semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA_LESSONS}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversions Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Conversions par semaine</CardTitle>
            <CardDescription>Inscriptions finalisées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA_CONVERSIONS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {CHART_DATA_CONVERSIONS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === CHART_DATA_CONVERSIONS.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* CRM Tasks */}
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tâches du jour</CardTitle>
              <CardDescription>Actions CRM prioritaires</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {CRM_TASKS.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <TrendingUp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Échéance : {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Fait
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full text-blue-600">
              Voir toutes les tâches
            </Button>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Derniers prospects</CardTitle>
              <CardDescription>Flux d'acquisition en temps réel</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Tout voir
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3 font-medium">Nom</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {RECENT_LEADS.map((lead) => (
                    <tr key={lead.id} className="group hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600">
                            {lead.name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {lead.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {lead.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant="secondary"
                          className={
                            lead.status === "NEW"
                              ? "bg-blue-100 text-blue-700"
                              : lead.status === "FOLLOW_UP"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }
                        >
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-gray-500">{lead.date}</td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm">
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

