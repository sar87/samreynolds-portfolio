// Content data for Sam Reynolds' academic website
// Using .js extension for direct script loading (no CORS issues on file://)

const SITE_CONTENT = {
    about: {
        name: "Sam Reynolds",
        title: "AI, Conservation & Ecology Researcher",
        affiliation: "University of Cambridge",
        email: "sam@samreynolds.org",
        bio: [
            "I'm a researcher at the University of Cambridge working at the intersection of artificial intelligence and conservation biology. My work focuses on developing machine learning tools to address pressing ecological challenges, from species monitoring to habitat preservation.",
            "I believe that thoughtful application of AI can transform how we understand and protect the natural world. My research combines computer vision, acoustic monitoring, and predictive modeling to give conservationists better tools for their vital work.",
            "When I'm not training models or writing papers, you'll find me birdwatching in the Fens, cycling around Cambridge, or attempting to grow vegetables in my college garden."
        ],
        links: {
            github: "https://github.com/samreynolds",
            scholar: "https://scholar.google.com",
            twitter: "https://twitter.com/samreynolds"
        }
    },

    research: [
        {
            id: "species-monitoring",
            title: "AI-Powered Species Monitoring",
            description: "Developing computer vision systems that can automatically identify and track wildlife from camera trap images and drone footage. Our models can distinguish between hundreds of species with high accuracy, enabling conservationists to monitor populations at unprecedented scales.",
            tags: ["Computer Vision", "Wildlife", "Camera Traps"],
            icon: "camera"
        },
        {
            id: "acoustic-ecology",
            title: "Acoustic Ecology & Biodiversity",
            description: "Using machine learning to analyze soundscapes and detect species from audio recordings. This non-invasive approach allows continuous monitoring of ecosystems, from rainforests to coral reefs, helping track biodiversity changes over time.",
            tags: ["Bioacoustics", "Deep Learning", "Soundscapes"],
            icon: "sound"
        },
        {
            id: "habitat-prediction",
            title: "Predictive Habitat Modeling",
            description: "Building models that predict how species distributions will shift under climate change scenarios. This work helps conservation planners identify critical habitats and wildlife corridors that will be essential for species survival.",
            tags: ["Climate Change", "Species Distribution", "GIS"],
            icon: "map"
        },
        {
            id: "conservation-ai",
            title: "Conservation Decision Support",
            description: "Creating AI tools that help conservation managers make better decisions about resource allocation, protected area design, and intervention strategies. Combining optimization algorithms with ecological knowledge.",
            tags: ["Decision Science", "Optimization", "Policy"],
            icon: "brain"
        }
    ],

    publications: [
        {
            title: "Deep Learning for Automated Wildlife Monitoring: A Comprehensive Review",
            authors: "Reynolds, S., Chen, L., & Thompson, R.",
            venue: "Nature Communications",
            year: 2024,
            type: "journal",
            links: {
                paper: "#",
                code: "https://github.com/samreynolds/wildlife-dl-review"
            }
        },
        {
            title: "BirdNet-UK: Transfer Learning for British Bird Species Recognition",
            authors: "Reynolds, S. & Davies, M.",
            venue: "Proceedings of ICML",
            year: 2024,
            type: "conference",
            links: {
                paper: "#",
                code: "#"
            }
        },
        {
            title: "Acoustic Indices Meet Deep Learning: Hybrid Approaches for Biodiversity Assessment",
            authors: "Reynolds, S., Patel, A., & Morrison, K.",
            venue: "Methods in Ecology and Evolution",
            year: 2023,
            type: "journal",
            links: {
                paper: "#"
            }
        },
        {
            title: "Camera Trap Image Quality Assessment Using Convolutional Neural Networks",
            authors: "Chen, L., Reynolds, S., & Williams, J.",
            venue: "Remote Sensing of Environment",
            year: 2023,
            type: "journal",
            links: {
                paper: "#"
            }
        },
        {
            title: "Predicting Pollinator Decline: A Machine Learning Approach",
            authors: "Reynolds, S., Thompson, R., & Baker, E.",
            venue: "Conservation Biology",
            year: 2022,
            type: "journal",
            links: {
                paper: "#"
            }
        },
        {
            title: "Real-time Species Detection on Edge Devices for Conservation",
            authors: "Reynolds, S. & Kumar, P.",
            venue: "NeurIPS Workshop on AI for Conservation",
            year: 2022,
            type: "workshop",
            links: {
                paper: "#",
                code: "#"
            }
        }
    ],

    media: [
        {
            title: "AI and the Future of Conservation",
            type: "talk",
            venue: "Cambridge Science Festival",
            date: "March 2024",
            description: "Public lecture on how machine learning is transforming wildlife conservation, from automated species identification to predicting biodiversity loss.",
            link: "#"
        },
        {
            title: "The Sound of Biodiversity",
            type: "podcast",
            venue: "BBC Inside Science",
            date: "January 2024",
            description: "Interview discussing our work on acoustic monitoring and how AI can help us listen to ecosystems at scale.",
            link: "#"
        },
        {
            title: "Tech for Nature: Machine Learning in Conservation",
            type: "talk",
            venue: "TEDxCambridge",
            date: "November 2023",
            description: "A 15-minute talk exploring the promise and challenges of applying AI to conservation problems.",
            link: "#"
        },
        {
            title: "Wildlife Monitoring with AI",
            type: "interview",
            venue: "The Guardian",
            date: "September 2023",
            description: "Feature article about our camera trap AI system being deployed in national parks across the UK.",
            link: "#"
        },
        {
            title: "Conservation in the Age of AI",
            type: "panel",
            venue: "Royal Society",
            date: "June 2023",
            description: "Panel discussion with leading conservation scientists and AI researchers on ethical considerations and future directions.",
            link: "#"
        }
    ],

    // Game-specific content for interior interactions
    gameContent: {
        office: {
            desk: "Sam's desk is covered with papers about neural networks and bird migration patterns. A half-finished cup of tea sits next to the keyboard.",
            bookshelf: "The bookshelf contains ecology textbooks, machine learning papers, and a well-worn copy of 'Silent Spring'.",
            window: "The window looks out over the college courtyard. You can see students cycling past.",
            computer: "The screen shows a terminal running a species classification model. Accuracy: 94.7%",
            plant: "A small potted fern named 'Ferndinand'. It's survived three office moves."
        },
        library: {
            entrance: "Welcome to the Library! Browse the shelves to discover publications and research papers.",
            shelf1: "Journal Articles section - peer-reviewed research on AI and conservation.",
            shelf2: "Conference Papers section - presentations from top ML venues.",
            readingDesk: "A quiet spot to read. Recent papers are stacked neatly."
        },
        lectureHall: {
            entrance: "Welcome to the Lecture Hall! Explore to find talks, podcasts, and media appearances.",
            podium: "The podium has notes for an upcoming talk about acoustic ecology.",
            screen: "The projector screen shows slides from the TEDx talk.",
            seats: "Rows of seats where students gather to learn about AI and conservation."
        },
        lab: {
            entrance: "Welcome to the Research Lab! Discover ongoing research projects and experiments.",
            workbench: "Camera traps and acoustic sensors are being calibrated for field deployment.",
            servers: "GPU servers humming away, training the latest species recognition models.",
            whiteboard: "The whiteboard is covered with diagrams of neural network architectures and ecosystem maps."
        }
    }
};

// Make content globally available
window.SITE_CONTENT = SITE_CONTENT;
