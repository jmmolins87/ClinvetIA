# Tooltip

Ayuda contextual breve que aparece al hacer hover o focus.

## Uso básico

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Ayuda</TooltipTrigger>
    <TooltipContent>Texto de apoyo</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Cuándo usarlo

- Aclaraciones cortas
- Iconos de ayuda
- Estados que necesitan contexto breve
