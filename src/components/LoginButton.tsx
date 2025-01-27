import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginButton = () => {
  const { user, login, logout } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => login(response),
    onError: () => console.log('Login Failed'),
  });

  if (user) {
    return (
      <button
        onClick={logout}
        className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => googleLogin()}
      className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
    >
      <LogIn className="h-4 w-4" />
      <span>Login with Google</span>
    </button>
  );
};

export default LoginButton;