/*
  ALL SITE CONTENT LIVES IN THIS FILE.
  To add a project: copy one block inside "projects", change the fields, add images to img/<slug>/.
  The guide is in README.md (Ukrainian).
*/
window.SITE = {
  name: "Bohdan Semchyshyn",
  role: "Video editor & colorist",
  available: true,

  contacts: {
    email: "bogdansem19@gmail.com",
    upwork: "https://www.upwork.com/freelancers/~01e246fc8834e12b64",
    linkedin: "https://www.linkedin.com/in/bohdan-semchyshyn",
    instagram: "https://www.instagram.com/semchyshyn_b"
  },

  showreel: {
    vimeo: "1219844988",
    cover: "img/showreel/cover.jpg",
    length: "0:30"
  },

  clients: ["Carlotti Paris", "Sanctum Digital", "Little Red Door", "Scott Marshall Injury Attorneys", "Evidence Strong Show", "UON.EARTH", "Nightlife Card", "CleverBiz AI", "Innerspace"],

  // Upwork reviews, quoted word for word
  reviews: [
    { text: "Bohdan is a highly skilled colorist who elevated our footage beyond expectations, turning so-so visuals into a stunning cinematic experience. We’ll definitely work with him again and highly recommend him.", job: "Creative Video Editor for Dynamic Multi-Platform Content", year: "2024–2025", featured: true },
    { text: "Bohdan is the best! Deff going to work with him more in the future. He is quick, gets the feedback and above all super talented!", job: "2 videos", year: "2025" },
    { text: "Bohdan is an expert in color grading. Quick, efficient, does quality work!", job: "Color Grade, Attorney Brand Video", year: "2025" },
    { text: "The editing job was done timely and according to my request. Great communication along the way. Highly recommend.", job: "Video editor in DaVinci Resolve", year: "2023" },
    { text: "Very nice to work with Bohdan! He has done an amazing job with really great cooperation!", job: "Color grade, 26-minute documentary", year: "2023" },
    { text: "Absolutely phenomenal work! Super skilled and responsive. A true professional. Thank you again.", job: "Color Grading Old Video", year: "2022" },
    { text: "Excellent colorist and communication to return files rapidly.", job: "Video colorist with DaVinci Resolve", year: "2022" }
  ],

  categories: ["Commercials", "Brand Stories", "Documentary", "YouTube & Podcasts", "Reels"],

  // Order of projects on the site. Change it in the admin panel (admin/) or by hand.
  // Projects missing from this list go to the end.
  order: ["carlotti-paris", "scott-marshall", "innerspace", "lrd-new-york", "vocations", "uon-earth", "sanctum-promo", "evidence-strong", "nightlife-card", "cleverbiz-the-build", "jack-the-grower", "youtube-leo", "lrd-interviews", "youtube-business-fr"],

  /*
    Project fields:
      slug        – folder name in img/ and the page address (project.html?p=slug)
      title, subtitle, client, category (one of the categories above)
      role, format, length
      vimeo       – Vimeo video number (the digits at the end of the link)
      vertical    – true if the main video is 9:16
      brief, did  – the two text blocks; leave "" to hide a block
      versions    – more videos: { vimeo, title, cover } (cover is optional, Vimeo's preview is used if empty)
      frames      – still frames from img/<slug>/
      quote       – a client review for this project (optional)
  */
  projects: [
    {
      slug: "carlotti-paris",
      title: "Carlotti Paris",
      subtitle: "Eyewear fashion film",
      client: "Carlotti Paris",
      category: "Commercials",
      role: "Color",
      format: "16:9",
      length: "0:56",
      vimeo: "907047609",
      vertical: false,
      brief: "A fashion film for an eyewear brand: a model among bas-reliefs and colonnades.",
      did: "",
      frames: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"]
    },
    {
      slug: "scott-marshall",
      title: "Helping People",
      subtitle: "Brand film for a law firm",
      client: "Scott Marshall Injury Attorneys",
      category: "Brand Stories",
      role: "Color",
      format: "16:9",
      length: "2:47",
      vimeo: "1081155841",
      vertical: false,
      brief: "A brand film for a Florida injury law firm, shot in difficult lighting conditions.",
      did: "I graded the whole film into one consistent look and fixed the problem areas shot by shot.",
      frames: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"],
      quote: { text: "Bohdan is an expert in color grading. Quick, efficient, does quality work!", source: "Upwork review, 2025" }
    },
    {
      slug: "innerspace",
      title: "Innerspace",
      subtitle: "Fashion and beauty ad",
      client: "Innerspace",
      category: "Commercials",
      role: "Color grading, beauty retouch",
      format: "9:16",
      length: "0:11",
      vimeo: "1220156285",
      vertical: true,
      brief: "A short fashion film on a clean high-key set.",
      did: "Graded in DaVinci Resolve with careful control of highlights and skin tone, then retouched frame by frame (skin, even tone, makeup, blemishes) for an editorial finish.",
      frames: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"]
    },
    {
      slug: "lrd-new-york",
      title: "Little Red Door brand trips",
      subtitle: "New York, Washington D.C., Mexico City",
      client: "Little Red Door",
      category: "Brand Stories",
      role: "Edit, color, graphics",
      format: "Three 9:16 films",
      length: "0:39–0:56",
      vimeo: "865902959",
      vertical: true,
      brief: "A series about the bar team's trips: local farms, markets, bars and cocktails.",
      did: "Editing, precise color, smooth transitions and graphics.",
      versions: [
        { vimeo: "865903832", title: "Washington, D.C.", cover: "img/lrd-washington/cover.jpg" },
        { vimeo: "861541218", title: "Mexico City", cover: "img/lrd-mexico-city/cover.jpg" }
      ],
      frames: ["01.jpg", "02.jpg", "03.jpg", "../lrd-washington/01.jpg", "../lrd-washington/02.jpg", "../lrd-mexico-city/01.jpg"]
    },
    {
      slug: "vocations",
      title: "Vocations: un monde d’artisanes",
      subtitle: "Documentary trailer",
      client: "Rémi Girardot, director",
      category: "Documentary",
      role: "Color",
      format: "16:9",
      length: "1:39",
      vimeo: "1101529988",
      vertical: false,
      brief: "Trailer for a documentary about women in construction and craft trades.",
      did: "I graded the documentary. The footage came with many technical problems, and I solved them to reach a clean, consistent result.",
      frames: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"]
    },
    {
      slug: "uon-earth",
      title: "UON.EARTH",
      subtitle: "Short-form brand video",
      client: "UON.EARTH",
      category: "Commercials",
      role: "Edit and color",
      format: "9:16",
      length: "0:59",
      vimeo: "1220153282",
      vertical: true,
      brief: "Short videos for a brand that protects the planet square metre by square metre: anyone can protect a real m² of nature from €1.20.",
      did: "Edited and graded for social: a clean, natural, earthy look that stays warm and on-brand but bright enough to stop the scroll.",
      frames: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"]
    },
    {
      slug: "sanctum-promo",
      title: "Sanctum Digital",
      subtitle: "App promo videos",
      client: "Sanctum Digital",
      category: "Commercials",
      role: "Video editing",
      format: "9:16",
      length: "0:29",
      vimeo: "1220155090",
      vertical: true,
      brief: "Promo for a wellness app built around movement, breathwork and music, with a two-week free trial offer.",
      did: "Edited for social: tight pacing, clean transitions and app screen mockups that show the product in action and drive downloads.",
      versions: [
        { vimeo: "1240734573", title: "App ad, 5 to 45 minutes", cover: "img/sanctum-app-ad/cover.jpg" },
        { vimeo: "1164921024", title: "Launch and waitlist ad", cover: "img/sanctum-launch/cover.jpg" }
      ],
      frames: ["01.jpg", "02.jpg", "03.jpg"]
    },
    {
      slug: "evidence-strong",
      title: "Evidence Strong Show",
      subtitle: "Podcast episode and Instagram shorts",
      client: "Evidence Strong Show",
      category: "YouTube & Podcasts",
      role: "Edit, color, subtitles, design",
      format: "16:9 episode, 9:16 shorts",
      length: "",
      vimeo: "920090813",
      vertical: false,
      brief: "A podcast about evidence-based training. Every interview becomes a full YouTube episode and a set of shorts for Instagram.",
      did: "I edit and switch cameras on the interview, grade it, and cut shorts with captions and on-brand design.",
      versions: [
        { vimeo: "920089469", title: "Instagram shorts", cover: "img/evidence-strong-reels/cover.jpg" }
      ],
      frames: ["01.jpg", "02.jpg"]
    },
    {
      slug: "nightlife-card",
      title: "Nightlife Card",
      subtitle: "A night out in London",
      client: "Nightlife Card",
      category: "Commercials",
      role: "Edit, color",
      format: "9:16",
      length: "0:41",
      vimeo: "1057048502",
      vertical: true,
      brief: "An ad for the Nightlife Card app: a night out in London for a fraction of the price, from pizza and mini golf to cocktails and a club.",
      did: "",
      frames: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"]
    },
    {
      slug: "cleverbiz-the-build",
      title: "The Build, EP.001",
      subtitle: "Founder story series",
      client: "CleverBiz AI",
      category: "Reels",
      role: "Edit, color",
      format: "9:16",
      length: "0:48",
      vimeo: "1240733411",
      vertical: true,
      brief: "The first episode of “The Build”: a founder's story from Thailand to Dubai, made for Instagram and TikTok.",
      did: "Edit, color and titles, refined over several rounds of client feedback.",
      frames: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"]
    },
    {
      slug: "jack-the-grower",
      title: "Jack the Grower",
      subtitle: "Flower bulb shop ad",
      client: "Jack the Grower",
      category: "Commercials",
      role: "Edit, motion text, color",
      format: "9:16",
      length: "0:30",
      vimeo: "1164921534",
      vertical: true,
      brief: "An ad for an online shop selling dahlia bulbs, with a promo code for the first order.",
      did: "A fast-paced edit with kinetic typography over live footage of the flowers.",
      versions: [
        { vimeo: "1094404206", title: "Second ad", cover: "" }
      ],
      frames: ["01.jpg", "02.jpg"]
    },
    {
      slug: "youtube-leo",
      title: "YouTube video for Leo",
      subtitle: "Talking-head video and shorts",
      client: "Leo",
      category: "YouTube & Podcasts",
      role: "Edit",
      format: "16:9 and 9:16",
      length: "0:27",
      vimeo: "920084014",
      vertical: false,
      brief: "A studio talking-head video with icons and graphic inserts, plus short vertical cuts.",
      did: "",
      versions: [
        { vimeo: "920082905", title: "Short-form version", cover: "" }
      ],
      frames: ["01.jpg", "02.jpg", "03.jpg"]
    },
    {
      slug: "lrd-interviews",
      title: "Little Red Door interviews",
      subtitle: "Four questions with bar owners",
      client: "Little Red Door",
      category: "Reels",
      role: "Edit, color",
      format: "9:16",
      length: "1:12 and 1:29",
      vimeo: "861545390",
      vertical: true,
      brief: "Interview reels with bar owners in a four-question format: Nicolas Torres of True Laurel and Matt Wiley of RE.",
      did: "",
      versions: [
        { vimeo: "861542333", title: "Matt Wiley, RE.", cover: "" }
      ],
      frames: []
    },
    {
      slug: "youtube-business-fr",
      title: "Scaling a business",
      subtitle: "French YouTube video",
      client: "YouTube channel",
      category: "YouTube & Podcasts",
      role: "Edit",
      format: "16:9",
      length: "0:21",
      vimeo: "1061356653",
      vertical: false,
      brief: "A French-language YouTube video about scaling a business, with animated graphics.",
      did: "",
      frames: ["01.jpg", "02.jpg"]
    }
  ]
};
