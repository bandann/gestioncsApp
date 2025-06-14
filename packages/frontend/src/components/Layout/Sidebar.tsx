
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Calculator, 
  History, 
  Users, 
  BarChart3, 
  Settings,
  Bell,
  PlusCircle,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  const userNavigation = [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Nuevo Reporte', href: '/report', icon: FileText },
    { name: 'Calculadora Diezmos', href: '/calculator', icon: Calculator },
    { name: 'Historial', href: '/history', icon: History },
  ];

  const adminNavigation = [
    { name: 'Panel Admin', href: '/admin', icon: Home },
    { name: 'Reportes', href: '/admin/reports', icon: FileText },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Estadísticas', href: '/admin/statistics', icon: BarChart3 },
    { name: 'Mensajes', href: '/admin/notifications', icon: Bell },
    { name: 'Campos Personalizados', href: '/admin/custom-fields', icon: PlusCircle },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 pt-16">
      <div className="flex flex-col flex-grow bg-white border-r overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
