import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  cedula: z.string().min(6, 'La cédula debe tener al menos 6 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (user) {
    return <Navigate to={user.isAdmin ? '/admin' : '/dashboard'} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Simular autenticación - en producción esto sería una llamada a la API
      const savedUsers = JSON.parse(localStorage.getItem('churchUsers') || '[]');
      const foundUser = savedUsers.find((u: any) => u.cedula === data.cedula && u.password === data.password);

      if (foundUser) {
        login(foundUser);
        toast({
          title: 'Inicio de sesión exitoso',
          description: `Bienvenido, ${foundUser.nombre}`,
        });
        navigate(foundUser.isAdmin ? '/admin' : '/dashboard');
      } else {
        toast({
          title: 'Error de autenticación',
          description: 'Cédula o contraseña incorrecta',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error durante el inicio de sesión',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-church-50 to-church-100 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img src="/public/logo_iglesia.svg" alt="Logo de la Iglesia" className="mx-auto mb-4 h-120 w-100" />
          {/* <p className="text-gray-600">Sistema de Gestión Administrativa</p> */}
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tu cédula y contraseña para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Ingresa tu cédula"
                  {...register('cedula')}
                  className={errors.cedula ? 'border-destructive' : ''}
                />
                {errors.cedula && (
                  <p className="text-sm text-destructive mt-1">{errors.cedula.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Regístrate aquí
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                <Link to="/admin/login" className="text-primary hover:underline">
                  Acceso Administrador
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
