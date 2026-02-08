import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, ShieldOff, Trash2, RefreshCw, UserPlus } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at?: string;
}

interface AdminManagementProps {
  currentUser: User;
}

export default function AdminManagement({ currentUser }: AdminManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  
  // Nuevo estado para el formulario de agregar admin
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [addAdminError, setAddAdminError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseUrl}/api/admin/users`, {
        headers: {
          'Authorization': currentUser.id,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al cargar usuarios');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Load users error:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'otorgar' : 'revocar';

    if (!confirm(`¿Estás seguro de ${action} permisos de administrador?`)) {
      return;
    }

    setProcessingUserId(userId);

    try {
      const response = await fetch(`${baseUrl}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.id,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Error al cambiar el rol');
        setProcessingUserId(null);
        return;
      }

      // Actualizar el usuario en la lista local
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole as any } : user
      ));
    } catch (err) {
      console.error('Toggle admin error:', err);
      alert('Error de conexión');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setProcessingUserId(userId);

    try {
      const response = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': currentUser.id,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Error al eliminar usuario');
        setProcessingUserId(null);
        return;
      }

      // Eliminar el usuario de la lista local
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Error de conexión');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminError('');
    setAddingAdmin(true);

    // Validaciones
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      setAddAdminError('Todos los campos son requeridos');
      setAddingAdmin(false);
      return;
    }

    if (newAdminPassword.length < 6) {
      setAddAdminError('La contraseña debe tener al menos 6 caracteres');
      setAddingAdmin(false);
      return;
    }

    try {
      // Primero registrar el usuario
      const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newAdminEmail,
          password: newAdminPassword,
          name: newAdminName,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setAddAdminError(registerData.error || 'Error al crear usuario');
        setAddingAdmin(false);
        return;
      }

      // Ahora cambiar el rol a admin
      const userId = registerData.user.id;
      const roleResponse = await fetch(`${baseUrl}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.id,
        },
        body: JSON.stringify({ role: 'admin' }),
      });

      if (!roleResponse.ok) {
        setAddAdminError('Usuario creado pero no se pudo hacer admin');
        setAddingAdmin(false);
        return;
      }

      // Limpiar el formulario
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');
      
      // Recargar la lista de usuarios
      await loadUsers();
      
      alert(`✅ Administrador "${newAdminName}" agregado exitosamente`);
    } catch (err) {
      console.error('Add admin error:', err);
      setAddAdminError('Error de conexión');
    } finally {
      setAddingAdmin(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 border border-red-200">
        <p className="text-sm text-red-600">{error}</p>
        <Button onClick={loadUsers} className="mt-2" size="sm">
          Reintentar
        </Button>
      </div>
    );
  }

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Usuarios</CardDescription>
            <CardTitle className="text-3xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Administradores</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{adminCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Usuarios Normales</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{userCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Formulario para agregar nuevo administrador */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">Agregar Nuevo Administrador</CardTitle>
          </div>
          <CardDescription>
            Crea directamente un usuario con permisos de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nombre Completo</Label>
                <Input
                  id="admin-name"
                  type="text"
                  placeholder="Ej: Dr. Juan Pérez"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  disabled={addingAdmin}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@ejemplo.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  disabled={addingAdmin}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Contraseña</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                disabled={addingAdmin}
                required
                minLength={6}
              />
              <p className="text-xs text-gray-600">
                El nuevo administrador deberá cambiar su contraseña después del primer login
              </p>
            </div>

            {addAdminError && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{addAdminError}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={addingAdmin}
            >
              {addingAdmin ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Agregar Administrador
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todos los Usuarios</CardTitle>
              <CardDescription>Gestiona roles y permisos</CardDescription>
            </div>
            <Button onClick={loadUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{user.name}</h4>
                    {user.id === currentUser.id && (
                      <Badge variant="outline" className="text-xs">Tú</Badge>
                    )}
                    {user.role === 'admin' && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Registrado: {formatDate(user.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleToggleAdmin(user.id, user.role)}
                    variant={user.role === 'admin' ? 'destructive' : 'default'}
                    size="sm"
                    disabled={processingUserId === user.id || user.id === currentUser.id}
                  >
                    {user.role === 'admin' ? (
                      <>
                        <ShieldOff className="h-4 w-4 mr-1" />
                        Quitar Admin
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-1" />
                        Hacer Admin
                      </>
                    )}
                  </Button>

                  {user.id !== currentUser.id && (
                    <Button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={processingUserId === user.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Nota:</strong> Los administradores pueden ver y gestionar todas las órdenes,
          mientras que los usuarios normales solo pueden ver sus propias órdenes.
        </p>
      </div>
    </div>
  );
}

