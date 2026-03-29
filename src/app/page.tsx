'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ChevronRight,
  Lock,
  Search,
  Target,
  Zap,
  FileText,
  Users,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Separator,
  SoundWave,
  Wordmark
} from '@/components/ui';
import { useAuthStore } from '@/lib/stores';
import { listKnowledge } from '@/lib/api/knowledge';
import type { KnowledgeItemRead } from '@/lib/types';
import { cn } from '@/lib/utils';

type WaveState = 'idle' | 'input' | 'thinking' | 'result';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  const [cards, setCards] = useState<KnowledgeItemRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<KnowledgeItemRead | null>(null);

  // Redirect if authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Fetch teaser cards (Limited to 4 per user request)
  useEffect(() => {
    async function fetchTeasers() {
      try {
        const response = await listKnowledge({ limit: 4 });
        setCards(response.items);
      } catch (err) {
        console.error('[v0] Failed to fetch teaser cards:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeasers();
  }, []);

  if (isHydrated && isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-ink/10">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4 lg:px-8 border-b border-border/40">
        <Wordmark size="sm" showLogo />
        <Link
          href="/auth/login"
          className="text-caption text-ink hover:text-ink/70 transition-colors font-medium"
        >
          Sign in
        </Link>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section - Search-First & Gated */}
        <section className="relative flex flex-col items-center px-4 pt-24 pb-32 overflow-hidden min-h-[600px] justify-center">
          {/* Background decoration */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-bg.PNG"
              alt="Hero Background"
              fill
              priority
              className="object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-canvas/60 via-canvas/20 to-canvas" />
          </div>

          <div className="relative z-10 w-full max-w-[640px] text-center mb-16">
            <h1 className="text-h1 text-gradient-ink mb-4">
              Complexity to Clarity.
            </h1>
            <p className="text-body-lg text-muted max-w-[480px] mx-auto">
              Professional decision infrastructure for navigating high-stakes organizational challenges.
            </p>
          </div>

          {/* Visually Locked Search Zone */}
          <div className="relative z-10 w-full max-w-[540px] group mt-50">
            {/* Animated, blended glow background - reduced bottom glow */}
            <div className="absolute -top-1 -left-1 -right-1 bottom-2 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 rounded-2xl blur-md opacity-70 transition duration-1000 group-hover:opacity-100 group-hover:blur-lg" />

            <div className="relative glass-card rounded-2xl p-1.5 shadow-2xl border border-white/10 dark:border-black/10">
              <div className="w-full flex items-center bg-surface/50 rounded-xl overflow-hidden backdrop-blur-md transition-colors group-hover:bg-surface/80">
                <div className="relative flex-1">
                  <input
                    type="text"
                    disabled
                    placeholder="Describe the business challenge you're under pressure to solve."
                    className="w-full bg-transparent border-none py-8 pl-14 pr-4 text-body-md text-ink/70 placeholder:text-muted/60 cursor-not-allowed italic focus:outline-none"
                  />
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500/70" strokeWidth={2} />
                </div>

                <div className="pr-3">
                  <Button
                    asChild
                    variant="primary"
                    className="shadow-md whitespace-nowrap h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none"
                  >
                    <Link href="/auth/login" title="Sign in to analyze" className="flex items-center gap-2">
                      <Lock className="h-4 w-4 opacity-90" strokeWidth={2} />
                      <span className="font-semibold text-[15px]">Analyze</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <SoundWave state="idle" className="w-48 opacity-40 group-hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </section>

        {/* 3. Intel Dispatch - Preview Knowledge (Grid of 4) */}
        <section className="bg-surface/30 border-y border-border/40 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-widest text-muted border-muted/30">
                  Intel Dispatch
                </Badge>
                <h2 className="text-h2">Strategic Discovery</h2>
              </div>
              <p className="text-body-md text-muted max-w-[400px]">
                A curated selection of decision intelligence reports from our master knowledge base.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-48 rounded-md border border-border/50 bg-canvas/50 animate-pulse" />
                  ))
                ) : (
                  cards.map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <KnowledgeTeaserCard
                        card={card}
                        onClick={() => setSelectedCard(card)}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 4. Infrastructure Section - 4 Feature Cards */}
        <section className="py-32 px-4 bg-canvas">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div>
                <h2 className="text-h1 mb-6 text-gradient-ink">
                  Modern Decision Infrastructure.
                </h2>
                <p className="text-body-lg text-muted">
                  M1NDMAP11 is not a simple tool; it is a thinking environment built for the complexity of modern leadership.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <div className="p-6 rounded-lg border border-border/60 bg-surface hover:border-ink/20 transition-colors">
                  <Target className="h-6 w-6 text-ink mb-4" strokeWidth={1.5} />
                  <h3 className="text-body-md font-medium mb-2">Precision Intelligence</h3>
                  <p className="text-caption text-muted">Move from raw complexity to reasoned strategic options with AI augmentation.</p>
                </div>
                {/* Feature 2 */}
                <div className="p-6 rounded-lg border border-border/60 bg-surface hover:border-ink/20 transition-colors">
                  <Shield className="h-6 w-6 text-ink mb-4" strokeWidth={1.5} />
                  <h3 className="text-body-md font-medium mb-2">Domain Sovereignty</h3>
                  <p className="text-caption text-muted">Analysis derived from your unique organization and proprietary strategic context.</p>
                </div>
                {/* Feature 3 */}
                <div className="p-6 rounded-lg border border-border/60 bg-surface hover:border-ink/20 transition-colors">
                  <FileText className="h-6 w-6 text-ink mb-4" strokeWidth={1.5} />
                  <h3 className="text-body-md font-medium mb-2">Executive Artifacts</h3>
                  <p className="text-caption text-muted">Instant generation of boardroom-ready PDF and PPTX strategic documentation.</p>
                </div>
                {/* Feature 4 */}
                <div className="p-6 rounded-lg border border-border/60 bg-surface hover:border-ink/20 transition-colors">
                  <Users className="h-6 w-6 text-ink mb-4" strokeWidth={1.5} />
                  <h3 className="text-body-md font-medium mb-2">Shared Workspace</h3>
                  <p className="text-caption text-muted">A unified contextual environment for cross-functional organizational decision-making.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Refined Footer */}
      <footer className="border-t border-border/40 py-16 px-4 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-4">
            <Wordmark size="sm" showLogo />
            <p className="text-caption text-muted max-w-[240px]">
              Engineered for clarity. Built for the high-stakes environment.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-ink font-semibold">Access</span>
              <Link href="/auth/login" className="text-caption text-muted hover:text-ink">Sign in</Link>
              <Link href="/auth/login?mode=signup" className="text-caption text-muted hover:text-ink">Register Organization</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-ink font-semibold">Platform</span>
              <span className="text-caption text-muted">Methodology</span>
              <span className="text-caption text-muted">Compliance</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border/20 flex justify-between items-center">
          <p className="text-[10px] text-muted uppercase tracking-widest">
            &copy; {new Date().getFullYear()} M1NDMAP11 Intelligence Systems
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-muted uppercase tracking-widest">v1.2.0</span>
          </div>
        </div>
      </footer>

      {/* Gated Knowledge Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
          {selectedCard && (
            <div className="flex flex-col">
              <div className="bg-charcoal p-8 text-ecru">
                <Badge variant="outline" className="border-ecru/30 text-ecru/70 mb-4 uppercase tracking-tighter text-[10px]">
                  {selectedCard.domain_code || 'Intelligence Brief'}
                </Badge>
                <DialogTitle className="text-h3 leading-tight mb-2">
                  {selectedCard.title}
                </DialogTitle>
                <p className="text-ecru/60 text-caption italic">
                  Gated Institutional Intelligence
                </p>
              </div>

              <div className="p-8 bg-surface space-y-6">
                <DialogDescription className="text-body-md text-ink/70 leading-relaxed">
                  {selectedCard.summary}
                </DialogDescription>

                <div className="bg-canvas/50 border border-border p-4 rounded flex items-start gap-3">
                  <Lock className="h-4 w-4 text-ink mt-0.5" strokeWidth={1.5} />
                  <p className="text-[12px] text-muted leading-snug">
                    Full analysis and strategic frameworks are only accessible to verified organizational members.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Button asChild variant="primary" className="w-full h-12">
                    <Link href="/auth/login">Sign in to Read Full Brief</Link>
                  </Button>
                  <div className="flex justify-between items-center px-2">
                    <Link href="/auth/login?mode=join" className="text-[11px] text-muted hover:text-ink font-medium uppercase tracking-widest flex items-center gap-1">
                      Join Request <ChevronRight className="h-3 w-3" />
                    </Link>
                    <Link href="/auth/login?mode=signup" className="text-[11px] text-muted hover:text-ink font-medium uppercase tracking-widest flex items-center gap-1">
                      New Org <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Knowledge Teaser Card Component
 * Executive style - clean, high-contrast, no fluff
 */
function KnowledgeTeaserCard({
  card,
  onClick,
}: {
  card: KnowledgeItemRead;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col h-full bg-surface border border-border/50 p-6 rounded-md hover:border-ink/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant="secondary" className="bg-ecru text-[9px] uppercase tracking-tighter text-charcoal py-0 px-2 h-5">
          {card.domain_code || 'Brief'}
        </Badge>
        <span className="flex items-center gap-1 text-[10px] text-muted uppercase tracking-widest">
          <Clock className="h-3 w-3" /> 5m read
        </span>
      </div>

      <h3 className="text-body-md font-medium text-ink mb-3 group-hover:text-ink/80 transition-colors line-clamp-2">
        {card.title}
      </h3>

      <p className="text-caption text-muted/80 line-clamp-3 mb-6 flex-1 italic">
        {card.summary}
      </p>

      <div className="pt-4 border-t border-border/30 flex items-center justify-between text-ink group-hover:gap-2 transition-all">
        <span className="text-[11px] font-semibold uppercase tracking-widest">Intel Level: A1</span>
        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
