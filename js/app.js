/* ============================================================
   PORTFOLIO APPLICATION
============================================================ */

"use strict";


/* ============================================================
   GLOBAL DATA
============================================================ */

const portfolioData = {
    profile: null,
    experience: null,
    projects: null,
    skills: null,
    contact: null,
    technologies: null
};


/* ============================================================
   JSON FILES
============================================================ */

const DATA_FILES = {
    profile: "data/profile.json",
    experience: "data/experience.json",
    projects: "data/projects.json",
    skills: "data/skills.json",
    contact: "data/contact.json",
    technologies: "data/technologies.json"
};


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Portfolio application starting...");

    initializeApplication();

});


/* ============================================================
   INITIALIZE APPLICATION
============================================================ */

async function initializeApplication() {

    try {

        await loadAllData();

        initializeNavigation();

        renderProfile();

        renderExperience();

        renderProjects();

        renderSkills();

        renderTechnologies();

        renderContact();

        initializeTechnologyModal();

        initializeHashNavigation();

        console.log("✅ Portfolio application initialized successfully.");

    } catch (error) {

        console.error(
            "❌ Failed to initialize portfolio:",
            error
        );

    }

}


/* ============================================================
   LOAD ALL JSON DATA
============================================================ */

async function loadAllData() {

    console.log("📦 Loading all JSON files...");


    const entries = Object.entries(DATA_FILES);


    const results = await Promise.all(

        entries.map(async ([key, file]) => {

            try {

                const response = await fetch(file);

                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status} - ${file}`
                    );

                }

                const data = await response.json();

                console.log(
                    `✅ ${file} loaded successfully`,
                    data
                );

                return [key, data];

            } catch (error) {

                console.error(
                    `❌ Failed to load ${file}`,
                    error
                );

                throw error;

            }

        })

    );


    results.forEach(([key, data]) => {

        portfolioData[key] = data;

    });


    console.log(
        "✅ ALL JSON FILES LOADED",
        portfolioData
    );

}


/* ============================================================
   NAVIGATION
============================================================ */

function initializeNavigation() {

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const sectionId =
                link.dataset.section;

            if (!sectionId) {
                return;
            }

            event.preventDefault();

            showSection(sectionId);

            history.replaceState(
                null,
                "",
                `#${sectionId}`
            );

        });

    });

}


