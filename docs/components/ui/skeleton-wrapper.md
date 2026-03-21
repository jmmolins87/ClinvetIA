# SkeletonWrapper

Wrapper para estado de carga esquelético alrededor de contenido real.

## Uso básico

```tsx
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper"

<SkeletonWrapper loading={isLoading}>
  <div>Contenido</div>
</SkeletonWrapper>
```

## Cuándo usarlo

- Cargas parciales
- Estados intermedios en tarjetas y botones
