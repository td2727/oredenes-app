import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Trash2, RefreshCw } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface Order {
  id: string;
  user_id: string;
  patient_name: string;
  order_type: string;
  status: 'Pendiente' | 'En Proceso' | 'Completada' | 'Cancelada';
  description: string | null;
  priority: 'Alta' | 'Media' | 'Baja';
  created_at: string;
  updated_at: string;
}

interface OrdersListProps {
  userId: string;
  isAdmin: boolean;
}

export default function OrdersList({ userId, isAdmin }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const url = `${baseUrl}/api/orders?userId=${userId}&isAdmin=${isAdmin}`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al cargar órdenes');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Load orders error:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [userId, isAdmin]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          userId,
          isAdmin,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Error al actualizar el estado');
        setUpdatingOrderId(null);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        // Actualizar la orden en la lista local
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ));
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Error de conexión');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/orders/${orderId}?userId=${userId}&isAdmin=${isAdmin}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Error al eliminar la orden');
        return;
      }

      // Eliminar la orden de la lista local
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error('Delete order error:', err);
      alert('Error de conexión');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'En Proceso': 'bg-blue-100 text-blue-800 border-blue-300',
      'Completada': 'bg-green-100 text-green-800 border-green-300',
      'Cancelada': 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getPriorityEmoji = (priority: string) => {
    const emojis: Record<string, string> = {
      'Alta': '🔴',
      'Media': '🟡',
      'Baja': '🟢',
    };
    return emojis[priority] || '⚪';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
        <Button onClick={loadOrders} className="mt-2" size="sm">
          Reintentar
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600 mb-2">No hay órdenes todavía</p>
        <p className="text-sm text-gray-500">Crea tu primera orden para comenzar</p>
      </div>
    );
  }

  // Filtrar órdenes según el estado seleccionado
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Contador de órdenes por estado
  const orderCounts = {
    all: orders.length,
    Pendiente: orders.filter(o => o.status === 'Pendiente').length,
    'En Proceso': orders.filter(o => o.status === 'En Proceso').length,
    Completada: orders.filter(o => o.status === 'Completada').length,
    Cancelada: orders.filter(o => o.status === 'Cancelada').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {isAdmin ? 'Todas las Órdenes' : 'Mis Órdenes'}
        </h3>
        <Button onClick={loadOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filtros por Estado */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          📋 Todas ({orderCounts.all})
        </button>
        <button
          onClick={() => setFilterStatus('Pendiente')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filterStatus === 'Pendiente'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          ⏳ Pendientes ({orderCounts.Pendiente})
        </button>
        <button
          onClick={() => setFilterStatus('En Proceso')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filterStatus === 'En Proceso'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          🔄 En Proceso ({orderCounts['En Proceso']})
        </button>
        <button
          onClick={() => setFilterStatus('Completada')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filterStatus === 'Completada'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          ✅ Completadas ({orderCounts.Completada})
        </button>
        <button
          onClick={() => setFilterStatus('Cancelada')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filterStatus === 'Cancelada'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          ❌ Canceladas ({orderCounts.Cancelada})
        </button>
      </div>

      {/* Mensaje si no hay órdenes con el filtro actual */}
      {filteredOrders.length === 0 && filterStatus !== 'all' && (
        <div className="text-center p-6 bg-gray-50 rounded-lg border">
          <p className="text-gray-600">No hay órdenes con estado: <strong>{filterStatus}</strong></p>
        </div>
      )}

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getPriorityEmoji(order.priority)}
                    {order.patient_name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{order.order_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  {isAdmin && (
                    <Button
                      onClick={() => handleDeleteOrder(order.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.description && (
                <p className="text-sm text-gray-600">{order.description}</p>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Estado:</span>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                  disabled={updatingOrderId === order.id || (!isAdmin && order.user_id !== userId)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
                Creada: {formatDate(order.created_at)}
                {order.updated_at !== order.created_at && (
                  <> • Actualizada: {formatDate(order.updated_at)}</>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

