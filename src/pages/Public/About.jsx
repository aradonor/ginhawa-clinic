import React from "react";
import doctor from "../../assets/about-doctor.webp";

export default function About() {
  return (
    <div className="pub-page">
      <section className="about" aria-labelledby="about-title">
        <div className="about__art">
          <img src={doctor} alt="A doctor greeting a young patient and her mother in a clinic." />
        </div>
        <div className="about__copy">
          <h1 id="about-title" className="about__title">
            About <span className="display text-red">Ginhawa</span>
          </h1>
          <p className="lead">
            Say goodbye to the hassle of manual paperwork and disorganized patient records. Meet{" "}
            <strong>GINHAWA</strong>, a simple and efficient clinic management system that brings
            patient records, appointments, consultations, prescriptions, billing, and inventory
            together in one convenient platform.
          </p>
        </div>
      </section>
    </div>
  );
}
