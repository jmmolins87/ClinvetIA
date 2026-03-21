# Avatar

Renderiza avatares individuales o grupos de avatares.

## Uso básico

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="Ana" />
  <AvatarFallback>AM</AvatarFallback>
</Avatar>
```

## Extras

- `AvatarGroup` permite apilar varios avatares
- `AvatarFallback` mantiene coherencia cuando no hay imagen
