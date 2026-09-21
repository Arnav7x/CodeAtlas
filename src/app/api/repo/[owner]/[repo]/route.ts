import { NextRequest, NextResponse } from 'next/server';
import { isValidSlug } from '@/lib/repoSlug';

export const dynamic = 'force-dynamic';

type CacheEntry = { expires: number; payload: unknown };
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.payload;
}

function setCached(key: string, payload: unknown) {
  if (cache.size > 100) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { expires: Date.now() + CACHE_TTL_MS, payload });
}

async function githubFetch(path: string, token?: string): Promise<{ data: unknown; headers: Headers; status: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'CodeAtlas/1.0',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text.slice(0, 300) };
    }
    return { data, headers: res.headers, status: res.status };
  } finally {
    clearTimeout(timeout);
  }
}

function parseLastPage(linkHeader: string | null): number | null {
  if (!linkHeader) return null;
  // <https://api.github.com/...?page=2>; rel="next", <...?page=34>; rel="last"
  const match = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return match ? Number(match[1]) : null;
}

function errorMessage(status: number, data: unknown): string {
  const msg = typeof data === 'object' && data !== null && 'message' in data
    ? String((data as { message: unknown }).message)
    : '';
  if (status === 404) return 'Repository not found. Check the owner/repo slug, or provide a PAT with access for private repos.';
  if (status === 401) return 'GitHub authentication failed. Your PAT is invalid or expired — update it in PAT settings.';
  if (status === 403 || status === 429) return 'GitHub API rate limit exceeded. Add a PAT via PAT settings to continue (5,000 requests/hour).';
  return `GitHub API error (${status})${msg ? ` — ${msg.slice(0, 140)}` : ''}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  if (!isValidSlug(owner, repo)) {
    return NextResponse.json({ error: 'Invalid owner/repo slug.' }, { status: 400 });
  }

  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() || undefined : undefined;
  const cacheKey = `${owner.toLowerCase()}/${repo.toLowerCase()}:${token ? 'auth' : 'anon'}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60', 'X-CodeAtlas-Cache': 'HIT' },
    });
  }

  const [repoRes, contribRes, langRes, commitRes, pullRes] = await Promise.all([
    githubFetch(`/repos/${owner}/${repo}`, token),
    githubFetch(`/repos/${owner}/${repo}/contributors?per_page=20`, token),
    githubFetch(`/repos/${owner}/${repo}/languages`, token),
    githubFetch(`/repos/${owner}/${repo}/commits?per_page=100`, token),
    githubFetch(`/repos/${owner}/${repo}/pulls?state=all&per_page=1`, token),
  ]);

  if (repoRes.status !== 200) {
    return NextResponse.json(
      { error: errorMessage(repoRes.status, repoRes.data), status: repoRes.status },
      { status: repoRes.status === 404 || repoRes.status === 401 ? repoRes.status : 502 }
    );
  }

  const repoInfo = repoRes.data as Record<string, unknown>;
  const prTotal = parseLastPage(pullRes.headers.get('link'));

  // Tree is best-effort (huge repos can 403); degrade gracefully.
  let tree: unknown = { tree: [] };
  try {
    const branch = (repoInfo.default_branch as string) || 'main';
    const treeRes = await githubFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, token);
    if (treeRes.status === 200) tree = treeRes.data;
  } catch {
    tree = { tree: [], truncated: true };
  }

  const payload = {
    repoInfo,
    contributors: contribRes.status === 200 ? contribRes.data : [],
    languages: langRes.status === 200 ? langRes.data : {},
    commits: commitRes.status === 200 ? commitRes.data : [],
    prTotal,
    prStatus: pullRes.status,
    tree,
    partialFailures: [
      contribRes.status !== 200 ? 'contributors' : null,
      langRes.status !== 200 ? 'languages' : null,
      commitRes.status !== 200 ? 'commits' : null,
    ].filter(Boolean),
  };

  setCached(cacheKey, payload);
  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60', 'X-CodeAtlas-Cache': 'MISS' },
  });
}
