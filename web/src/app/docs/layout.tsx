import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

const pageTree = source.getPageTree();
const layoutOptions = baseOptions();

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={pageTree} {...layoutOptions}>
      {children}
    </DocsLayout>
  );
}
