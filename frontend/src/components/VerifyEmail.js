import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [status, setStatus] = useState('Verifying...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(`/api/auth/verify-email?token=${token}`);
        setStatus(response.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="verify-email">
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmail;