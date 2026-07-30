import JsonLd from "@/components/JsonLd";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import EquipmentMatrix from "@/components/sections/EquipmentMatrix";
import Faq from "@/components/sections/Faq";
import FeaturedEquipment from "@/components/sections/FeaturedEquipment";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import ProjectsTeaser from "@/components/sections/ProjectsTeaser";
import Testimonials from "@/components/sections/Testimonials";
import Timeline from "@/components/sections/Timeline";
import WhyPeakfront from "@/components/sections/WhyPeakfront";
import { faqs, featuredItems } from "@/lib/content";
import {
  getFaqJsonLd,
  getLocalBusinessJsonLd,
  getProductJsonLd,
  getWebSiteJsonLd,
} from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          getLocalBusinessJsonLd(),
          getWebSiteJsonLd(),
          getFaqJsonLd(faqs),
          ...featuredItems.map(getProductJsonLd),
        ]}
      />
      <div id="top" aria-hidden="true" />
      <Hero />
      <EquipmentMatrix />
      <FeaturedEquipment />
      <WhyPeakfront />
      <Timeline />
      <Industries />
      <ProjectsTeaser />
      <About />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
