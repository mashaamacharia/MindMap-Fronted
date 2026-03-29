'use client';

import {
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Lightbulb,
  Gauge,
  ListChecks,
} from 'lucide-react';
import type { ArtifactRead, DecisionArtifact, StrategicOption, RiskItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Progress } from '@/components/ui/Progress';

interface ArtifactViewerProps {
  artifact: ArtifactRead;
}

function getEffortColor(effort: string) {
  switch (effort) {
    case 'low':
      return 'bg-surface text-muted border-border';
    case 'medium':
      return 'bg-canvas text-ink border-border';
    case 'high':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-surface text-muted border-border';
  }
}

function getImpactColor(impact: string) {
  switch (impact) {
    case 'low':
      return 'bg-surface text-muted border-border';
    case 'medium':
      return 'bg-canvas text-ink border-border';
    case 'high':
      return 'bg-charcoal text-ecru border-charcoal';
    default:
      return 'bg-surface text-muted border-border';
  }
}

function getSeverityVariant(severity: string): 'destructive' | 'secondary' | 'outline' | 'default' {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    default:
      return 'outline';
  }
}

function StrategicOptionCard({ option, index }: { option: StrategicOption; index: number }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-surface/50">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-medium text-ink">
          Option {index + 1}: {option.label}
        </h4>
        <div className="flex items-center gap-2">
          <Badge className={getEffortColor(option.estimated_effort)}>
            {option.estimated_effort} effort
          </Badge>
          <Badge className={getImpactColor(option.estimated_impact)}>
            {option.estimated_impact} impact
          </Badge>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        {option.rationale}
      </p>
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskItem }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-surface/50">
      <div className="flex items-start gap-3">
        <AlertTriangle 
          className={`h-5 w-5 flex-shrink-0 ${
            risk.severity === 'critical' || risk.severity === 'high' 
              ? 'text-destructive' 
              : risk.severity === 'medium' 
                ? 'text-ink' 
                : 'text-muted'
          }`} 
          strokeWidth={1.5} 
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={getSeverityVariant(risk.severity)}>
              {risk.severity}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-ink">{risk.description}</p>
          {risk.mitigation && (
            <div className="mt-3 p-3 rounded bg-surface border border-border">
              <p className="text-xs font-medium text-ink uppercase tracking-wide mb-1">
                Mitigation
              </p>
              <p className="text-sm text-muted">{risk.mitigation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  const content = artifact.content as DecisionArtifact | null;

  if (!content) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted">Artifact content is not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-charcoal" strokeWidth={1.5} />
            <Badge variant="outline">v{artifact.version}</Badge>
            <Badge 
              variant={
                artifact.status === 'approved' 
                  ? 'default' 
                  : artifact.status === 'draft' 
                    ? 'secondary' 
                    : 'outline'
              }
            >
              {artifact.status}
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-light tracking-tight text-ink">
            {content.title}
          </h1>
          <p className="mt-1 text-sm text-muted flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            Generated {formatDate(artifact.created_at)}
            {artifact.creator_name && ` by ${artifact.creator_name}`}
          </p>
          {content.domain_code && (
            <Badge variant="outline" className="mt-2">
              {content.domain_code}
            </Badge>
          )}
        </div>
        
        {/* Confidence Score */}
        <div className="text-right">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted" strokeWidth={1.5} />
            <span className="text-xs text-muted uppercase tracking-wide">Confidence</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Progress value={content.confidence_score * 100} className="w-24 h-2" />
            <span className="text-sm font-medium text-ink">
              {Math.round(content.confidence_score * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" strokeWidth={1.5} />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
            {content.executive_summary}
          </p>
        </CardContent>
      </Card>

      {/* Decision Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4" strokeWidth={1.5} />
            Decision Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
            {content.decision_context}
          </p>
        </CardContent>
      </Card>

      {/* Strategic Options */}
      {content.strategic_options && content.strategic_options.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
              Strategic Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content.strategic_options.map((option, index) => (
                <StrategicOptionCard key={index} option={option} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Path */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="h-4 w-4 text-primary" strokeWidth={1.5} />
            Recommended Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
            {content.recommended_path}
          </p>
        </CardContent>
      </Card>

      {/* Risks */}
      {content.risks && content.risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content.risks.map((risk, index) => (
                <RiskCard key={index} risk={risk} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assumptions */}
      {content.assumptions && content.assumptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {content.assumptions.map((assumption, index) => (
                <li key={index} className="text-sm text-ink">
                  {assumption}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggested Next Steps */}
      {content.suggested_next_steps && content.suggested_next_steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4" strokeWidth={1.5} />
              Suggested Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {content.suggested_next_steps.map((step, index) => (
                <li key={index} className="text-sm text-ink">
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
