// Building interactions and dialog system

const Buildings = {
    // Dialog state
    dialogOpen: false,
    dialogQueue: [],
    currentDialog: null,

    // DOM elements
    dialogBox: null,
    dialogTitle: null,
    dialogText: null,

    // Content panel state
    panelOpen: false,
    panelElement: null,
    panelTitle: null,
    panelBody: null,
    panelCloseBtn: null,
    previousFocus: null,

    // Interaction prompt
    promptVisible: false,
    promptElement: null,
    currentInteraction: null,

    // Action cooldown to prevent double-triggers
    actionCooldown: false,

    // Track visited buildings this session
    visitedBuildings: {},

    // Mode toggle button element
    modeToggleBtn: null,

    // Initialize
    init() {
        this.dialogBox = document.getElementById('dialog-box');
        this.dialogTitle = document.getElementById('dialog-title');
        this.dialogText = document.getElementById('dialog-text');

        // Content panel elements
        this.panelElement = document.getElementById('content-panel');
        this.panelTitle = document.getElementById('panel-title');
        this.panelBody = document.getElementById('panel-body');
        this.panelCloseBtn = document.getElementById('panel-close');

        // Create interaction prompt
        this.createPrompt();

        // Create mode toggle button
        this.createModeToggle();

        // Dialog click/tap to advance (only if dialog box exists)
        if (this.dialogBox) {
            this.dialogBox.addEventListener('click', () => this.advanceDialog());
            this.dialogBox.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.advanceDialog();
            });
        }

        // Panel close button click
        if (this.panelCloseBtn) {
            this.panelCloseBtn.addEventListener('click', () => this.closePanel());
        }

        // ESC key handling for panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panelOpen) {
                this.closePanel();
            }
        });
    },

    // Create the interaction prompt element
    createPrompt() {
        this.promptElement = document.createElement('div');
        this.promptElement.className = 'interaction-prompt';
        this.promptElement.style.display = 'none';
        const gameMode = document.getElementById('game-mode') || document.getElementById('game-container');
        if (gameMode) {
            gameMode.appendChild(this.promptElement);
        }
    },

    // Create the mode toggle button for HUD
    createModeToggle() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        // Website icon SVG
        const websiteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;

        this.modeToggleBtn = document.createElement('button');
        this.modeToggleBtn.className = 'game-mode-toggle';
        this.modeToggleBtn.innerHTML = `${websiteIcon}<span>Website</span>`;
        this.modeToggleBtn.setAttribute('aria-label', 'View website');

        this.modeToggleBtn.addEventListener('click', () => {
            window.dispatchEvent(
                new CustomEvent('mode-switch', { detail: { mode: 'website' } })
            );
        });

        gameContainer.appendChild(this.modeToggleBtn);
    },

    // Clean up mode toggle button (called on game destroy)
    destroyModeToggle() {
        if (this.modeToggleBtn) {
            this.modeToggleBtn.remove();
            this.modeToggleBtn = null;
        }
    },

    // Show/hide interaction prompt
    updatePrompt(interaction, isMobile) {
        if (interaction && !this.dialogOpen && !this.panelOpen) {
            this.currentInteraction = interaction;

            // Get object name for display
            let objectName = interaction.name || this.getInteractionName(interaction);
            let actionText = isMobile ? 'Tap to interact' : 'Press ENTER to interact';

            // Customize action text based on type
            switch (interaction.type) {
                case 'entrance':
                case 'door':
                    actionText = isMobile ? 'Tap to enter' : 'Press ENTER to enter';
                    break;
                case 'sign':
                    actionText = isMobile ? 'Tap to read' : 'Press ENTER to read';
                    break;
                case 'exit':
                    objectName = 'Exit';
                    actionText = isMobile ? 'Tap to exit' : 'Press ENTER to exit';
                    break;
            }

            // Update prompt with formatted content
            this.promptElement.innerHTML = `<span class="prompt-object">${objectName}</span><br><span class="prompt-action">${actionText}</span>`;
            this.promptElement.style.display = 'block';
            this.promptVisible = true;
        } else {
            this.hidePrompt();
        }
    },

    // Get display name for an interaction
    getInteractionName(interaction) {
        const nameMap = {
            'publication': 'Bookshelf',
            'media': 'Media Equipment',
            'research': 'Research Station',
            'talk': 'Lecture Notes',
            'talks': 'Lecture Notes',
            'object': interaction.id || 'Object',
            'entrance': interaction.name || 'Entrance',
            'door': interaction.name || 'Door',
            'sign': 'Sign'
        };
        return nameMap[interaction.type] || 'Interact';
    },

    hidePrompt() {
        if (this.promptElement) {
            this.promptElement.style.display = 'none';
        }
        this.promptVisible = false;
        this.currentInteraction = null;
    },

    // Handle an interaction
    handleInteraction(interaction) {
        if (this.actionCooldown) return null;

        this.actionCooldown = true;
        setTimeout(() => { this.actionCooldown = false; }, 200);

        if (!interaction) return null;

        switch (interaction.type) {
            case 'entrance':
            case 'door':
                return { action: 'enter', building: interaction.building };

            case 'exit':
                return { action: 'exit' };

            case 'sign':
                this.showDialog('Sign', interaction.text);
                return { action: 'dialog' };

            case 'object':
                this.showObjectContent(interaction);
                return { action: 'dialog' };

            case 'publication':
                this.showPublicationContent(interaction.index);
                return { action: 'dialog' };

            case 'media':
                this.showMediaContent(interaction.index);
                return { action: 'dialog' };

            case 'research':
                this.showResearchContent(interaction.index);
                return { action: 'dialog' };

            case 'talk':
                this.showTalkContent(interaction.index);
                return { action: 'dialog' };

            case 'talks':
                this.showTalksContent(interaction.index);
                return { action: 'dialog' };
        }

        return null;
    },

    // Show object content from game content
    showObjectContent(interaction) {
        const content = SITE_CONTENT.gameContent;
        const [room, item] = interaction.content.split('.');

        if (content[room] && content[room][item]) {
            const title = this.formatTitle(item);
            this.showDialog(title, content[room][item]);
        }
    },

    // Format item name to title
    formatTitle(item) {
        return item
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },

    // Show publication content
    showPublicationContent(index) {
        const pubs = SITE_CONTENT.publications;
        if (index >= 0 && index < pubs.length) {
            const pub = pubs[index];
            const html = `
                <p><strong>${pub.title}</strong></p>
                <p>${pub.authors}</p>
                <p><em>${pub.venue}</em> (${pub.year})</p>
            `;
            this.showDialog('Publication', html, true);
        } else {
            this.showDialog('Bookshelf', 'Rows of academic journals and conference proceedings line the shelves.');
        }
    },

    // Show media content
    showMediaContent(index) {
        const media = SITE_CONTENT.media;
        if (index >= 0 && index < media.length) {
            const item = media[index];
            const html = `
                <p><strong>${item.title}</strong></p>
                <p><span style="text-transform: uppercase; font-size: 0.8em;">${item.type}</span> at ${item.venue}</p>
                <p>${item.description}</p>
                <p><em>${item.date}</em></p>
            `;
            this.showDialog('Media & Talks', html, true);
        } else {
            this.showDialog('Lecture Hall', 'The lecture hall is set up for presentations on AI and conservation.');
        }
    },

    // Show research content
    showResearchContent(index) {
        const research = SITE_CONTENT.research;
        if (index >= 0 && index < research.length) {
            const item = research[index];
            const tags = item.tags.map(t => `[${t}]`).join(' ');
            const html = `
                <p><strong>${item.title}</strong></p>
                <p>${item.description}</p>
                <p style="margin-top: 0.5em; font-size: 0.85em;">${tags}</p>
            `;
            this.showDialog('Research Project', html, true);
        } else {
            this.showDialog('Research Lab', 'Equipment and computers fill the lab, all dedicated to conservation AI research.');
        }
    },

    // Show talk content (from talks data - legacy singular type)
    showTalkContent(index) {
        const talks = SITE_CONTENT.talks;
        if (talks && index >= 0 && index < talks.length) {
            const item = talks[index];
            const html = `
                <p><strong>${item.title}</strong></p>
                <p>${item.venue} (${item.year})</p>
                ${item.description ? `<p>${item.description}</p>` : ''}
            `;
            this.showDialog('Talk', html, true);
        } else {
            this.showDialog('Lecture Theatre', 'The stage is set for academic presentations and guest lectures.');
        }
    },

    // Show talks content (Theatre interior - plural type)
    // Uses SITE_CONTENT.talks or falls back to media for talk-type items
    showTalksContent(index) {
        const talks = SITE_CONTENT.talks || SITE_CONTENT.media;
        if (index >= 0 && index < talks.length) {
            const item = talks[index];
            const html = `
                <p><strong>${item.title}</strong></p>
                <p><span style="text-transform: uppercase; font-size: 0.8em;">${item.type || 'TALK'}</span> at ${item.venue}</p>
                <p>${item.description}</p>
                <p><em>${item.date || item.year}</em></p>
            `;
            this.showDialog('Talk', html, true);
        } else {
            this.showDialog('Lecture Theatre', 'The theatre hosts talks on AI, conservation, and technology.');
        }
    },

    // Show a dialog box
    showDialog(title, text, isHtml = false) {
        this.dialogTitle.textContent = title;

        if (isHtml) {
            this.dialogText.innerHTML = text;
        } else {
            this.dialogText.textContent = text;
        }

        this.dialogBox.classList.remove('hidden');
        this.dialogOpen = true;
        this.hidePrompt();
    },

    // Advance/close dialog
    advanceDialog() {
        if (this.dialogQueue.length > 0) {
            const next = this.dialogQueue.shift();
            this.showDialog(next.title, next.text, next.isHtml);
        } else {
            this.closeDialog();
        }
    },

    // Close dialog
    closeDialog() {
        this.dialogBox.classList.add('hidden');
        this.dialogOpen = false;
        this.currentDialog = null;
    },

    // Check if dialog or panel is open
    isDialogOpen() {
        return this.dialogOpen || this.panelOpen;
    },

    // Handle action key in dialog
    handleDialogAction() {
        if (this.dialogOpen) {
            this.advanceDialog();
            return true;
        }
        return false;
    },

    // Show content panel with title and HTML content
    showContentPanel(title, htmlContent) {
        if (!this.panelElement) return;

        // Save current focus for restoration
        this.previousFocus = document.activeElement;

        // Set panel content
        this.panelTitle.textContent = title;
        this.panelBody.innerHTML = htmlContent;

        // Show panel
        this.panelElement.classList.remove('hidden');
        this.panelOpen = true;
        this.hidePrompt();

        // Trap focus inside panel
        this.trapFocus(this.panelElement);
    },

    // Close content panel
    closePanel() {
        if (!this.panelElement) return;

        this.panelElement.classList.add('hidden');
        this.panelOpen = false;

        // Restore focus
        if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
            this.previousFocus.focus();
        }
        this.previousFocus = null;
    },

    // Trap focus inside element for accessibility
    trapFocus(element) {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = element.querySelectorAll(focusableSelectors);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first focusable element (close button)
        firstElement.focus();

        // Remove any existing trap handler to prevent duplicates
        if (this._trapHandler) {
            element.removeEventListener('keydown', this._trapHandler);
        }

        // Create and store trap handler
        this._trapHandler = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift+Tab: if on first, go to last
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: if on last, go to first
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        element.addEventListener('keydown', this._trapHandler);
    },

    // Check if content panel is open
    isPanelOpen() {
        return this.panelOpen;
    },

    // Get building info for location display
    getBuildingInfo(buildingId) {
        return World.buildings[buildingId] || null;
    },

    // Record a building visit, return true if first visit
    recordVisit(buildingId) {
        const isFirstVisit = !this.visitedBuildings[buildingId];
        this.visitedBuildings[buildingId] = true;
        return isFirstVisit;
    },

    // Check if building was visited
    hasVisited(buildingId) {
        return !!this.visitedBuildings[buildingId];
    },

    // Get welcome message for a building (context-aware)
    getWelcomeMessage(buildingId, isFirstVisit = true) {
        const building = World.buildings[buildingId];
        const name = building?.name || 'this building';

        const firstVisitMessages = {
            playerHouse: "Welcome home! This is your house. Look around to learn about Sam's background, education, and interests.",
            playerHouse2F: "Your bedroom and study area. Check the desk and bookshelves for more about Sam's academic journey.",
            rivalHouse: "Welcome to your rival's house! They've got quite the media setup. Browse around to find talks and media appearances.",
            oakLab: "Welcome to Professor Oak's Laboratory! This is where the research happens. Explore to discover publications and ongoing projects."
        };

        const returnVisitMessages = {
            playerHouse: "Welcome back home! Feel free to look around.",
            playerHouse2F: "Back in your room. Your research notes are on the desk.",
            rivalHouse: "Back at your rival's place. Any new episodes on TV?",
            oakLab: "Welcome back to the lab! The research never stops."
        };

        if (isFirstVisit) {
            return firstVisitMessages[buildingId] || `Welcome to ${name}!`;
        } else {
            return returnVisitMessages[buildingId] || `Welcome back to ${name}!`;
        }
    },

    // Format ISO date to "Month Year"
    formatDate(isoDate) {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    },

    // Format all publications for panel display
    formatPublicationsList() {
        const pubs = SITE_CONTENT.publications;
        return pubs.map(pub => `
            <div class="panel-item">
                <h4>${pub.title}</h4>
                <p class="authors">${pub.authors}</p>
                <p class="venue"><em>${pub.venue}</em> (${pub.year})</p>
                ${pub.links?.paper && pub.links.paper !== '#' ? `<a href="${pub.links.paper}" target="_blank" rel="noopener" class="panel-link">View Paper</a>` : ''}
                ${pub.links?.code && pub.links.code !== '#' ? `<a href="${pub.links.code}" target="_blank" rel="noopener" class="panel-link">View Code</a>` : ''}
            </div>
        `).join('');
    },

    // Format all talks for panel display
    formatTalksList() {
        const talks = SITE_CONTENT.talks;
        return talks.map(talk => {
            const date = this.formatDate(talk.date);
            return `
                <div class="panel-item">
                    <h4>${talk.title}</h4>
                    <p class="venue">${talk.venue}</p>
                    <p class="date">${date}</p>
                    ${talk.video ? `<a href="${talk.video}" target="_blank" rel="noopener" class="panel-link">Watch Video</a>` : ''}
                    ${talk.slides ? `<a href="${talk.slides}" target="_blank" rel="noopener" class="panel-link">View Slides</a>` : ''}
                </div>
            `;
        }).join('');
    },

    // Format all media appearances for panel display
    formatMediaList() {
        const media = SITE_CONTENT.media;
        return media.map(item => `
            <div class="panel-item">
                <h4>${item.title}</h4>
                <p class="type-badge">${item.type.toUpperCase()}</p>
                <p class="venue">${item.venue}</p>
                <p class="description">${item.description}</p>
                <p class="date">${item.date}</p>
                ${item.link && item.link !== '#' ? `<a href="${item.link}" target="_blank" rel="noopener" class="panel-link">View</a>` : ''}
            </div>
        `).join('');
    },

    // Format all research projects for panel display
    formatResearchList() {
        const research = SITE_CONTENT.research;
        return research.map(item => `
            <div class="panel-item">
                <h4>${item.title}</h4>
                <p class="description">${item.description}</p>
                <p class="tags">${item.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</p>
            </div>
        `).join('');
    },

    // Show publications panel
    showPublicationsPanel() {
        const content = this.formatPublicationsList();
        this.showContentPanel('Publications', content);
    },

    // Show talks panel
    showTalksPanel() {
        const content = this.formatTalksList();
        this.showContentPanel('Invited Talks', content);
    },

    // Show media panel
    showMediaPanel() {
        const content = this.formatMediaList();
        this.showContentPanel('Media & Appearances', content);
    },

    // Show research panel
    showResearchPanel() {
        const content = this.formatResearchList();
        this.showContentPanel('Research Projects', content);
    }
};

// Export
window.Buildings = Buildings;
