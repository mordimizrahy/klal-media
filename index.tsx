
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Mail, Phone, X, MapPin, Newspaper, ShoppingBag, Settings, Plus, Trash2, 
  UploadCloud, Files, FastForward, Menu, Users, Locate, BookOpen, 
  MonitorCheck, ChevronLeft, ExternalLink, Wand2, ImageIcon, Building2, 
  Target, Download, Loader2, MessageSquareText, Clock, Layers, Monitor, 
  Image as LucideImage, PlayCircle, Store, Sparkles, Instagram, Accessibility,
  Lock, UserCheck, ShieldCheck, FileText, Layout, Map as LucideMap, Edit3,
  Hash, Shield, KeyRound, MailQuestion, Sparkle, Eye, CheckCircle2,
  Archive, PlusCircle, Link as LucideLink, Calendar, BarChart3, Handshake,
  Info, Heart, TrendingUp, Award, Palette, LineChart, FileJson, ImagePlus,
  MoveVertical, Type, Upload, Zap, Share2, Send, MessageCircle, ChevronDown, Save,
  Lightbulb, Rocket, Megaphone, Globe, Hammer, FileCode, Printer, Quote, LockKeyhole,
  UnlockKeyhole, AlertTriangle, ChevronDownCircle, ChevronRight, Move, UserPlus,
  UserCog, Search, InfoIcon, FileWarning, MonitorPlay, UserCircle, Power, 
  Settings2, EyeOff, CalendarDays, ListPlus, CheckSquare, Fingerprint, Map as MapIcon,
  Maximize2, Edit, Ruler, Sparkle as AIStars, ScanSearch, Scale, Gavel, ShieldAlert,
  ShieldCheck as ShieldIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- Gemini Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Helper Functions ---
const handleScroll = (id: string) => {
  if (id === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const element = document.querySelector(id);
  if (element) {
    const offset = window.innerWidth < 768 ? 80 : 140; 
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];
  if (url.length === 11) return url;
  return null;
};

const compressImage = (file: File | string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = typeof file === 'string' ? file : URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;
      if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
      else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = reject;
  });
};

// --- Sub-components ---

const BadgeRow = ({ issue, hebrewDate, date, className = "" }: { issue: string, hebrewDate: string, date: string, className?: string }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <div className="flex flex-wrap gap-2">
      {issue && <span className="px-3 py-1 bg-[#00A19B]/20 text-[#00A19B] rounded-lg text-[10px] md:text-xs font-black italic uppercase">גיליון {issue}</span>}
      {hebrewDate && <span className="px-3 py-1 bg-[#F7941D]/20 text-[#F7941D] rounded-lg text-[10px] md:text-xs font-black italic uppercase">{hebrewDate}</span>}
    </div>
    {date && <div className="text-slate-500 font-bold italic text-[10px] md:text-[11px] uppercase tracking-wider">תאריך: {date}</div>}
  </div>
);

