'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { useAnalyze } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Progress } from '@/components/ui/Progress';

interface AnalyzeButtonProps {
  challengeId: string;
  disabled?: boolean;
}

export function AnalyzeButton({ challengeId, disabled }: AnalyzeButtonProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyzeChallenge = useAnalyze();

  const handleAnalyze = async () => {
    setShowDialog(true);
    setProgress(10);

    // Simulate progress while waiting for analysis
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 1000);

    try {
      const artifact = await analyzeChallenge.mutateAsync(challengeId);
      clearInterval(progressInterval);
      setProgress(100);

      // Small delay to show completion
      setTimeout(() => {
        setShowDialog(false);
        router.push(`/artifacts/${artifact.id}`);
      }, 500);
    } catch {
      clearInterval(progressInterval);
      setProgress(0);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={handleAnalyze}
        disabled={disabled || analyzeChallenge.isPending}
      >
        <Zap className="mr-2 h-4 w-4" strokeWidth={1.5} />
        Analyze Challenge
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {analyzeChallenge.isError
                ? 'Analysis Failed'
                : 'Analyzing Challenge'}
            </DialogTitle>
            <DialogDescription>
              {analyzeChallenge.isError
                ? 'There was an error analyzing your challenge. Please try again.'
                : 'Our AI is analyzing your challenge using organizational knowledge to generate a comprehensive decision artifact.'}
            </DialogDescription>
          </DialogHeader>

          {!analyzeChallenge.isError && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted text-center">
                {progress < 30 && 'Gathering organizational context...'}
                {progress >= 30 && progress < 60 && 'Analyzing decision factors...'}
                {progress >= 60 && progress < 90 && 'Generating recommendations...'}
                {progress >= 90 && 'Finalizing artifact...'}
              </p>
            </div>
          )}

          {analyzeChallenge.isError && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAnalyze}>
                Try again
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
