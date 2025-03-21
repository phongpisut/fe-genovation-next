import { AlertDialogProvider } from '@/components/alert/alert-dialog';
import { LoadingProvider } from '@/context/LoadingContext';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';

const Main = dynamic(() => import('@/components/Main'));

export default async function Home() {
  return (
    <div className="grid justify-items-center  min-h-[calc(100vh-30px)] bg-gray-300 p-8">
      <LoadingProvider>
        <AlertDialogProvider>
          <Main />
        </AlertDialogProvider>
      </LoadingProvider>
      <ToastContainer />
    </div>
  );
}
