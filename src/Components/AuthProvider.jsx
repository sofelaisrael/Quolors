import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../services/supabase';
import { login, logout } from '../store/slices/uiSlice';
import { addNotification } from '../store/slices/notificationSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          provider: session.user.app_metadata?.provider || 'email',
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        };
        
        dispatch(login(userData));
        dispatch(addNotification({
          message: `Welcome back, ${userData.name}!`,
          type: 'success'
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            provider: session.user.app_metadata?.provider || 'email',
            avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          };
          
          dispatch(login(userData));
          dispatch(addNotification({
            message: `Successfully signed in with ${userData.provider}!`,
            type: 'success'
          }));
        } else if (event === 'SIGNED_OUT') {
          dispatch(logout());
          dispatch(addNotification({
            message: 'Successfully signed out!',
            type: 'success'
          }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
