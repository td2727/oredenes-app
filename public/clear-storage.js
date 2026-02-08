// Script para limpiar el localStorage y forzar la recreación del admin
// Solo se ejecuta una vez después de cambiar la configuración

(function() {
  const CONFIG_VERSION = '2.0'; // Cambia este número cada vez que actualices el admin
  const VERSION_KEY = 'medical_orders_config_version';
  
  const currentVersion = localStorage.getItem(VERSION_KEY);
  
  if (currentVersion !== CONFIG_VERSION) {
    console.log('🔄 Actualizando configuración del administrador...');
    localStorage.removeItem('medical_orders_users');
    localStorage.removeItem('medical_orders_current_user');
    localStorage.removeItem('medical_orders_orders');
    localStorage.setItem(VERSION_KEY, CONFIG_VERSION);
    console.log('✅ Configuración actualizada. Por favor, inicia sesión nuevamente.');
  }
})();
