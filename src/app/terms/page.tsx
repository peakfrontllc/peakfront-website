import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { CONTACT } from "@/lib/constants";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using the Peakfront Equipment Rental LLC website and submitting rental enquiries.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="28 July 2026">
      <section>
        <h2 className="text-lg font-bold text-navy">1. Agreement</h2>
        <p className="mt-3">
          By accessing or using peakfront.ae (the &ldquo;Website&rdquo;), you
          agree to these Terms of Service. If you do not agree, please do not
          use the Website. These terms apply to visitors and users submitting
          enquiries through the Website.
        </p>
        <p className="mt-3">
          {siteConfig.name} is based in Abu Dhabi, United Arab Emirates. For
          questions about these terms, contact{" "}
          <a href={CONTACT.emailHref} className="text-blue hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">2. Website use</h2>
        <p className="mt-3">You agree to use the Website only for lawful purposes. You must not:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Submit false, misleading or fraudulent information</li>
          <li>Attempt to disrupt, damage or gain unauthorised access to the Website</li>
          <li>Use automated tools to scrape or overload the Website without permission</li>
          <li>Infringe the rights of Peakfront or any third party</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">3. Quotes and enquiries</h2>
        <p className="mt-3">
          Information on the Website — including equipment listings, indicative
          rates and availability — is provided for general information only. A
          quote request submitted through the Website does not create a binding
          rental contract.
        </p>
        <p className="mt-3">
          All rentals are subject to written confirmation, signed agreement,
          equipment availability, site assessment where applicable, and Peakfront&apos;s
          standard rental terms and conditions.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">4. Equipment rental</h2>
        <p className="mt-3">
          Actual rental arrangements — including pricing, mobilisation, operator
          provision, insurance, fuel, maintenance responsibilities and payment
          terms — are governed by the separate rental agreement issued by
          Peakfront for each hire, not by this Website alone.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">5. Intellectual property</h2>
        <p className="mt-3">
          All content on the Website, including text, logos, images and layout,
          is owned by or licensed to Peakfront unless otherwise stated. You may
          not copy, reproduce or distribute Website content without our prior
          written consent, except for personal, non-commercial reference.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">6. Third-party links</h2>
        <p className="mt-3">
          The Website may contain links to third-party services such as WhatsApp,
          maps or social media platforms. We are not responsible for the content
          or practices of those external sites.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">7. Disclaimer</h2>
        <p className="mt-3">
          The Website is provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. To the fullest extent permitted by applicable
          law, Peakfront disclaims warranties that the Website will be
          uninterrupted, error-free or free of harmful components.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">8. Limitation of liability</h2>
        <p className="mt-3">
          To the fullest extent permitted by applicable law, Peakfront shall not
          be liable for any indirect, incidental or consequential loss arising
          from your use of the Website or reliance on information published on
          it. Nothing in these terms limits liability that cannot be excluded
          under UAE law.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">9. Privacy</h2>
        <p className="mt-3">
          Our collection and use of personal information is described in our{" "}
          <a href="/privacy" className="text-blue hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">10. Changes</h2>
        <p className="mt-3">
          We may update these Terms of Service at any time. The &ldquo;Last
          updated&rdquo; date at the top of this page indicates when they were
          last revised. Your continued use of the Website after changes are
          posted constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">11. Governing law</h2>
        <p className="mt-3">
          These terms are governed by the laws of the United Arab Emirates. Any
          dispute arising in connection with the Website shall be subject to the
          exclusive jurisdiction of the courts of Abu Dhabi, UAE, unless
          mandatory law provides otherwise.
        </p>
      </section>
    </LegalPageShell>
  );
}
