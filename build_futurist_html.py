import os

md_path = "nutuVocabulary.md"
with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Espace </script> tags to avoid breaking the inline script block
safe_md_content = md_content.replace("</script>", "<\\/script>")

html_template = """<!DOCTYPE html>
<html lang="tr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutuVocabulary Documentation</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        background: '#040405',
                        foreground: '#ffffff',
                        border: 'rgba(255, 255, 255, 0.08)',
                        accent: {
                            DEFAULT: '#9333ea',
                            hover: '#a855f7',
                            glow: 'rgba(147, 51, 234, 0.5)'
                        },
                        muted: {
                            DEFAULT: '#a1a1aa',
                            foreground: '#71717a'
                        }
                    },
                    fontFamily: {
                        sans: ['"Inter"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                        serif: ['"Inria Serif"', 'serif'],
                    },
                    backgroundImage: {
                        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    },
                    animation: {
                        'blob': 'blob 7s infinite',
                        'glow': 'glow 2s ease-in-out infinite alternate',
                        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    },
                    keyframes: {
                        blob: {
                            '0%': { transform: 'translate(0px, 0px) scale(1)' },
                            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                            '100%': { transform: 'translate(0px, 0px) scale(1)' },
                        },
                        glow: {
                            '0%': { opacity: '0.4' },
                            '100%': { opacity: '0.8' }
                        },
                        slideUp: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
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

        /* 21st.dev Style Background */
        .cyber-grid {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-size: 30px 30px;
            background-image: theme('backgroundImage.grid-pattern');
            mask-image: radial-gradient(ellipse at center 20%, black 10%, transparent 70%);
            -webkit-mask-image: radial-gradient(ellipse at center 20%, black 10%, transparent 70%);
            z-index: -2;
            pointer-events: none;
        }

        .ambient-light {
            position: fixed;
            top: -250px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 500px;
            background: radial-gradient(circle, theme('colors.accent.glow') 0%, transparent 70%);
            filter: blur(80px);
            z-index: -1;
            pointer-events: none;
            opacity: 0.7;
        }

        /* 21st.dev Style Glass Cards */
        .ui-card {
            background: rgba(20, 20, 22, 0.4);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02),
                        0 20px 40px -10px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .glowing-border {
            position: relative;
        }
        .glowing-border::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 50%, rgba(147, 51, 234, 0.3) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }

        /* Markdown Styling */
        .md-prose {
            font-family: 'Inter', sans-serif;
            color: #b9b9c3;
            line-height: 1.8;
            font-size: 1.05rem;
        }

        .md-prose h1 {
            font-family: 'Inria Serif', serif;
            font-size: 3.5rem;
            line-height: 1.1;
            color: #ffffff;
            margin-bottom: 2.5rem;
            letter-spacing: -0.03em;
            background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
        }

        .md-prose h2 {
            font-size: 1.7rem;
            color: #ffffff;
            font-weight: 600;
            margin-top: 4rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: -0.02em;
        }

        .md-prose h2 .lucide {
            color: theme('colors.accent.DEFAULT');
            stroke-width: 2.5px;
            filter: drop-shadow(0 0 8px theme('colors.accent.glow'));
        }

        .md-prose h3 {
            font-size: 1.25rem;
            color: #f4f4f5;
            font-weight: 600;
            margin-top: 2.5rem;
            margin-bottom: 1.2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .md-prose p {
            margin-bottom: 1.5rem;
        }

        .md-prose strong {
            color: #ffffff;
            font-weight: 600;
        }

        /* 21st.dev Style Tables elements */
        .md-prose table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 2.5rem 0;
            background: rgba(10, 10, 12, 0.5);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .md-prose th, .md-prose td {
            padding: 1.2rem 1.5rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .md-prose th {
            background: rgba(255, 255, 255, 0.02);
            color: #d4d4d8;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
        }

        .md-prose tr:last-child td {
            border-bottom: none;
        }

        .md-prose tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        .md-prose code {
            font-family: 'JetBrains Mono', monospace;
            background: rgba(147, 51, 234, 0.15);
            color: #d8b4fe;
            padding: 0.2em 0.5em;
            border-radius: 6px;
            font-size: 0.85em;
            border: 1px solid rgba(147, 51, 234, 0.3);
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.1);
        }

        .md-prose blockquote {
            margin: 2rem 0;
            padding: 1.5rem 2rem;
            border-left: 2px solid theme('colors.accent.DEFAULT');
            background: linear-gradient(90deg, rgba(147, 51, 234, 0.1) 0%, transparent 100%);
            color: #e4e4e7;
            font-style: italic;
            border-radius: 0 16px 16px 0;
            position: relative;
        }

        .md-prose blockquote::before {
            content: '"';
            position: absolute;
            top: 0;
            left: 10px;
            font-size: 4rem;
            color: rgba(147, 51, 234, 0.2);
            font-family: serif;
            line-height: 1;
        }

        .md-prose ul {
            list-style: none;
            padding: 0;
            margin-bottom: 1.5rem;
        }

        .md-prose ul li {
            position: relative;
            padding-left: 2rem;
            margin-bottom: 0.75rem;
        }

        .md-prose ul li::before {
            content: '';
            position: absolute;
            left: 4px;
            top: 10px;
            width: 6px;
            height: 6px;
            background: theme('colors.accent.DEFAULT');
            border-radius: 50%;
            box-shadow: 0 0 12px theme('colors.accent.DEFAULT');
            transition: transform 0.2s;
        }

        .md-prose ul li:hover::before {
            transform: scale(1.5);
        }

        /* App Logo specific */
        .glass-icon-container {
            width: 48px;
            height: 48px;
            position: relative;
            transform: rotate(-10deg) scale(0.9);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
        }
        
        .glass-icon-container:hover {
            transform: rotate(0deg) scale(1.1);
        }

        .glass-panel {
            position: absolute;
            width: 20px;
            height: 30px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: inset 0 0 10px rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.5);
        }

        .glass-icon-container .p1 { transform: translate(0px, 0px) rotate(15deg); border-color: rgba(147, 51, 234, 0.4); z-index: 1;}
        .glass-icon-container .p2 { transform: translate(8px, -4px) rotate(25deg); border-color: rgba(147, 51, 234, 0.6); z-index: 2;}
        .glass-icon-container .p3 { transform: translate(16px, -2px) rotate(35deg); border-color: rgba(147, 51, 234, 0.8); z-index: 3;}
        .glass-icon-container .p4 { transform: translate(24px, 4px) rotate(45deg); border-color: rgba(147, 51, 234, 1); background: rgba(147, 51, 234, 0.2); z-index: 4;}

        .glass-icon-container:hover .p1 { transform: translate(0px, 0px) rotate(0deg); }
        .glass-icon-container:hover .p2 { transform: translate(10px, 0px) rotate(0deg); }
        .glass-icon-container:hover .p3 { transform: translate(20px, 0px) rotate(0deg); }
        .glass-icon-container:hover .p4 { transform: translate(30px, 0px) rotate(0deg); }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: theme('colors.background');
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            border: 2px solid theme('colors.background');
        }
        ::-webkit-scrollbar-thumb:hover {
            background: theme('colors.accent.DEFAULT');
        }
        
    </style>
</head>
<body class="antialiased selection:bg-accent/30 selection:text-white">

    <!-- 21st.dev Style Background Setup -->
    <div class="cyber-grid"></div>
    <div class="ambient-light"></div>

    <!-- Header / Navbar -->
    <nav class="fixed top-0 inset-x-0 z-50 h-20 border-b border-border/50 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
        <div class="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
            <div class="flex items-center gap-4 group cursor-pointer">
                <div class="glass-icon-container">
                    <div class="glass-panel p1"></div>
                    <div class="glass-panel p2"></div>
                    <div class="glass-panel p3"></div>
                    <div class="glass-panel p4"></div>
                </div>
                <div>
                    <h1 class="font-serif font-bold text-xl text-white tracking-tight group-hover:text-accent transition-colors">NutuVocabulary</h1>
                    <p class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Vision Document</p>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-white/5 font-mono text-xs text-muted">
                    <div class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                    Build 2.0.26
                </div>
                <button class="h-9 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black font-medium text-sm transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                    Join Waitlist
                </button>
            </div>
        </div>
    </nav>

    <!-- Main View -->
    <main class="relative z-10 pt-32 pb-24 px-6 min-h-screen">
        <div class="max-w-4xl mx-auto">
            
            <div class="mb-12 animate-slide-up" style="animation-delay: 0.1s;">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-widest mb-6">
                    <i data-lucide="file-text" class="w-3 h-3"></i> Strategy
                </div>
            </div>

            <div class="ui-card glowing-border p-8 sm:p-14 animate-slide-up" style="animation-delay: 0.2s;">
                <!-- Raw Markdown Storage -->
                <script type="text/markdown" id="md-source">
!!!MARKDOWN_CONTENT!!!
                </script>
                
                <!-- Render Container -->
                <div id="md-rendered" class="md-prose">
                    <!-- Marked JS outputs here -->
                </div>
            </div>
            
        </div>
    </main>

    <footer class="border-t border-border/50 bg-background/50 backdrop-blur-md relative z-10">
        <div class="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-muted-foreground font-medium">
                © 2026 NutuVocabulary. Designed with <span class="text-accent">Liquid Glass</span>.
            </p>
            <div class="flex gap-4">
                <a href="#" class="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-white hover:border-accent hover:bg-accent/10 transition-all">
                    <i data-lucide="twitter" class="w-4 h-4"></i>
                </a>
                <a href="#" class="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-white hover:border-accent hover:bg-accent/10 transition-all">
                    <i data-lucide="github" class="w-4 h-4"></i>
                </a>
            </div>
        </div>
    </footer>

    <!-- Init script -->
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

            // Icon Mapping for a futuristic UI feel
            const iconSet = ['box', 'swatch-book', 'globe-2', 'layers', 'bar-chart-3', 'blocks', 'cpu', 'smartphone', 'pen-tool', 'code-2'];
            
            // Post-process HTML for 21st.dev styling injections
            renderArea.querySelectorAll('h2').forEach((h2, idx) => {
                // Determine icon
                let iconName = iconSet[idx % iconSet.length];
                if (h2.textContent.includes('ÖNEMLİ') || h2.textContent.includes('⚠️')) iconName = 'alert-triangle';

                // Format text and clean emojis inserted logically
                const rawText = h2.textContent.replace(/⚠️/g, '');
                
                h2.innerHTML = `
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 mr-2">
                        <i data-lucide="${iconName}"></i>
                    </div> 
                    <span>${rawText}</span>
                `;
            });

            // Make images look premium
            renderArea.querySelectorAll('img').forEach(img => {
                img.classList.add('rounded-xl', 'border', 'border-border/50', 'shadow-2xl', 'my-6', 'w-full', 'max-w-2xl', 'mx-auto', 'block');
            });

            // Add smooth staggering to rows
            renderArea.querySelectorAll('tr').forEach((tr, i) => {
                tr.style.opacity = '0';
                tr.style.animation = `slideUp 0.5s ease forwards ${(i * 0.05) + 0.3}s`;
            });

            // Re-render new lucide icons
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

print("21st.dev inspired futuristic HTML generated!")
