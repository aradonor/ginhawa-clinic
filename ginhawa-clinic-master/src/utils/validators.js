// Small validation helpers shared by the public forms.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PH_MOBILE_RE = /^(\+?63|0)9\d{9}$/;

export const isEmail = (v) => EMAIL_RE.test(String(v).trim());
export const isPhMobile = (v) => PH_MOBILE_RE.test(String(v).replace(/[\s-]/g, ""));

// Each rule returns an error string, or "" when the value is fine.
export const required = (label) => (v) => (String(v ?? "").trim() ? "" : `${label} is required.`);

export function validate(values, rules) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    for (const rule of rules[field]) {
      const message = rule(values[field], values);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  });
  return errors;
}