const Logo = ({ className = "", logoUrl = "", onClick, onSecretTrigger }: any) => {
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef<any>(null);
  const handleLogoClick = () => {
    setClicks(prev => prev + 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setClicks(0), 2500); 
    if (clicks + 1 >= 5) { onSecretTrigger?.(); setClicks(0); }
    onClick?.();
  };
  return (
    <div className={`flex items-center gap-2 md:gap-4 cursor-pointer select-none active:scale-95 transition-transform ${className}`} onClick={handleLogoClick}>
      {logoUrl ? <img src={logoUrl} alt="Logo" className="h-8 md:h-14 w-auto object-contain" /> : (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-col text-right"><div className="flex items-center justify-end gap-1"><span className="text-white font-black text-lg md:text-2xl italic">כלל</span><span className="text-white font-light text-lg md:text-2xl">MEDIA</span></div></div>
          <div className="relative w-6 h-6 md:w-10 md:h-10 flex flex-wrap gap-0.5 md:gap-1">
            <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-sm bg-[#E2231A]" /><div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-sm bg-[#F7941D]" />
            <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-sm bg-[#00A19B]" /><div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-sm bg-[#3A3A3A]" />
          </div>
        </div>
      )}
    </div>
  );
};

const ModalWrapper = ({ children, onClose, className = "" }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className={`fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-2 md:p-8 ${className}`}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-[95vw] max-h-[95vh] overflow-y-auto no-scrollbar rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-2xl">
      {children}
    </motion.div>
  </motion.div>
);

const IconMap: any = { Lightbulb, Rocket, Megaphone, Globe, Hammer, Newspaper, BarChart3, Users, Clock, Monitor, Layout, Power, Zap, MessageSquareText, Shield, FileCode, Palette, Handshake, Building2, Store, Sparkles, TrendingUp, Award, Heart, Info, Target, Share2, Send, Lightning: Zap };

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReporter, setIsReporter] = useState(false);
  const [activeReporter, setActiveReporter] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isReporterLoginOpen, setIsReporterLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReporterPanelOpen, setIsReporterPanelOpen] = useState(false);
  const [isDesignersPortalOpen, setIsDesignersPortalOpen] = useState(false);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState<any>(null);
  const [activeFlash, setActiveFlash] = useState<any>(null);
  const [lightboxItem, setLightboxItem] = useState<any>(null);
  const [legalModal, setLegalModal] = useState<any>(null);
  
  const [fontSize, setFontSize] = useState(1);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('klal_admin_pass') || 'klal2026');
  const [masterCode, setMasterCode] = useState(() => localStorage.getItem('klal_master_code') || '4321');
  
  const [reporters, setReporters] = useState<any[]>(() => {
    const saved = localStorage.getItem('klal_reporters');
    return saved ? JSON.parse(saved) : [{ id: 1, username: 'reporter', password: 'news2026', name: 'מערכת כלל מדיה' }];
  });
  
  const [leads, setLeads] = useState<any[]>(() => {
    const saved = localStorage.getItem('klal_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [newsFlashes, setNewsFlashes] = useState<any[]>(() => {
    const saved = localStorage.getItem('klal_news_flashes');
    return saved ? JSON.parse(saved) : [{ id: 1, title: "כלל מדיה משיקה את מהפכת האימפקט 2030", content: "קבוצת המדיה המובילה הכריזה היום על סדרת מהלכים אסטרטגיים חדשים לשנת 2030.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200", date: new Date().toLocaleDateString('he-IL'), hebrewDate: "י״ז באייר תשפ״ה", author: 'מערכת כלל מדיה' }];
  });

  const [siteContent, setSiteContent] = useState(() => {
    const saved = localStorage.getItem('klal_site_content');
    return saved ? JSON.parse(saved) : {
      logoUrl: "", isTickerEnabled: true, heroVideoUrl: "5coozncmyv8", 
      heroTitle: "כלל מדיה", heroSubtitle: "25 שנות דומיננטיות במגזר החרדי", heroDesc: "מומחי אימפקט. הופכים חזון לתוצאות במדיות הכתובות, הדיגיטליות ובשטח.",
      heroYOffset: 0, heroTitleScale: 10,
      navLink1: "אודות", navLink2: "עיתונות", navLink3: "שילוט חוצות", navLink4: "גלריה", navLink5: "בלוג", navContactBtn: "בואו נדבר",
      aboutTitle: "אודות כלל מדיה", aboutSubtitle: "קבוצת התקשורת המובילה במגזר החרדי", 
      aboutStoryP1: "קבוצת 'כלל מדיה' מובילה בתחום הפרסום במגזר החרדי כבר מעל שני עשורים.",
      aboutStoryP2: "בזכות היכרות עמוקה של הניואנסים החברתיים והקהילתיים, אנחנו מומחים במתן פתרונות מותאמים אישית.",
      aboutMainImg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
      stats1Lbl: "מרכז העניינים", stats1Val: "130,000", stats1Desc: "מערך הפצה מסיבי.", stats1Img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200",
      stats2Lbl: "שלטי חוצות", stats2Val: "1,500", stats2Desc: "פריסה ארצית רחבה.", stats2Img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
      stats3Lbl: "פאשקוויל", stats3Val: "50+", stats3Desc: "עוצמת השטח.", stats3Img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
      stats4Lbl: "נקודות מכירה", stats4Val: "450", stats4Desc: "מיתוג בלב הקהילות.", stats4Img: "https://images.unsplash.com/photo-1534452203294-49c8913721b2?auto=format&fit=crop&q=80&w=1200",
      headingPubTitle: "עולם של תוכן", headingPubDesc: "מכסים את כל הקהלים בבית היהודי",
      headingOutdoorTitle: "עוצמת השטח", headingOutdoorDesc: "הנוכחות הפיזית שלנו ברחוב החרדי היא בלעדית.",
      headingGalleryTitle: "ראו מי כבר איתנו", headingGalleryDesc: "קמפיינים פורצי דרך של המותגים הגדולים בישראל",
      headingAboutTitle: "אודות כלל מדיה", headingAboutSubtitle: "קבוצת התקשורת המובילה במגזר החרדי",
      headingDeptsTitle: "מחלקות המשרד", headingDeptsDesc: "מומחיות בפריסה של 360 מעלות",
      headingContactTitle: "בואו ניצור אימפקט ביחד",
      contactAddress: "בן גוריון 17, בני ברק", contactPhone: "03-6150000", contactEmail: "office@klal-p.com", contactInstagram: "klal_media",
      contactSectionDesc: "אנחנו כאן כדי להפוך את המותג שלכם לשיחת היום",
      successTitle: "תודה רבה!", successDesc: "הפנייה שלך התקבל בהצלחה. נחזור אליך בהקדם.",
      galleryModalTitle: "הוכחת ביצוע - גלריה מלאה",
      footerSlogan: "קבוצת כלל מדיה - מומחי אימפקט 2030", footerCopyright: "כל הזכויות שמורות © 2025",
      legalTerms: "תקנון האתר\nברוכים הבאים לאתר כלל מדיה...",
      legalPrivacy: "מדיניות פרטיות...",
      legalAccessibility: "הצהרת נגישות..."
    };
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('klal_departments');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "אסטרטגיה וקריאייטיב", desc: "תכנון מהלכים שיווקיים פורצי דרך למגזר החרדי.", icon: "Lightbulb", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" }
    ];
  });

  const [magazines, setMagazines] = useState(() => {
    const saved = localStorage.getItem('klal_magazines');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "מרכז העניינים", type: "עיתון ראשי", desc: "העיתון הממלכתי המוביל במגזר החרדי.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200", lastIssueDate: "1.2.2026", lastIssueHebrewDate: "י״ז באייר תשפ״ה", lastIssueNumber: "1248", lastIssueLink: "https://online.fliphtml5.com/qwwer/merkaz/", archiveLink: "#", joinLink: "#" }
    ];
  });

  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem('klal_partners');
    return saved ? JSON.parse(saved) : [{ id: 1, name: "בנק הפועלים", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Bank_Hapoalim_logo.png" }];
  });

  const [signageSpecs, setSignageSpecs] = useState(() => {
    const saved = localStorage.getItem('klal_signage_specs');
    return saved ? JSON.parse(saved) : [
      { id: 1, category: "שילוט חוצות", title: "דאבל (2X3)", size: "210x300 ס\"מ", desc: "יש להוסיף בליד של 3 ס\"מ היקפי", image: "" }
    ];
  });

  const [galleryItems, setGalleryItems] = useState(() => {
    const saved = localStorage.getItem('klal_gallery_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('klal_blogs');
    return saved ? JSON.parse(saved) : [{ id: 1, title: "העתיד של המדיה החרדית", content: "תוכן הבלוג כאן...", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", date: "15.05.2025" }];
  });

  useEffect(() => {
    try {
      localStorage.setItem('klal_site_content', JSON.stringify(siteContent));
      localStorage.setItem('klal_departments', JSON.stringify(departments));
      localStorage.setItem('klal_magazines', JSON.stringify(magazines));
      localStorage.setItem('klal_partners', JSON.stringify(partners));
      localStorage.setItem('klal_signage_specs', JSON.stringify(signageSpecs));
      localStorage.setItem('klal_gallery_items', JSON.stringify(galleryItems));
      localStorage.setItem('klal_blogs', JSON.stringify(blogs));
      localStorage.setItem('klal_news_flashes', JSON.stringify(newsFlashes));
      localStorage.setItem('klal_admin_pass', adminPassword);
      localStorage.setItem('klal_master_code', masterCode);
      localStorage.setItem('klal_reporters', JSON.stringify(reporters));
      localStorage.setItem('klal_leads', JSON.stringify(leads));
    } catch (e) { console.error("Storage Error:", e); }
  }, [siteContent, departments, magazines, partners, signageSpecs, galleryItems, blogs, newsFlashes, adminPassword, masterCode, reporters, leads]);

  return (
    <div className={`min-h-screen bg-slate-950 selection:bg-teal-500 selection:text-white overflow-x-hidden font-heebo transition-all duration-300 ${isGrayscale ? 'grayscale' : ''} ${isHighContrast ? 'contrast-150' : ''}`} style={{ fontSize: `${fontSize}rem` }}>
      <AccessibilityWidget isGrayscale={isGrayscale} setIsGrayscale={setIsGrayscale} isHighContrast={isHighContrast} setIsHighContrast={setIsHighContrast} fontSize={fontSize} setFontSize={setFontSize} />
      <WhatsAppButton />
      
      <AnimatePresence>
        {isLoginOpen && <ModalWrapper onClose={() => setIsLoginOpen(false)}><AdminLogin onClose={() => setIsLoginOpen(false)} onSuccess={() => { setIsAdmin(true); setIsLoginOpen(false); setIsAdminOpen(true); }} correctPass={adminPassword} correctMaster={masterCode} /></ModalWrapper>}
        {isReporterLoginOpen && <ModalWrapper onClose={() => setIsReporterLoginOpen(false)}><ReporterLogin onClose={() => setIsReporterLoginOpen(false)} onSuccess={(rep: any) => { setActiveReporter(rep); setIsReporter(true); setIsReporterLoginOpen(false); setIsReporterPanelOpen(true); }} reporters={reporters} /></ModalWrapper>}
        {isAdminOpen && isAdmin && (
          <ModalWrapper onClose={() => setIsAdminOpen(false)}>
            <AdminPanel 
              onClose={() => setIsAdminOpen(false)} siteContent={siteContent} setSiteContent={setSiteContent} departments={departments} setDepartments={setDepartments} 
              magazines={magazines} setMagazines={setMagazines} partners={partners} setPartners={setPartners} 
              galleryItems={galleryItems} setGalleryItems={setGalleryItems} signageSpecs={signageSpecs} setSignageSpecs={setSignageSpecs} blogs={blogs} setBlogs={setBlogs} 
              newsFlashes={newsFlashes} setNewsFlashes={setNewsFlashes} leads={leads} setLeads={setLeads} onLogout={() => { setIsAdmin(false); setIsAdminOpen(false); }} 
              adminPassword={adminPassword} setAdminPassword={setAdminPassword} masterCode={masterCode} setMasterCode={setMasterCode} reporters={reporters} setReporters={setReporters}
            />
          </ModalWrapper>
        )}
        {isReporterPanelOpen && isReporter && activeReporter && <ModalWrapper onClose={() => setIsReporterPanelOpen(false)}><ReporterPanel onClose={() => setIsReporterPanelOpen(false)} reporter={activeReporter} newsFlashes={newsFlashes} setNewsFlashes={setNewsFlashes} onLogout={() => { setIsReporter(false); setIsReporterPanelOpen(false); setActiveReporter(null); }} /></ModalWrapper>}
      </AnimatePresence>

      <Navbar onOpenGallery={() => setIsFullGalleryOpen(true)} content={siteContent} onOpenAdmin={() => setIsLoginOpen(true)} />
      {siteContent.isTickerEnabled && <NewsTicker flashes={newsFlashes} onFlashClick={(f:any) => setActiveFlash(f)} />}
      <Hero content={siteContent} />
      
      <main className="relative z-10">
        <StatsDashboard content={siteContent} />
        <PublishingHub magazines={magazines} content={siteContent} />
        <OutdoorSection content={siteContent} />
        <InfiniteGallery content={siteContent} galleryItems={galleryItems} onOpenFull={() => setIsFullGalleryOpen(true)} onImageClick={(item: any) => setLightboxItem(item)} />
        <AboutSection content={siteContent} departments={departments} />
        <BlogSection content={siteContent} blogs={blogs} onRead={(blog: any) => setActiveBlog(blog)} />
        <TrustBar partners={partners} />
        <ContactSection content={siteContent} onOpenDesignersPortal={() => setIsDesignersPortalOpen(true)} onAddLead={(l: any) => setLeads([l, ...leads])} />
      </main>
      
      <Footer content={siteContent} onTriggerReporterLogin={() => setIsReporterLoginOpen(true)} onOpenLegal={(type:string) => setLegalModal(type)} />
      
      <AnimatePresence>
        {isDesignersPortalOpen && <ModalWrapper onClose={() => setIsDesignersPortalOpen(false)} className="bg-slate-950/98"><DesignersPortal onClose={() => setIsDesignersPortalOpen(false)} specs={signageSpecs} content={siteContent} /></ModalWrapper>}
        {isFullGalleryOpen && <ModalWrapper onClose={() => setIsFullGalleryOpen(false)}><FullGalleryModal onClose={() => setIsFullGalleryOpen(false)} items={galleryItems} content={siteContent} onImageClick={(item: any) => setLightboxItem(item)} /></ModalWrapper>}
        {activeBlog && <ModalWrapper onClose={() => setActiveBlog(null)}><BlogModal blog={activeBlog} onClose={() => setActiveBlog(null)} /></ModalWrapper>}
        {activeFlash && <ModalWrapper onClose={() => setActiveFlash(null)}><FlashModal flash={activeFlash} onClose={() => setActiveFlash(null)} /></ModalWrapper>}
        {lightboxItem && <LightboxModal item={lightboxItem} items={galleryItems} onClose={() => setLightboxItem(null)} onNavigate={(nextItem: any) => setLightboxItem(nextItem)} />}
        {legalModal && <ModalWrapper onClose={() => setLegalModal(null)}><LegalModal type={legalModal} content={siteContent} onClose={() => setLegalModal(null)} /></ModalWrapper>}
      </AnimatePresence>
    </div>
  );
}

// --- Components ---

const LegalModal = ({ type, content, onClose }: any) => {
  const titles: any = { terms: "תקנון האתר", privacy: "מדיניות פרטיות", access: "הצהרת נגישות" };
  const texts: any = { terms: content.legalTerms, privacy: content.legalPrivacy, access: content.legalAccessibility };
  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-10 md:p-20 text-right w-full max-w-4xl max-h-[85vh] overflow-y-auto no-scrollbar" dir="rtl">
       <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6"><h2 className="text-4xl font-black text-white italic">{titles[type]}</h2><button onClick={onClose} className="text-slate-500 hover:text-white"><X size={32}/></button></div>
       <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap italic font-light">{texts[type]}</div>
    </div>
  );
};

const AIEnhancerModal = ({ image, onClose, onApply }: any) => {
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(image);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100 });
  const analyzeImage = async () => {
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [ { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }, { text: "Analyze this advertising image. Suggest an enticing marketing title (in Hebrew), recommended CSS filter values (brightness 80-120, contrast 80-150, saturation 80-150). Return ONLY JSON: { \"title\": \"...\", \"filters\": { \"brightness\": 105, \"contrast\": 110, \"saturate\": 120 } }" } ] }]
      });
      const responseText = response.text || '{}';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const result = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
      setSuggestions(result); setFilters(result.filters || filters);
    } catch (e) { console.error("AI Analysis failed", e); }
    setLoading(false);
  };
  return (
    <div className="w-full max-w-6xl bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 flex flex-col md:flex-row h-[85vh]" dir="rtl">
      <div className="flex-1 bg-black p-6 flex items-center justify-center relative overflow-hidden">
        <img src={previewImg} className="max-h-[70vh] object-contain rounded-2xl shadow-2xl transition-all duration-500" style={{ filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)` }} />
      </div>
      <div className="w-full md:w-96 bg-slate-900 border-r border-white/10 p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <h3 className="text-white font-black text-2xl italic uppercase flex items-center gap-3"><AIStars className="text-teal-400" /> AI ENHANCE</h3>
        <button onClick={analyzeImage} disabled={loading} className="w-full py-4 bg-teal-500 rounded-2xl text-white font-black italic shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50">{loading ? <Loader2 className="animate-spin" /> : <ScanSearch />} {loading ? "AI מנתח..." : "שיפור AI אוטומטי"}</button>
        {suggestions && <div className="bg-teal-500/10 border border-teal-500/20 p-5 rounded-2xl"><span className="text-teal-400 text-[10px] font-black uppercase tracking-widest block mb-2">הצעת AI לכותרת</span><p className="text-white font-bold italic text-lg">{suggestions.title}</p></div>}
        <div className="space-y-6">
          <div className="space-y-2"><div className="flex justify-between text-[10px] font-black text-slate-500"><span>בהירות</span><span>{filters.brightness}%</span></div><input type="range" min="50" max="150" value={filters.brightness} onChange={e => setFilters({...filters, brightness: parseInt(e.target.value)})} className="w-full accent-teal-500 bg-white/5 h-1 rounded-full appearance-none" /></div>
          <div className="space-y-2"><div className="flex justify-between text-[10px] font-black text-slate-500"><span>ניגודיות</span><span>{filters.contrast}%</span></div><input type="range" min="50" max="150" value={filters.contrast} onChange={e => setFilters({...filters, contrast: parseInt(e.target.value)})} className="w-full accent-teal-500 bg-white/5 h-1 rounded-full appearance-none" /></div>
        </div>
        <div className="mt-auto pt-6 border-t border-white/5 flex gap-3"><button onClick={() => onApply(previewImg, {suggestions, filters})} className="flex-1 py-4 bg-white text-black rounded-2xl font-black italic shadow-xl">החל וסגור</button><button onClick={onClose} className="px-6 py-4 bg-white/5 text-white rounded-2xl font-bold">ביטול</button></div>
      </div>
    </div>
  );
};

const LightboxModal = ({ item, items, onClose, onNavigate }: any) => {
  const idx = items.findIndex((i: any) => i.id === item.id);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 md:top-10 md:right-10 text-white/40 hover:text-white z-20 p-2"><X size={32}/></button>
      <div className="relative w-full max-w-6xl h-[70vh] md:h-[80vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
        <motion.img key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={item.image} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
        <div className="mt-6 text-center"><span className="text-teal-400 font-black italic uppercase tracking-widest text-[10px] md:text-xs mb-1 block">{item.category}</span><h3 className="text-white text-xl md:text-3xl font-black italic uppercase">{item.title}</h3></div>
      </div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-20 pointer-events-none">
        <button onClick={() => onNavigate(items[(idx - 1 + items.length) % items.length])} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all pointer-events-auto border border-white/10"><ChevronRight size={32} /></button>
        <button onClick={() => onNavigate(items[(idx + 1) % items.length])} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all pointer-events-auto border border-white/10"><ChevronLeft size={32} /></button>
      </div>
    </motion.div>
  );
};

const AccessibilityWidget = ({ isGrayscale, setIsGrayscale, isHighContrast, setIsHighContrast, fontSize, setFontSize }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShown, setIsShown] = useState(true);
  if (!isShown) return null;
  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[600]" dir="rtl">
      <div className="relative">
        <button onClick={() => setIsShown(false)} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg z-[610] border-2 border-slate-950"><X size={12} strokeWidth={4} /></button>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-teal-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center">{isOpen ? <X size={28} /> : <Accessibility size={28} />}</button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-20 left-0 bg-slate-900/95 border border-white/10 p-6 rounded-[2rem] shadow-2xl w-64 space-y-4 backdrop-blur-xl">
            <h4 className="text-white font-black italic uppercase text-lg border-b border-white/10 pb-2 mb-4">נגישות</h4>
            <button onClick={() => setFontSize(Math.min(fontSize + 0.1, 1.5))} className="w-full py-2 bg-white/5 text-white rounded-xl text-xs font-bold hover:bg-teal-500">הגדל טקסט</button>
            <button onClick={() => setFontSize(Math.max(fontSize - 0.1, 0.8))} className="w-full py-2 bg-white/5 text-white rounded-xl text-xs font-bold hover:bg-teal-500">הקטן טקסט</button>
            <button onClick={() => setIsGrayscale(!isGrayscale)} className={`w-full py-2 rounded-xl text-xs font-bold ${isGrayscale ? 'bg-teal-500 text-white' : 'bg-white/5 text-white'}`}>גווני אפור</button>
            <button onClick={() => setIsHighContrast(!isHighContrast)} className={`w-full py-2 rounded-xl text-xs font-bold ${isHighContrast ? 'bg-orange-500 text-white' : 'bg-white/5 text-white'}`}>ניגודיות גבוהה</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WhatsAppButton = () => (
  <a href="https://api.whatsapp.com/send?phone=972505390809" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[600] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center">
    <MessageCircle size={32} />
  </a>
);

const Navbar = ({ onOpenGallery, content, onOpenAdmin }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const check = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', check); return () => window.removeEventListener('scroll', check);
  }, []);
  const links = [ { label: content.navLink1, id: '#about-section' }, { label: content.navLink2, id: '#publishing' }, { label: content.navLink3, id: '#outdoor' }, { label: content.navLink4, id: 'gallery', onClick: () => { onOpenGallery(); setIsMobileMenuOpen(false); } }, { label: content.navLink5, id: '#blog' } ];
  return (
    <>
      <nav className={`fixed top-0 w-full z-[500] transition-all duration-500 ${isScrolled ? 'bg-slate-950/95 backdrop-blur-xl py-3 shadow-2xl border-b border-white/5' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center" dir="rtl">
          <Logo logoUrl={content.logoUrl} onSecretTrigger={onOpenAdmin} />
          <div className="hidden lg:flex items-center gap-10">
            {links.map((link, idx) => (<button key={idx} onClick={() => link.onClick ? link.onClick() : handleScroll(link.id)} className="text-white font-bold italic hover:text-teal-400 transition-colors uppercase tracking-widest text-sm">{link.label}</button>))}
            <button onClick={() => handleScroll('#contact')} className="bg-white text-black px-8 py-3 rounded-full font-black italic hover:bg-teal-500 hover:text-white transition-all shadow-xl text-sm">{content.navContactBtn}</button>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg"><Menu size={28} /></button>
        </div>
      </nav>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col p-6" dir="rtl">
            <div className="flex justify-between items-center mb-10"><Logo logoUrl={content.logoUrl} onSecretTrigger={onOpenAdmin} onClick={() => setIsMobileMenuOpen(false)} /><button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-3 bg-white/5 rounded-full"><X size={28} /></button></div>
            <div className="flex flex-col gap-6 flex-1">
              {links.map((link, idx) => (<button key={idx} onClick={() => { if(link.onClick) link.onClick(); else handleScroll(link.id); setIsMobileMenuOpen(false); }} className="text-white text-3xl font-black italic text-right uppercase tracking-tighter hover:text-teal-500">{link.label}</button>))}
              <button onClick={() => { handleScroll('#contact'); setIsMobileMenuOpen(false); }} className="mt-6 bg-white text-black py-5 rounded-2xl font-black text-xl italic">{content.navContactBtn}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NewsTicker = ({ flashes, onFlashClick }: any) => {
  if (!flashes || flashes.length === 0) return null;
  return (
    <div className="fixed top-[74px] md:top-[104px] w-full z-[450] bg-[#E2231A] text-white py-2 md:py-3 flex items-center overflow-hidden border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 bg-[#E2231A] px-8 relative z-10 shadow-[20px_0_20px_rgba(226,35,26,1)]">
        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-3 h-3 bg-white rounded-full" />
        <span className="font-black italic uppercase tracking-tighter text-xs whitespace-nowrap">מבזק חי</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="flex gap-20 whitespace-nowrap">
          {flashes.map((f: any) => (<button key={f.id} onClick={() => onFlashClick(f)} className="text-sm font-bold italic hover:underline">{f.title}</button>))}
        </motion.div>
      </div>
    </div>
  );
};

const Hero = ({ content }: any) => {
  const vid = getYoutubeId(content.heroVideoUrl);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      <div className="absolute inset-0 z-0">
        {vid ? <div className="absolute inset-0 pointer-events-none overflow-hidden"><iframe className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 scale-110" src={`https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}&controls=0&showinfo=0&rel=0&enablejsapi=1&modestbranding=1&iv_load_policy=3&disablekb=1`} frameBorder="0" allow="autoplay; encrypted-media" /></div> : <div className="absolute inset-0 bg-slate-900" />}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-slate-950" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl" style={{ transform: `translateY(${content.heroYOffset}px)` }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: `${content.heroTitleScale}rem` }} className="font-black text-white italic leading-none tracking-tighter uppercase mb-6 drop-shadow-2xl">{content.heroTitle}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: `${content.heroSubtitle && content.heroSubtitle.length > 0 ? 3 : 0}rem` }} className="text-teal-400 font-bold italic tracking-widest uppercase mb-10">{content.heroSubtitle}</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontSize: `1.2rem` }} className="text-white/80 max-w-2xl mx-auto leading-relaxed italic font-light">{content.heroDesc}</motion.div>
      </div>
    </section>
  );
};

const StatsDashboard = ({ content }: any) => {
  const stats = [ { l: content.stats1Lbl, v: content.stats1Val, d: content.stats1Desc, i: content.stats1Img, c: 'border-red-500' }, { l: content.stats2Lbl, v: content.stats2Val, d: content.stats2Desc, i: content.stats2Img, c: 'border-orange-500' }, { l: content.stats3Lbl, v: content.stats3Val, d: content.stats3Desc, i: content.stats3Img, c: 'border-teal-500' }, { l: content.stats4Lbl, v: content.stats4Val, d: content.stats4Desc, i: content.stats4Img, c: 'border-slate-500' } ];
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" dir="rtl">
      {stats.map((s, i) => (
        <motion.div key={i} whileHover={{ y: -10 }} className={`bg-white/5 border-t-8 ${s.c} rounded-[3rem] p-10 shadow-2xl`}>
          <div className="h-40 rounded-2xl overflow-hidden mb-8 relative"><img src={s.i} className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900" /><div className="absolute bottom-4 right-6 text-4xl font-black text-white italic">{s.v}</div></div>
          <h3 className="text-2xl font-black text-white italic mb-4 uppercase">{s.l}</h3>
          <p className="text-slate-400 italic font-light text-sm">{s.d}</p>
        </motion.div>
      ))}
    </section>
  );
};

const PublishingHub = ({ magazines, content }: any) => (
  <section id="publishing" className="py-20 md:py-32 bg-white/5" dir="rtl">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 md:mb-24"><h2 className="text-5xl md:text-6xl font-black text-white italic uppercase mb-4 md:mb-6 leading-tight">{content.headingPubTitle}</h2><p className="text-teal-400 font-bold italic tracking-wider">{content.headingPubDesc}</p></div>
      <div className="grid lg:grid-cols-2 gap-10 md:gap-16 mb-24">
        {magazines.map((m: any) => (
          <div key={m.id} className="bg-[#0D1525] border border-[#1E2D4A] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden flex flex-col-reverse md:flex-row shadow-2xl group hover:border-[#00A19B]/50 transition-all duration-500 md:min-h-[520px]">
            <div className="md:w-[55%] p-8 md:p-14 flex flex-col text-right">
              <div className="flex-1"><h3 className="text-3xl md:text-5xl font-black text-white italic mb-4 md:mb-6 tracking-tighter leading-tight">{m.name}</h3><BadgeRow issue={m.lastIssueNumber} hebrewDate={m.lastIssueHebrewDate} date={m.lastIssueDate} className="mb-4" /><p className="text-slate-400 italic font-light leading-relaxed text-sm md:text-base max-w-sm">{m.desc}</p></div>
              <div className="flex flex-col gap-4 md:gap-5 mt-8 md:mt-10">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <a href={m.lastIssueLink} target="_blank" className="py-4 bg-white text-black text-center font-black italic rounded-2xl hover:bg-[#00A19B] hover:text-white transition-all text-lg md:text-xl shadow-xl">קריאה</a>
                  {m.archiveLink && m.archiveLink !== "#" && (
                    <a href={m.archiveLink} target="_blank" className="py-4 border border-white/10 text-white text-center font-black italic rounded-2xl hover:bg-white/5 transition-all text-lg md:text-xl flex items-center justify-center gap-2"><Archive size={18}/> ארכיון</a>
                  )}
                </div>
                <a href={m.joinLink} target="_blank" className="w-full py-4 bg-[#00A19B]/10 border border-[#00A19B]/30 text-[#00A19B] text-center font-black italic rounded-2xl hover:bg-[#00A19B] hover:text-white transition-all text-[10px] uppercase">הצטרפות לרשימת תפוצה</a>
              </div>
            </div>
            <div className="md:w-[45%] h-72 md:h-full relative overflow-hidden bg-[#050810]"><img src={m.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-l from-[#0D1525] via-transparent to-transparent md:block hidden" /><div className="absolute inset-0 bg-gradient-to-t from-[#0D1525] via-transparent to-transparent md:hidden" /></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const OutdoorSection = ({ content }: any) => (
  <section id="outdoor" className="relative py-48 overflow-hidden">
    <div className="absolute inset-0"><img src={content.stats2Img} className="w-full h-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950" /></div>
    <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-32 items-center" dir="rtl">
      <div className="text-right"><span className="text-teal-400 font-black italic uppercase tracking-widest mb-4 block">OUTDOOR IMPACT</span><h2 className="text-8xl font-black text-white italic uppercase leading-none mb-10">{content.headingOutdoorTitle}</h2><p className="text-2xl text-slate-300 font-light italic leading-relaxed">{content.headingOutdoorDesc}</p></div>
      <div className="bg-slate-900/80 p-4 rounded-[4rem] border border-white/20 rotate-3 shadow-2xl"><img src={content.stats2Img} className="rounded-[3.5rem] w-full h-[500px] object-cover" /></div>
    </div>
  </section>
);

const InfiniteGallery = ({ content, galleryItems, onOpenFull, onImageClick }: any) => {
  const displayItems = galleryItems.length > 0 ? [...galleryItems, ...galleryItems, ...galleryItems] : [];
  return (
    <section id="gallery" className="py-40 bg-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-24 relative z-10" dir="rtl"><span className="text-teal-400 font-black italic uppercase tracking-[0.2em] text-sm mb-4 block">SHOWCASE 2030</span><h2 className="text-4xl md:text-8xl font-black text-white italic uppercase mb-6 leading-tight">{content.headingGalleryTitle}</h2><p className="text-slate-400 italic font-light text-lg">{content.headingGalleryDesc}</p></div>
      {displayItems.length > 0 ? (
        <div className="relative group overflow-hidden"><motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 80, ease: "linear" }} className="flex gap-16 whitespace-nowrap py-10">{displayItems.map((g, i) => (<div key={i} onClick={() => onImageClick(g)} className="w-[700px] h-[500px] rounded-[4rem] overflow-hidden border border-white/10 shrink-0 relative group shadow-2xl cursor-pointer"><img src={g.image} className="w-full h-full object-cover transition-all duration-700 hover:scale-105" /><div className="absolute bottom-12 right-12 text-right"><span className="text-teal-400 font-black italic uppercase text-xs mb-2 block">{g.category}</span><h4 className="text-white text-xl font-black italic uppercase">{g.title}</h4></div></div>))}</motion.div></div>
      ) : <div className="text-center text-slate-500 py-20 italic">הגלריה ריקה כרגע...</div>}
      <div className="text-center mt-24"><button onClick={onOpenFull} className="bg-white text-black px-16 py-6 rounded-full font-black text-2xl italic hover:bg-teal-500 hover:text-white transition-all shadow-xl">לגלריה המלאה</button></div>
    </section>
  );
};

const AboutSection = ({ content, departments }: any) => (
  <section id="about-section" className="py-48 bg-slate-950 relative overflow-hidden" dir="rtl">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid lg:grid-cols-2 gap-32 items-center mb-40">
        <div className="text-right"><h2 className="text-teal-400 font-black italic uppercase tracking-widest mb-6">{content.aboutSubtitle}</h2><h3 className="text-7xl font-black text-white italic uppercase leading-none mb-12">{content.aboutTitle}</h3><div className="space-y-10"><p className="text-slate-300 text-xl font-light italic leading-relaxed border-r-8 border-teal-500 pr-8 bg-white/5 py-6 rounded-l-3xl">{content.aboutStoryP1}</p><p className="text-slate-300 text-xl font-light italic leading-relaxed border-r-8 border-orange-500 pr-8 bg-white/5 py-6 rounded-l-3xl">{content.aboutStoryP2}</p></div></div>
        <div className="grid grid-cols-2 gap-6"><div className="bg-white/5 p-4 rounded-[3rem] h-96 overflow-hidden mt-20 shadow-2xl"><img src={content.aboutMainImg} className="w-full h-full object-cover rounded-[2.5rem]" /></div><div className="bg-teal-500 p-4 rounded-[3rem] h-96 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center gap-6"><div className="bg-white/10 p-4 rounded-full"><Sparkles size={40} className="text-white" /></div><h4 className="text-white text-4xl font-black italic uppercase">IMPACT<br/>DRIVEN</h4></div></div>
      </div>
      <div className="text-center mb-24"><h2 className="text-6xl font-black text-white italic uppercase mb-6">{content.headingDeptsTitle}</h2><p className="text-teal-400 font-bold italic tracking-widest uppercase">{content.headingDeptsDesc}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">{departments.map((dept: any) => { const Icon = IconMap[dept.icon] || Lightbulb; return (<div key={dept.id} className="bg-white/5 border border-white/10 rounded-[4rem] group shadow-2xl overflow-hidden flex flex-col"><div className="h-48 overflow-hidden relative"><img src={dept.image} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950" /></div><div className="p-12 -mt-20 relative z-10"><div className="w-20 h-20 bg-teal-500/10 rounded-[1.5rem] flex items-center justify-center text-teal-400 mb-8 group-hover:bg-teal-500 group-hover:text-white transition-all backdrop-blur-xl border border-white/5"><Icon size={40} /></div><h4 className="text-3xl font-black text-white italic mb-6 uppercase">{dept.title}</h4><p className="text-slate-400 italic font-light leading-relaxed text-lg">{dept.desc}</p></div></div>); })}</div>
    </div>
  </section>
);

const BlogSection = ({ content, blogs, onRead }: any) => (
  <section id="blog" className="py-32 bg-white/5" dir="rtl">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-right mb-20"><h2 className="text-6xl font-black text-white italic uppercase mb-4">{content.headingBlogTitle}</h2><p className="text-teal-400 font-bold italic tracking-wider">תובנות מהשטח</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">{blogs.map((b: any) => (<div key={b.id} onClick={() => onRead(b)} className="group cursor-pointer"><div className="aspect-video rounded-[3rem] overflow-hidden mb-8 relative shadow-xl"><img src={b.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" /></div><span className="text-slate-500 font-bold italic text-sm mb-4 block">{b.date}</span><h3 className="text-3xl font-black text-white italic uppercase group-hover:text-teal-400 transition-colors leading-tight">{b.title}</h3></div>))}</div>
    </div>
  </section>
);

const TrustBar = ({ partners }: any) => (
  <section className="py-24 border-y border-white/5 bg-slate-950 overflow-hidden">
    <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="flex gap-24 items-center whitespace-nowrap">{[...partners, ...partners].map((p, i) => (<img key={i} src={p.logo} className="h-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all object-contain" alt={p.name} />))}</motion.div>
  </section>
);

const ContactSection = ({ content, onOpenDesignersPortal, onAddLead }: any) => {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault(); setIsSubmitting(true);
    setTimeout(() => { onAddLead({ ...form, id: Date.now(), date: new Date().toLocaleString('he-IL') }); setIsSubmitting(false); setIsSuccess(true); setForm({ name: '', phone: '', message: '' }); setTimeout(() => setIsSuccess(false), 5000); }, 1500);
  };
  return (
    <section id="contact" className="py-32 md:py-48" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 md:gap-32 items-start">
        <div className="bg-[#0D1525]/80 border border-[#1E2D4A] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl order-2 lg:order-1">
          {isSuccess ? (<div className="text-center py-20"><CheckCircle2 className="text-[#00A19B] mx-auto mb-10" size={64}/><h3 className="text-3xl md:text-4xl font-black text-white italic mb-4">{content.successTitle}</h3><p className="text-slate-400 italic">{content.successDesc}</p></div>) : (
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <input required className="w-full bg-[#050810] border border-[#1E2D4A] p-6 rounded-2xl text-white italic outline-none focus:border-[#00A19B]" placeholder="שם מלא" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input required className="w-full bg-[#050810] border border-[#1E2D4A] p-6 rounded-2xl text-white italic outline-none focus:border-[#00A19B]" placeholder="טלפון" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <textarea className="w-full bg-[#050810] border border-[#1E2D4A] p-6 rounded-2xl text-white h-32 italic outline-none focus:border-[#00A19B] resize-none" placeholder="איך נוכל לעזור?" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#00A19B] text-white font-black text-xl md:text-2xl italic rounded-2xl md:rounded-3xl shadow-xl hover:bg-[#008a85] transition-all">{isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : "צרו אימפקט"}</button>
            </form>
          )}
        </div>
        <div className="text-right order-1 lg:order-2">
          <h3 className="text-5xl md:text-8xl font-black text-white italic uppercase mb-6 tracking-tighter leading-tight">{content.headingContactTitle}</h3>
          <p className="text-slate-400 text-xl md:text-2xl font-light italic mb-12">{content.contactSectionDesc}</p>
          <div className="space-y-6 mb-16">
            <div className="flex items-center gap-6 group"><div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-[#00A19B] border border-[#00A19B]/30 rounded-full group-hover:bg-[#00A19B] group-hover:text-white transition-all"><MapPin size={28}/></div><div className="text-right flex-1"><span className="text-slate-500 font-bold italic text-xs block mb-1">המשרדים</span><span className="text-xl md:text-2xl text-white font-black italic">{content.contactAddress}</span></div></div>
            <div className="flex items-center gap-6 group"><div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-[#F7941D] border border-[#F7941D]/30 rounded-full group-hover:bg-[#F7941D] group-hover:text-white transition-all"><Phone size={28}/></div><div className="text-right flex-1"><span className="text-slate-500 font-bold italic text-xs block mb-1">דברו איתנו</span><span className="text-xl md:text-2xl text-white font-black italic" dir="ltr">{content.contactPhone}</span></div></div>
            <div className="flex items-center gap-6 group"><div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-[#E2231A] border border-[#E2231A]/30 rounded-full group-hover:bg-[#E2231A] group-hover:text-white transition-all"><Mail size={28}/></div><div className="text-right flex-1"><span className="text-slate-500 font-bold italic text-xs block mb-1">כתבו לנו</span><a href={`mailto:${content.contactEmail}`} className="text-xl md:text-2xl text-white font-black italic hover:text-[#00A19B]">{content.contactEmail}</a></div></div>
            <div className="flex items-center gap-6 group"><div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border border-white/10 rounded-full group-hover:bg-white group-hover:text-black transition-all"><Instagram size={28} className="insta-gradient"/></div><div className="text-right flex-1"><span className="text-slate-500 font-bold italic text-xs block mb-1">אינסטגרם</span><a href={`https://instagram.com/${content.contactInstagram}`} target="_blank" className="text-xl md:text-2xl text-white font-black italic hover:text-teal-400">@{content.contactInstagram}</a></div></div>
          </div>
          <button onClick={onOpenDesignersPortal} className="bg-[#0D1525]/60 p-6 rounded-[2rem] border border-[#1E2D4A] w-full flex items-center justify-between hover:bg-[#141C2D] group transition-all"><ChevronLeft size={24} className="text-slate-600 group-hover:text-white" /><div className="text-right flex-1 mx-6"><h4 className="text-xl md:text-2xl font-black text-white italic uppercase">PORTAL 2.0</h4><p className="text-slate-500 text-[10px] italic font-bold uppercase tracking-widest">מפרטים טכניים להורדה</p></div><div className="w-12 h-12 bg-[#00A19B]/10 rounded-2xl flex items-center justify-center text-[#00A19B] group-hover:bg-[#00A19B] group-hover:text-white transition-all"><FileCode size={32}/></div></button>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ content, onTriggerReporterLogin, onOpenLegal }: any) => (
  <footer className="bg-slate-950 pt-32 pb-16 border-t border-white/5" dir="rtl">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-16">
      <div className="space-y-8"><Logo logoUrl={content.logoUrl} className="scale-125" /><p className="text-slate-500 text-xl font-light italic max-w-md">{content.footerSlogan}</p></div>
      <div className="flex flex-col gap-4 text-right">
        <h4 className="text-white font-black italic uppercase tracking-widest mb-2">משפטי</h4>
        <button onClick={() => onOpenLegal('terms')} className="text-slate-500 hover:text-teal-400 text-sm italic font-bold text-right transition-colors">תקנון האתר</button>
        <button onClick={() => onOpenLegal('privacy')} className="text-slate-500 hover:text-teal-400 text-sm italic font-bold text-right transition-colors">מדיניות פרטיות</button>
        <button onClick={() => onOpenLegal('access')} className="text-slate-500 hover:text-teal-400 text-sm italic font-bold text-right transition-colors">הצהרת נגישות</button>
      </div>
      <div className="flex flex-col gap-4 text-right">
        <h4 className="text-white font-black italic uppercase tracking-widest mb-2">מערכת</h4>
        <button onClick={onTriggerReporterLogin} className="text-slate-500 hover:text-orange-500 text-sm italic font-bold text-right transition-colors flex items-center gap-2 justify-end">כניסת כתבים <Zap size={14}/></button>
        <div className="text-slate-700 text-[10px] font-black uppercase mt-10 tracking-widest">{content.footerCopyright}</div>
      </div>
    </div>
  </footer>
);

// --- Admin Panel ---

const AdminPanel = ({ onClose, siteContent, setSiteContent, departments, setDepartments, magazines, setMagazines, partners, setPartners, galleryItems, setGalleryItems, signageSpecs, setSignageSpecs, blogs, setBlogs, newsFlashes, setNewsFlashes, leads, setLeads, onLogout, adminPassword, setAdminPassword, masterCode, setMasterCode, reporters, setReporters }: any) => {
  const [activeTab, setActiveTab] = useState("cms-main");
  const [cmsTab, setCmsTab] = useState("hero");
  const [isUploading, setIsUploading] = useState(false);
  const [galCategory, setGalCategory] = useState("שלטי חוצות");
  const [activeEnhancer, setActiveEnhancer] = useState<string | null>(null);
  const [enhancerCallback, setEnhancerCallback] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formState, setFormState] = useState<any>({});

  const tabs = [
    { id: 'cms-main', label: 'תוכן האתר', icon: <Settings size={16}/> }, 
    { id: 'pubs', label: 'עיתונות', icon: <Newspaper size={16}/> }, 
    { id: 'gallery', label: 'גלריה', icon: <LucideImage size={16}/> }, 
    { id: 'blog', label: 'בלוג', icon: <BookOpen size={16}/> }, 
    { id: 'depts', label: 'מחלקות', icon: <Building2 size={16}/> }, 
    { id: 'reporters', label: 'כתבים', icon: <Users size={16}/> }, 
    { id: 'partners', label: 'שותפים', icon: <Handshake size={16}/> }, 
    { id: 'specs', label: 'מפרטים', icon: <FileCode size={16}/> },
    { id: 'leads', label: 'פניות', icon: <MessageSquareText size={16}/> }, 
    { id: 'legal', label: 'משפטי', icon: <Gavel size={16}/> }, 
    { id: 'security', label: 'אבטחה', icon: <ShieldIcon size={16}/> }
  ];

  const inputStyle = "w-full bg-[#050810] border border-white/10 p-5 rounded-2xl text-white focus:border-teal-500 outline-none italic font-light text-right shadow-inner";
  const labelStyle = "text-teal-400 text-[10px] font-black uppercase mb-3 block tracking-widest text-right opacity-80";
  const cardStyle = "bg-white/5 p-10 rounded-[3rem] border border-white/5 mb-10 shadow-2xl relative transition-all hover:bg-white/[0.07]";

  const ImageUploader = ({ label, value, onChange }: any) => (
    <div className="space-y-2 mb-6">
      <label className={labelStyle}>{label}</label>
      <div className="flex flex-row-reverse gap-6 items-center bg-[#050810]/50 p-6 rounded-3xl border border-white/5">
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative group">
          {value ? <img src={value} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto mt-8 text-white/10" size={32}/>}
          {value && <button onClick={() => { setActiveEnhancer(value); setEnhancerCallback(() => (newImg: string, sugg: any) => { onChange(newImg); if(sugg?.title) setFormState((prev:any)=>({...prev, title: sugg.title})); }); }} className="absolute inset-0 bg-teal-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><AIStars size={28} /></button>}
        </div>
        <div className="flex-1 relative">
           <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async e => { const f = e.target.files?.[0]; if(f) { setIsUploading(true); try { const b64 = await compressImage(f); onChange(b64); } catch(err) { console.error(err); } setIsUploading(false); } }} />
           <button className="w-full py-4 bg-white/5 rounded-2xl text-white font-black italic text-sm hover:bg-white/10 transition-all">{isUploading ? "מעבד..." : "בחר תמונה מהמחשב"}</button>
        </div>
        {value && <button onClick={() => onChange("")} className="text-red-500 hover:scale-125 transition-all"><Trash2 size={24}/></button>}
      </div>
    </div>
  );

  const renderCMS = () => (
    <div className="space-y-10">
      <div className="flex gap-3 bg-black/40 p-2 rounded-2xl w-fit mx-auto border border-white/5 backdrop-blur-md">
        {[ {id: 'hero', l: 'HERO'}, {id: 'about', l: 'ABOUT'}, {id: 'stats', l: 'STATS'}, {id: 'headings', l: 'HEADINGS'}, {id: 'contact', l: 'FORMS'} ].map(sub=>(
          <button key={sub.id} onClick={()=>setCmsTab(sub.id)} className={`px-8 py-3 rounded-xl text-[11px] font-black italic tracking-widest transition-all ${cmsTab===sub.id?'bg-white text-black shadow-2xl':'text-slate-500 hover:text-white'}`}>{sub.l}</button>
        ))}
      </div>
      
      {cmsTab === 'hero' && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
            <button onClick={()=>setSiteContent({...siteContent, isTickerEnabled: !siteContent.isTickerEnabled})} className={`w-14 h-8 rounded-full transition-all relative ${siteContent.isTickerEnabled?'bg-teal-500':'bg-white/10'}`}><motion.div animate={{x: siteContent.isTickerEnabled?26:4}} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" /></button>
            <h4 className="text-white font-black italic text-lg">פס מבזקים פעיל?</h4>
          </div>
          <ImageUploader label="לוגו האתר" value={siteContent.logoUrl} onChange={(v:any)=>setSiteContent({...siteContent, logoUrl:v})} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div><label className={labelStyle}>YOUTUBE ID</label><input className={inputStyle} value={siteContent.heroVideoUrl} onChange={e=>setSiteContent({...siteContent, heroVideoUrl:e.target.value})} /></div>
            <div><label className={labelStyle}>כותרת ראשית</label><input className={inputStyle} value={siteContent.heroTitle} onChange={e=>setSiteContent({...siteContent, heroTitle:e.target.value})} /></div>
          </div>
          <div><label className={labelStyle}>תת כותרת</label><input className={inputStyle} value={siteContent.heroSubtitle} onChange={e=>setSiteContent({...siteContent, heroSubtitle:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div><label className={labelStyle}>גודל פונט כותרת</label><input type="number" className={inputStyle} value={siteContent.heroTitleScale} onChange={e=>setSiteContent({...siteContent, heroTitleScale: parseInt(e.target.value)})} /></div>
            <div><label className={labelStyle}>Y-OFFSET (פיקסלים)</label><input type="number" className={inputStyle} value={siteContent.heroYOffset} onChange={e=>setSiteContent({...siteContent, heroYOffset: parseInt(e.target.value)})} /></div>
          </div>
        </div>
      )}

      {cmsTab === 'about' && (
        <div className={cardStyle}>
          <h4 className="text-white font-black italic text-2xl mb-8 border-b border-white/5 pb-4">תוכן מדור אודות</h4>
          <div className="space-y-6">
            <div><label className={labelStyle}>כותרת אודות</label><input className={inputStyle} value={siteContent.aboutTitle} onChange={e=>setSiteContent({...siteContent, aboutTitle:e.target.value})} /></div>
            <div><label className={labelStyle}>תת כותרת</label><input className={inputStyle} value={siteContent.aboutSubtitle} onChange={e=>setSiteContent({...siteContent, aboutSubtitle:e.target.value})} /></div>
            <div><label className={labelStyle}>סיפור - פסקה 1</label><textarea className={`${inputStyle} h-40`} value={siteContent.aboutStoryP1} onChange={e=>setSiteContent({...siteContent, aboutStoryP1:e.target.value})} /></div>
            <div><label className={labelStyle}>סיפור - פסקה 2</label><textarea className={`${inputStyle} h-40`} value={siteContent.aboutStoryP2} onChange={e=>setSiteContent({...siteContent, aboutStoryP2:e.target.value})} /></div>
            <ImageUploader label="תמונה ראשית אודות" value={siteContent.aboutMainImg} onChange={(v:any)=>setSiteContent({...siteContent, aboutMainImg:v})} />
          </div>
        </div>
      )}

      {cmsTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(n => (
            <div key={n} className={cardStyle}>
               <h4 className="text-white font-black italic text-lg mb-6 border-b border-white/5 pb-2">אימפקט {n}</h4>
               <div className="space-y-4">
                  <input className={inputStyle} placeholder="כותרת (למשל: שלטי חוצות)" value={(siteContent as any)[`stats${n}Lbl`]} onChange={e=>setSiteContent({...siteContent, [`stats${n}Lbl`]:e.target.value})} />
                  <input className={inputStyle} placeholder="ערך (למשל: 1,500)" value={(siteContent as any)[`stats${n}Val`]} onChange={e=>setSiteContent({...siteContent, [`stats${n}Val`]:e.target.value})} />
                  <textarea className={`${inputStyle} h-24`} placeholder="תיאור קצר" value={(siteContent as any)[`stats${n}Desc`]} onChange={e=>setSiteContent({...siteContent, [`stats${n}Desc`]:e.target.value})} />
                  <ImageUploader label="תמונת רקע" value={(siteContent as any)[`stats${n}Img`]} onChange={(v:any)=>setSiteContent({...siteContent, [`stats${n}Img`]:v})} />
               </div>
            </div>
          ))}
        </div>
      )}

      {cmsTab === 'headings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { k: 'Pub', l: 'עיתונות' }, { k: 'Outdoor', l: 'חוצות' }, { k: 'Gallery', l: 'גלריה' },
             { k: 'About', l: 'אודות' }, { k: 'Depts', l: 'מחלקות' }, { k: 'Contact', l: 'בלוג וצור קשר' }
           ].map(sec => (
             <div key={sec.k} className={cardStyle}>
                <h4 className="text-[#F7941D] font-black italic text-lg mb-6 uppercase tracking-widest">{sec.l}</h4>
                <div className="space-y-4">
                   <div><label className={labelStyle}>כותרת</label><input className={inputStyle} value={(siteContent as any)[`heading${sec.k}Title`]} onChange={e=>setSiteContent({...siteContent, [`heading${sec.k}Title`]:e.target.value})} /></div>
                   <div><label className={labelStyle}>תיאור</label><textarea className={`${inputStyle} h-20`} value={(siteContent as any)[`heading${sec.k}Desc`]} onChange={e=>setSiteContent({...siteContent, [`heading${sec.k}Desc`]:e.target.value})} /></div>
                </div>
             </div>
           ))}
        </div>
      )}

      {cmsTab === 'contact' && (
        <div className={cardStyle}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div><label className={labelStyle}>כתובת המשרדים</label><input className={inputStyle} value={siteContent.contactAddress} onChange={e=>setSiteContent({...siteContent, contactAddress:e.target.value})} /></div>
              <div><label className={labelStyle}>טלפון</label><input className={inputStyle} value={siteContent.contactPhone} onChange={e=>setSiteContent({...siteContent, contactPhone:e.target.value})} /></div>
              <div><label className={labelStyle}>מייל</label><input className={inputStyle} value={siteContent.contactEmail} onChange={e=>setSiteContent({...siteContent, contactEmail:e.target.value})} /></div>
              <div><label className={labelStyle}>אינסטגרם (HANDLE)</label><input className={inputStyle} value={siteContent.contactInstagram} onChange={e=>setSiteContent({...siteContent, contactInstagram:e.target.value})} /></div>
           </div>
           <div className="mb-10"><label className={labelStyle}>תיאור מדור צור קשר</label><input className={inputStyle} value={siteContent.contactSectionDesc} onChange={e=>setSiteContent({...siteContent, contactSectionDesc:e.target.value})} /></div>
           <h4 className="text-white font-black italic text-lg mb-6 border-b border-white/5 pb-2">הודעה לאחר שליחת פנייה</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div><label className={labelStyle}>כותרת לאחר הצלחה</label><input className={inputStyle} value={siteContent.successTitle} onChange={e=>setSiteContent({...siteContent, successTitle:e.target.value})} /></div>
              <div><label className={labelStyle}>תיאור לאחר הצלחה</label><input className={inputStyle} value={siteContent.successDesc} onChange={e=>setSiteContent({...siteContent, successDesc:e.target.value})} /></div>
           </div>
        </div>
      )}
    </div>
  );

  const renderMagazines = () => (
    <div className={cardStyle}>
       <h3 className="text-2xl font-black text-white italic mb-10 border-b border-white/5 pb-4 uppercase tracking-tighter">ניהול עיתונות ומוספים</h3>
       <div className="bg-[#050810]/80 p-8 rounded-[3rem] border border-teal-500/20 mb-12 shadow-2xl">
          <h4 className="text-teal-400 font-black italic text-xs mb-6 uppercase tracking-[0.3em]">פרסום חדש</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <input className={inputStyle} placeholder="שם העיתון/מוסף" value={formState.name||''} onChange={e=>setFormState({...formState, name:e.target.value})} />
             <select className={inputStyle} value={formState.type || 'עיתון ראשי'} onChange={e=>setFormState({...formState, type:e.target.value})}>
                <option value="עיתון ראשי">עיתון ראשי</option>
                <option value="מוסף">מוסף</option>
             </select>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-6">
             <input className={inputStyle} placeholder="גיליון #" value={formState.lastIssueNumber||''} onChange={e=>setFormState({...formState, lastIssueNumber:e.target.value})} />
             <input className={inputStyle} placeholder="תאריך לועזי" value={formState.lastIssueDate||''} onChange={e=>setFormState({...formState, lastIssueDate:e.target.value})} />
             <input className={inputStyle} placeholder="תאריך עברי" value={formState.lastIssueHebrewDate||''} onChange={e=>setFormState({...formState, lastIssueHebrewDate:e.target.value})} />
          </div>
          <textarea className={`${inputStyle} h-24 mb-6`} placeholder="תיאור..." value={formState.desc||''} onChange={e=>setFormState({...formState, desc:e.target.value})} />
          <div className="grid grid-cols-2 gap-6 mb-6">
             <input className={inputStyle} placeholder="קישור לקריאה" value={formState.lastIssueLink||''} onChange={e=>setFormState({...formState, lastIssueLink:e.target.value})} />
             <input className={inputStyle} placeholder="קישור לארכיון" value={formState.archiveLink||''} onChange={e=>setFormState({...formState, archiveLink:e.target.value})} />
          </div>
          <input className={inputStyle + " mb-6"} placeholder="קישור להצטרפות" value={formState.joinLink||''} onChange={e=>setFormState({...formState, joinLink:e.target.value})} />
          <ImageUploader label="תמונת שער" value={formState.image} onChange={(v:any)=>setFormState({...formState, image:v})} />
          <button onClick={()=>{ const n = {...formState, id: editingItem?.id||Date.now()}; setMagazines(editingItem ? magazines.map((i:any)=>i.id===editingItem.id?n:i) : [n, ...magazines]); setEditingItem(null); setFormState({}); }} className="w-full py-5 bg-teal-500 rounded-3xl font-black text-white text-xl italic hover:bg-teal-400 transition-all shadow-xl">פרסם עיתון</button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
             <h5 className="text-[#00A19B] font-black italic text-xs mb-4 uppercase tracking-widest">עיתונים ראשיים</h5>
             <div className="space-y-3">{magazines.filter((it:any)=>it.type==='עיתון ראשי').map((m:any)=>(
                <div key={m.id} className="bg-slate-950/50 p-6 rounded-2xl flex flex-row-reverse justify-between items-center border border-white/5">
                   <span className="text-white font-black italic text-xl">{m.name}</span>
                   <div className="flex gap-4"><button onClick={()=>{setEditingItem(m); setFormState(m);}} className="text-teal-500"><Edit size={20}/></button><button onClick={()=>setMagazines(magazines.filter((i:any)=>i.id!==m.id))} className="text-red-500"><Trash2 size={20}/></button></div>
                </div>
             ))}</div>
          </div>
          <div>
             <h5 className="text-[#F7941D] font-black italic text-xs mb-4 uppercase tracking-widest">מוספים</h5>
             <div className="space-y-3">{magazines.filter((it:any)=>it.type==='מוסף').map((m:any)=>(
                <div key={m.id} className="bg-slate-950/50 p-6 rounded-2xl flex flex-row-reverse justify-between items-center border border-white/5">
                   <span className="text-white font-black italic text-xl">{m.name}</span>
                   <div className="flex gap-4"><button onClick={()=>{setEditingItem(m); setFormState(m);}} className="text-teal-500"><Edit size={20}/></button><button onClick={()=>setMagazines(magazines.filter((i:any)=>i.id!==m.id))} className="text-red-500"><Trash2 size={20}/></button></div>
                </div>
             ))}</div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="w-full bg-[#0D1525] border border-white/10 rounded-[3rem] p-6 md:p-12 text-right shadow-2xl relative h-[92vh] flex flex-col overflow-hidden" dir="rtl">
      <div className="flex justify-between items-center mb-10 shrink-0">
        <div className="flex items-center gap-8">
           <Logo logoUrl={siteContent.logoUrl} className="scale-75 opacity-50" />
           <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">ELITE <span className="text-teal-400">ADMIN</span></h2>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogout} className="bg-red-500/10 text-red-500 px-8 py-3 rounded-full text-xs font-black italic uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">LOGOUT</button>
          <button onClick={onClose} className="bg-white/10 p-4 rounded-full text-white hover:bg-white/20 transition-all border border-white/10 shadow-xl"><X size={32}/></button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-10 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setEditingItem(null); setFormState({}); }} className={`px-10 py-5 rounded-full font-black text-xs md:text-sm transition-all flex items-center gap-4 italic whitespace-nowrap tracking-widest ${activeTab === t.id ? 'bg-[#00A19B] text-white shadow-[0_0_30px_rgba(0,161,155,0.4)] scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40 px-2">
        {activeTab === 'cms-main' && renderCMS()}
        {activeTab === 'pubs' && renderMagazines()}
        
        {activeTab === 'gallery' && (
          <div className={cardStyle}>
            <h3 className="text-2xl font-black text-white mb-10 border-b border-white/5 pb-4 uppercase italic">ניהול גלריה</h3>
            <div className="border-4 border-dashed border-white/5 rounded-[4rem] p-20 text-center mb-12 flex flex-col items-center gap-8 bg-black/20 hover:border-teal-500/30 transition-all group">
              <div className="w-24 h-24 bg-teal-500/10 rounded-3xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-all"><UploadCloud size={64} /></div>
              <div className="space-y-2"><h4 className="text-white font-black text-3xl italic uppercase">גרירת קבצים או בחירה</h4><p className="text-slate-500 italic">ניתן להעלות מספר תמונות במקביל לתיקיית הקטגוריה</p></div>
              <div className="flex gap-4 items-center">
                <select value={galCategory} onChange={e=>setGalCategory(e.target.value)} className={inputStyle+" w-64 h-16 text-lg"}>
                  {["שלטי חוצות", "פאשקוויל", "מיתוג", "דיגיטל", "אסטרטגיה", "קריאייטיב", "הפקות", "אירועים"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <input type="file" multiple accept="image/*" className="hidden" id="gal-inp" onChange={async e=>{ const files=Array.from(e.target.files||[]) as File[]; setIsUploading(true); for(const f of files){ try{ const b64=await compressImage(f); setGalleryItems((prev:any)=>[{id:Date.now()+Math.random(), image:b64, category:galCategory, title:f.name.split('.')[0]}, ...prev]); }catch(err){console.error(err)}} setIsUploading(false); }} />
                <button onClick={()=>document.getElementById('gal-inp')?.click()} className="bg-teal-500 text-white px-12 py-5 rounded-2xl font-black text-xl italic hover:scale-105 transition-all shadow-2xl">{isUploading?"מעבד...":"בחר קבצים"}</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-6">{galleryItems.map((g:any)=>(<div key={g.id} className="aspect-square bg-slate-950 rounded-2xl overflow-hidden relative group border border-white/5 shadow-2xl"><img src={g.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all"/><div className="absolute inset-0 bg-teal-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all"><button onClick={()=>{setActiveEnhancer(g.image);setEnhancerCallback(()=>(newImg:string,sugg:any)=>setGalleryItems((p:any)=>p.map((it:any)=>it.id===g.id?{...it,image:newImg,title:sugg?.title||it.title}:it)));}} className="bg-white text-black p-3 rounded-2xl shadow-2xl"><AIStars size={20}/></button><button onClick={()=>setGalleryItems((p:any)=>p.filter((i:any)=>i.id!==g.id))} className="bg-red-500 text-white p-3 rounded-2xl shadow-2xl"><Trash2 size={20}/></button></div><div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-xl text-[10px] text-center font-bold text-white opacity-0 group-hover:opacity-100 transition-all">{g.category}</div></div>))}</div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className={cardStyle}>
             <h3 className="text-2xl font-black text-white italic mb-10 border-b border-white/5 pb-4 uppercase">ניהול בלוג</h3>
             <div className="bg-[#050810]/80 p-8 rounded-[3rem] border border-teal-500/20 mb-12">
                <input className={inputStyle + " mb-6"} placeholder="כותרת הכתבה" value={formState.title||''} onChange={e=>setFormState({...formState, title:e.target.value})} />
                <textarea className={`${inputStyle} h-64 mb-6 leading-relaxed`} placeholder="תוכן הכתבה..." value={formState.content||''} onChange={e=>setFormState({...formState, content:e.target.value})} />
                <ImageUploader label="תמונת רקע" value={formState.image} onChange={(v:any)=>setFormState({...formState, image:v})} />
                <button onClick={()=>{ if(!formState.title)return; const n = {...formState, id: editingItem?.id||Date.now(), date: new Date().toLocaleDateString('he-IL')}; setBlogs(editingItem ? blogs.map((i:any)=>i.id===editingItem.id?n:i) : [n, ...blogs]); setEditingItem(null); setFormState({}); }} className="w-full py-5 bg-teal-500 rounded-3xl font-black text-white text-xl italic hover:bg-teal-400 transition-all">פרסם כתבה</button>
             </div>
             <div className="space-y-4">{blogs.map((b:any)=>(<div key={b.id} className="bg-slate-950/50 p-6 rounded-2xl flex flex-row-reverse justify-between items-center border border-white/5"><span className="text-white font-black italic text-xl">{b.title}</span><div className="flex gap-4"><button onClick={()=>{setEditingItem(b);setFormState(b);}} className="text-teal-500"><Edit size={20}/></button><button onClick={()=>setBlogs(blogs.filter((i:any)=>i.id!==b.id))} className="text-red-500"><Trash2 size={20}/></button></div></div>))}</div>
          </div>
        )}

        {activeTab === 'depts' && (
          <div className={cardStyle}>
             <h3 className="text-2xl font-black text-white mb-10 border-b border-white/5 pb-4 uppercase italic">ניהול מחלקות</h3>
             <div className="bg-[#050810]/80 p-8 rounded-[3rem] border border-teal-500/20 mb-12">
                <h4 className="text-teal-400 font-black italic text-xs mb-6 uppercase tracking-widest">מחלקה חדשה</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <input className={inputStyle} placeholder="שם המחלקה" value={formState.title||''} onChange={e=>setFormState({...formState, title:e.target.value})} />
                   <select className={inputStyle} value={formState.icon || 'Lightbulb'} onChange={e=>setFormState({...formState, icon: e.target.value})}>
                     {Object.keys(IconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                   </select>
                </div>
                <textarea className={`${inputStyle} h-24 mb-6`} placeholder="תיאור המחלקה..." value={formState.desc||''} onChange={e=>setFormState({...formState, desc:e.target.value})} />
                <ImageUploader label="תמונת רקע מחלקה" value={formState.image} onChange={(v:any)=>setFormState({...formState, image:v})} />
                <button onClick={()=>{ const n = {...formState, id: editingItem?.id||Date.now()}; setDepartments(editingItem?departments.map((i:any)=>i.id===editingItem.id?n:i):[n,...departments]); setEditingItem(null); setFormState({}); }} className="w-full py-5 bg-teal-500 rounded-3xl font-black text-white text-xl italic hover:bg-teal-400">הוסף מחלקה</button>
             </div>
             <div className="space-y-4">{departments.map((d:any)=>(<div key={d.id} className="bg-slate-950/50 p-6 rounded-2xl flex flex-row-reverse justify-between items-center border border-white/5"><div className="flex items-center gap-4 flex-row-reverse"><div className="text-teal-400"><Layout size={24}/></div><span className="text-white font-black italic text-xl">{d.title}</span></div><div className="flex gap-4"><button onClick={()=>{setEditingItem(d);setFormState(d);}} className="text-teal-500"><Edit size={20}/></button><button onClick={()=>setDepartments(departments.filter((i:any)=>i.id!==d.id))} className="text-red-500"><Trash2 size={20}/></button></div></div>))}</div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={cardStyle}>
            <h3 className="text-2xl font-black text-white mb-10 border-b border-white/5 pb-4 uppercase italic">אבטחת מערכת</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div><label className={labelStyle}>סיסמת ניהול (ADMIN PASSWORD)</label><input type="password" className={inputStyle} value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} /></div>
              <div><label className={labelStyle}>קוד מאסטר (GATE CODE)</label><input type="password" className={inputStyle} value={masterCode} onChange={e=>setMasterCode(e.target.value)} /></div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            {leads.length === 0 ? <div className="text-center py-40 text-slate-700 italic text-4xl font-black uppercase">NO NEW INQUIRIES</div> : leads.map((l:any)=>(
              <div key={l.id} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 text-right hover:bg-white/[0.08] transition-all group shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                   <button onClick={()=>setLeads(leads.filter((it:any)=>it.id!==l.id))} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all p-3 bg-red-500/10 rounded-2xl"><Trash2 size={28}/></button>
                   <div className="text-teal-400 text-sm font-black uppercase tracking-widest bg-teal-500/10 px-4 py-1.5 rounded-full">{l.date}</div>
                </div>
                <div className="text-4xl font-black text-white mb-4 tracking-tighter">{l.name} <span className="text-slate-600 font-light mx-4">|</span> <span dir="ltr" className="text-teal-400">{l.phone}</span></div>
                <div className="text-slate-400 mt-2 bg-[#050810] p-8 rounded-[2rem] italic font-light text-xl leading-relaxed whitespace-pre-wrap shadow-inner">{l.message}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'partners' && (
          <div className={cardStyle}>
            <h3 className="text-2xl font-black text-white italic mb-10 border-b border-white/5 pb-4 uppercase">ניהול שותפים</h3>
            <div className="bg-[#050810]/80 p-8 rounded-[3rem] border border-teal-500/20 mb-12">
               <input className={inputStyle + " mb-6"} placeholder="שם השותף" value={formState.name||''} onChange={e=>setFormState({...formState, name:e.target.value})} />
               <ImageUploader label="לוגו שותף" value={formState.logo} onChange={(v:any)=>setFormState({...formState, logo:v})} />
               <button onClick={()=>{ if(!formState.logo)return; setPartners([...partners, {...formState, id: Date.now()}]); setFormState({}); }} className="w-full py-5 bg-teal-500 rounded-3xl font-black text-white text-xl italic hover:bg-teal-400">הוסף שותף</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {partners.map((p:any)=>(
                  <div key={p.id} className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-4 relative group">
                     <img src={p.logo} className="h-12 object-contain" />
                     <button onClick={()=>setPartners(partners.filter((it:any)=>it.id!==p.id))} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"><Trash2 size={16}/></button>
                  </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'reporters' && (
          <div className={cardStyle}>
             <h3 className="text-xl font-black text-white mb-8 border-b border-white/5 pb-4">כתבי מערכת</h3>
             <div className="bg-black/30 p-6 rounded-[2rem] space-y-4 border border-teal-500/20 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <input className={inputStyle} placeholder="שם מלא" value={formState.name||''} onChange={e=>setFormState({...formState, name:e.target.value})} />
                  <input className={inputStyle} placeholder="שם משתמש" value={formState.username||''} onChange={e=>setFormState({...formState, username:e.target.value})} />
                </div>
                <input className={inputStyle} type="password" placeholder="סיסמה" value={formState.password||''} onChange={e=>setFormState({...formState, password:e.target.value})} />
                <button onClick={()=>{ if(!formState.username||!formState.password)return; setReporters([...reporters, {...formState, id:Date.now()}]); setFormState({}); }} className="w-full py-4 bg-teal-500 rounded-2xl font-black text-white shadow-lg">הוסף כתב</button>
             </div>
             <div className="space-y-2">{reporters.map((r:any)=>(<div key={r.id} className="bg-slate-950 p-4 rounded-xl flex flex-row-reverse justify-between items-center border border-white/5"><span className="text-white font-bold">{r.name} ({r.username})</span><button onClick={()=>setReporters(reporters.filter((i:any)=>i.id!==r.id))} className="text-red-500 hover:scale-110 transition-all"><Trash2 size={18}/></button></div>))}</div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className={cardStyle}>
            <h3 className="text-xl font-black text-white mb-8 border-b border-white/5 pb-4">מפרטים טכניים (Portal)</h3>
            <div className="bg-black/30 p-6 rounded-[2rem] space-y-4 border border-teal-500/20 mb-8">
              <input className={inputStyle} placeholder="שם המפרט" value={formState.title||''} onChange={e=>setFormState({...formState, title:e.target.value})} />
              <input className={inputStyle} placeholder="מידות (למשל: 210X300 ס״מ)" value={formState.size||''} onChange={e=>setFormState({...formState, size:e.target.value})} />
              <textarea className={`${inputStyle} h-24`} placeholder="תיאור נוסף והערות לגרפיקאי" value={formState.desc||''} onChange={e=>setFormState({...formState, desc:e.target.value})} />
              <button onClick={()=>{ const n = {...formState, id: editingItem?.id||Date.now()}; setSignageSpecs(editingItem ? signageSpecs.map((i:any)=>i.id===editingItem.id?n:i) : [n, ...signageSpecs]); setEditingItem(null); setFormState({}); }} className="w-full py-4 bg-teal-500 rounded-2xl font-black text-white shadow-lg">הוסף מפרט טכני</button>
            </div>
            <div className="space-y-2">{signageSpecs.map((s:any)=>(<div key={s.id} className="bg-slate-950 p-4 rounded-xl flex flex-row-reverse justify-between items-center border border-white/5"><span className="text-white font-bold">{s.title}</span><div className="flex gap-4"><button onClick={()=>{setEditingItem(s); setFormState(s);}} className="text-teal-500"><Edit size={18}/></button><button onClick={()=>setSignageSpecs(signageSpecs.filter((i:any)=>i.id!==s.id))} className="text-red-500"><Trash2 size={18}/></button></div></div>))}</div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className={cardStyle}>
            <h3 className="text-xl font-black text-white mb-8 border-b border-white/5 pb-4">מסמכים משפטיים</h3>
            <div className="space-y-6">
              <div className="space-y-1"><label className={labelStyle}>תקנון האתר</label><textarea className={`${inputStyle} h-40`} value={siteContent.legalTerms} onChange={e=>setSiteContent({...siteContent, legalTerms:e.target.value})} /></div>
              <div className="space-y-1"><label className={labelStyle}>מדיניות פרטיות</label><textarea className={`${inputStyle} h-40`} value={siteContent.legalPrivacy} onChange={e=>setSiteContent({...siteContent, legalPrivacy:e.target.value})} /></div>
              <div className="space-y-1"><label className={labelStyle}>הצהרת נגישות</label><textarea className={`${inputStyle} h-40`} value={siteContent.legalAccessibility} onChange={e=>setSiteContent({...siteContent, legalAccessibility:e.target.value})} /></div>
            </div>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {activeEnhancer && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActiveEnhancer(null)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl"/>
            <motion.div initial={{scale:0.9, y: 20}} animate={{scale:1, y: 0}} className="relative z-10 w-full max-w-7xl">
              <AIEnhancerModal image={activeEnhancer} onClose={()=>setActiveEnhancer(null)} onApply={(newImg:any, sugg:any)=>{enhancerCallback(newImg, sugg); setActiveEnhancer(null);}} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 bg-slate-900/98 border-t border-white/10 p-10 flex justify-center z-[100] backdrop-blur-xl">
        <button onClick={onClose} className="bg-white text-black px-32 py-6 rounded-full font-black text-2xl hover:bg-teal-500 hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 italic active:scale-95 group">
          <Save size={32} className="group-hover:rotate-12 transition-transform"/> עדכן אתר בלייב
        </button>
      </div>
    </div>
  );
};

const AdminLogin = ({ onClose, onSuccess, correctPass, correctMaster }: any) => {
  const [step, setStep] = useState(1);
  const [inp, setInp] = useState("");
  const handle = (e: any) => { e.preventDefault(); if (step===1 && inp===correctMaster) { setStep(2); setInp(""); } else if (step===2 && inp===correctPass) onSuccess(); else setInp(""); };
  return (
    <div className="bg-[#050810] border border-white/10 p-20 rounded-[4rem] w-full max-w-xl text-center relative mx-auto overflow-hidden shadow-2xl backdrop-blur-3xl">
      <button onClick={onClose} className="absolute top-10 left-10 text-white/20 hover:text-white transition-all"><X size={40}/></button>
      <form onSubmit={handle} className="space-y-12">
        <AnimatePresence mode="wait">
          {step===1 ? (
            <motion.div key="master" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="space-y-12">
              <div className="w-24 h-24 bg-teal-500/10 rounded-3xl mx-auto flex items-center justify-center text-teal-500 shadow-2xl border border-teal-500/20"><Fingerprint size={80} /></div>
              <h2 className="text-4xl font-black text-white italic uppercase tracking-[0.2em] leading-none">MASTER ACCESS</h2>
              <input type="password" autoFocus className="w-full bg-black/40 border border-white/10 p-8 rounded-[2.5rem] text-white text-center text-5xl outline-none focus:border-teal-500 focus:shadow-[0_0_40px_rgba(20,184,166,0.2)] transition-all font-mono" placeholder="••••" value={inp} onChange={e=>setInp(e.target.value)} />
            </motion.div>
          ) : (
            <motion.div key="auth" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="space-y-12">
              <div className="w-24 h-24 bg-orange-500/10 rounded-3xl mx-auto flex items-center justify-center text-orange-500 shadow-2xl border border-orange-500/20"><Lock size={80} /></div>
              <h2 className="text-4xl font-black text-white italic uppercase tracking-[0.2em] leading-none">AUTHORIZE</h2>
              <input type="password" autoFocus className="w-full bg-black/40 border border-white/10 p-8 rounded-[2.5rem] text-white text-center text-2xl outline-none focus:border-orange-500 focus:shadow-[0_0_40px_rgba(249,115,22,0.2)] transition-all" placeholder="Enter System Password" value={inp} onChange={e=>setInp(e.target.value)} />
            </motion.div>
          )}
        </AnimatePresence>
        <button className="w-full bg-teal-500 py-7 rounded-[2.5rem] text-white font-black text-2xl hover:bg-teal-400 transition-all shadow-2xl">כניסה למערכת</button>
      </form>
    </div>
  );
};

const ReporterLogin = ({ onClose, onSuccess, reporters }: any) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const handle = (e: any) => { e.preventDefault(); const f = reporters.find((r:any)=>r.username===user && r.password===pass); if (f) onSuccess(f); };
  return (
    <div className="bg-[#050810] border border-white/10 p-20 rounded-[4rem] w-full max-w-xl text-center relative mx-auto shadow-2xl">
      <button onClick={onClose} className="absolute top-10 left-10 text-white/20 hover:text-white transition-all"><X size={40}/></button>
      <div className="mb-12">
        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl mx-auto flex items-center justify-center text-orange-500 mb-8 border border-orange-500/20 shadow-2xl"><Zap size={64}/></div>
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">REPORTER LOGIN</h2>
      </div>
      <form onSubmit={handle} className="space-y-8">
        <input className="w-full bg-black/40 border border-white/10 p-7 rounded-[2rem] text-white text-center text-xl outline-none focus:border-orange-500 transition-all" placeholder="Username" value={user} onChange={e=>setUser(e.target.value)} />
        <input type="password" className="w-full bg-black/40 border border-white/10 p-7 rounded-[2rem] text-white text-center text-xl outline-none focus:border-orange-500 transition-all" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="w-full bg-orange-500 py-7 rounded-[2rem] text-white font-black text-2xl hover:bg-orange-400 transition-all shadow-2xl">התחברות כתב</button>
      </form>
    </div>
  );
};

const ReporterPanel = ({ onClose, reporter, newsFlashes, setNewsFlashes, onLogout }: any) => {
  const [form, setForm] = useState<any>({ title: '', content: '' });
  return (
    <div className="w-full bg-[#0D1525] border border-white/10 rounded-[3.5rem] p-10 md:p-16 text-right shadow-2xl relative h-fit" dir="rtl">
      <div className="flex justify-between items-center mb-16 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6 flex-row-reverse text-right">
          <div className="w-20 h-20 bg-orange-500/10 rounded-[2rem] flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-2xl"><Zap size={48}/></div>
          <div><h2 className="text-4xl font-black text-white italic uppercase leading-none mb-2">NEWS DESK</h2><p className="text-teal-400 font-bold text-lg uppercase tracking-widest">כתב: {reporter.name}</p></div>
        </div>
        <button onClick={onLogout} className="text-red-500 bg-red-500/10 px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl">LOGOUT</button>
      </div>
      <div className="space-y-10">
        <div className="space-y-2"><label className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 block opacity-60">כותרת המבזק</label><input className="w-full bg-[#050810] p-8 rounded-3xl text-white outline-none border border-white/10 focus:border-orange-500 font-black italic text-3xl shadow-inner transition-all" placeholder="הקלד כותרת דחופה..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
        <div className="space-y-2"><label className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 block opacity-60">תוכן הדיווח</label><textarea className="w-full bg-[#050810] p-10 rounded-[2.5rem] text-white outline-none h-80 border border-white/10 focus:border-orange-500 italic font-light text-2xl leading-relaxed shadow-inner transition-all" placeholder="פרטי המבזק כאן..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
        <button onClick={() => { if(form.title) { setNewsFlashes([{id: Date.now(), ...form, image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200", author: reporter.name, date: new Date().toLocaleDateString('he-IL') }, ...newsFlashes]); onClose(); } }} className="w-full py-10 bg-orange-500 rounded-[2.5rem] text-white font-black text-3xl italic hover:bg-orange-400 transition-all shadow-[0_30px_60px_rgba(249,115,22,0.3)] active:scale-95 group"><Zap className="inline-block mr-4 group-hover:animate-pulse" size={32}/> שדר מבזק חי למערכת</button>
      </div>
    </div>
  );
};

const FlashModal = ({ flash, onClose }: any) => (
  <div className="bg-[#0D1525] border border-white/10 rounded-[3rem] w-full max-w-6xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]" dir="rtl">
     <div className="h-[400px] md:h-[500px] relative shrink-0">
        <img src={flash.image} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1525] via-[#0D1525]/20 to-transparent" />
        <button onClick={onClose} className="absolute top-10 left-10 text-white hover:scale-110 transition-all bg-white/10 p-4 rounded-full backdrop-blur-md shadow-2xl border border-white/10"><X size={44}/></button>
        <div className="absolute bottom-12 right-12 left-12">
           <div className="flex items-center gap-4 text-teal-400 font-black italic text-sm mb-6 uppercase tracking-[0.3em]"><div className="w-10 h-0.5 bg-teal-500"></div>{flash.author} <span className="text-white/20">|</span> {flash.date}</div>
           <h2 className="text-5xl md:text-8xl font-black text-white italic leading-[0.9] uppercase tracking-tighter drop-shadow-2xl">{flash.title}</h2>
        </div>
     </div>
     <div className="flex-1 overflow-y-auto p-12 md:p-32 text-slate-300 text-2xl md:text-4xl leading-relaxed italic font-light whitespace-pre-wrap shadow-inner">{flash.content}</div>
  </div>
);

const BlogModal = ({ blog, onClose }: any) => (
  <div className="max-w-7xl w-full bg-[#0D1525] rounded-[3.5rem] border border-white/10 overflow-hidden relative text-right shadow-[0_50px_100px_rgba(0,0,0,0.8)] pb-10 mx-auto max-h-[95vh] overflow-y-auto no-scrollbar">
    <button onClick={onClose} className="absolute top-10 left-10 text-white z-20 hover:scale-110 transition-all bg-white/10 p-5 rounded-full backdrop-blur-md border border-white/10 shadow-2xl"><X size={44}/></button>
    <div className="h-[500px] md:h-[750px] relative">
      <img src={blog.image} className="w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1525] via-[#0D1525]/30 to-transparent" />
      <div className="absolute bottom-16 right-16 left-16">
        <h2 className="text-6xl md:text-[10rem] font-black text-white italic uppercase tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl">{blog.title}</h2>
        <div className="mt-8 flex items-center gap-10">
          <span className="text-teal-400 font-black italic text-2xl border-r-[12px] border-teal-500 pr-10 uppercase tracking-widest drop-shadow-lg">{blog.date}</span>
          <div className="h-0.5 flex-1 bg-white/10 shadow-lg"></div>
        </div>
      </div>
    </div>
    <div className="p-16 md:p-40 text-slate-300 text-3xl md:text-5xl leading-tight italic font-light whitespace-pre-wrap max-w-5xl mx-auto drop-shadow-md">{blog.content}</div>
  </div>
);

const FullGalleryModal = ({ onClose, items, content, onImageClick }: any) => {
  const [filter, setFilter] = useState("הכל");
  const categories = ["הכל", "שלטי חוצות", "פאשקוויל", "מיתוג", "דיגיטל", "אסטרטגיה", "קריאייטיב", "הפקות", "אירועים"];
  const filtered = filter === "הכל" ? items : items.filter((i: any) => i.category === filter);
  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-16 no-scrollbar bg-slate-950/80 backdrop-blur-3xl">
      <div className="flex justify-between items-center mb-16 w-full px-16">
        <button onClick={onClose} className="bg-white/10 p-8 rounded-full text-white hover:bg-teal-500 transition-all border border-white/10 shadow-2xl"><X size={48}/></button>
        <h2 className="text-5xl md:text-[10rem] font-black text-white italic uppercase text-center flex-1 tracking-tighter leading-none drop-shadow-2xl">{content.galleryModalTitle}</h2>
      </div>
      <div className="flex flex-wrap gap-5 mb-24 justify-center px-10">
        {categories.map(cat => (<button key={cat} onClick={() => setFilter(cat)} className={`px-16 py-6 rounded-full font-black transition-all italic uppercase tracking-[0.2em] text-sm md:text-lg ${filter === cat ? 'bg-teal-500 text-white shadow-[0_0_50px_rgba(0,161,155,0.4)] scale-110' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border border-white/5 shadow-xl'}`}>{cat}</button>))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 pb-60 w-full px-16 md:px-48">
        {filtered.length > 0 ? filtered.map((item: any) => (
          <div key={item.id} onClick={() => onImageClick(item)} className="bg-white/5 border border-white/10 rounded-[4rem] overflow-hidden group relative h-[600px] md:h-[900px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] cursor-pointer">
            <img src={item.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-115" />
            <div className="p-20 text-right bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent absolute bottom-0 inset-x-0">
               <span className="text-teal-400 text-lg md:text-2xl font-black uppercase italic tracking-[0.4em] mb-8 block opacity-80">{item.category}</span>
               <h3 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-2xl group-hover:text-teal-400 transition-colors">{item.title}</h3>
            </div>
          </div>
        )) : <div className="col-span-full py-60 text-center text-slate-900 text-7xl italic font-black uppercase tracking-tighter opacity-30">NO PROJECTS FOUND</div>}
      </div>
    </div>
  );
};

const DesignersPortal = ({ onClose, specs, content }: any) => {
  const [search, setSearch] = useState("");
  const filtered = specs.filter((s: any) => s.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="w-full h-full flex flex-col bg-[#050810] text-right" dir="rtl">
      <div className="w-full pt-20 pb-20 px-16 text-center">
        <h2 className="text-white text-6xl md:text-[12rem] font-black italic uppercase leading-none mb-8 tracking-tighter">DESIGNERS <span className="bg-gradient-to-l from-[#00C2FF] to-[#9D00FF] bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(0,194,255,0.3)]">PORTAL</span></h2>
        <p className="text-[#00C2FF] font-black italic text-2xl uppercase tracking-[0.4em] opacity-60">מפרטים טכניים, מידות והוראות סגירה לקמפיינים 2030</p>
      </div>
      <div className="max-w-8xl w-full mx-auto px-16 mb-20">
        <div className="bg-[#0D1525] border border-[#1E2D4A] p-6 rounded-[2.5rem] flex items-center gap-8 shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
          <Search className="text-[#00C2FF] mr-8" size={48} />
          <input type="text" placeholder="חפש מפרט טכני (למשל: דאבל 2X3, עמוד פנימי...)" className="w-full bg-transparent p-6 rounded-2xl text-white text-3xl outline-none italic font-light placeholder:text-slate-700 tracking-tight" value={search} onChange={e=>setSearch(e.target.value)}/>
          <button onClick={onClose} className="p-6 text-white hover:text-red-500 transition-all hover:rotate-90"><X size={44}/></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-16 md:px-48 pb-80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-10xl mx-auto">
          {filtered.map((s: any) => (
            <motion.div layout key={s.id} className="bg-[#0D1525] border border-[#1E2D4A] rounded-[4rem] overflow-hidden flex flex-col group hover:border-[#00C2FF]/50 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.5)] p-4 relative">
              <div className="p-10 flex flex-row-reverse justify-between items-start mb-4">
                <h3 className="text-white text-4xl font-black italic uppercase leading-none tracking-tighter">{s.title}</h3>
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#00C2FF]/10 flex items-center justify-center text-[#00C2FF] shadow-inner"><FileCode size={32}/></div>
              </div>
              <div className="p-10 pt-0">
                <div className="aspect-video bg-[#050810] border border-[#1E2D4A] rounded-[3rem] relative flex items-center justify-center overflow-hidden mb-12 shadow-inner group-hover:shadow-[0_0_60px_rgba(0,194,255,0.2)] transition-all">
                  <span className="text-[#00C2FF] font-black text-6xl italic tracking-tighter drop-shadow-2xl">{s.size}</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00C2FF]/5 to-transparent"></div>
                </div>
                <div className="space-y-6">
                  <div className="p-10 bg-[#141C2D]/50 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-inner">
                    <p className="text-slate-400 text-xl leading-relaxed italic text-right font-light whitespace-pre-wrap">{s.desc}</p>
                  </div>
                  <button onClick={()=>{navigator.clipboard.writeText(`${s.title}\nמידה: ${s.size}\n${s.desc}`); alert('הפרטים הועתקו ללוח העבודה שלך');}} className="w-full py-7 bg-[#00C2FF] text-black rounded-[3rem] font-black text-2xl italic hover:bg-white hover:scale-105 transition-all shadow-2xl active:scale-95 tracking-widest">העתק נתונים טכניים</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
