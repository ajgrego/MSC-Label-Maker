import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const PrintQueueContext = createContext();

export const usePrintQueue = () => {
  const context = useContext(PrintQueueContext);
  if (!context) {
    throw new Error('usePrintQueue must be used within a PrintQueueProvider');
  }
  return context;
};

export const PrintQueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addToQueue = useCallback((label) => {
    const newLabel = {
      id: nextId,
      ...label,
      addedAt: new Date().toISOString(),
    };
    setQueue((prev) => [...prev, newLabel]);
    setNextId((prev) => prev + 1);
    return newLabel.id;
  }, [nextId]);

  const removeFromQueue = useCallback((id) => {
    setQueue((prev) => prev.filter((label) => label.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const updateQueueItem = useCallback((id, updates) => {
    setQueue((prev) =>
      prev.map((label) => (label.id === id ? { ...label, ...updates } : label))
    );
  }, []);

  const value = useMemo(() => ({
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    updateQueueItem,
  }), [queue, addToQueue, removeFromQueue, clearQueue, updateQueueItem]);

  return (
    <PrintQueueContext.Provider value={value}>
      {children}
    </PrintQueueContext.Provider>
  );
};
