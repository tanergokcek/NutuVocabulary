import os
import re

md_path = "nutuVocabulary.md"
with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Replace images and assets with HTML blocks
md_content = md_content.replace(
    "📸 Ekran Görüntüsü: domain olarak ekledim.",
    "<div class=\"premium-image-wrapper\"><img src=\"../domain.png\" class=\"zoomable-image\" alt=\"Domain Görseli\" /></div>"
)

md_content = md_content.replace(
    "[Basit bir sistem mimarisi çizimi ekleyin veya el çizimi fotoğrafı olabilir.]",
    "<div class=\"premium-image-wrapper\"><img src=\"../mimari.png\" class=\"zoomable-image\" alt=\"Mimari Diyagram\" /></div>"
)

story_html = """
<div class="instagram-stories-container">
    <div class="story-card"><img src="../stories/story1.png" /><div class="story-overlay"><span class="story-tag">01 - Teaser</span></div></div>
    <div class="story-card"><img src="../stories/story2.png" /><div class="story-overlay"><span class="story-tag">02 - Problem</span></div></div>
    <div class="story-card"><img src="../stories/story3.png" /><div class="story-overlay"><span class="story-tag">03 - Çözüm</span></div></div>
    <div class="story-card"><img src="../stories/story4.png" /><div class="story-overlay"><span class="story-tag">04 - Özellik 1</span></div></div>
    <div class="story-card"><img src="../stories/story5.png" /><div class="story-overlay"><span class="story-tag">05 - Özellik 2</span></div></div>
    <div class="story-card"><img src="../stories/story6.png" /><div class="story-overlay"><span class="story-tag">06 - Özellik 3</span></div></div>
    <div class="story-card"><img src="../stories/story7.png" /><div class="story-overlay"><span class="story-tag">07 - Karşılaştırma</span></div></div>
    <div class="story-card"><img src="../stories/story8.png" /><div class="story-overlay"><span class="story-tag">08 - Sosyal Kanıt</span></div></div>
    <div class="story-card"><img src="../stories/story9.png" /><div class="story-overlay"><span class="story-tag">09 - CTA</span></div></div>
    <div class="story-card"><img src="../stories/story10.png" /><div class="story-overlay"><span class="story-tag">10 - Lansman</span></div></div>
</div>
"""
md_content = md_content.replace("📁 Görseller: Story görselleri ayrı klasörde (/stories) teslim edilecektir.", story_html)

logo_html = """
<div class="brand-assets-grid">
    <div class="brand-card light-bg">
        <span class="brand-label text-black/50">Açık Tema</span>
        <img src="../logo/acik.png" />
    </div>
    <div class="brand-card dark-bg">
        <span class="brand-label text-white/50">Koyu Tema</span>
        <img src="../logo/koyu.png" />
    </div>
    <div class="brand-card glass-bg">
        <span class="brand-label text-white/70">Şeffaf (Liquid)</span>
        <img src="../logo/seffaf.png" />
    </div>
    <div class="brand-card dark-bg">
        <span class="brand-label text-white/50">Favicon</span>
        <img src="../logo/favicon.png" class="favicon-size" />
    </div>
</div>
"""
md_content = md_content.replace("📁 Logolar: Logo dosyaları ayrı klasörde (/logo) teslim edilecektir.", logo_html)

safe_md_content = md_content.replace("</script>", "<\\/script>")

