/**
 * Analyze Page
 * Primary landing page after login.
 *
 * Flow:
 * 1. User types a raw decision query
 * 2. Selects project (required) + domain (optional)
 * 3. Hits "Analyze" → auto-creates a challenge → triggers AI analysis
 * 4. SoundWave transitions: idle → input (typing) → thinking (analyzing) → result (done)
 * 5. ArtifactViewer renders inline below the wave
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, RotateCcw, ExternalLink } from 'lucide-react';
import Image from 'next/image';

import { useAuthStore } from '@/lib/stores';
import {
  useCreateChallenge,
  useAnalyze,
  useAnalyzeStatus,
  useArtifact,
  useProjects,
  useDomains,
  useExportPdf,
  useExportPptx,
  useReanalyze,
  useCreateProject,
} from '@/lib/hooks';
import type { ArtifactRead } from '@/lib/types';

import { SoundWave } from '@/components/ui/SoundWave';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ArtifactViewer } from '@/components/artifacts/artifact-viewer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { RoleGate } from '@/components/ui/RoleGate';
import { Wordmark } from '@/components/ui/Wordmark';
import { ProjectForm } from '@/components/projects';

type WaveState = 'idle' | 'input' | 'thinking' | 'result';
type AnalyzePhase = 'prompt' | 'analyzing' | 'result';

export default function AnalyzePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  /* ── form state ── */
  const [rawText, setRawText] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedDomainCode, setSelectedDomainCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);

  /* ── flow state ── */
  const [phase, setPhase] = useState<AnalyzePhase>('prompt');
  const [waveState, setWaveState] = useState<WaveState>('idle');
  const [artifactId, setArtifactId] = useState<string | undefined>(undefined);
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const [finalArtifact, setFinalArtifact] = useState<ArtifactRead | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── data hooks ── */
  const { data: projects, refetch: refetchProjects } = useProjects(1, 20);
  const { data: domains } = useDomains();
  const createChallenge = useCreateChallenge();
  const triggerAnalyze = useAnalyze();
  const reanalyze = useReanalyze();
  const exportPdf = useExportPdf();
  const exportPptx = useExportPptx();
  const createProject = useCreateProject();

  /* ── poll status until complete ── */
  const { data: statusData } = useAnalyzeStatus(artifactId, pollingEnabled);

  /* When status leaves 'processing', stop polling and show result */
  const { data: completedArtifact } = useArtifact(
    statusData?.status !== 'processing' && statusData?.artifact_id
      ? statusData.artifact_id
      : undefined
  );

  if (
    pollingEnabled &&
    statusData &&
    statusData.status !== 'processing' &&
    completedArtifact &&
    phase !== 'result'
  ) {
    setPollingEnabled(false);
    setWaveState('result');
    setFinalArtifact(completedArtifact);
    setTimeout(() => {
      setPhase('result');
    }, 600);
  }

  /* ── handlers ── */
  const handleTextFocus = useCallback(() => {
    if (waveState === 'idle') setWaveState('input');
  }, [waveState]);

  const handleTextBlur = useCallback(() => {
    if (waveState === 'input' && !rawText.trim()) setWaveState('idle');
  }, [waveState, rawText]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setRawText(e.target.value);
      if (e.target.value.trim() && waveState !== 'input') setWaveState('input');
      if (!e.target.value.trim() && waveState !== 'idle') setWaveState('idle');
      // Auto-resize
      const el = textareaRef.current;
      if (el) {
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
      }
    },
    [waveState]
  );

  const handleAnalyze = async () => {
    const trimmed = rawText.trim();
    if (trimmed.length < 10) {
      toast.error('Please describe your challenge in at least 10 characters.');
      return;
    }

    if (!selectedProjectId) {
      toast.error('You need to select or create a project before analyzing.');
      setShowCreateProjectDialog(true);
      return;
    }

    if (!user?.profile_completed) {
      toast.error('Complete your profile to unlock AI analysis.');
      router.push('/auth/complete-profile');
      return;
    }

    try {
      setPhase('analyzing');
      setWaveState('thinking');

      // Step 1: create challenge
      const challenge = await createChallenge.mutateAsync({
        raw_text: trimmed,
        project_id: selectedProjectId || '',
        domain_code: selectedDomainCode || undefined,
      });

      // Step 2: trigger AI
      const artifact = await triggerAnalyze.mutateAsync(challenge.id);
      setArtifactId(artifact.id);

      // Step 3: start polling
      if (artifact.status === 'processing') {
        setPollingEnabled(true);
      } else {
        // Already done (unlikely but safe)
        setWaveState('result');
        setFinalArtifact(artifact);
        setTimeout(() => setPhase('result'), 600);
      }
    } catch {
      toast.error('Analysis failed. Please try again.');
      setPhase('prompt');
      setWaveState('idle');
    }
  };

  const handleReset = () => {
    setRawText('');
    setSelectedProjectId('');
    setSelectedDomainCode('');
    setPhase('prompt');
    setWaveState('idle');
    setArtifactId(undefined);
    setPollingEnabled(false);
    setFinalArtifact(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleReanalyze = async () => {
    if (!finalArtifact) return;
    try {
      setPhase('analyzing');
      setWaveState('thinking');
      await reanalyze.mutateAsync(finalArtifact.id);
      setPollingEnabled(true);
    } catch {
      toast.error('Re-analysis failed.');
      setPhase('result');
      setWaveState('result');
    }
  };

  const handleExportPdf = async () => {
    if (!finalArtifact) return;
    try {
      await exportPdf.mutateAsync({ artifactId: finalArtifact.id });
    } catch {
      toast.error('Export failed.');
    }
  };

  const handleExportPptx = async () => {
    if (!finalArtifact) return;
    try {
      await exportPptx.mutateAsync({ artifactId: finalArtifact.id });
    } catch {
      toast.error('Export failed.');
    }
  };

  const isBusy = createChallenge.isPending || triggerAnalyze.isPending || pollingEnabled;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* ── Content ── */}
      <div className="flex flex-col flex-1">

        {/* Prompt phase */}
        <AnimatePresence mode="wait">
          {phase === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center flex-1 px-6 py-16"
            >
              {/* Wordmark */}
              <div className="mb-10">
                <Wordmark size="lg" />
              </div>

              {/* Wave (behind / above textarea) */}
              <div className="w-full max-w-2xl mb-4">
                <SoundWave state={waveState} className="h-[120px]" />
              </div>

              {/* Caption */}
              <p className="text-caption text-muted mb-8 tracking-wide">
                From complexity to clarity.
              </p>

              {/* Main textarea */}
              <div className="w-full max-w-2xl">
                <div className="relative rounded-xl border border-border bg-surface/80 backdrop-blur-sm shadow-sm transition-shadow focus-within:shadow-md">
                  <textarea
                    ref={textareaRef}
                    id="analyze-query"
                    value={rawText}
                    onChange={handleTextChange}
                    onFocus={handleTextFocus}
                    onBlur={handleTextBlur}
                    placeholder="Describe the decision or challenge you need clarity on..."
                    rows={4}
                    className="w-full resize-none bg-transparent px-5 pt-5 pb-3 text-body-md text-ink placeholder:text-muted focus:outline-none"
                    style={{ minHeight: '120px' }}
                    aria-label="Decision challenge input"
                  />

                  <div className="flex items-center justify-between px-5 pb-4 pt-1">
                    {/* Advanced toggle */}
                    <button
                      type="button"
                      onClick={() => setShowAdvanced((v) => !v)}
                      className="flex items-center gap-1 text-caption text-muted hover:text-ink transition-colors"
                      aria-expanded={showAdvanced}
                    >
                      Advanced options
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        strokeWidth={1.5}
                      />
                    </button>

                    {/* Analyze button */}
                    <Button
                      id="analyze-submit"
                      onClick={handleAnalyze}
                      disabled={isBusy || rawText.trim().length < 10}
                      className="flex items-center gap-2 px-6"
                    >
                      <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                      Analyze
                    </Button>
                  </div>

                  {/* Advanced options (project + domain) */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="grid gap-4 sm:grid-cols-2 px-5 py-4">
                          {/* Project */}
                          <div className="space-y-1.5">
                            <label className="text-caption text-muted font-medium">
                              Project *
                            </label>
                            <Select
                              value={selectedProjectId || undefined}
                              onValueChange={(v) => setSelectedProjectId(v === 'none' ? '' : v)}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="No project" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                  {projects?.items?.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.title}
                                  </SelectItem>
                                ))}
                                
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Domain */}
                          <div className="space-y-1.5">
                            <label className="text-caption text-muted font-medium">
                              Domain (optional)
                            </label>
                            <Select
                              value={selectedDomainCode || undefined}
                              onValueChange={(v) => setSelectedDomainCode(v === 'none' ? '' : v)}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Auto-detect" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Auto-detect</SelectItem>
                                {domains?.map((d) => (
                                  <SelectItem key={d.id} value={d.code}>
                                    {d.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile gate warning */}
                {!user?.profile_completed && (
                  <p className="mt-3 text-caption text-muted text-center">
                    <span className="text-ink">Complete your profile</span> to run AI analysis.{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/auth/complete-profile')}
                      className="underline hover:no-underline"
                    >
                      Do it now
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Analyzing phase */}
          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center flex-1 px-6 py-16"
            >
              <div className="mb-6">
                <Wordmark size="md" />
              </div>

              <div className="w-full max-w-2xl mb-6">
                <SoundWave state="thinking" className="h-[160px]" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <Spinner size="sm" />
                <p className="text-body-md text-ink">Analyzing your challenge…</p>
                <p className="text-caption text-muted">Structure for better decisions.</p>
              </div>

              {/* Original query preview */}
              <div className="mt-8 max-w-xl w-full rounded-lg border border-border bg-surface/60 backdrop-blur-sm px-5 py-4">
                <p className="text-caption text-muted mb-1 uppercase tracking-wide font-medium">
                  Your challenge
                </p>
                <p className="text-body-md text-ink line-clamp-4">{rawText}</p>
              </div>
            </motion.div>
          )}

          {/* Result phase */}
          {phase === 'result' && finalArtifact && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 px-6 py-8"
            >
              {/* Receding wave */}
              <div className="max-w-3xl mx-auto mb-6">
                <SoundWave state="result" className="h-[60px]" />
              </div>

              {/* Action bar */}
              <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Wordmark size="sm" />
                  <span className="text-muted text-caption">· Analysis complete</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                    New analysis
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReanalyze}
                    disabled={reanalyze.isPending}
                    className="flex items-center gap-1.5"
                  >
                    Re-analyse
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPdf}
                    disabled={exportPdf.isPending}
                  >
                    {exportPdf.isPending ? <Spinner size="sm" /> : 'Export PDF'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPptx}
                    disabled={exportPptx.isPending}
                  >
                    {exportPptx.isPending ? <Spinner size="sm" /> : 'Export PPTX'}
                  </Button>

                  <RoleGate minimum="admin">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/artifacts/${finalArtifact.id}`)}
                      className="flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Full view
                    </Button>
                  </RoleGate>
                </div>
              </div>

              {/* Artifact */}
              <div className="max-w-3xl mx-auto">
                <ArtifactViewer artifact={finalArtifact} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Project Dialog */}
        <Dialog open={showCreateProjectDialog} onOpenChange={setShowCreateProjectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                You need to create or select a project before analyzing a challenge.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              onSubmit={async (data) => {
                try {
                  await createProject.mutateAsync(data);
                  await refetchProjects();
                  setShowCreateProjectDialog(false);
                  toast.success('Project created! Select it and try analyzing again.');
                } catch {
                  toast.error('Failed to create project.');
                }
              }}
              onCancel={() => setShowCreateProjectDialog(false)}
              isLoading={createProject.isPending}
              error={createProject.isError ? new Error('Failed to create project') : null}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
