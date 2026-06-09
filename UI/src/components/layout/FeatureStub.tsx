import { Construction } from "lucide-react";
import { PageHeader, type Crumb } from "./PageHeader";
import { EmptyState } from "@/components/data/EmptyState";

interface Props {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  module: string;
}

export function FeatureStub({ title, description, breadcrumbs, module }: Props) {
  return (
    <>
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />
      <EmptyState
        icon={Construction}
        title={`${module} — Phase 3`}
        description="This bounded context is scaffolded. UI, mock data, and server functions land in Phase 3."
      />
    </>
  );
}