
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Calculator, 
  History, 
  Users, 
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const MobileNavigation: React.FC = () => {
  const { isAdmin } = useAuth();

  const userNavigation = [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Reporte', href: '/report', icon: FileText },
    { name: 'Calculadora', href: '/calculator', icon: Calculator },
    { name: 'Historial', href: '/history', icon: History },
  ];

  const adminNavigation = [
    { name: 'Admin', href: '/admin', icon: Home },
    { name: 'Reportes', href: '/admin/reports', icon: FileText },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Stats', href: '/admin/statistics', icon: BarChart3 },
  ];

  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <nav className="flex justify-around items-center py-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md transition-colors min-w-0',
                isActive
                  ? 'text-primary'
                  : 'text-gray-600'
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;
