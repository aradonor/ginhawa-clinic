import React, { useState } from "react";
import API from "../../api/axios";
import FormField from "../../components/public/FormField";
import { validate, required, isEmail, isPhMobile } from "../../utils/validators";
import art from "../../assets/contact-illustration.webp";

const EMPTY = { firstName: "", lastName: "", mobile: "", email: "", message: "" };

const RULES = {
  firstName: [required("First name")],
  lastName: [required("Last name")],
  mobile: [
    required("Mobile number"),
    (v) => (isPhMobile(v) ? "" : "Enter a valid mobile number, like 0917 123 4567."),
  ],
  email: [required("Email address"), (v) => (isEmail(v) ? "" : "Enter a valid email address.")],
  message: [required("Message")],
};

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    const found = validate(values, RULES);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSending(true);
    try {
      await API.post("/contact", values);
      setValues(EMPTY);
      setStatus({ type: "success", text: "Message sent. We will get back to you soon." });
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "We could not send your message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pub-page contact">
      <form className="contact__form" onSubmit={onSubmit} noValidate>
        <h1 className="form-heading display">Send us a message!</h1>

        {status.text && (
          <p className={`form-alert form-alert--${status.type}`} role="status">
            {status.text}
          </p>
        )}

        <div className="form-grid">
          <FormField label="First Name" name="firstName" autoComplete="given-name"
            value={values.firstName} onChange={onChange} error={errors.firstName} />
          <FormField label="Last Name" name="lastName" autoComplete="family-name"
            value={values.lastName} onChange={onChange} error={errors.lastName} />
          <FormField label="Mobile Number" name="mobile" type="tel" autoComplete="tel"
            value={values.mobile} onChange={onChange} error={errors.mobile} />
          <FormField label="Email Address" name="email" type="email" autoComplete="email"
            value={values.email} onChange={onChange} error={errors.email} />
          <FormField label="Message here" name="message" as="textarea" className="span-2"
            value={values.message} onChange={onChange} error={errors.message} />
        </div>

        <p style={{ margin: "1.5rem 0 0" }}>
          <button className="btn-pill" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send"}
          </button>
        </p>
      </form>

      <img className="contact__art" src={art} alt="" aria-hidden="true" />
    </div>
  );
}
