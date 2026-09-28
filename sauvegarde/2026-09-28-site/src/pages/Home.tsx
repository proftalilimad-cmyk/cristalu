import Hero from '../components/home/Hero'
import MaterialsSection from '../components/home/MaterialsSection'
import SolutionsHorizontal from '../components/home/SolutionsHorizontal'
import CinematicReveal from '../components/home/CinematicReveal'
import MoroccoSection from '../components/home/MoroccoSection'
import ProjectsPreview from '../components/home/ProjectsPreview'
import BeforeAfter from '../components/home/BeforeAfter'
import QualitySection from '../components/home/QualitySection'
import ProcessTimeline from '../components/home/ProcessTimeline'
import TypographySection from '../components/home/TypographySection'
import CtaSection from '../components/home/CtaSection'

export default function Home() {
  return (
    <>
      <Hero />
      <MaterialsSection />
      <SolutionsHorizontal />
      <CinematicReveal />
      <MoroccoSection />
      <ProjectsPreview />
      <BeforeAfter />
      <QualitySection />
      <ProcessTimeline />
      <TypographySection />
      <CtaSection />
    </>
  )
}
