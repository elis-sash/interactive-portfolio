import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig, type IndexHtmlTransformContext, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import ru from './lang/ru.json';
import eng from './lang/eng.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

function localeMetaPlugin(): Plugin {
  const metaByLocale = JSON.stringify({ ru: ru.meta, eng: eng.meta });

  return {
    name: 'locale-meta',
    transformIndexHtml(html) {
      const script = `<script>(function(){var m=${metaByLocale};var l=(navigator.languages&&navigator.languages[0]||navigator.language||"en").toLowerCase();var k=l.indexOf("ru")===0?"ru":"eng";document.documentElement.lang=k==="ru"?"ru":"en";document.title=m[k].title;var d=document.querySelector('meta[name="description"]');if(d)d.setAttribute("content",m[k].description);})();</script>`;

      return html.replace('</head>', `      ${script}\n    </head>`);
    },
  };
}

function fontPreloadPlugin(): Plugin {
  return {
    name: 'font-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx: IndexHtmlTransformContext) {
        if (!ctx.bundle) return html;

        const preloads: string[] = [];
        for (const chunk of Object.values(ctx.bundle)) {
          if (chunk.type !== 'asset') continue;
          const { fileName } = chunk;
          if (
            fileName.endsWith('.woff2') &&
            (fileName.includes('geist-mono-latin-wght-normal') ||
              fileName.includes('geist-mono-cyrillic-wght-normal'))
          ) {
            preloads.push(
              `<link rel="preload" href="/${fileName}" as="font" type="font/woff2" crossorigin>`,
            );
          }
        }

        if (!preloads.length) return html;
        return html.replace('</head>', `      ${preloads.join('\n      ')}\n    </head>`);
      },
    },
  };
}

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  plugins: [react(), tailwindcss(), localeMetaPlugin(), fontPreloadPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
});
