import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <Image
            src="/adfelt-logo.png"
            alt="Adfelt Logo"
            width={200}
            height={200}
            priority
            className="animate-pulse"
          />
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 rounded-full bg-gray-400 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
