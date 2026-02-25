import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const Icon = action?.icon;

  return (
    <div className="mb-6 border-b pb-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {action &&
          (action.href ? (
            <Button asChild size="sm" className="shrink-0">
              <Link href={action.href}>
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button size="sm" onClick={action.onClick} className="shrink-0">
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          ))}
      </div>
    </div>
  );
}

export default PageHeader;
