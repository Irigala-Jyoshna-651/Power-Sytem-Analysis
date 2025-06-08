document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded'); // This 'loaded' class is for general body animations

    // Burger Menu Toggle Logic
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            body.classList.toggle('no-scroll');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    body.classList.remove('no-scroll');
                }
            });
        });
    }

    // --- Content Loading Logic ---
    fetch('content.json')
        .then(response => {
            if (!response.ok) {
                if (response.status === 404 && window.location.protocol === 'file:') {
                    throw new Error("Could not load content.json. Please ensure you are serving the website using a local web server (e.g., Live Server VS Code extension, Python's http.server) instead of opening HTML directly.");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderGlobalElements(data.global);

            const path = window.location.pathname;
            if (path.includes('iframe_page.html')) {
                renderIframePage(data.iframePage);
            } else if (path.includes('projects_team.html')) {
                renderProjectsTeamPage(data.projectsTeamPage);
            } else {
                renderLandingPage(data.landingPage);
            }
        })
        .catch(error => {
            console.error('Error loading content:', error);
            const mainContent = document.querySelector('body main');
            if (mainContent) {
                 mainContent.innerHTML = `
                    <div style="text-align: center; padding: 50px; color: #dc3545; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; margin: 50px auto; max-width: 600px;">
                        <h1>Error Loading Content</h1>
                        <p>Website content could not be loaded. This might be due to a server issue or incorrect file paths.</p>
                        <p style="font-style: italic; margin-top: 15px;">Please make sure you are running the site using a local web server (like VS Code's Live Server or Python's http.server).</p>
                        <p style="font-size: 0.8em; color: #6c757d;">Details: ${error.message}</p>
                    </div>
                `;
            } else {
                document.body.innerHTML = `
                    <div style="text-align: center; padding: 50px; color: #dc3545; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; margin: 50px auto; max-width: 600px;">
                        <h1>Error Loading Content</h1>
                        <p>Website content could not be loaded. Please try again later or contact support.</p>
                        <p style="font-size: 0.8em; color: #6c757d;">Details: ${error.message}</p>
                    </div>
                `;
            }
        });

    // --- Rendering Functions ---

    function renderGlobalElements(globalData) {
        const pageTitleElement = document.getElementById('pageTitle');
        if (pageTitleElement) {
            pageTitleElement.textContent = globalData.instituteName + " - " + globalData.projectType;
        }

        const instituteLogo = document.getElementById('instituteLogo');
        if (instituteLogo) {
            instituteLogo.src = globalData.logoImage;
            instituteLogo.alt = globalData.instituteName + " Logo";
        }

        const footerLogo = document.getElementById('footerLogo');
        if (footerLogo) {
            footerLogo.textContent = globalData.instituteName;
        }

        const footerLinksUl = document.querySelector('#footerLinks ul');
        if (footerLinksUl) {
            footerLinksUl.innerHTML = '';
            globalData.footerLinks.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.url;
                a.textContent = link.text;
                li.appendChild(a);
                footerLinksUl.appendChild(li);
            });
        }

        // Social Media Icons - NO LONGER RENDERED
        const socialMediaIconsDiv = document.getElementById('socialMediaIcons');
        if (socialMediaIconsDiv) {
            socialMediaIconsDiv.innerHTML = ''; // Ensure it's empty
            // globalData.socialMedia.forEach is removed
        }

        const copyrightText = document.getElementById('copyrightText');
        if (copyrightText) {
            copyrightText.textContent = `© ${globalData.copyrightYear} ${globalData.instituteName} ${globalData.projectType}. All rights reserved.`;
        }
    }

    function renderLandingPage(pageData) {
        document.getElementById('pageTitle').textContent = pageData.title;

        const heroSection = document.getElementById('heroSection');
        const heroBackgroundImage = pageData.hero.backgroundImage;

        const img = new Image();
        img.src = heroBackgroundImage;
        img.onload = () => {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBackgroundImage})`;
            heroSection.classList.add('loaded'); // Add 'loaded' class to trigger text animations
        };
        img.onerror = () => {
            console.error('Failed to load hero background image:', heroBackgroundImage);
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://via.placeholder.com/1600x900/444444/FFFFFF?text=Background+Error')`; // Fallback image
            heroSection.classList.add('loaded');
        };

        document.getElementById('heroHeading1').innerHTML = pageData.hero.heading1;
        document.getElementById('heroHeading2').innerHTML = pageData.hero.heading2;
        document.getElementById('heroParagraph').innerHTML = pageData.hero.paragraph;
        const heroCtaButton = document.getElementById('heroCtaButton');
        heroCtaButton.textContent = pageData.hero.ctaButtonText;
        heroCtaButton.href = pageData.hero.ctaButtonLink;

        document.getElementById('acknowledgementHeading').textContent = pageData.acknowledgement.heading;
        document.getElementById('acknowledgementParagraph').textContent = pageData.acknowledgement.paragraph;

        const featuresContainer = document.getElementById('featuresContainer');
        if (featuresContainer) {
            featuresContainer.innerHTML = '';
            pageData.features.forEach(feature => {
                const featureItem = document.createElement('div');
                featureItem.className = 'feature-item';
                featureItem.innerHTML = `
                    <img src="${feature.icon}" alt="${feature.title} Icon">
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                `;
                featuresContainer.appendChild(featureItem);
            });
        }

        document.getElementById('aboutUsHeading').textContent = pageData.aboutUs.heading;
        document.getElementById('aboutUsParagraph').textContent = pageData.aboutUs.paragraph;
        const aboutUsButton = document.getElementById('aboutUsButton');
        aboutUsButton.textContent = pageData.aboutUs.buttonText;
        aboutUsButton.href = pageData.aboutUs.buttonLink;
    }

    function renderIframePage(pageData) {
        document.getElementById('pageTitle').textContent = pageData.title;

        document.getElementById('iframeMainHeading').textContent = pageData.mainHeading;
        document.getElementById('iframeDescription').innerHTML = pageData.description;

        const iframesWrapper = document.getElementById('iframesWrapper');
        if (iframesWrapper) {
            iframesWrapper.innerHTML = '';
            if (pageData.iframes && pageData.iframes.length > 0) {
                const iframeData = pageData.iframes[0];
                const responsiveWrapper = document.createElement('div');
                responsiveWrapper.className = 'responsive-iframe-wrapper';
                responsiveWrapper.innerHTML = `
                    <iframe id="${iframeData.id}"
                            src="${iframeData.src}"
                            title="${iframeData.title}"
                            frameborder="0"
                            allowfullscreen>
                    </iframe>
                    <p class="iframe-description">${iframeData.fieldDescription}</p>
                `;
                iframesWrapper.appendChild(responsiveWrapper);
            } else {
                iframesWrapper.innerHTML = '<p>No ThingSpeak charts available.</p>';
            }
        }

        document.getElementById('iframeFooterDescription').textContent = pageData.footerDescription;
    }

    function renderProjectsTeamPage(pageData) {
        document.getElementById('pageTitle').textContent = pageData.title;

        document.getElementById('projectsSectionHeading').textContent = pageData.projectsSectionHeading;

        const projectDetailsTitle = document.getElementById('projectDetailsTitle');
        const projectDetailsDescription = document.getElementById('projectDetailsDescription');
        if (projectDetailsTitle && projectDetailsDescription && pageData.projectsDetails) {
            projectDetailsTitle.textContent = pageData.projectsDetails.title;
            projectDetailsDescription.textContent = pageData.projectsDetails.description;
        } else {
            console.warn("Project details elements or data not found.");
            document.querySelector('.project-details-section').style.display = 'none';
        }

        document.getElementById('teamSectionHeading').textContent = pageData.teamSectionHeading;
        const teamGrid = document.getElementById('teamGrid');
        if (teamGrid) {
            teamGrid.innerHTML = '';
            pageData.teamMembers.forEach(member => {
                const teamMemberCard = document.createElement('div');
                teamMemberCard.className = 'team-member-card';
                teamMemberCard.innerHTML = `
                    <img src="${member.image}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                    <p class="member-bio">${member.bio}</p>
                `;
                teamGrid.appendChild(teamMemberCard);
            });
        }
    }
});