/* ============================================================
   SHOW SECTION
============================================================ */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");


    const navLinks =
        document.querySelectorAll(".nav-link");


    let targetFound = false;


    sections.forEach(section => {

        const isTarget =
            section.id === sectionId;

        section.classList.toggle(
            "active-section",
            isTarget
        );

        if (isTarget) {
            targetFound = true;
        }

    });


    navLinks.forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );

    });


    if (!targetFound) {

        const home =
            document.getElementById("home");

        if (home) {

            home.classList.add(
                "active-section"
            );

        }

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   HASH NAVIGATION
============================================================ */

function initializeHashNavigation() {

    const hash =
        window.location.hash.replace("#", "");


    if (hash) {

        showSection(hash);

    } else {

        showSection("home");

    }


    window.addEventListener(
        "hashchange",
        () => {

            const sectionId =
                window.location.hash.replace("#", "");

            if (sectionId) {

                showSection(sectionId);

            }

        }
    );

}


/* ============================================================
   PROFILE
============================================================ */

function renderProfile() {

    const profile =
        portfolioData.profile;


    if (!profile) {
        return;
    }


    setText(
        "hero-name",
        profile.name
    );


    setText(
        "hero-title",
        profile.title
    );


    setText(
        "hero-summary",
        profile.summary
    );


    setText(
        "about-summary",
        profile.summary
    );


    setText(
        "about-education",
        profile.education
    );


    setText(
        "about-location",
        profile.location
    );


    setText(
        "about-email",
        profile.email
    );

}


/* ============================================================
   EXPERIENCE
============================================================ */

function renderExperience() {

    const container =
        document.getElementById(
            "experience-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const experience =
        portfolioData.experience?.experience || [];


    if (experience.length === 0) {

        container.innerHTML =
            `<p class="empty-message">
                No experience available.
             </p>`;

        return;

    }


    experience.forEach((item, index) => {

        const card =
            document.createElement("article");

        card.className = "experience-card";


        const responsibilities =
            Array.isArray(item.responsibilities)
                ? item.responsibilities
                : [];


        const responsibilityHTML =
            responsibilities
                .map(
                    responsibility =>
                        `<li>${escapeHTML(
                            responsibility
                        )}</li>`
                )
                .join("");


        card.innerHTML = `

            <div class="experience-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="experience-main">

                <div class="experience-header">

                    <div>

                        <span class="experience-position">
                            ${escapeHTML(item.position)}
                        </span>

                        <h3>
                            ${escapeHTML(item.company)}
                        </h3>

                    </div>

                    <span class="experience-date">
                        ${escapeHTML(item.startDate)}
                        —
                        ${escapeHTML(item.endDate)}
                    </span>

                </div>


                <p class="experience-description">
                    ${escapeHTML(item.description)}
                </p>


                ${
                    responsibilities.length
                        ? `
                            <ul class="responsibility-list">
                                ${responsibilityHTML}
                            </ul>
                          `
                        : ""
                }

            </div>
        `;


        container.appendChild(card);

    });

}


/* ============================================================
   PROJECTS
============================================================ */

function renderProjects() {

    const container =
        document.getElementById(
            "projects-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const projects =
        portfolioData.projects?.projects || [];


    projects.forEach((project, index) => {

        const card =
            document.createElement("article");

        card.className = "project-card";


        const technologies =
            Array.isArray(project.technologies)
                ? project.technologies
                : [];


        const techHTML =
            technologies
                .map(
                    tech =>
                        `<span>${escapeHTML(tech)}</span>`
                )
                .join("");


        card.innerHTML = `

            <div class="project-top">

                <span class="project-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="project-status">
                    ${escapeHTML(project.status || "Project")}
                </span>

            </div>


            <h3>
                ${escapeHTML(project.name)}
            </h3>


            <p>
                ${escapeHTML(project.description)}
            </p>


            <div class="project-technologies">
                ${techHTML}
            </div>

        `;


        container.appendChild(card);

    });

}


/* ============================================================
   SKILLS
============================================================ */

function renderSkills() {

    const container =
        document.getElementById(
            "skills-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const skills =
        portfolioData.skills?.skills || [];


    skills.forEach((skill, index) => {

        const card =
            document.createElement("article");

        card.className = "skill-card";


        card.innerHTML = `

            <div class="skill-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="skill-content">

                <span class="skill-category">
                    ${escapeHTML(skill.category)}
                </span>

                <h3>
                    ${escapeHTML(skill.name)}
                </h3>

                <p>
                    ${escapeHTML(skill.description)}
                </p>

            </div>

        `;


        container.appendChild(card);

    });

}


/* ============================================================
   TECHNOLOGIES
============================================================ */

function renderTechnologies() {

    console.log(
        "renderTechnologies() called"
    );


    const grid =
        document.getElementById(
            "technology-grid"
        );


    const ticker =
        document.getElementById(
            "tech-ticker-track"
        );


    if (!grid) {

        console.error(
            "❌ Technology grid not found."
        );

        return;

    }


    const technologies =
        portfolioData.technologies?.technologies || [];


    console.log(
        "Technologies:",
        technologies
    );


    /*
       ================================================
       TECHNOLOGY STACK GRID
       ================================================
    */

    grid.innerHTML = "";


    technologies.forEach((technology, index) => {

        const card =
            createTechnologyCard(
                technology,
                index
            );


        grid.appendChild(card);

    });


    /*
       ================================================
       TECHNOLOGY CAROUSEL
       ================================================
    */

    if (ticker) {

        ticker.innerHTML = "";


        const firstSet =
            createTechnologyTickerSet(
                technologies
            );


        const secondSet =
            createTechnologyTickerSet(
                technologies
            );


        ticker.appendChild(firstSet);

        ticker.appendChild(secondSet);


        console.log(
            "✅ Technology carousel rendered."
        );

    }

}


/* ============================================================
   CREATE TECHNOLOGY CARD
============================================================ */

function createTechnologyCard(
    technology,
    index
) {

    const button =
        document.createElement("button");


    button.type = "button";

    button.className =
        "technology-card";


    button.dataset.technologyIndex =
        index;


    button.setAttribute(
        "aria-label",
        `View ${technology.name} experience`
    );


    button.innerHTML = `

        <div class="technology-icon">

            <img
                src="${escapeAttribute(technology.iconUrl)}"
                alt="${escapeAttribute(technology.name)}"
                loading="lazy"
            >

        </div>


        <div class="technology-info">

            <strong>
                ${escapeHTML(technology.name)}
            </strong>

            <span>
                ${escapeHTML(technology.category)}
            </span>

        </div>


        <span class="technology-arrow">
            →
        </span>

    `;


    button.addEventListener(
        "click",
        () => {

            openTechnologyModal(
                technology
            );

        }
    );


    return button;

}


/* ============================================================
   CREATE TICKER SET
============================================================ */

function createTechnologyTickerSet(
    technologies
) {

    const set =
        document.createElement("div");


    set.className =
        "tech-ticker-set";


    technologies.forEach(technology => {

        const item =
            document.createElement("button");


        item.type = "button";

        item.className =
            "tech-ticker-item";


        item.innerHTML = `

            <img
                src="${escapeAttribute(technology.iconUrl)}"
                alt="${escapeAttribute(technology.name)}"
            >

            <span>
                ${escapeHTML(technology.name)}
            </span>

        `;


        item.addEventListener(
            "click",
            () => {

                openTechnologyModal(
                    technology
                );

            }
        );


        set.appendChild(item);

    });


    return set;

}


/* ============================================================
   TECHNOLOGY MODAL
============================================================ */

function initializeTechnologyModal() {

    const modal =
        document.getElementById(
            "technology-modal"
        );


    const closeButton =
        document.getElementById(
            "modal-close"
        );


    const backdrop =
        modal?.querySelector(
            ".modal-backdrop"
        );


    if (!modal) {
        return;
    }


    closeButton?.addEventListener(
        "click",
        closeTechnologyModal
    );


    backdrop?.addEventListener(
        "click",
        closeTechnologyModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("modal-open")
            ) {

                closeTechnologyModal();

            }

        }
    );

}


/* ============================================================
   OPEN TECHNOLOGY MODAL
============================================================ */

function openTechnologyModal(
    technology
) {

    const modal =
        document.getElementById(
            "technology-modal"
        );


    const icon =
        document.getElementById(
            "modal-technology-icon"
        );


    const name =
        document.getElementById(
            "modal-technology-name"
        );


    const category =
        document.getElementById(
            "modal-technology-category"
        );


    const experienceList =
        document.getElementById(
            "modal-experience-list"
        );


    if (!modal) {
        return;
    }


    /*
       Header
    */

    icon.src =
        technology.iconUrl || "";

    icon.alt =
        technology.name || "";


    name.textContent =
        technology.name || "Technology";


    category.textContent =
        technology.category || "Technology";


    /*
       Experience
    */

    experienceList.innerHTML = "";


    const experiences =
        Array.isArray(technology.experience)
            ? technology.experience
            : [];


    if (experiences.length === 0) {

        experienceList.innerHTML = `

            <div class="modal-empty">

                <span>
                    No detailed experience has
                    been added for this technology yet.
                </span>

            </div>

        `;

    } else {

        experiences.forEach(
            (experience, index) => {

                const item =
                    document.createElement("article");


                item.className =
                    "modal-experience-item";


                item.innerHTML = `

                    <div class="modal-experience-number">
                        ${String(index + 1).padStart(2, "0")}
                    </div>


                    <div class="modal-experience-content">

                        <div class="modal-experience-heading">

                            <div>

                                <span>
                                    ${escapeHTML(
                                        experience.role ||
                                        "Developer"
                                    )}
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        experience.project ||
                                        "Project"
                                    )}
                                </h3>

                            </div>

                        </div>


                        <p>
                            ${escapeHTML(
                                experience.description ||
                                ""
                            )}
                        </p>

                    </div>

                `;


                experienceList.appendChild(item);

            }
        );

    }


    /*
       Open modal
    */

    modal.classList.add(
        "modal-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-active"
    );


    /*
       Prevent background scrolling
    */

    document.body.style.overflow =
        "hidden";

}


/* ============================================================
   CLOSE TECHNOLOGY MODAL
============================================================ */

function closeTechnologyModal() {

    const modal =
        document.getElementById(
            "technology-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "modal-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-active"
    );


    document.body.style.overflow =
        "";

}


/* ============================================================
   CONTACT
============================================================ */

function renderContact() {

    const contact =
        portfolioData.contact?.contact;


    if (!contact) {
        return;
    }


    setText(
        "contact-email",
        contact.email
    );


    setText(
        "contact-location",
        contact.location
    );


    setText(
        "contact-availability",
        contact.availability
    );


    setText(
        "contact-message",
        contact.message
    );


    const emailLink =
        document.getElementById(
            "contact-email-link"
        );


    if (emailLink) {

        emailLink.href =
            `mailto:${contact.email}`;

    }

}


/* ============================================================
   HELPER: SET TEXT
============================================================ */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* ============================================================
   HELPER: ESCAPE HTML
============================================================ */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* ============================================================
   HELPER: ESCAPE ATTRIBUTE
============================================================ */

function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* ============================================================
   DEBUG HELPER
============================================================ */

window.portfolioData =
    portfolioData;