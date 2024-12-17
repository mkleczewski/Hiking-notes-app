import Navbar from '@/components/shared/navbar/Navbar';

import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="h-screen w-full">
      <Navbar />
      <div className="flex h-full items-center justify-center pt-20">
        <div className="relative flex justify-center font-inter text-black">
          <div className="absolute mt-10 rounded-2xl bg-white/50 px-6 py-2 text-center backdrop-blur-xl">
            <h2 className="text-lg font-bold">Nie znaleziono podanej strony</h2>
            <p>Musisz wybrać inną ścieżkę!</p>
          </div>
          <Image
            src="/assets/images/not-found.jpg"
            alt="404"
            width={900}
            height={600}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
