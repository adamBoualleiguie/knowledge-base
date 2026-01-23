'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'
import { TabbedContent, TabPanel } from './TabbedContent'
import { DocImage } from './Image'
import { DocVideo } from './Video'
import { CodeBlock } from './CodeBlock'
import { Callout } from './Callout'
import { ExcalidrawDiagram } from './ExcalidrawDiagram'

const mdxComponents = {
  TabbedContent,
  TabPanel,
  DocImage,
  DocVideo,
  CodeBlock,
  Callout,
  ExcalidrawDiagram,
  pre: (props: any) => {
    // Handle code blocks - MDX wraps code in pre > code
    const child = props.children
    
    // Handle React element (code component)
    if (child && typeof child === 'object' && 'props' in child) {
      const codeProps = child.props || {}
      
      // Extract code content
      let code = ''
      if (typeof codeProps.children === 'string') {
        code = codeProps.children
      } else if (Array.isArray(codeProps.children)) {
        code = codeProps.children
          .map((c: any) => (typeof c === 'string' ? c : c?.props?.children || ''))
          .join('')
      } else if (codeProps.children) {
        code = String(codeProps.children)
      }
      
      // Extract language from className
      const className = codeProps.className || ''
      const languageMatch = className.match(/language-(\w+)/)
      const language = languageMatch ? languageMatch[1] : 'text'
      
      // Extract filename from className if present (format: language:filename)
      const filenameMatch = className.match(/language-\w+:([^\s]+)/)
      const filename = filenameMatch ? filenameMatch[1] : undefined

      if (code || language !== 'text') {
        return (
          <CodeBlock
            code={code.trim()}
            language={language}
            filename={filename}
            showLineNumbers={true}
            highlightLines={[]}
          />
        )
      }
    }
    
    // Fallback for non-code pre elements
    return <pre {...props} />
  },
  code: (props: any) => {
    // Inline code - don't use CodeBlock
    if (props.className && props.className.includes('language-')) {
      // This is part of a code block (handled by pre)
      return <code {...props} />
    }
    // Inline code with enhanced highlighting (SigNoz style)
    return (
      <code className="inline-code-highlight">
        {props.children}
      </code>
    )
  },
  img: (props: any) => {
    // Handle regular img tags by converting them to DocImage
    if (props.src) {
      return (
        <DocImage
          src={props.src}
          alt={props.alt || ''}
          width={props.width ? parseInt(props.width) : undefined}
          height={props.height ? parseInt(props.height) : undefined}
          caption={props.caption || props.title}
        />
      )
    }
    return <img {...props} />
  },
}

export function Mdx({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code)
  return <MDXContent components={mdxComponents} />
}

