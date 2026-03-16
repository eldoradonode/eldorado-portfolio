import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Download, Loader2, Sparkles, RefreshCw } from 'lucide-react';

export const LogoGenerator = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: "A professional, minimalist logo for an AI automation business called 'Eldorado Node'. The logo should feature a stylized 'E' or a 'Node' symbol (interconnected dots and lines) integrated with a modern, tech-forward aesthetic. Use a color palette of deep charcoal, metallic gold, and electric blue. The typography should be clean, bold, and sans-serif. The background should be a clean, solid dark grey. High resolution, vector style, professional branding.",
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          },
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setLogoUrl(`data:image/png;base64,${base64EncodeString}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image was generated. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate logo");
    } finally {
      setLoading(false);
    }
  };

  const downloadLogo = () => {
    if (!logoUrl) return;
    const link = document.createElement('a');
    link.href = logoUrl;
    link.download = 'eldorado-node-logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-20 bg-bg-alt border-t border-gold/10">
      <div className="container max-w-4xl mx-auto px-6 text-center">
        <div className="mb-12">
          <span className="section-label mx-auto">Brand Identity</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tighter">
            Custom <span className="text-gold-gradient">Logo Design</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            As a design expert, I've conceptualized a professional brand identity for <strong>Eldorado Node</strong>. 
            Click below to generate and view your custom AI automation logo.
          </p>
        </div>

        <div className="glass p-8 md:p-12 border-gold/20 flex flex-col items-center justify-center min-h-[400px]">
          {!logoUrl && !loading && (
            <button 
              onClick={generateLogo}
              className="group relative px-8 py-4 bg-gold text-black font-tech font-bold rounded-xl hover:bg-gold-light transition-all flex items-center gap-3 shadow-xl shadow-gold/20"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Generate Professional Logo
            </button>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
              <p className="text-gold font-tech animate-pulse">Crafting your brand identity...</p>
            </div>
          )}

          {error && (
            <div className="text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20 mb-4">
              {error}
              <button onClick={generateLogo} className="ml-4 underline">Retry</button>
            </div>
          )}

          {logoUrl && !loading && (
            <div className="space-y-8 w-full max-w-md">
              <div className="rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl shadow-gold/10 aspect-square bg-black">
                <img src={logoUrl} alt="Eldorado Node Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={downloadLogo}
                  className="px-6 py-3 bg-white/5 border border-gold/30 text-gold font-tech font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
                <button 
                  onClick={generateLogo}
                  className="px-6 py-3 bg-gold text-black font-tech font-bold rounded-xl hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
