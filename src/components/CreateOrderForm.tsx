import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { baseUrl } from '../lib/base-url';

interface CreateOrderFormProps {
  userId: string;
  onOrderCreated: () => void;
  onCancel: () => void;
}

export default function CreateOrderForm({ userId, onOrderCreated, onCancel }: CreateOrderFormProps) {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [printRequired, setPrintRequired] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          patientName,
          patientId,
          phoneNumber,
          email: email || undefined,
          orderType,
          description,
          printRequired,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al crear la orden');
        setLoading(false);
        return;
      }

      if (data.success) {
        // Limpiar formulario
        setPatientName('');
        setPatientId('');
        setPhoneNumber('');
        setEmail('');
        setOrderType('');
        setDescription('');
        setPrintRequired(false);

        onOrderCreated();
      } else {
        setError('Error al crear la orden');
      }
    } catch (err) {
      console.error('Create order error:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nueva Orden Médica</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información del Paciente */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Información del Paciente</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre Completo *
              </label>
              <Input
                type="text"
                placeholder="Ej: Juan Pérez García"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cédula de Identidad (C.I) *
              </label>
              <Input
                type="text"
                placeholder="Ej: 12345678"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Número de Celular *
              </label>
              <Input
                type="tel"
                placeholder="Ej: 3001234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email (Opcional)
              </label>
              <Input
                type="email"
                placeholder="Ej: paciente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Detalles de la Orden */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Detalles de la Orden</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Orden *
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione el tipo de orden...</option>
                <option value="Tomografía">Tomografía</option>
                <option value="Radiografía">Radiografía</option>
                <option value="Ortodoncia">Ortodoncia</option>
                <option value="Cefalometría">Cefalometría</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción del Procedimiento *
              </label>
              <textarea
                placeholder="Describa el procedimiento requerido..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                ¿Requiere impreso?
              </label>
              <select
                value={printRequired ? "si" : "no"}
                onChange={(e) => setPrintRequired(e.target.value === "si")}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          >
            {loading ? 'Creando Orden...' : '✓ Crear Orden'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
