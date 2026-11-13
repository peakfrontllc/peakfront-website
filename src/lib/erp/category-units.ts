import { lengthField } from "@/lib/erp/lengths";

export function categoryUnits(purposeName: string, typeName: string) {
  const purpose = purposeName.toLowerCase();
  const type = typeName.toLowerCase();
  const boom = lengthField(purposeName, typeName) === "boom";
  if (purpose.includes("access")) {
    return {
      capacityHint: "person or kg",
      capacityPlaceholder: "2 Person capacity",
      secondTitle: boom ? "Boom length" : "Height",
      secondHint: boom ? "Boom length in metres" : "Platform height in metres",
      secondPlaceholder: boom ? "75 m boom" : "8 m",
      secondKind: (boom ? "boom" : "capacity") as "boom" | "capacity" | "length",
      showSecond: true,
    };
  }
  if (purpose.includes("lifting") || boom) {
    return {
      capacityHint: "ton",
      capacityPlaceholder: "150 ton",
      secondTitle: "Boom length",
      secondHint: "Boom length in metres",
      secondPlaceholder: "75 m boom",
      secondKind: "boom" as const,
      showSecond: true,
    };
  }
  let capacityHint = "ton";
  let capacityPlaceholder = "10 ton";
  if (purpose.includes("earth")) {
    if (/skid/.test(type)) {
      capacityHint = "kg";
      capacityPlaceholder = "700 kg";
    } else if (/loader/.test(type) && !/backhoe/.test(type)) {
      capacityHint = "cubic metres";
      capacityPlaceholder = "3 m3";
    } else if (/grader/.test(type)) {
      capacityHint = "blade width";
      capacityPlaceholder = "14 ft";
    } else if (/dozer/.test(type)) {
      capacityHint = "model";
      capacityPlaceholder = "D6";
    } else if (/backhoe/.test(type)) {
      capacityHint = "type";
      capacityPlaceholder = "4x4";
    } else {
      capacityHint = "ton";
      capacityPlaceholder = "20 ton";
    }
  } else if (purpose.includes("compact")) {
    if (/plate|rammer/.test(type)) {
      capacityHint = "kg";
      capacityPlaceholder = "90 kg";
    } else {
      capacityHint = "ton";
      capacityPlaceholder = "10 ton";
    }
  } else if (purpose.includes("material")) {
    if (/telehandler/.test(type)) {
      capacityHint = "metres";
      capacityPlaceholder = "14 m";
    } else if (/skid/.test(type)) {
      capacityHint = "kg";
      capacityPlaceholder = "700 kg";
    } else {
      capacityHint = "ton";
      capacityPlaceholder = "5 ton";
    }
  } else if (purpose.includes("attenuator") || purpose.includes("tma")) {
    capacityHint = "host vehicle weight";
    capacityPlaceholder = "15 ton";
  } else if (purpose.includes("van")) {
    if (/passenger/.test(type)) {
      capacityHint = "seats";
      capacityPlaceholder = "14 seater";
    } else {
      capacityHint = "ton";
      capacityPlaceholder = "3 ton";
    }
  } else if (purpose.includes("tanker")) {
    capacityHint = "gallons";
    capacityPlaceholder = "5000 gal";
  } else if (purpose.includes("bus")) {
    capacityHint = "seats";
    capacityPlaceholder = "30 seater";
  } else if (purpose.includes("truck") || purpose.includes("recovery") || purpose.includes("transport")) {
    if (/pickup/.test(type)) {
      capacityHint = "cab";
      capacityPlaceholder = "Double Cab";
    } else {
      capacityHint = "ton";
      capacityPlaceholder = "10 ton";
    }
  } else if (purpose.includes("power") || purpose.includes("site")) {
    if (/generator/.test(type)) {
      capacityHint = "kVA";
      capacityPlaceholder = "100 kVA";
    } else if (/pump/.test(type)) {
      capacityHint = "inch";
      capacityPlaceholder = "6 inch";
    } else if (/compressor/.test(type)) {
      capacityHint = "cfm";
      capacityPlaceholder = "375 cfm";
    } else if (/weld/.test(type)) {
      capacityHint = "amps";
      capacityPlaceholder = "400 A";
    } else if (/scaffold/.test(type)) {
      capacityHint = "system";
      capacityPlaceholder = "Cuplock";
    } else {
      capacityHint = "size";
      capacityPlaceholder = "Standard";
    }
  }
  const bed = lengthField(purposeName, typeName) === "bed";
  return {
    capacityHint,
    capacityPlaceholder,
    secondTitle: bed ? "Length" : "",
    secondHint: bed ? "Length in metres" : "",
    secondPlaceholder: bed ? "12 m" : "",
    secondKind: (bed ? "length" : "capacity") as "boom" | "capacity" | "length",
    showSecond: bed,
  };
}
