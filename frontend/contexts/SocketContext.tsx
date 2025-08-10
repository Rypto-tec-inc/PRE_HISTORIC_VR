import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SocketContextType {
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [eventHandlers] = useState<Map<string, (data: any) => void>>(new Map());

  const connect = () => {
    if (connected || connecting) return;
    
    setConnecting(true);
    console.log('🔌 Socket: Attempting to connect...');
    
    // Simulate connection (in a real app, you'd connect to Socket.IO)
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
      console.log('✅ Socket: Connected successfully');
    }, 1000);
  };

  const disconnect = () => {
    if (!connected) return;
    
    setConnected(false);
    setConnecting(false);
    eventHandlers.clear();
    console.log('🔌 Socket: Disconnected');
  };

  const emit = (event: string, data?: any) => {
    if (!connected) {
      console.warn('⚠️ Socket: Cannot emit, not connected');
      return;
    }
    
    console.log('📤 Socket: Emitting event:', event, data);
    // In a real app, you'd emit to the socket server
  };

  const on = (event: string, callback: (data: any) => void) => {
    eventHandlers.set(event, callback);
    console.log('👂 Socket: Listening for event:', event);
  };

  const off = (event: string) => {
    eventHandlers.delete(event);
    console.log('🚫 Socket: Stopped listening for event:', event);
  };

  useEffect(() => {
    // Auto-connect when provider mounts
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    connected,
    connecting,
    connect,
    disconnect,
    emit,
    on,
    off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext; 