import { PageNotFoundState } from "@/components/error/empty-states";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-nexus-950 flex items-center justify-center p-6">
      <PageNotFoundState />
    </div>
  );
}
