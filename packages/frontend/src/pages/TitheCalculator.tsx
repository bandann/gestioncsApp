
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, Plus, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TitheCalculation } from '@/types';

const TitheCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [amounts, setAmounts] = useState<number[]>([0]);
  const [calculations, setCalculations] = useState<TitheCalculation[]>([]);
  const [totalTithe, setTotalTithe] = useState(0);

  const calculateTithe = (amount: number): TitheCalculation => {
    const tithe = amount * 0.1; // 10% del monto
    return {
      monto: amount,
      diezmo: tithe,
      porcentaje: 10
    };
  };

  const handleAmountChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newAmounts = [...amounts];
    newAmounts[index] = numValue;
    setAmounts(newAmounts);

    // Recalcular todos los diezmos
    const newCalculations = newAmounts.map(amount => calculateTithe(amount));
    setCalculations(newCalculations);
    
    // Calcular total
    const total = newCalculations.reduce((sum, calc) => sum + calc.diezmo, 0);
    setTotalTithe(total);
  };

  const addAmount = () => {
    setAmounts([...amounts, 0]);
  };

  const removeAmount = (index: number) => {
    if (amounts.length > 1) {
      const newAmounts = amounts.filter((_, i) => i !== index);
      setAmounts(newAmounts);
      
      const newCalculations = newAmounts.map(amount => calculateTithe(amount));
      setCalculations(newCalculations);
      
      const total = newCalculations.reduce((sum, calc) => sum + calc.diezmo, 0);
      setTotalTithe(total);
    }
  };

  const reportTithe = (amount: number) => {
    // Navegar al formulario de reporte con el monto precargado
    navigate('/report', { 
      state: { 
        preloadedTithe: amount,
        tipo: 'Diezmo'
      } 
    });
  };

  const reportTotalTithe = () => {
    navigate('/report', { 
      state: { 
        preloadedTithe: totalTithe,
        tipo: 'Diezmo'
      } 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Calculadora de Diezmos
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Section */}
        <Card>
          <CardHeader>
            <CardTitle>Calcular Diezmo</CardTitle>
            <CardDescription>
              Ingresa tus ingresos para calcular el 10% correspondiente al diezmo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {amounts.map((amount, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor={`amount-${index}`}>
                    Monto {index + 1}
                  </Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount || ''}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                  />
                </div>
                <div className="flex gap-1">
                  {calculations[index] && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reportTithe(calculations[index].diezmo)}
                      className="whitespace-nowrap"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Reportar
                    </Button>
                  )}
                  {amounts.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAmount(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button 
              variant="outline" 
              onClick={addAmount}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Monto
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Cálculos de diezmos basados en tus ingresos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculations.length > 0 && (
              <>
                <div className="space-y-3">
                  {calculations.map((calc, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Monto {index + 1}</p>
                        <p className="font-medium">${calc.monto.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Diezmo (10%)</p>
                        <p className="text-lg font-bold text-green-600">${calc.diezmo.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {amounts.length > 1 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Total General</p>
                        <p className="font-medium">
                          ${amounts.reduce((sum, amount) => sum + amount, 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Diezmo Total</p>
                        <p className="text-2xl font-bold text-primary">${totalTithe.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={reportTotalTithe}
                      className="w-full mt-4"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Reportar Diezmo Total
                    </Button>
                  </div>
                )}
              </>
            )}

            {calculations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ingresa un monto para ver los cálculos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información sobre el Diezmo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Badge variant="secondary" className="mb-2">10%</Badge>
              <p className="text-sm text-muted-foreground">
                El diezmo representa el 10% de tus ingresos
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Badge variant="secondary" className="mb-2">Fidelidad</Badge>
              <p className="text-sm text-muted-foreground">
                Es una expresión de fe y confianza en Dios
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Badge variant="secondary" className="mb-2">Bendición</Badge>
              <p className="text-sm text-muted-foreground">
                Apoya la obra de la iglesia y sus ministerios
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TitheCalculator;
