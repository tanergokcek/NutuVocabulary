import os

md_path = "nutuVocabulary.md"
with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Escape </script> tags to avoid breaking the inline script block
safe_md_content = md_content.replace("</script>", "<\\/script>")

html_template = """<!DOCTYPE html>
<html lang="tr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutuVocabulary \u2014 Vision</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        background: '#000000',
                        foreground: '#f5f5f7',
                        border: 'rgba(255, 255, 255, 0.12)',
                        accent: {
                            DEFAULT: '#8A2BE2',
                            hover: '#a855f7',
                            glow: 'rgba(138, 43, 226, 0.3)'
                        },
                        muted: {
                            DEFAULT: '#86868b',
                            foreground: '#a1a1aa'
                        },
                        glass: {
                            bg: 'rgba(255, 255, 255, 0.02)',
                            border: 'rgba(255, 255, 255, 0.08)'
                        }
                    },
                    fontFamily: {
                        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                        serif: ['"Inria Serif"', 'serif'],
                    },
                    backgroundImage: {
                        'hero-glow': 'radial-gradient(circle at 50% 0%, rgba(138,43,226,0.15) 0%, transparent 60%)',
                    },
                    animation: {
                        'reveal-up': 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    },
                    keyframes: {
                        revealUp: {
                            '0%': { opacity: '0', transform: 'translateY(40px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' }
                        }
                    }
                }
            }
        }
    </script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:wght@300;400;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Marked.js for Markdown Parsing -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

    <style>
        :root {
            color-scheme: dark;
        }

        body {
            background-color: theme('colors.background');
            color: theme('colors.foreground');
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        /* Apple-esque Ambient Details */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
        }

        .ambient-mesh {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-image: 
                radial-gradient(ellipse at 50% 0%, theme('colors.accent.glow'), transparent 50%);
            z-index: -2;
            pointer-events: none;
            opacity: 0.8;
            filter: blur(60px);
        }

        /* 21st.dev UI Border Glow */
        .glowing-wrapper {
            position: relative;
            background: theme('colors.background');
            border-radius: 24px;
        }
        
        .glowing-wrapper::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0) 40%, rgba(138,43,226,0.3) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
            transition: all 0.5s ease;
        }
        
        .glowing-wrapper:hover::before {
            background: linear-gradient(180deg, rgba(138,43,226,0.4), rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.2) 100%);
        }

        /* Apple-style Glass Panel */
        .apple-glass {
            background: rgba(30, 30, 32, 0.4);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* Markdown Rendering Styles */
        .md-prose {
            font-family: 'Inter', sans-serif;
            color: #a1a1a6; /* Apple muted gray */
            line-height: 1.6;
            font-size: 1.125rem;
            letter-spacing: -0.01em;
        }

        /* H1 - Apple Style Huge Typo */
        .md-prose h1 {
            font-family: 'Inria Serif', serif;
            font-size: clamp(3rem, 6vw, 5rem);
            line-height: 1.05;
            color: #f5f5f7;
            margin-bottom: 2rem;
            letter-spacing: -0.04em;
            font-weight: 700;
            text-align: center;
        }

        /* Highlight gradient for text */
        .text-gradient {
            background: linear-gradient(110deg, #fff 0%, #a855f7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* H2 */
        .md-prose h2 {
            font-size: 2rem;
            color: #f5f5f7;
            font-weight: 600;
            margin-top: 5rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 16px;
            letter-spacing: -0.02em;
        }

        /* Abstract elegant icon box for h2 */
        .icon-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 14px;
            background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.05);
            flex-shrink: 0;
            transition: transform 0.3s ease;
        }

        .md-prose h2:hover .icon-box {
            transform: scale(1.05) translateY(-2px);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 16px rgba(138,43,226,0.2);
            border-color: rgba(138,43,226,0.4);
        }

        .md-prose h2 .lucide {
            color: #fff;
            stroke-width: 2px;
            width: 24px;
            height: 24px;
        }

        .md-prose h3 {
            font-size: 1.4rem;
            color: #f5f5f7;
            font-weight: 500;
            margin-top: 3rem;
            margin-bottom: 1.25rem;
            letter-spacing: -0.01em;
        }

        .md-prose p {
            margin-bottom: 1.75rem;
            max-width: 800px;
        }

        .md-prose strong {
            color: #ffffff;
            font-weight: 600;
        }

        /* Lists */
        .md-prose ul {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
            max-width: 800px;
        }

        .md-prose ul li {
            position: relative;
            padding-left: 2rem;
            margin-bottom: 1rem;
        }

        .md-prose ul li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10px;
            width: 18px;
            height: 2px;
            background: theme('colors.accent.DEFAULT');
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .md-prose ul li:hover::before {
            width: 24px;
            background: #fff;
        }

        /* 21st.dev Ultra Premium Tables */
        .md-prose table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 3rem 0;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 16px;
            border: 1px solid theme('colors.glass.border');
            overflow: hidden;
            backdrop-filter: blur(20px);
        }

        .md-prose th, .md-prose td {
            padding: 1.5rem 1.5rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            vertical-align: top;
        }

        .md-prose th {
            background: rgba(255, 255, 255, 0.03);
            color: #ffffff;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 600;
        }

        .md-prose tr:last-child td {
            border-bottom: none;
        }

        .md-prose tr {
            transition: background 0.2s ease;
        }

        .md-prose tr:hover td {
            background: rgba(255, 255, 255, 0.04);
        }

        /* Inline Code */
        .md-prose code {
            font-family: 'JetBrains Mono', monospace;
            background: rgba(255, 255, 255, 0.1);
            color: #e5e5ea;
            padding: 0.2em 0.5em;
            border-radius: 6px;
            font-size: 0.85em;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Blockquotes - Apple Style */
        .md-prose blockquote {
            margin: 3rem 0;
            padding: 2rem;
            border-radius: 24px;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid rgba(255,255,255,0.08);
            color: #f5f5f7;
            font-weight: 400;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        
        .md-prose blockquote p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
            letter-spacing: -0.01em;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .md-prose th, .md-prose td {
                padding: 1rem;
            }
            .md-prose h1 { font-size: 2.5rem; }
            .md-prose h2 { font-size: 1.5rem; }
        }

        /* Logo Stack Anim */
        .glass-icon-container {
            width: 40px;
            height: 40px;
            position: relative;
            transform: rotate(-5deg);
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .glass-icon-container:hover {
            transform: rotate(0deg) scale(1.05);
        }

        .glass-logo-panel {
            position: absolute;
            width: 16px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .glass-icon-container .p1 { transform: translate(0px, 0px) rotate(15deg); border-color: rgba(138,43,226, 0.3); z-index: 1;}
        .glass-icon-container .p2 { transform: translate(6px, -3px) rotate(25deg); border-color: rgba(138,43,226, 0.5); z-index: 2;}
        .glass-icon-container .p3 { transform: translate(12px, -1px) rotate(35deg); border-color: rgba(138,43,226, 0.8); z-index: 3;}
        .glass-icon-container .p4 { transform: translate(18px, 3px) rotate(45deg); border-color: rgba(138,43,226, 1); background: rgba(138,43,226, 0.2); z-index: 4;}

        .glass-icon-container:hover .p1 { transform: translate(0px, 0px) rotate(0deg); }
        .glass-icon-container:hover .p2 { transform: translate(8px, 0px) rotate(0deg); }
        .glass-icon-container:hover .p3 { transform: translate(16px, 0px) rotate(0deg); }
        .glass-icon-container:hover .p4 { transform: translate(24px, 0px) rotate(0deg); }
    </style>
</head>
<body class="antialiased selection:bg-accent/40 selection:text-white">

    <div class="ambient-mesh"></div>

    <!-- Navigation Core -->
    <nav class="fixed top-0 inset-x-0 z-50 transition-all duration-300 apple-glass border-b border-border/50">
        <div class="max-w-[1200px] mx-auto h-[64px] px-6 flex items-center justify-between">
            <div class="flex items-center gap-4 cursor-pointer group">
                <div class="glass-icon-container">
                    <div class="glass-logo-panel p1"></div>
                    <div class="glass-logo-panel p2"></div>
                    <div class="glass-logo-panel p3"></div>
                    <div class="glass-logo-panel p4"></div>
                </div>
                <div class="flex flex-col">
                    <span class="font-serif font-bold text-lg text-[#f5f5f7] leading-none group-hover:text-accent transition-colors duration-300">NutuVocabulary</span>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <!-- Apple styled pill button -->
                <button class="h-8 px-4 inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-xs tracking-wide transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    Explore product
                </button>
            </div>
        </div>
    </nav>

    <main class="relative z-10 pt-[160px] pb-32 px-6">
        <div class="max-w-[1000px] mx-auto">
            
            <div class="flex justify-center mb-10 opacity-0 animate-reveal-up" style="animation-delay: 0.1s;">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted font-medium text-xs tracking-wide shadow-lg backdrop-blur-md">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-accent"></i> 
                    Vision Document 2026
                </div>
            </div>

            <!-- Glowing wrapper container for the document -->
            <div class="glowing-wrapper opacity-0 animate-reveal-up" style="animation-delay: 0.2s;">
                <div class="apple-glass rounded-3xl p-8 sm:p-16 lg:p-20 relative overflow-hidden">
                    
                    <script type="text/markdown" id="md-source">
!!!MARKDOWN_CONTENT!!!
                    </script>
                    
                    <div id="md-rendered" class="md-prose">
                        <!-- Marked JS output -->
                    </div>
                </div>
            </div>
            
        </div>
    </main>

    <footer class="border-t border-border/50 apple-glass relative z-10 mt-12">
        <div class="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-3">
                <img src="../logo/favicon.png" alt="logo" class="w-6 h-6 rounded border border-white/20 hidden" onerror="this.style.display='none'">
                <p class="text-sm text-muted font-medium">
                    Copyright © 2026 Nutu. All rights reserved.
                </p>
            </div>
            <div class="flex gap-6 text-xs font-medium text-muted-foreground">
                <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-white transition-colors">Terms of Use</a>
                <a href="#" class="hover:text-white transition-colors">Design Guidelines</a>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();

            const mdContent = document.getElementById('md-source').textContent;
            
            marked.setOptions({
                gfm: true,
                breaks: true
            });

            const renderArea = document.getElementById('md-rendered');
            renderArea.innerHTML = marked.parse(mdContent);

            // Icon Mapping for a sleek, Apple-like abstract feel
            const abstractIcons = [
                'command', 'layers-3', 'globe', ' क्रेडिट-card', 'box', 'bar-chart', 'blocks', 'cpu', 'tablet-smartphone', 'pen-tool'
            ];
            
            let h2Count = 0;
            renderArea.querySelectorAll('h2').forEach((h2) => {
                // Determine icon
                let iconName = abstractIcons[h2Count % abstractIcons.length];
                
                if (h2.textContent.includes('ÖNEMLİ') || h2.textContent.includes('⚠️')) {
                    iconName = 'alert-circle';
                } else if(h2.textContent.includes('Domain')) {
                    iconName = 'globe-2';
                } else if(h2.textContent.includes('Paket')) {
                    iconName = 'credit-card';
                } else if(h2.textContent.includes('Teknolojik')) {
                    iconName = 'layers';
                }

                // Clean emojis
                const rawText = h2.textContent.replace(/⚠️|🏷️|🎨|🌐|💰|📊|🛠️|📱|📲|📌/g, '').replace(/^\d+\.\s*/, '').trim();
                
                h2.innerHTML = `
                    <div class="icon-box">
                        <i data-lucide="${iconName}"></i>
                    </div> 
                    <span>${rawText}</span>
                `;
                h2Count++;
            });

            // Smooth element reveals inside the document
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            // Apply to tables and blockquotes
            renderArea.querySelectorAll('table, blockquote, p:not(:first-child), ul').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(15px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
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
with open("html/index.html", "w", encoding="utf-8") as f:
    f.write(final_html)

print("Futuristic Apple/21st.dev inspired HTML generated successfully at html/index.html")
