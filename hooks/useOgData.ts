// hooks/useOGData.ts
import { useState, useEffect } from 'react';

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  favicon?: string;
}

interface UseOGDataResult {
  data: OGData | null;
  loading: boolean;
  error: string | null;
}

export function useOGData(url: string | null): UseOGDataResult {
  const [data, setData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError('Invalid URL format');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchOGData = async () => {
      try {
        const response = await fetch(`/api/og-data?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch OG data');
        }

        const ogData = await response.json();
        setData(ogData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the request
    const timeoutId = setTimeout(fetchOGData, 500);

    return () => clearTimeout(timeoutId);
  }, [url]);

  return { data, loading, error };
}