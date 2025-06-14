import { useState, useEffect } from 'react';

type DataSource<T> = {
  fetch: () => Promise<T>;
  save: (data: T) => Promise<void>;
};

// Hook principal que abstrae el uso de localStorage y una API externa
export function useData<T>(key: string, initialValue: T, dataSource?: DataSource<T>) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (dataSource) {
      return initialValue; // Si se usa API, inicializamos con el valor predeterminado
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Efecto para obtener datos de la API al iniciar
  useEffect(() => {
    if (dataSource) {
      dataSource.fetch().then(
        (data) => setStoredValue(data),
        (error) => console.error(`Error fetching data from API for key "${key}":`, error)
      );
    }
  }, [dataSource, key]);

  // Función para actualizar el valor
  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (dataSource) {
        await dataSource.save(valueToStore);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting value for key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook para configurar tiempo de persistencia
export function useDataPersistence() {
  const [persistenceTime, setPersistenceTime] = useData('dataPersistenceTime', 30); // 30 días por defecto

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('church_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data.timestamp) {
              const daysDiff = (now - data.timestamp) / (1000 * 60 * 60 * 24);
              if (daysDiff > persistenceTime) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            console.error('Error checking data persistence:', error);
          }
        }
      });
    }, 24 * 60 * 60 * 1000); // Verificar cada 24 horas

    return () => clearInterval(interval);
  }, [persistenceTime]);

  return { persistenceTime, setPersistenceTime };
}
