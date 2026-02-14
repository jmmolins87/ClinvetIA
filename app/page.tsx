import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between gap-8 py-16 px-8 bg-white dark:bg-black sm:items-start rounded-xl border border-zinc-200 dark:border-zinc-800">
        <Alert variant="warning" className="w-full">
          <AlertIcon>
            <TriangleAlert className="h-4 w-4" />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>En proceso</AlertTitle>
            <AlertDescription>
              Esta aplicación está en desarrollo. Certaines fonctionnalités peuvent être incomplètes.
            </AlertDescription>
          </AlertContent>
        </Alert>
      </main>
    </div>
  );
}
