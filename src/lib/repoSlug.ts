export function parseRepoSlug(raw: string): { owner: string; repo: string } | null {
  let clean = raw.trim().replace(/\/+$/, '');
  if (!clean) return null;

  if (clean.includes('github.com/')) {
    const after = clean.split('github.com/')[1];
    if (after) {
      clean = after
        .replace(/\.git$/, '')
        .split(/[?#]/)[0]
        .split('/')
        .slice(0, 2)
        .join('/');
    }
  }

  const segments = clean.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  const [owner, repo] = segments;
  if (!owner || !repo) return null;
  if (!/^[a-zA-Z0-9_.-]+$/.test(owner) || !/^[a-zA-Z0-9_.-]+$/.test(repo)) return null;
  return { owner, repo };
}

export function isValidSlug(owner: string, repo: string): boolean {
  return (
    /^[a-zA-Z0-9_.-]+$/.test(owner) &&
    /^[a-zA-Z0-9_.-]+$/.test(repo) &&
    owner.length <= 100 &&
    repo.length <= 100
  );
}
