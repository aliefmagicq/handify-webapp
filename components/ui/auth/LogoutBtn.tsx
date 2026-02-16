'use client';

import React from 'react';
import { Button } from '../button';
import { signOut } from '@/actions/auth-action';

const LogoutBtn = () => {
  const logOut = () => {
    signOut();
  };

  return <Button onClick={logOut}>LogOut</Button>;
};

export default LogoutBtn;
