// Re-export all components from lib.tsx (the main component library)
export {
  Button,
  buttonVariants,
  Input,
  Textarea,
  Label,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  badgeVariants,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  Separator,
  Skeleton,
  Spinner,
  Progress,
  Tooltip,
  EmptyState,
  StatCard,
} from './lib';

// Forms (from input.tsx)
export {
  FormLabel,
  FormField,
  Select,
  Checkbox,
  SearchInput,
} from './input';

// Tables (from table.tsx)
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  SortableHeader,
  TablePagination,
  TableEmptyState,
  TableLoadingState,
} from './table';

// Tabs
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './tabs';
