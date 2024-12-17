const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="z-40">{children}</div>
    </div>
  );
};

export default AuthLayout;
