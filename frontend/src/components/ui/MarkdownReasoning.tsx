import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { memo } from 'react';

interface Props {
  content: string;
  className?: string;
}

export const MarkdownReasoning = memo(function MarkdownReasoning({ content, className }: Props) {
  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-none space-y-1 my-2">{children}</ol>,
          li: ({ children }) => <li className="text-current">{children}</li>,
          // Prevent code blocks from rendering as monospace - just show as regular text
          code: ({ children }) => <span>{children}</span>,
          pre: ({ children }) => <span>{children}</span>,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
});
