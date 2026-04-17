import os

md_path = "nutuVocabulary.md"
with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Replace placeholders with actual images
md_content = md_content.replace(
    "📸 Ekran Görüntüsü: domain olarak ekledim.",
    "📸 Ekran Görüntüsü:\n\n<div class=\"image-container\"><img src=\"../domain.png\" class=\"apple-image\" alt=\"Domain Görseli\" /></div>"
)

md_content = md_content.replace(
    "[Basit bir sistem mimarisi çizimi ekleyin veya el çizimi fotoğrafı olabilir.]",
    "<div class=\"image-container\"><img src=\"../mimari.png\" class=\"apple-image\" alt=\"Mimari Diyagram\" /></div>"
)

story_html = """
<div class="stories-grid">
    <div class="story-item group"><img src="../stories/story1.png" class="story-img"/><div class="story-overlay"><span class="story-badge">01</span></div></div>
    <div class="story-item group"><img src="../stories/story2.png" class="story-img"/><div class="story-overlay"><span class="story-badge">02</span></div></div>
    <div class="story-item group"><img src="../stories/story3.png" class="story-img"/><div class="story-overlay"><span class="story-badge">03</span></div></div>
    <div class="story-item group"><img src="../stories/story4.png" class="story-img"/><div class="story-overlay"><span class="story-badge">04</span></div></div>
    <div class="story-item group"><img src="../stories/story5.png" class="story-img"/><div class="story-overlay"><span class="story-badge">05</span></div></div>
    <div class="story-item group"><img src="../stories/story6.png" class="story-img"/><div class="story-overlay"><span class="story-badge">06</span></div></div>
    <div class="story-item group"><img src="../stories/story7.png" class="story-img"/><div class="story-overlay"><span class="story-badge">07</span></div></div>
    <div class="story-item group"><img src="../stories/story8.png" class="story-img"/><div class="story-overlay"><span class="story-badge">08</span></div></div>
    <div class="story-item group"><img src="../stories/story9.png" class="story-img"/><div class="story-overlay"><span class="story-badge">09</span></div></div>
    <div class="story-item group"><img src="../stories/story10.png" class="story-img"/><div class="story-overlay"><span class="story-badge">10</span></div></div>
</div>
"""
md_content = md_content.replace("📁 Görseller: Story görselleri ayrı klasörde (/stories) teslim edilecektir.", story_html)

logo_html = """
<div class="logos-grid">
    <div class="logo-box glass-light">
        <span class="logo-label text-black/50">Açık Tema</span>
        <img src="../logo/acik.png" class="max-w-full h-auto max-h-32 object-contain" />
    </div>
    <div class="logo-box glass-dark">
        <span class="logo-label text-white/50">Koyu Tema</span>
        <img src="../logo/koyu.png" class="max-w-full h-auto max-h-32 object-contain" />
    </div>
    <div class="logo-box glass-trans">
        <span class="logo-label text-purple-200/60">Şeffaf (Liquid)</span>
        <img src="../logo/seffaf.png" class="max-w-full h-auto max-h-32 object-contain" />
    </div>
    <div class="logo-box glass-dark">
        <span class="logo-label text-white/50">Favicon</span>
        <img src="../logo/favicon.png" class="w-20 h-20 object-contain mx-auto" />
    </div>
</div>
"""
md_content = md_content.replace("📁 Logolar: Logo dosyaları ayrı klasörde (/logo) teslim edilecektir.", logo_html)

# Escape </script>
safe_md_content = md_content.replace("</script>", "<\\/script>")

