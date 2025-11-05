import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  CheckCircle, 
  Calendar,
  DollarSign, 
  Clock
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { profile, user } = useAuth();
  
  // Nom d'utilisateur (partie avant @ de l'email ou nom du profil)
  const userName = user?.email?.split('@')[0] || profile?.nom || 'Martin';

  // Données factices pour les indicateurs
  const statsData = {
    devisCreésSemaine: 12,
    devisAcceptés: 8,
    tauxConversion: 67,
    interventionsPlanifiées: 6,
    interventionsDemain: 3,
    paiementsEncaissés: 3240,
    tempsGagnéIA: '5h45',
  };

  // Données pour le graphique d'évolution mensuelle (devis / interventions / paiements)
  const evolutionData = [
    { mois: 'Jan', devis: 45, interventions: 32, paiements: 2800 },
    { mois: 'Fév', devis: 52, interventions: 38, paiements: 3100 },
    { mois: 'Mar', devis: 48, interventions: 35, paiements: 2950 },
    { mois: 'Avr', devis: 61, interventions: 42, paiements: 3500 },
    { mois: 'Mai', devis: 55, interventions: 40, paiements: 3200 },
    { mois: 'Juin', devis: 68, interventions: 48, paiements: 3800 },
  ];

  // Données pour le camembert de répartition des interventions
  const interventionsData = [
    { name: 'Urgence', value: 25, color: '#ef4444' },
    { name: 'Entretien', value: 45, color: '#3b82f6' },
    { name: 'Installation', value: 30, color: '#22c55e' },
  ];

  const COLORS = interventionsData.map(item => item.color);

  return (
    <div className="space-y-8">
      {/* En-tête amélioré */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Bienvenue, {userName} 👋</h1>
        <p className="text-gray-400 text-lg">
          Voici un aperçu de votre activité plomberie
        </p>
      </div>

      {/* Indicateurs clés - Alignement et dimensions optimisés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-6">
        {/* Devis créés cette semaine */}
        <Card className="hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-tight flex-1">
                Devis créés cette semaine
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pt-0">
            <div className="text-3xl xl:text-4xl font-bold text-white mb-1.5">{statsData.devisCreésSemaine}</div>
            <p className="text-[11px] text-green-400 font-medium leading-tight">
              +20% vs semaine dernière ↗
            </p>
          </CardContent>
        </Card>

        {/* Devis acceptés */}
        <Card className="hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-tight flex-1">
                Devis acceptés
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pt-0">
            <div className="text-3xl xl:text-4xl font-bold text-white mb-1.5">{statsData.devisAcceptés}</div>
            <p className="text-[11px] text-gray-400 leading-tight">
              Taux de conversion : <span className="text-green-400 font-semibold">{statsData.tauxConversion}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Interventions planifiées */}
        <Card className="hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-tight flex-1">
                Interventions planifiées
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30 flex-shrink-0 mt-0.5">
                <Calendar className="h-4 w-4 text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pt-0">
            <div className="text-3xl xl:text-4xl font-bold text-white mb-1.5">{statsData.interventionsPlanifiées}</div>
            <p className="text-[11px] text-gray-400 leading-tight">
              dont <span className="text-orange-400 font-semibold">{statsData.interventionsDemain}</span> demain
            </p>
          </CardContent>
        </Card>

        {/* Paiements encaissés */}
        <Card className="hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-tight flex-1">
                Paiements encaissés
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0 mt-0.5">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pt-0">
            <div className="text-3xl xl:text-4xl font-bold text-white mb-1.5">{statsData.paiementsEncaissés.toLocaleString('fr-FR')} €</div>
            <p className="text-[11px] text-gray-400 leading-tight">
              ce mois
            </p>
          </CardContent>
        </Card>

        {/* Temps gagné grâce à l'IA */}
        <Card className="hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-tight flex-1">
                Temps gagné grâce à l'IA
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pt-0">
            <div className="text-3xl xl:text-4xl font-bold text-white mb-1.5">{statsData.tempsGagnéIA}</div>
            <p className="text-[11px] text-gray-400 leading-tight">
              automatisations actives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques - Alignement corrigé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'évolution mensuelle */}
        <Card className="hover:scale-[1.01] transition-transform duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-white mb-1">Évolution mensuelle</CardTitle>
            <p className="text-sm text-gray-400">Devis, interventions et paiements sur 6 mois</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="mois" stroke="rgba(148, 163, 184, 0.5)" />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="devis" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Devis"
                />
                <Line 
                  type="monotone" 
                  dataKey="interventions" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Interventions"
                />
                <Line 
                  type="monotone" 
                  dataKey="paiements" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Paiements (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique répartition des interventions */}
        <Card className="hover:scale-[1.01] transition-transform duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-white mb-1">Répartition des interventions</CardTitle>
            <p className="text-sm text-gray-400">Par type d'intervention</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={interventionsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {interventionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
              </div>
    </div>
  );
}
