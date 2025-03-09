declare module 'react-syntax-highlighter' {
  import { FC, ReactNode } from 'react';
  
  interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    children?: ReactNode;
    className?: string;
    PreTag?: string | FC;
    [key: string]: any;
  }

  export const Prism: FC<SyntaxHighlighterProps>;
  export const Light: FC<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const styles: Record<string, any>;
  export const vscDarkPlus: any;
  export default styles;
}
