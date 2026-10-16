import React from "react";
import blob from "../../assets/hero-blob.webp";

export default function Home() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero__blob" src={blob} alt="" aria-hidden="true" />
      <div className="hero__copy">
        <h1 id="hero-title" className="hero__title display">
          <span className="hero__line">
            <span className="text-red">Smarter</span> way to
          </span>
          <span className="hero__line">manage your clinic.</span>
        </h1>
        <p className="lead">
          Say goodbye to the hassle of manual paperwork and disorganized patient records. Meet{" "}
          <strong>GINHAWA</strong>, a simple and efficient clinic management system that brings
          patient records, appointments, consultations, prescriptions, billing, and inventory
          together in one convenient platform.
        </p>
      </div>
    </section>
  );
}
