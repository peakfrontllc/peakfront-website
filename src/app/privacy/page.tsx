import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { CONTACT } from "@/lib/constants";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Peakfront Equipment Rental LLC collects, uses and protects personal information submitted through peakfront.ae.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="28 July 2026">
      <section>
        <h2 className="text-lg font-bold text-navy">1. Who we are</h2>
        <p className="mt-3">
          {siteConfig.name} (&ldquo;Peakfront&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
          operates peakfront.ae. Our head office is at {CONTACT.address}.
        </p>
        <p className="mt-3">
          If you have questions about this policy, contact us at{" "}
          <a href={CONTACT.emailHref} className="text-blue hover:underline">
            {CONTACT.email}
          </a>{" "}
          or {CONTACT.phone}.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">2. Information we collect</h2>
        <p className="mt-3">
          When you use our website, we may collect the following information:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-navy">Quote requests:</strong> company name,
            contact person, phone number, email address, equipment required,
            quantity, rental duration, project location and any message you
            submit through our quote form.
          </li>
          <li>
            <strong className="text-navy">Communications:</strong> information
            you provide when you email, call or message us via WhatsApp.
          </li>
          <li>
            <strong className="text-navy">Technical data:</strong> basic server
            logs such as IP address, browser type and pages visited, used for
            security and to keep the site running reliably.
          </li>
        </ul>
        <p className="mt-3">
          We do not intentionally collect sensitive personal data through this
          website.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">3. How we use your information</h2>
        <p className="mt-3">We use the information you provide to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Respond to quote and rental enquiries</li>
          <li>Prepare pricing, availability and mobilisation proposals</li>
          <li>Communicate with you about equipment rental services</li>
          <li>Maintain business records required for our operations</li>
          <li>Protect our website against misuse or fraud</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">4. How quote form data is handled</h2>
        <p className="mt-3">
          When you submit a quote request, your details are sent securely to our
          team by email so we can respond to your enquiry. Email delivery is
          handled by our email service provider. We do not sell quote form
          submissions to third parties.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">5. Sharing of information</h2>
        <p className="mt-3">
          We may share information only where necessary, for example with:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Service providers that help us operate our website and email systems</li>
          <li>Professional advisers where required by law or business need</li>
          <li>Authorities if we are legally required to do so</li>
        </ul>
        <p className="mt-3">
          We require service providers to handle personal data appropriately and
          only for the purposes we specify.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">6. Data retention</h2>
        <p className="mt-3">
          We keep enquiry and quote information for as long as needed to respond
          to your request, manage our business relationship and meet applicable
          legal, accounting or regulatory requirements.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">7. Your choices</h2>
        <p className="mt-3">
          You may request access to, correction of, or deletion of personal
          information we hold about you, subject to applicable law. Contact us at{" "}
          <a href={CONTACT.emailHref} className="text-blue hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">8. Security</h2>
        <p className="mt-3">
          We take reasonable technical and organisational measures to protect
          personal information. No method of transmission over the internet is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">9. Changes to this policy</h2>
        <p className="mt-3">
          We may update this Privacy Policy from time to time. The &ldquo;Last
          updated&rdquo; date at the top of this page shows when it was last
          revised. Continued use of the website after changes are posted
          constitutes acceptance of the updated policy.
        </p>
      </section>
    </LegalPageShell>
  );
}
