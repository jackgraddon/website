import { Suspense } from "react";
import Splash from "@/components/splash/splash";
import ProjectPage from "./ProjectPage"; // Import Client Component

export const dynamic = "force-dynamic"; // Dynamically render this page

export default function Page() {
  return (
    <Suspense fallback={<Splash title={"Loading..."} subtitle={"Please hang tight!"}></Splash>}>
      <ProjectPage />
    </Suspense>
  );
}