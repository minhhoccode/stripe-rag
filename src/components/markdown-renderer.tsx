"use client"

import { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    const thinkRegex = /<think>([\s\S]*?)<\/think>/g
    return content.replace(thinkRegex, (_, thinkContent) => {
      return `\n> ${thinkContent.trim().split("\n").join("\n> ")}\n`
    })
  }, [content])

  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
          p: ({ ...props }) => <p className="my-3" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-6 my-3" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-6 my-3" {...props} />,
          li: ({ ...props }) => <li className="my-1" {...props} />,
          a: ({ ...props }) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                {children}
              </code>
            )
          },
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props} />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
          tbody: ({ ...props }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-800" {...props} />,
          tr: ({ ...props }) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-900" {...props} />,
          th: ({ ...props }) => (
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100" {...props} />
          ),
          td: ({ ...props }) => <td className="px-3 py-2 text-sm" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
