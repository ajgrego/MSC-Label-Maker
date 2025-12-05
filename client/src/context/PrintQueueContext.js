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
    // Validation: Don't allow mixing full page notices with other label types
    const hasNotices = queue.some(item => item.type === 'notice');
    const hasOtherLabels = queue.some(item => item.type !== 'notice');

    // If trying to add a notice but queue has other labels, reject
    if (label.type === 'notice' && hasOtherLabels) {
      return { error: 'Cannot add full page notices to a queue with other label types. Please clear the queue first.' };
    }

    // If trying to add other labels but queue has notices, reject
    if (label.type !== 'notice' && hasNotices) {
      return { error: 'Cannot add other labels when queue contains full page notices. Please clear the queue first.' };
    }

    const newLabel = {
      id: nextId,
      ...label,
      addedAt: new Date().toISOString(),
    };
    setQueue((prev) => [...prev, newLabel]);
    setNextId((prev) => prev + 1);
    return newLabel.id;
  }, [nextId, queue]);

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
