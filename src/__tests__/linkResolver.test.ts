import { describe, it, expect } from 'vitest';
import {
  resolveInternalEntityLink,
  classifyExternalLink,
  isSafeExternalUrl,
  sanitizeExternalUrl,
} from '../services/linkResolver';

describe('linkResolver — Internal Entity Resolution', () => {
  it('resolves decisions and ADRs to the decisions section', () => {
    const res = resolveInternalEntityLink({ type: 'decision', id: 'ADR-001' });
    expect(res.isValid).toBe(true);
    expect(res.section).toBe('decisions');
    expect(res.selectedItemId).toBe('ADR-001');
    expect(res.targetRole).toBe('dev');

    const resAdr = resolveInternalEntityLink({ type: 'adr', id: 'ADR-004' });
    expect(resAdr.isValid).toBe(true);
    expect(resAdr.section).toBe('decisions');
  });

  it('resolves meetings to the meetings section', () => {
    const res = resolveInternalEntityLink({ type: 'meeting', id: 'MTG-024' });
    expect(res.isValid).toBe(true);
    expect(res.section).toBe('meetings');
    expect(res.selectedItemId).toBe('MTG-024');
    expect(res.targetRole).toBe('pm');
  });

  it('resolves tasks and devtasks to the tasks section', () => {
    const res = resolveInternalEntityLink({ type: 'task', id: 'DEV-SIGN-001' });
    expect(res.isValid).toBe(true);
    expect(res.section).toBe('tasks');
    expect(res.selectedItemId).toBe('DEV-SIGN-001');
    expect(res.targetRole).toBe('dev');
  });

  it('resolves memory events to the project-memory section', () => {
    const res = resolveInternalEntityLink({ type: 'memory', id: 'MEM-001' });
    expect(res.isValid).toBe(true);
    expect(res.section).toBe('project-memory');
    expect(res.targetRole).toBe('memory');
  });

  it('resolves PRDs and requirements to requirements section', () => {
    const res = resolveInternalEntityLink({ type: 'prd', id: 'PRD-01' });
    expect(res.isValid).toBe(true);
    expect(res.section).toBe('requirements');
  });

  it('resolves security findings to security section', () => {
    const res = resolveInternalEntityLink({ type: 'security', id: 'SEC-01' });
    expect(res.isValid).toBe(true);
    expect(res.section).toBe('security');
    expect(res.targetRole).toBe('qa');
  });

  it('handles unknown or missing types gracefully', () => {
    const res = resolveInternalEntityLink({ type: 'unknown_entity', id: '123' });
    expect(res.isValid).toBe(false);
    expect(res.section).toBe('overview');
  });
});

describe('linkResolver — External URL Security & Classification', () => {
  it('accepts safe HTTPS and HTTP protocols', () => {
    expect(isSafeExternalUrl('https://github.com/devatlas')).toBe(true);
    expect(isSafeExternalUrl('http://example.com')).toBe(true);
    expect(isSafeExternalUrl('https://figma.com/file/123')).toBe(true);
  });

  it('strictly rejects malicious schemes like javascript:, data:, file:, vbscript:', () => {
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeExternalUrl('file:///etc/passwd')).toBe(false);
    expect(isSafeExternalUrl('vbscript:msgbox("hello")')).toBe(false);
  });

  it('correctly classifies external platforms', () => {
    expect(classifyExternalLink('https://github.com/org/repo').category).toBe('github');
    expect(classifyExternalLink('https://github.com/org/repo/pull/12').category).toBe('pull-request');
    expect(classifyExternalLink('https://figma.com/@design').category).toBe('figma');
    expect(classifyExternalLink('https://twitter.com/devatlas').category).toBe('social');
    expect(classifyExternalLink('https://discord.gg/devatlas').category).toBe('social');
  });

  it('sanitizes and normalizes safe URLs, rejecting unsafe ones', () => {
    expect(sanitizeExternalUrl('https://example.com/path')).toBe('https://example.com/path');
    expect(sanitizeExternalUrl('javascript:evil()')).toBeNull();
  });
});
