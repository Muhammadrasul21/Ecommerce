import { Suspense } from "react";
import type { ReactNode } from "react";

export const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

type SuspenseContainerProps = {
  children: ReactNode;
};

export const SuspenseContainer = ({ children }: SuspenseContainerProps) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};