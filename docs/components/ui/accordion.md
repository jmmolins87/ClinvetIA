# Accordion

Agrupa contenido expandible en bloques colapsables.

## Uso básico

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="faq-1">
    <AccordionTrigger>Pregunta</AccordionTrigger>
    <AccordionContent>Respuesta</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Cuándo usarlo

- FAQs
- Ajustes avanzados
- Secciones secundarias que no deben ocupar todo el espacio
