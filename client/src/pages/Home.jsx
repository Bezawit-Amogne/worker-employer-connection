import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [activeStep, setActiveStep] = useState(0);
    const [activeFeature, setActiveFeature] = useState(0);
    const [activeGallery, setActiveGallery] = useState(0);

    const featureCards = [
        {
            title: "Verified professionals",
            text: "Build trust with clear skill profiles, experience history, and professional visibility for workers and employers."
        },
        {
            title: "Smart job matching",
            text: "Search by category, skill, location, and experience so the right opportunities rise to the top."
        },
        {
            title: "Fast hiring flow",
            text: "Employers can post jobs, review applications, and contact candidates without middlemen or delays."
        },
        {
            title: "Built for growth",
            text: "From entry-level to specialized roles, Serategna supports better hiring decisions and better job access."
        }
    ];

    const steps = [
        { label: "1", title: "Create profile", text: "Workers set up a profile and employers create their company presence." },
        { label: "2", title: "Match and connect", text: "Search roles, shortlist candidates, and start meaningful conversations." },
        { label: "3", title: "Hire or get hired", text: "Move from inquiry to opportunity with clearer communication and better visibility." }
    ];

    const images = [
        {
            src: "https://www.people.com.cn/mediafile/pic/BIG/20210526/61/8147697076146860145.jpg",
            title: "Create a worker profile",
            caption: "Workers build their skills and experience profile."
        },
        {
            src: "https://media.istockphoto.com/id/628497306/photo/african-women-plucking-tea-leaves-on-plantation-east-africa.jpg?s=612x612&w=0&k=20&c=uV0IkYJeLWV57X4_C0lHOs3ZqCWYTr_p9Z2KUKhlAaY=",
            title: "Match with employers",
            caption: "Employers discover candidates based on role fit."
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7bu4yxH8Uc45zv7fSBeH5NpJA8qgohL4MDFMF04H3Q&s=10",
            title: "Connect and hire",
            caption: "Applicants and employers move from interest to action."
        }
    ];

    const highlightImages = [
        {
            src: "https://invest-for-jobs.com/assets/media/bilder/DESTA-Factory-Worker-ETH.jpg",
            title: "Professional visibility",
            text: "Showcase experience, skills, and trust signals that help workers stand out."
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmigmNz3UtEQ0xc95dLkz16KK9NHC2FqJFZTvmjjhDzuWhI3EK-dr57Ttg&s=10",
            title: "Smarter matching",
            text: "Match the right people with the right opportunities based on skills and role fit."
        },
        {
            src: "https://www.unhcr.org/sites/default/files/styles/de2e/public/legacy-images/5daefd753.jpg",
            title: "Better connections",
            text: "Create faster, clearer communication between applicants and employers."
        }
    ];

    return (
        <main className="home">
            <section className="hero">
                <div className="hero-glow hero-glow-one" />
                <div className="hero-glow hero-glow-two" />

                <div className="hero-content">
                    <span className="eyebrow">worker and employment platform</span>
                    <div className="brand-pill">
                        <span className="brand-pill-mark">S</span>
                        <span>Trusted employment network</span>
                    </div>
                    <h1>Find the right work. Hire the right people.</h1>
                    <p>
                        the plat form connects skilled workers with reliable employers through a cleaner, smarter,
                        and more trusted hiring experience across Ethiopia.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/login" className="primary-button">Explore jobs</Link>
                        <Link to="/register" className="secondary-button">Create account</Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <strong>500+</strong>
                            <span>jobs posted</span>
                        </div>
                        <div className="stat-item">
                            <strong>4k+</strong>
                            <span>workers connected</span>
                        </div>
                        <div className="stat-item">
                            <strong>94%</strong>
                            <span>role fit satisfaction</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="image-showcase">
                <div className="showcase-grid">
                    {images.map((image, index) => (
                        <div key={image.src} className={`showcase-card showcase-card-${index + 1}`}>
                            <img src={image.src} alt={image.title} />
                            <div className="showcase-caption">
                                <h3>{image.title}</h3>
                                <p>{image.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="feature-gallery">
                <div className="section-heading">
                    <span className="eyebrow eyebrow-dark">More about our platform</span>
                    <h2>Built to help people connect faster and more confidently.</h2>
                </div>

                <div className="feature-gallery-grid">
                    {highlightImages.map((item, index) => (
                        <button
                            key={item.title}
                            type="button"
                            className={`feature-gallery-card ${activeGallery === index ? "selected" : ""}`}
                            onClick={() => setActiveGallery(index)}
                            aria-pressed={activeGallery === index}
                        >
                            <img src={item.src} alt={item.title} />
                            <div className="feature-gallery-content">
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="how-it-works">
                <div className="section-heading">
                    <span className="eyebrow eyebrow-dark">How it works</span>
                    <h2>Simple steps to grow your opportunities</h2>
                </div>

                <div className="work-sections">
                    {steps.map((step, index) => (
                        <button
                            key={step.label}
                            type="button"
                            className={`info-card step-card ${activeStep === index ? "selected" : ""}`}
                            onClick={() => setActiveStep(index)}
                            aria-pressed={activeStep === index}
                        >
                            <span className="step-badge">{step.label}</span>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section className="benefits-section">
                <div className="section-heading">
                    <span className="eyebrow eyebrow-dark">Why Serategna</span>
                    <h2>Built for trusted hiring and meaningful work</h2>
                </div>

                <div className="benefits-grid">
                    {featureCards.map((card, index) => (
                        <button
                            key={card.title}
                            type="button"
                            className={`info-card feature-card ${activeFeature === index ? "selected" : ""}`}
                            onClick={() => setActiveFeature(index)}
                            aria-pressed={activeFeature === index}
                        >
                            <div className="feature-icon">•</div>
                            <h3>{card.title}</h3>
                            <p>{card.text}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-box">
                    <div>
                        <span className="eyebrow eyebrow-dark">Ready to get started?</span>
                        <h2>Start building the next opportunity today.</h2>
                    </div>
                    <div className="hero-buttons">
                        <Link to="/register" className="primary-button">Join now</Link>
                        <Link to="/contact" className="secondary-button secondary-button-dark">Contact us</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;