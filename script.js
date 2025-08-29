// Set page title
document.title = "My Pretentious Love";

// Inject CSS styles
const style = document.createElement("style");
style.textContent = `
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #121212;
        color: white;
        text-align: center;
    }
    .header {
        display: flex;
        align-items: center;
        background: #1e1e1e;
        padding: 10px;
        border-bottom: 2px solid #333;
    }
    .header img {
        height: 50px;
        margin-right: 10px;
    }
    .header h1 {
        font-size: 1.5rem;
        margin: 0;
    }
    video {
        width: 100%;
        max-height: 500px;
        background: black;
    }
    .episodes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 5px;
        padding: 10px;
    }
    .episodes button {
        padding: 5px;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        background: #333;
        color: white;
        cursor: pointer;
    }
    .episodes button:hover {
        background: #555;
    }
`;
document.head.appendChild(style);

// Load HLS.js dynamically
const hlsScript = document.createElement("script");
hlsScript.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
document.head.appendChild(hlsScript);

hlsScript.onload = () => {
    const body = document.body;

    // Header
    const header = document.createElement("div");
    header.className = "header";

    const logo = document.createElement("img");
    logo.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1UhPG1TReum6ieg5QrVBdGhzsBhembOyZBA&s";

    const title = document.createElement("h1");
    title.textContent = "My Pretentious Love";

    header.appendChild(logo);
    header.appendChild(title);
    body.appendChild(header);

    // Video Player
    const video = document.createElement("video");
    video.id = "video";
    video.controls = true;
    body.appendChild(video);

    // Episodes container
    const episodesContainer = document.createElement("div");
    episodesContainer.className = "episodes";
    body.appendChild(episodesContainer);

    // Episode list
    const episodes = [];
    for (let i = 1; i <= 97; i++) {
        episodes.push({
            num: i,
            url: `https://cdn-aws9.spicychiliti.com/hls/20053/${i}/${i}_1080p.m3u8`
        });
    }

    // Function to load episodes
    function loadEpisode(url) {
        if (window.Hls && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
        }
    }

    // Function to show ads before playing
    function showAdThenPlay(url) {
        // Remove old ad script if it exists
        const oldAd = document.getElementById("ad-script");
        if (oldAd) oldAd.remove();

        // Create ad script
        const adScript = document.createElement("script");
        adScript.id = "ad-script";
        adScript.setAttribute("data-cfasync", "false");
        adScript.setAttribute("data-zone", "9791642");
        adScript.src = "https://groleegni.net/vignette.min.js";
        adScript.async = true;
        document.body.appendChild(adScript);

        // Delay video loading until ad runs
        setTimeout(() => {
            loadEpisode(url);
        }, 3000); // adjust delay as needed
    }

    // Create episode buttons
    episodes.forEach(ep => {
        const btn = document.createElement("button");
        btn.textContent = ep.num;

        btn.addEventListener("click", () => {
            showAdThenPlay(ep.url);
        });

        episodesContainer.appendChild(btn);
    });

    // Load the first episode by default
    if (episodes.length > 0) {
        loadEpisode(episodes[0].url);
    }
};
