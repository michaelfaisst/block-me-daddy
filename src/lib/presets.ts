/**
 * Represents a category of preset sites for quick blocking
 */
export interface PresetCategory {
    id: string;
    name: string;
    sites: string[];
}

/**
 * Predefined categories of commonly blocked websites
 * Users can quickly add these sites instead of typing them manually
 */
export const PRESET_CATEGORIES: PresetCategory[] = [
    {
        id: "social-media",
        name: "Social Media",
        sites: [
            "facebook.com",
            "instagram.com",
            "twitter.com",
            "x.com",
            "tiktok.com",
            "reddit.com",
            "snapchat.com",
            "linkedin.com",
            "pinterest.com",
            "tumblr.com",
            "whatsapp.com",
            "threads.net",
            "mastodon.social"
        ]
    },
    {
        id: "video-streaming",
        name: "Video Streaming",
        sites: [
            "youtube.com",
            "twitch.tv",
            "netflix.com",
            "hulu.com",
            "disneyplus.com",
            "primevideo.com",
            "hbomax.com",
            "vimeo.com",
            "dailymotion.com",
            "crunchyroll.com"
        ]
    },
    {
        id: "news",
        name: "News & Media",
        sites: [
            "cnn.com",
            "bbc.com",
            "nytimes.com",
            "theguardian.com",
            "washingtonpost.com",
            "foxnews.com",
            "reuters.com",
            "bloomberg.com",
            "buzzfeed.com",
            "vice.com",
            "huffpost.com"
        ]
    },
    {
        id: "gaming",
        name: "Gaming",
        sites: [
            "steam.com",
            "epicgames.com",
            "twitch.tv",
            "roblox.com",
            "minecraft.net",
            "leagueoflegends.com",
            "fortnite.com",
            "ea.com",
            "playstation.com",
            "xbox.com",
            "ign.com",
            "gamespot.com"
        ]
    },
    {
        id: "shopping",
        name: "Shopping",
        sites: [
            "amazon.com",
            "ebay.com",
            "etsy.com",
            "walmart.com",
            "target.com",
            "aliexpress.com",
            "wish.com",
            "bestbuy.com",
            "zappos.com",
            "asos.com"
        ]
    },
    {
        id: "entertainment",
        name: "Entertainment",
        sites: [
            "spotify.com",
            "soundcloud.com",
            "9gag.com",
            "imgur.com",
            "giphy.com",
            "tenor.com",
            "memes.com",
            "funnyjunk.com",
            "cheezburger.com"
        ]
    }
];
