import { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (page = 1, searchQuery = '', limit = 20) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }

      const res = await fetch(`http://localhost:4001/api/items?${params}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setItems(data);
        return { items: data, pagination: null };
      } else {
        setItems(data.items || []);
        return data;
      }
    } catch (err) {
      setError(err);
      setItems([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:4001/api/items/${id}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const item = await res.json();
      return item;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{
      items,
      loading,
      error,
      fetchItems,
      fetchItem
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);