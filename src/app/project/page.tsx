/**
 * Name: Project Page
 * Description: This displays a project based on the provided project ID. This page is mostly handled in ProjectPage, but just in case that fails to load, this page serves as a fallback.
 * Author: Jack Graddon
 */

import { Suspense } from "react";

// Components
import Splash from "@/components/splash/splash";
import ProjectPage from "./ProjectPage"; // Needs client rendering

export const dynamic = "force-dynamic"; // Dynamically render this page

export default function Page() {
  return (
      <Suspense fallback={<Splash title={"Loading..."} subtitle={"Please hang tight!"}></Splash>}>
        <ProjectPage />
      </Suspense>
  );
}