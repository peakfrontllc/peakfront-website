import JsonLd from "@/components/JsonLd";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import EquipmentMatrix from "@/components/sections/EquipmentMatrix";
import Faq from "@/components/sections/Faq";
import FeaturedEquipment from "@/components/sections/FeaturedEquipment";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import Testimonials from "@/components/sections/Testimonials";
import Timeline from "@/components/sections/Timeline";
import WhyPeakfront from "@/components/sections/WhyPeakfront";
import { faqs } from "@/lib/content";
import {
  getFaqJsonLd,
  getLocalBusinessJsonLd,
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
        ]}
      />
      <div id="top" aria-hidden="true" />
      <Hero />
      <EquipmentMatrix />
      <FeaturedEquipment />
      <WhyPeakfront />
      <Timeline />
      <Industries />
      <About />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