html_template = """<!DOCTYPE html>
<html lang="tr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutuVocabulary \u2014 Vision Document</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        base: '#030303',
                        surface: 'rgba(20, 20, 20, 0.4)',
                        border: 'rgba(255, 255, 255, 0.08)',
                        accent: {
                            DEFAULT: '#8A2BE2',
                            light: '#A855F7',
                            glow: 'rgba(138, 43, 226, 0.4)'
                        }
                    },
                    fontFamily: {
                        sans: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                        serif: ['"Inria Serif"', 'serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:wght@300;400;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Marked.js -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

    <style>
        :root { color-scheme: dark; }

        body {
            background-color: theme('colors.base');
            color: #f5f5f7;
            overflow-x: hidden;
            font-family: theme('fontFamily.sans');
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

        /* Liquid Glass Background Effects */
        .ambient-glow {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80vw;
            height: 60vh;
            background: radial-gradient(ellipse at center, theme('colors.accent.glow') 0%, transparent 60%);
            filter: blur(80px);
            z-index: -1;
            pointer-events: none;
            opacity: 0.6;
        }

        .ambient-glow-2 {
            position: fixed;
            bottom: -20%;
            right: -10%;
            width: 60vw;
            height: 50vh;
            background: radial-gradient(circle at center, rgba(168,85,247,0.2) 0%, transparent 70%);
            filter: blur(100px);
            z-index: -1;
            pointer-events: none;
        }

        /* Apple/21st.dev Hybrid UI Containers */
        .liquid-glass-container {
            background: rgba(15, 15, 16, 0.4);
            backdrop-filter: blur(40px) saturate(200%);
            -webkit-backdrop-filter: blur(40px) saturate(200%);
            border: 1px solid theme('colors.border');
            border-radius: 32px;
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1);
            position: relative;
            overflow: hidden;
        }
        
        .liquid-glass-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            opacity: 0.5;
        }

        /* Top Navbar */
        .header-glass {
            background: rgba(3, 3, 3, 0.6);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 4px 30px rgba(0,0,0,0.1);
        }

        /* Hero Apple Style Text */
        .apple-gradient-text {
            background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 50%, #8A2BE2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Markdown Rendering Core */
        .md-prose {
            color: #a1a1aa;
            font-size: 1.125rem;
            line-height: 1.7;
            font-weight: 400;
        }

        .md-prose h1 {
            font-family: theme('fontFamily.serif');
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 700;
            line-height: 1.1;
            letter-spacing: -0.04em;
            text-align: center;
            margin-bottom: 2rem;
            background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .md-prose h2 {
            font-size: 1.8rem;
            color: #ffffff;
            font-weight: 600;
            letter-spacing: -0.02em;
            margin: 4.5rem 0 2rem 0;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
            border: 1px solid rgba(255,255,255,0.05);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .md-prose h2:hover .icon-wrapper {
            transform: scale(1.05) translateY(-2px);
            border-color: rgba(138,43,226,0.3);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 20px rgba(138,43,226,0.25);
        }

        .md-prose h2 .lucide {
            color: #fff;
            stroke-width: 2px;
        }

        .md-prose h3 {
            font-size: 1.3rem;
            color: #e5e5ea;
            font-weight: 600;
            margin: 3rem 0 1rem 0;
            letter-spacing: -0.01em;
        }

        .md-prose p {
            margin-bottom: 1.5rem;
            max-width: 85%;
            margin-left: auto;
            margin-right: auto;
            text-align: justify;
        }
        @media (max-width: 768px) {
            .md-prose p { max-width: 100%; text-align: left;}
        }

        .md-prose strong {
            color: #ffffff;
            font-weight: 600;
        }

        .md-prose ul {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
            max-width: 85%;
            margin-left: auto;
            margin-right: auto;
        }
        @media (max-width: 768px) {
            .md-prose ul { max-width: 100%; }
        }

        .md-prose ul li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 12px;
        }

        .md-prose ul li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, theme('colors.accent.light'), theme('colors.accent.DEFAULT'));
            box-shadow: 0 0 10px theme('colors.accent.glow');
        }

        /* Apple/21st.dev Premium Tables */
        .md-prose table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 3rem 0;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 20px;
            border: 1px solid theme('colors.border');
            overflow: hidden;
            backdrop-filter: blur(20px);
        }

        .md-prose th, .md-prose td {
            padding: 1.25rem 1.75rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            vertical-align: top;
        }

        .md-prose th {
            background: rgba(255, 255, 255, 0.04);
            color: #ffffff;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-family: theme('fontFamily.mono');
        }

        .md-prose tr:last-child td {
            border-bottom: none;
        }

        .md-prose tr {
            transition: background 0.3s ease;
        }

        .md-prose tr:hover td {
            background: rgba(255, 255, 255, 0.03);
        }

        /* 21st.dev Apple Styled Images */
        .image-container {
            margin: 3rem auto;
            max-width: 900px;
            display: flex;
            justify-content: center;
        }

        .apple-image {
            max-width: 100%;
            height: auto;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
            cursor: pointer;
        }
        
        .apple-image:hover {
            transform: scale(1.02);
            box-shadow: 0 30px 60px -15px rgba(138,43,226,0.3), 0 0 0 1px rgba(138,43,226,0.2);
        }

        /* Stories Grid / Carousel concept */
        .stories-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin: 3rem auto;
            max-width: 1000px;
        }
        @media (min-width: 640px) {
            .stories-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
            .stories-grid { grid-template-columns: repeat(5, 1fr); gap: 24px; }
        }

        .story-item {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            aspect-ratio: 9/16;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
        }
        
        .story-item:hover {
            transform: translateY(-8px) scale(1.03);
            border-color: rgba(138,43,226,0.4);
            box-shadow: 0 20px 40px -10px rgba(138,43,226,0.25);
        }

        .story-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }
        
        .story-item:hover .story-img {
            transform: scale(1.05);
        }

        .story-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%);
            display: flex;
            align-items: flex-end;
            padding: 16px;
        }

        .story-badge {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(8px);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-family: theme('fontFamily.mono');
            font-weight: 600;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.2);
        }

        /* Logos Grid */
        .logos-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            margin: 3rem auto;
            max-width: 1000px;
        }
        @media (min-width: 768px) {
            .logos-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .logo-box {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(20px);
            transition: all 0.4s ease;
            min-height: 200px;
        }

        .logo-box:hover {
            transform: translateY(-4px);
            border-color: rgba(255,255,255,0.2);
        }

        .logo-label {
            position: absolute;
            top: 16px;
            left: 20px;
            font-size: 0.75rem;
            font-family: theme('fontFamily.mono');
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 600;
        }

        .glass-light { background: #e5e5ea; border-color: transparent;}
        .glass-dark { background: rgba(20,20,22,0.6); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
        .glass-trans { background: linear-gradient(135deg, rgba(138,43,226,0.1) 0%, rgba(138,43,226,0.02) 100%); border-color: rgba(138,43,226,0.2); }

        /* Quotes */
        .md-prose blockquote {
            margin: 3rem auto;
            max-width: 85%;
            padding: 2.5rem;
            border-radius: 24px;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid rgba(255,255,255,0.08);
            color: #f5f5f7;
            position: relative;
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
        }
        
        .md-prose blockquote p {
            margin: 0;
            font-size: 1.125rem;
            font-style: italic;
        }

        /* Intro Glass Logo */
        .hero-logo-container {
            width: 80px;
            height: 80px;
            position: relative;
            margin: 0 auto 2rem auto;
            transform: rotate(-5deg);
        }

        .hero-glass-panel {
            position: absolute;
            width: 32px;
            height: 48px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(16px);
            box-shadow: inset 0 0 12px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.4);
        }

        .hero-logo-container .p1 { transform: translate(0px, 0px) rotate(15deg); border-color: rgba(138,43,226,0.3); z-index: 1;}
        .hero-logo-container .p2 { transform: translate(12px, -6px) rotate(25deg); border-color: rgba(138,43,226,0.5); z-index: 2;}
        .hero-logo-container .p3 { transform: translate(24px, -2px) rotate(35deg); border-color: rgba(138,43,226,0.7); z-index: 3;}
        .hero-logo-container .p4 { transform: translate(36px, 6px) rotate(45deg); border-color: rgba(138,43,226,1); background: rgba(138,43,226,0.15); z-index: 4;}

    </style>
</head>
<body class="selection:bg-accent/40 selection:text-white">

    <div class="ambient-glow"></div>
    <div class="ambient-glow-2"></div>

    <!-- Apple-style minimal glass nav -->
    <nav class="fixed top-0 inset-x-0 z-50 transition-all duration-300 header-glass">
        <div class="max-w-[1200px] mx-auto h-[60px] px-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="../logo/favicon.png" alt="Icon" class="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(138,43,226,0.5)]">
                <span class="font-serif font-bold text-[17px] text-[#f5f5f7] tracking-tight">NutuVocabulary</span>
            </div>
            <div>
                <button class="h-8 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs tracking-wide transition-all border border-white/10 backdrop-blur-md">
                    Overview
                </button>
            </div>
        </div>
    </nav>

    <main class="relative z-10 pt-[180px] pb-32 px-4 md:px-8">
        <div class="max-w-[1100px] mx-auto">
            
            <div class="liquid-glass-container p-8 md:p-14 lg:p-20 opacity-0 animate-reveal-up overflow-hidden">
                <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div class="text-center mb-16 relative z-10">
                    <div class="hero-logo-container">
                        <div class="hero-glass-panel p1"></div>
                        <div class="hero-glass-panel p2"></div>
                        <div class="hero-glass-panel p3"></div>
                        <div class="hero-glass-panel p4"></div>
                    </div>
                </div>

                <script type="text/markdown" id="md-source">
!!!MARKDOWN_CONTENT!!!
                </script>
                
                <div id="md-rendered" class="md-prose relative z-10">
                    <!-- Markdown inj -->
                </div>
            </div>
            
        </div>
    </main>

    <footer class="border-t border-border/50 bg-[#000000]/80 backdrop-blur-xl relative z-10 mt-12">
        <div class="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <p class="text-sm text-muted font-medium">
                Copyright © 2026 Nutu. Tasarlanmış ve Apple standartlarında kodlanmıştır.
            </p>
            <div class="flex gap-8 text-sm font-medium text-muted-foreground">
                <a href="#" class="hover:text-white transition-colors">Yasal Bildirimler</a>
                <a href="#" class="hover:text-white transition-colors">Gizlilik İlkeleri</a>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();

            const mdContent = document.getElementById('md-source').textContent;
            
            marked.setOptions({ gfm: true, breaks: true });

            const renderArea = document.getElementById('md-rendered');
            renderArea.innerHTML = marked.parse(mdContent);

            // Icon Mapping
            const abstractIcons = [
                'tag', 'palette', 'globe-2', 'credit-card', 'layers-2', 'cpu', 'image', 'pen-tool', 'monitor-smartphone', 'shield-check'
            ];
            
            let h2Count = 0;
            renderArea.querySelectorAll('h2').forEach((h2) => {
                let iconName = abstractIcons[h2Count % abstractIcons.length];
                
                if (h2.textContent.includes('ÖNEMLİ') || h2.textContent.includes('⚠️')) iconName = 'alert-triangle';

                // Clean emojis
                const rawText = h2.textContent.replace(/⚠️|🏷️|🎨|🌐|💰|📊|🛠️|📱|📲|📌|📁/g, '').replace(/^\d+\.\s*/, '').trim();
                
                h2.innerHTML = `
                    <div class="icon-wrapper">
                        <i data-lucide="${iconName}"></i>
                    </div> 
                    <span>${rawText}</span>
                `;
                h2Count++;
            });

            // Smooth reveal
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            // Apply to specific sections to fade them in beautifully
            renderArea.querySelectorAll('table, blockquote, .image-container, .stories-grid, .logos-grid, ul').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                observer.observe(el);
            });
            
            lucide.createIcons();
        });
    </script>
</body>
</html>
"""

final_html = html_template.replace("!!!MARKDOWN_CONTENT!!!", safe_md_content)

os.makedirs("html", exist_ok=True)
with open("html/index2.html", "w", encoding="utf-8") as f:
    f.write(final_html)

print("Spectacular Apple + 21st.dev html built successfully at html/index2.html")
