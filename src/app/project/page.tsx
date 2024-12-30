import { Suspense } from "react";
import ProjectPage from "./ProjectPage"; // Import Client Component

export const dynamic = "force-dynamic"; // Dynamically render this page

export default function Page() {
  return (
    <Suspense fallback={<div>Loading project...</div>}>
      <ProjectPage />
    </Suspense>
  );
}