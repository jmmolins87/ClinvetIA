# Sheet

Panel lateral o inferior para flujos que no requieren modal centrado.

## Uso básico

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger>Abrir panel</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Detalle</SheetTitle>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Cuándo usarlo

- Paneles laterales
- Configuración contextual
- Navegación móvil
