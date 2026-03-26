import { type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SeoCard } from "@/components/marketing/seo-card"

export interface SeoLinkClusterItem {
  href: string
  title: string
  description: string
  icon?: LucideIcon
}

export interface SeoLinkClusterProps {
  badge?: string
  title: string
  description?: string
  items: readonly SeoLinkClusterItem[]
}

export function SeoLinkCluster({
  badge = "Recursos relacionados",
  title,
  description,
  items,
}: SeoLinkClusterProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 w-full text-center">
            <Badge variant="secondary">{badge}</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="mt-4 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <SeoCard
                key={item.href}
                href={item.href}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
