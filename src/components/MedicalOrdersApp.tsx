import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CreateOrderForm from './CreateOrderForm';
import OrdersList from './OrdersList';
import AdminManagement from './AdminManagement';
import { Button } from './ui/button';
import { PlusCircle, LogOut, Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export default function MedicalOrdersApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar usuario guardado al inicio
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setShowCreateOrder(false);
    setShowAdminManagement(false);
  };

  const handleOrderCreated = () => {
    setShowCreateOrder(false);
    setRefreshKey(prev => prev + 1);
  };

  // Si no hay usuario, mostrar login o registro
  if (!currentUser) {
    if (showRegister) {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Vista de administración de admins
  if (showAdminManagement && currentUser.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 px-3 py-4 sm:p-4 overflow-x-hidden">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight break-words">
              Administración de Admins
            </h1>

            <Button
              onClick={() => setShowAdminManagement(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Volver
            </Button>
          </div>

          <AdminManagement currentUser={currentUser} />
        </div>
      </div>
    );
  }

  // Vista principal de la aplicación
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-3 py-4 sm:p-4 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full min-w-0">
              <h1 className="!text-[32px] sm:!text-[38px] lg:!text-[44px] font-bold text-gray-800 leading-[1.05] break-words max-w-full">
                Administrador de Órdenes Médicas
              </h1>

              <p className="text-gray-600 mt-2 text-sm sm:text-base break-words">
                Bienvenido, {currentUser.name}{' '}
                {currentUser.role === 'admin' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Admin
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full lg:w-auto lg:flex-row lg:shrink-0">
              {currentUser.role === 'admin' && (
                <Button
                  onClick={() => setShowAdminManagement(true)}
                  variant="outline"
                  className="w-full lg:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Users className="h-4 w-4" />
                  Administrar
                </Button>
              )}

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Botón crear orden */}
        {!showCreateOrder && (
          <div className="mb-6">
            <Button
              onClick={() => setShowCreateOrder(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              size="lg"
            >
              <PlusCircle className="h-5 w-5" />
              Nueva Orden Médica
            </Button>
          </div>
        )}

        {/* Formulario de crear orden */}
        {showCreateOrder && (
          <div className="mb-6">
            <CreateOrderForm
              userId={currentUser.id}
              onOrderCreated={handleOrderCreated}
              onCancel={() => setShowCreateOrder(false)}
            />
          </div>
        )}

        {/* Lista de órdenes */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <OrdersList
            key={refreshKey}
            userId={currentUser.id}
            isAdmin={currentUser.role === 'admin'}
          />
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-600 px-2">
          <p>
            💡{' '}
            {currentUser.role === 'admin'
              ? 'Como administrador puedes ver y gestionar todas las órdenes'
              : 'Solo puedes ver tus propias órdenes'}
          </p>
        </div>
      </div>
    </div>
  );
}
