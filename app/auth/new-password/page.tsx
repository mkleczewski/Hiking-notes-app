import React, { Suspense } from 'react';

import { NewPasswordForm } from '@/components/auth/new-password-form';

const NewPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
};

export default NewPassword;
