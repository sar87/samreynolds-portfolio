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

    // Interaction prompt
    promptVisible: false,
    promptElement: null,

    // Action cooldown to prevent double-triggers
    actionCooldown: false,

    // Initialize
    init() {
        this.dialogBox = document.getElementById('dialog-box');
        this.dialogTitle = document.getElementById('dialog-title');
        this.dialogText = document.getElementById('dialog-text');

        // Create interaction prompt
        this.createPrompt();

        // Dialog click/tap to advance
        this.dialogBox.addEventListener('click', () => this.advanceDialog());
        this.dialogBox.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.advanceDialog();
        });
    },

    // Create the interaction prompt element
    createPrompt() {
        this.promptElement = document.createElement('div');
        this.promptElement.className = 'interaction-prompt';
        this.promptElement.style.display = 'none';
        document.getElementById('game-mode').appendChild(this.promptElement);
    },

    // Show/hide interaction prompt
    updatePrompt(interaction, isMobile) {
        if (interaction && !this.dialogOpen) {
            let promptText = '';

            switch (interaction.type) {
                case 'entrance':
                case 'door':
                    promptText = isMobile ? 'Tap A to enter' : 'Press ENTER to enter';
                    break;
                case 'sign':
                    promptText = isMobile ? 'Tap A to read' : 'Press ENTER to read';
                    break;
                case 'exit':
                    promptText = isMobile ? 'Tap A to exit' : 'Press ENTER to exit';
                    break;
                case 'object':
                case 'publication':
                case 'media':
                case 'research':
                case 'talk':
                case 'talks':
                    promptText = isMobile ? 'Tap A to examine' : 'Press ENTER to examine';
                    break;
            }

            if (promptText) {
                this.promptElement.textContent = promptText;
                this.promptElement.style.display = 'block';
                this.promptVisible = true;
            } else {
                this.hidePrompt();
            }
        } else {
            this.hidePrompt();
        }
    },

    hidePrompt() {
        this.promptElement.style.display = 'none';
        this.promptVisible = false;
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

    // Check if dialog is open
    isDialogOpen() {
        return this.dialogOpen;
    },

    // Handle action key in dialog
    handleDialogAction() {
        if (this.dialogOpen) {
            this.advanceDialog();
            return true;
        }
        return false;
    },

    // Get building info for location display
    getBuildingInfo(buildingId) {
        return World.buildings[buildingId] || null;
    },

    // Get welcome message for a building
    getWelcomeMessage(buildingId) {
        const messages = {
            pembroke: "Welcome to Pembroke College! This is Sam's office. Look around to learn about Sam's background and research interests.",
            library: "Welcome to the University Library! Browse the extensive shelves to discover publications and research papers.",
            lab: "Welcome to the Research Lab! Examine the equipment to learn about current conservation AI projects.",
            station: "Welcome to the TV Station! Explore to find podcasts, interviews, and media appearances.",
            theatre: "Welcome to the Lecture Theatre! Check out recordings of talks and presentations."
        };
        return messages[buildingId] || "Welcome!";
    }
};

// Export
window.Buildings = Buildings;
