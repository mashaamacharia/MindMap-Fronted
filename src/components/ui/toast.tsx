"use client";

import * as React from 'react';

// Minimal toast types + placeholder component to satisfy TypeScript imports
export type ToastActionElement = React.ReactNode;

export type ToastProps = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  action?: ToastActionElement;
};

// Placeholder Toast UI — real implementation can be swapped in later.
export function Toast(_props: ToastProps) {
  return null;
}

export function ToastViewport() {
  return null;
}

export default Toast;
