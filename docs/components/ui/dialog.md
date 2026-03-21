# Dialog

Sistema modal para confirmaciones, formularios y flujos bloqueantes.

## Uso básico

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Abrir</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Cuándo usarlo

- Confirmaciones
- Edición rápida
- Flujos de acción importantes