html_template = """<!DOCTYPE html>
<html lang="tr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutuVocabulary \x14 Apple & 21st.dev Premium</title>
    
    <!-- Tailwind CSS (No custom config to avoid JS crash parsing issues) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:wght@300;400;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Icons and Markdown parsers -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

    <style>
        :root {
            --bg-color: #000000;
            --text-color: #f5f5f7;
            --accent-color: #8A2BE2;
            --accent-glow: rgba(138, 43, 226, 0.5);
            --glass-bg: rgba(20, 20, 22, 0.5);
            --glass-border: rgba(255, 255, 255, 0.08);
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        /* Ambient Glow Backgrounds */
        .ambient-glow {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 80vw;
            height: 60vh;
            background: radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 60%);
            filter: blur(100px);
            z-index: -2;
            pointer-events: none;
            opacity: 0.5;
        }

        /* Apple Glass Navigation */
        .nav-glass {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border-bottom: 1px solid var(--glass-border);
        }

        /* 21st.dev Liquid Glass Container */
        .liquid-container {
            position: relative;
            background: var(--glass-bg);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border-radius: 32px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
            padding: 4rem;
            margin: 4rem auto;
            max-width: 1000px;
        }

        .liquid-container::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 40%, rgba(138,43,226,0.4) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }

        @media (max-width: 768px) {
            .liquid-container { padding: 2rem; border-radius: 20px; }
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
            animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }

        /* Apple Gradient Text */
        .text-gradient {
            background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 50%, #8A2BE2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Markdown Styles */
        .md-prose {
            color: #a1a1aa;
            line-height: 1.7;
            font-size: 1.125rem;
        }

        .md-prose h1 {
            font-family: 'Inria Serif', serif;
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 700;
            text-align: center;
            letter-spacing: -0.04em;
            margin-bottom: 3rem;
            color: #fff;
            background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.6) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .md-prose h2 {
            font-size: 1.8rem;
            color: #ffffff;
            font-weight: 600;
            margin-top: 5rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .icon-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 14px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.05);
            flex-shrink: 0;
            transition: all 0.3s ease;
        }
        
        .md-prose h2:hover .icon-box {
            transform: scale(1.05) translateY(-2px);
            border-color: rgba(138,43,226,0.4);
            box-shadow: 0 8px 20px rgba(138,43,226,0.3);
        }

        .md-prose h2 .lucide {
            color: #fff;
            width: 24px;
            height: 24px;
        }

        .md-prose h3 {
            font-size: 1.3rem;
            color: #e5e5ea;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
            font-weight: 600;
        }

        .md-prose p { margin-bottom: 1.5rem; }
        .md-prose strong { color: #fff; }

        /* Custom UI Elements injected via Regex/Replace */
        
        /* Premium Images */
        .premium-image-wrapper {
            margin: 4rem 0;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            position: relative;
        }

        .zoomable-image {
            width: 100%;
            display: block;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-image-wrapper:hover .zoomable-image {
            transform: scale(1.02);
        }

        /* Stories Grid */
        .instagram-stories-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
            margin: 4rem 0;
        }

        .story-card {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            aspect-ratio: 9/16;
            border: 1px solid rgba(255,255,255,0.1);
            background: #111;
            transition: all 0.4s ease;
            box-shadow: 0 10px 20px rgba(0,0,0,0.4);
            cursor: pointer;
        }

        .story-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }

        .story-card:hover {
            transform: translateY(-8px);
            border-color: var(--accent-color);
            box-shadow: 0 15px 30px rgba(138,43,226,0.3);
        }

        .story-card:hover img {
            transform: scale(1.05);
        }

        .story-overlay {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 20px 16px;
            background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
            display: flex;
            align-items: flex-end;
        }

        .story-tag {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(8px);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            color: #fff;
            font-family: 'JetBrains Mono', monospace;
            border: 1px solid rgba(255,255,255,0.1);
        }

        /* Brand Logos Grid */
        .brand-assets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin: 4rem 0;
        }

        .brand-card {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.08);
            min-height: 220px;
            transition: all 0.4s ease;
        }

        .brand-card:hover {
            transform: scale(1.02);
            border-color: rgba(255,255,255,0.2);
        }

        .brand-card img {
            max-width: 100%;
            max-height: 120px;
            object-fit: contain;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
        }

        .brand-card .favicon-size {
            height: 80px;
            width: 80px;
        }

        .brand-label {
            position: absolute;
            top: 16px;
            left: 20px;
            font-size: 0.75rem;
            font-family: 'JetBrains Mono', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 600;
        }

        .light-bg { background: #e5e5ea; }
        .dark-bg { background: rgba(10,10,12,0.8); }
        .glass-bg { background: linear-gradient(135deg, rgba(138,43,226,0.1), rgba(138,43,226,0.02)); border-color: rgba(138,43,226,0.2); }

        /* Premium Tables */
        .md-prose table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 3rem 0;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 16px;
            border: 1px solid var(--glass-border);
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .md-prose th, .md-prose td {
            padding: 1.25rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            vertical-align: top;
        }

        .md-prose th {
            background: rgba(255, 255, 255, 0.03);
            color: #fff;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-family: 'JetBrains Mono', monospace;
        }

        .md-prose tr:last-child td { border-bottom: none; }
        .md-prose tr:hover td { background: rgba(255, 255, 255, 0.03); }

        /* Code & Quotes */
        .md-prose code {
            font-family: 'JetBrains Mono', monospace;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2em 0.4em;
            border-radius: 6px;
            font-size: 0.85em;
            color: #e5e5ea;
        }

        .md-prose blockquote {
            margin: 3rem 0;
            padding: 2.5rem;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid rgba(255,255,255,0.08);
            position: relative;
        }

        .md-prose blockquote p {
            margin: 0;
            font-size: 1.2rem;
            font-style: italic;
            color: #f5f5f7;
        }
        
    </style>
</head>
<body>

    <!-- Ambient Lighting -->
    <div class="ambient-glow"></div>

    <!-- Apple navbar -->
    <nav class="fixed top-0 inset-x-0 z-50 nav-glass">
        <div class="h-16 px-6 max-w-6xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="../logo/favicon.png" alt="Logo" class="w-6 h-6 object-contain" onerror="this.src=''; this.alt='Nutu'">
                <span class="font-serif font-bold text-lg text-white">NutuVocabulary</span>
            </div>
            <div>
                <button class="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition-colors">
                    Önizleme
                </button>
            </div>
        </div>
    </nav>

    <!-- Main ContentWrapper -->
    <main class="pt-[140px] pb-24 px-4 sm:px-6 relative z-10">
        <!-- Notice we removed the 'opacity-0' class here so it renders IMMEDIATELY even if JS fails -->
        <div class="liquid-container animate-fade-in" id="content-card">
            
            <div class="text-center mb-10">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-xl">
                    <img src="../logo/favicon.png" alt="Icon" class="w-10 h-10 object-contain" onerror="this.style.display='none'">
                </div>
            </div>

            <!-- Markdown Source -->
            <script type="text/markdown" id="md-source">
!!!MARKDOWN_CONTENT!!!
            </script>
            
            <!-- Render Target -->
            <div id="md-rendered" class="md-prose">
                <p class="text-center text-white/50">Yükleniyor...</p>
            </div>

        </div>
    </main>

    <footer class="border-t border-border/50 bg-[#000000]/80 backdrop-blur-xl relative z-10 mt-12 py-10">
        <div class="max-w-6xl mx-auto px-6 text-center text-sm font-medium text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
            <span class="text-white/60">Copyright © 2026 Nutu. Apple & 21st.dev tasarımıyla oluşturulmuştur.</span>
        </div>
    </footer>

    <!-- JS Parsing Logic -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            try {
                // Initialize icons if available
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                const mdSource = document.getElementById('md-source');
                const renderArea = document.getElementById('md-rendered');
                
                if (mdSource && typeof marked !== 'undefined') {
                    // Safe parsing
                    marked.setOptions({ gfm: true, breaks: true });
                    const html = marked.parse(mdSource.textContent);
                    renderArea.innerHTML = html;

                    // Enhance H2 headers with Icons
                    const abstractIcons = ['layers', 'globe', 'credit-card', 'box', 'cpu', 'image', 'pen-tool', 'monitor', 'shield'];
                    let h2Count = 0;
                    
                    renderArea.querySelectorAll('h2').forEach((h2) => {
                        let iconName = abstractIcons[h2Count % abstractIcons.length];
                        if (h2.textContent.includes('ÖNEMLİ') || h2.textContent.includes('⚠️')) {
                            iconName = 'alert-triangle';
                        }
                        
                        // Clean markdown emojis
                        const rawText = h2.textContent.replace(/⚠️|🏷️|🎨|🌐|💰|📊|🛠️|📱|📲|📌|📁/g, '').replace(/^\\d+\\.\\s*/, '').trim();
                        
                        // Inject icon block
                        h2.innerHTML = `
                            <div class="icon-box">
                                <i data-lucide="${iconName}"></i>
                            </div> 
                            <span>${rawText}</span>
                        `;
                        h2Count++;
                    });
                    
                    // Re-run lucide on the newly injected markdown
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                } else {
                    renderArea.innerHTML = "<p style='color:red;'>Marked.js yüklenemedi. Lütfen internet bağlantınızı kontrol edin.</p>";
                }
            } catch (error) {
                console.error("Render hatası:", error);
                document.getElementById('md-rendered').innerHTML = "<p style='color:red;'>İçerik yüklenirken bir hata oluştu.</p>";
            }
        });
    </script>
</body>
</html>
"""

final_html = html_template.replace("!!!MARKDOWN_CONTENT!!!", safe_md_content)

os.makedirs("html", exist_ok=True)
output_path = "html/index_premium.html"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(final_html)

print(f"Premium file saved to {output_path}")

