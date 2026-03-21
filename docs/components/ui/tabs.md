# Tabs

Navegación por pestañas para cambiar de panel sin abandonar contexto.

## Uso básico

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Contenido</TabsContent>
  <TabsContent value="settings">Configuración</TabsContent>
</Tabs>
```

## Cuándo usarlo

- Fichas de cliente
- Paneles con submódulos
- Secciones compactas
