import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import API from '../services/authService';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // After OAuth server-side set the httpOnly cookie and redirected here.
    // Call /api/auth/me to get the authenticated user profile and populate client state.
    if (location.pathname.includes('failure')) {
      return; // show failure UI
    }
    API.get('/auth/me')
      .then((resp) => {
        const user = resp.data.user;
        dispatch(setUser({ user }));
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Auth callback validation failed', err);
        // If validation fails, go to failure page (avoid loops)
        if (!location.pathname.includes('failure')) navigate('/auth/failure');
      });
  }, [location, dispatch, navigate]);

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white/10 p-8 rounded">
      {location.pathname.includes('failure') ? (
        <>
          <h3 className="text-lg mb-2">Authentication failed</h3>
          <p>Please try again or contact support.</p>
        </>
      ) : (
        <h3 className="text-lg">Processing authentication...</h3>
      )}
    </div>
  );
};

export default AuthCallback;
