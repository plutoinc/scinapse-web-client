interface ValidateLengthParams {
  value: string;
  fieldName: string;
  maxLength: number;
}

export function validateDateString(date: string, type: "year" | "month") {
  const dateInt = parseInt(date, 10);

  if (isNaN(dateInt)) {
    throw new Error("Invalid date format");
  }

  if (type === "year" && date.length !== 4) {
    throw new Error("Year value should be 4 length number value.");
  }

  if (type === "month" && date.length !== 2) {
    throw new Error("Month value should be 2 length number value");
  }
}

export function validateLength({ value, maxLength, fieldName }: ValidateLengthParams) {
  if (value.length < 2) {
    throw new Error(`Please enter a longer value to ${fieldName}. it allows 2 characters at minimum.`);
  } else if (value.length > maxLength) {
    throw new Error(`Please enter a shorter value to ${fieldName}. it allows ${maxLength} characters at maximum.`);
  }
}
