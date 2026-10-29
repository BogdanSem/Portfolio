/*
  All site content lives here. The easiest way to change it is the admin panel: <site>/admin/
  You can also edit this file by hand; keep the commas and quotes.

  Project fields:
    slug      – folder name in img/ and the page address (latin letters, digits, dashes)
    title, subtitle, client, category, role, format, length
    vimeo     – the digits from the Vimeo link
    vertical  – true for 9:16 videos: they go to the Social carousel instead of the Work grid
    parent    – slug of the main project this video belongs to (optional)
    brief, did – texts for "The brief" and "What I did" (empty hides the block)
    frames    – file names of stills in img/<slug>/
    quote     – optional { text, source }
  order: the order of projects on the site.
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
  showreel: { vimeo: "1219844988", cover: "img/showreel/cover-mvtn5dj6.jpg", length: "0:30" },
  clients: ["Carlotti Paris", "Sanctum Digital", "Little Red Door", "Scott Marshall Injury Attorneys", "Evidence Strong Show", "UON.EARTH", "Nightlife Card", "CleverBiz AI", "Innerspace"],
  reviews: [
    {
      text: "Bohdan is a highly skilled colorist who elevated our footage beyond expectations, turning so-so visuals into a stunning cinematic experience. We’ll definitely work with him again and highly recommend him.",
      job: "Creative Video Editor for Dynamic Multi-Platform Content",
      year: "2024–2025",
      featured: true
    },
    {
      text: "Bohdan is the best! Deff going to work with him more in the future. He is quick, gets the feedback and above all super talented!",
      job: "2 videos",
      year: "2025"
    },
    {
      text: "Bohdan is an expert in color grading. Quick, efficient, does quality work!",
      job: "Color Grade, Attorney Brand Video",
      year: "2025"
    },
    {
      text: "The editing job was done timely and according to my request. Great communication along the way. Highly recommend.",
      job: "Video editor in DaVinci Resolve",
      year: "2023"
    },
    {
      text: "Very nice to work with Bohdan! He has done an amazing job with really great cooperation!",
      job: "Color grade, 26-minute documentary",
      year: "2023"
    },
    {
      text: "Absolutely phenomenal work! Super skilled and responsive. A true professional. Thank you again.",
      job: "Color Grading Old Video",
      year: "2022"
    },
    {
      text: "Excellent colorist and communication to return files rapidly.",
      job: "Video colorist with DaVinci Resolve",
      year: "2022"
    }
  ],
  categories: ["Commercials", "Brand Stories", "Documentary", "YouTube & Podcasts", "Reels"],
  order: ["carlotti-paris", "scott-marshall", "vocations", "evidence-strong", "youtube-leo", "youtube-business-fr", "evidence-strong-reels", "innerspace", "cleverbiz-the-build", "sanctum-app-ad", "jack-the-grower", "lrd-new-york", "lrd-washington", "lrd-mexico-city", "uon-earth", "sanctum-promo", "sanctum-launch", "nightlife-card", "lrd-interviews"],
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
      frames: ["01.jpg", "02.jpg", "fmvtkgwh8.jpg", "04.jpg", "fmvtkhjkp.jpg", "fmvtkhdwu.jpg"]
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
      frames: ["fmvtkihbj.jpg", "fmvtkijby.jpg", "fmvtkin46.jpg", "fmvtkiq6e.jpg", "fmvtkj9hf.jpg", "fmvtkj4tu.jpg"],
      quote: {
        text: "Bohdan is an expert in color grading. Quick, efficient, does quality work!",
        source: "Upwork review, 2025"
      }
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
      frames: ["fmvtknzka.jpg", "fmvtko1hf.jpg", "fmvtko3wv.jpg", "fmvtko5ne.jpg"]
    },
    {
      slug: "lrd-new-york",
      title: "Little Red Door",
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
      frames: ["fmvtkp0wx.jpg", "fmvtkpa3n.jpg", "fmvtkpcfs.jpg", "fmvtkpeul.jpg", "fmvtkphao.jpg", "fmvtkpjtk.jpg", "fmvtkppty.jpg", "fmvtkptnv.jpg"],
      parent: "lrd-interviews"
    },
    {
      slug: "lrd-washington",
      title: "Little Red Door",
      subtitle: "Washington, D.C.",
      client: "Little Red Door",
      category: "Brand Stories",
      role: "Edit, color, graphics",
      format: "9:16",
      length: "",
      vimeo: "865903832",
      vertical: true,
      parent: "lrd-interviews",
      brief: "A series about the bar team's trips: local farms, markets, bars and cocktails.",
      did: "Editing, precise color, smooth transitions and graphics.",
      frames: ["fmvtm3qjd0.jpg", "fmvtm3sni1.jpg", "fmvtm3y9m2.jpg", "fmvtm40973.jpg", "fmvtm42ff4.jpg", "fmvtm44ra5.jpg", "fmvtm46ck6.jpg", "fmvtm4bwh7.jpg"]
    },
    {
      slug: "lrd-mexico-city",
      title: "Little Red Door",
      subtitle: "Mexico City",
      client: "Little Red Door",
      category: "Brand Stories",
      role: "Edit, color, graphics",
      format: "9:16",
      length: "",
      vimeo: "861541218",
      vertical: true,
      parent: "lrd-interviews",
      brief: "A series about the bar team's trips: local farms, markets, bars and cocktails.",
      did: "Editing, precise color, smooth transitions and graphics.",
      frames: ["fmvtmbtk58.jpg", "fmvtmbwt99.jpg", "fmvtmby330.jpg", "fmvtmc08s1.jpg", "fmvtmc6kq3.jpg", "fmvtmc8rv4.jpg", "fmvtmce355.jpg", "fmvtmcgvl6.jpg"]
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
      frames: ["fmvtkjvo2.jpg", "fmvtkjy6c.jpg", "fmvtkk20w.jpg", "fmvtkk6ch.jpg", "fmvtkke36.jpg", "fmvtkkhg9.jpg"]
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
      frames: ["fmvtkqhrg.jpg", "fmvtkqjff.jpg", "fmvtkqokv.jpg", "fmvtkqtzs.jpg"]
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
      frames: ["fmvtkrqys.jpg", "fmvtkrt9k.jpg", "fmvtkrxxf.jpg", "fmvtks2yv.jpg"]
    },
    {
      slug: "sanctum-app-ad",
      title: "Sanctum Digital App AD",
      subtitle: "",
      client: "Sanctum Digital",
      category: "Commercials",
      role: "Video editing",
      format: "9:16",
      length: "",
      vimeo: "1240734573",
      vertical: true,
      parent: "sanctum-promo",
      brief: "Promo for a wellness app built around movement, breathwork and music, with a two-week free trial offer.",
      did: "Edited for social: tight pacing, clean transitions and app screen mockups that show the product in action and drive downloads.",
      frames: ["fmvtmda1q7.jpg", "fmvtmdbq28.jpg", "fmvtmddes9.jpg"]
    },
    {
      slug: "sanctum-launch",
      title: "Launch and waitlist ad",
      subtitle: "",
      client: "Sanctum Digital",
      category: "Commercials",
      role: "Video editing",
      format: "9:16",
      length: "",
      vimeo: "1164921024",
      vertical: true,
      parent: "sanctum-promo",
      brief: "Promo for a wellness app built around movement, breathwork and music, with a two-week free trial offer.",
      did: "Edited for social: tight pacing, clean transitions and app screen mockups that show the product in action and drive downloads.",
      frames: ["fmvtmimiw0.jpg", "fmvtmipb01.jpg", "fmvtmir5d2.jpg", "fmvtmisuw3.jpg", "fmvtmiv3q4.jpg", "fmvtmixbo5.jpg"]
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
      frames: ["01.jpg", "02.jpg", "fmvtkkvll.jpg"]
    },
    {
      slug: "evidence-strong-reels",
      title: "Evidence Strong Show Short",
      subtitle: "",
      client: "Evidence Strong Show",
      category: "YouTube & Podcasts",
      role: "Edit, color, subtitles, design",
      format: "9:16",
      length: "",
      vimeo: "920089469",
      vertical: true,
      parent: "evidence-strong",
      brief: "A podcast about evidence-based training. Every interview becomes a full YouTube episode and a set of shorts for Instagram.",
      did: "I edit and switch cameras on the interview, grade it, and cut shorts with captions and on-brand design.",
      frames: []
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
      frames: ["fmvtkswom.jpg", "fmvtkt1q9.jpg", "fmvtkt9wu.jpg"]
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
      frames: ["fmvtku186.jpg", "fmvtku628.jpg", "fmvtku85j.jpg", "fmvtkuapf.jpg", "fmvtkuep0.jpg", "fmvtkujuq.jpg", "fmvtkusi4.jpg", "fmvtkupn3.jpg"]
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
      frames: ["fmvtkv9i5.jpg", "fmvtkvlj9.jpg", "fmvtkvgek.jpg", "fmvtkvop5.jpg", "fmvtkvqby.jpg", "fmvtkvtt2.jpg", "fmvtkvwer.jpg"]
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
      frames: ["fmvtklnis.jpg", "fmvtklq6b.jpg", "fmvtkluaa.jpg", "fmvtklwu4.jpg", "fmvtklynr.jpg", "fmvtkm4df.jpg"]
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
      frames: ["fmvtkwa7o.jpg", "fmvtkwod3.jpg", "fmvtkwix9.jpg"]
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
      frames: ["fmvtkmn75.jpg", "fmvtkmq3z.jpg", "fmvtkmrsz.jpg", "fmvtkmtqi.jpg", "fmvtkmwpc.jpg", "fmvtkn56k.jpg"]
    }
  ]
};
