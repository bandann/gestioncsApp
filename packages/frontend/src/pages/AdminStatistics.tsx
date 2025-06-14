import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

const mockReportesPorMes = [
  { mes: 'Enero', cantidad: 120 },
  { mes: 'Febrero', cantidad: 98 },
  { mes: 'Marzo', cantidad: 145 },
  { mes: 'Abril', cantidad: 110 },
  { mes: 'Mayo', cantidad: 130 },
  { mes: 'Junio', cantidad: 105 },
];

const mockTopContribuyentes = [
  { name: 'Juan Pérez', value: 400 },
  { name: 'María García', value: 300 },
  { name: 'Carlos López', value: 300 },
  { name: 'Ana Rodríguez', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminStatistics: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ingresos Totales</CardTitle>
            <CardDescription>Resumen de ingresos por diezmos y ofrendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$54,321</div>
            <div className="text-sm text-muted-foreground">
              <TrendingUp className="inline-block h-4 w-4 mr-1" />
              +12% desde el mes pasado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Miembros Activos</CardTitle>
            <CardDescription>Número de miembros que han contribuido este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <div className="text-sm text-muted-foreground">
              <Users className="inline-block h-4 w-4 mr-1" />
              +5 nuevos miembros este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Último Reporte</CardTitle>
            <CardDescription>Fecha del último reporte financiero</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 de Mayo, 2024</div>
            <div className="text-sm text-muted-foreground">
              <Calendar className="inline-block h-4 w-4 mr-1" />
              Próximo reporte en 30 días
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Promedio por Miembro</CardTitle>
            <CardDescription>Contribución promedio por miembro activo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$221.72</div>
            <div className="text-sm text-muted-foreground">
              <DollarSign className="inline-block h-4 w-4 mr-1" />
              +3% comparado al trimestre anterior
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reportes por Mes</CardTitle>
          <CardDescription>Cantidad de reportes generados por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockReportesPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Contribuyentes</CardTitle>
          <CardDescription>Miembros con mayores contribuciones</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockTopContribuyentes}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {mockTopContribuyentes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatistics;
