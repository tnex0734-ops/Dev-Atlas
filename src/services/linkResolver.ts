export interface EntityLinkTarget {
  type: string;
  id: string;
  label?: string;
}

export interface ResolvedNavigationState {
  section: string;
  selectedItemId?: string;
  isValid: boolean;
  targetRole?: string;
  error?: string;
}

/**
 * Maps any internal DevAtlas entity reference to its corresponding application section and item ID.
 * Used uniformly across AI source citations, Kanban rationale chains, meeting decisions,
 * memory drawer links, and command palette navigation.
 */
export function resolveInternalEntityLink(target: EntityLinkTarget): ResolvedNavigationState {
  if (!target || !target.type) {
    return { section: 'overview', isValid: false, error: 'Target type is required' };
  }

  const normalizedType = target.type.toLowerCase().trim();
  const id = target.id?.trim();

  switch (normalizedType) {
    case 'decision':
    case 'adr':
      return { section: 'decisions', selectedItemId: id, isValid: true, targetRole: 'dev' };

    case 'meeting':
    case 'sync':
      return { section: 'meetings', selectedItemId: id, isValid: true, targetRole: 'pm' };

    case 'task':
    case 'devtask':
      return { section: 'tasks', selectedItemId: id, isValid: true, targetRole: 'dev' };

    case 'memory':
    case 'memoryevent':
    case 'event':
      return { section: 'project-memory', selectedItemId: id, isValid: true, targetRole: 'memory' };

    case 'requirement':
    case 'prd':
      return { section: 'requirements', selectedItemId: id, isValid: true, targetRole: 'pm' };

    case 'bug':
    case 'defect':
      return { section: 'bugs', selectedItemId: id, isValid: true, targetRole: 'qa' };

    case 'security':
    case 'finding':
    case 'securityfinding':
      return { section: 'security', selectedItemId: id, isValid: true, targetRole: 'qa' };

    case 'research':
    case 'session':
      return { section: 'research', selectedItemId: id, isValid: true, targetRole: 'designer' };

    case 'validation':
    case 'pin':
      return { section: 'validation', selectedItemId: id, isValid: true, targetRole: 'designer' };

    case 'feedback':
    case 'cluster':
      return { section: 'feedback', selectedItemId: id, isValid: true, targetRole: 'pm' };

    case 'release':
    case 'deployment':
      return { section: 'releases', selectedItemId: id, isValid: true, targetRole: 'ops' };

    case 'incident':
      return { section: 'incidents', selectedItemId: id, isValid: true, targetRole: 'ops' };

    case 'context':
    case 'contextblock':
      return { section: 'context', selectedItemId: id, isValid: true, targetRole: 'dev' };

    case 'file':
    case 'document':
      return { section: 'files', selectedItemId: id, isValid: true, targetRole: 'memory' };

    default:
      return {
        section: 'overview',
        isValid: false,
        error: `Unknown internal entity type: ${target.type}`
      };
  }
}

/**
 * Validates external URLs, permitting only secure http/https protocols.
 * Rejects javascript:, data:, file:, and malformed targets.
 */
export function validateExternalUrl(url: string): { isValid: boolean; sanitizedUrl?: string; error?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmed = url.trim();

  // Reject dangerous protocols immediately
  if (/^(javascript|data|file|vbscript):/i.test(trimmed)) {
    return { isValid: false, error: 'Unsafe URL protocol rejected' };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }
    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, error: 'Malformed URL format' };
  }
}

/**
 * Checks whether an external URL is safe (HTTP or HTTPS only, rejects scripts and file schemes).
 */
export function isSafeExternalUrl(url: string): boolean {
  return validateExternalUrl(url).isValid;
}

/**
 * Sanitizes and returns canonical string of an external URL, or null if invalid/unsafe.
 */
export function sanitizeExternalUrl(url: string): string | null {
  const result = validateExternalUrl(url);
  return result.isValid && result.sanitizedUrl ? result.sanitizedUrl : null;
}

/**
 * Classifies an external link into its service type (github, pull-request, figma, social, documentation, generic).
 */
export function classifyExternalLink(url: string): { category: string; label: string } {
  if (!isSafeExternalUrl(url)) {
    return { category: 'unknown', label: 'Invalid Link' };
  }

  const u = url.toLowerCase();
  if (u.includes('github.com')) {
    if (u.includes('/pull/') || u.includes('/pulls/')) {
      return { category: 'pull-request', label: 'Pull Request' };
    }
    return { category: 'github', label: 'GitHub Repository' };
  }

  if (u.includes('figma.com')) {
    return { category: 'figma', label: 'Figma Design' };
  }

  if (u.includes('twitter.com') || u.includes('x.com') || u.includes('discord.gg') || u.includes('discord.com')) {
    return { category: 'social', label: 'Social Community' };
  }

  if (u.includes('/docs') || u.includes('readme') || u.includes('gitbook.io')) {
    return { category: 'documentation', label: 'Documentation' };
  }

  return { category: 'website', label: 'External Site' };
}

