import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSession } from '../store/slices/authSlice';
import { getCurrentSession, onAuthStateChange } from '../utils/supabase';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      try {
        const session = await getCurrentSession();
        dispatch(setSession(session));
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      dispatch(setSession(session));
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
