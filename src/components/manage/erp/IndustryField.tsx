"use client";

import { useState } from "react";
import { fieldClass, labelClass } from "@/components/manage/form-styles";
import { CLIENT_INDUSTRIES, knownIndustry } from "@/lib/erp/shared";

export function IndustryField({ defaultValue = "" }: { defaultValue?: string }) {
  const current = defaultValue.trim();
  const custom = current && !knownIndustry(current) ? current : "";
  const [choice, setChoice] = useState(custom ? "other" : current);

  return (
    <div>
      <label className={labelClass} htmlFor="industry-choice">Industry</label>
      <select
        id="industry-choice"
        name={choice === "other" ? undefined : "industry"}
        value={choice}
        onChange={(event) => setChoice(event.target.value)}
        className={fieldClass}
      >
        <option value="">Select industry</option>
        {CLIENT_INDUSTRIES.map((industry) => (
          <option key={industry} value={industry}>{industry}</option>
        ))}
        <option value="other">Other</option>
      </select>
      {choice === "other" && (
        <input
          name="industry"
          required
          minLength={2}
          maxLength={80}
          defaultValue={custom}
          placeholder="Enter industry"
          aria-label="Custom industry"
          className={`${fieldClass} mt-2`}
        />
      )}
    </div>
  );
}
