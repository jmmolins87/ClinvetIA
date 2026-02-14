import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Alert variant="warning" className="w-full">
        <AlertIcon>
          <TriangleAlert className="h-4 w-4" />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>En proceso</AlertTitle>
          <AlertDescription>
            Esta aplicacion esta en desarrollo. Algunas funcionalidades pueden estar incompletas.
          </AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  );
}
