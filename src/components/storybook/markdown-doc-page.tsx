import * as React from "react"
import { Markdown } from "@storybook/blocks"

export interface MarkdownDocPageProps {
  content: string
}

export function MarkdownDocPage({ content }: MarkdownDocPageProps) {
  return (
    <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6">
      <Markdown>{content}</Markdown>
    </div>
  )
}
