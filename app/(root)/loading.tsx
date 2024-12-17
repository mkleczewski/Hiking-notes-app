import React from 'react';

const loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="spinner icon-spinner-5" aria-hidden="true" />
    </div>
  );
};

export default loading;
