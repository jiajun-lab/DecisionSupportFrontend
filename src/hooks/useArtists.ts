/**
 * 艺人数据 Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import type { Artist, ArtistSimple } from '../types';
import * as api from '../api/client';

interface UseArtistsReturn {
  artists: ArtistSimple[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * 获取艺人列表
 */
export function useArtists(): UseArtistsReturn {
  const [artists, setArtists] = useState<ArtistSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getArtists();
      setArtists(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch artists'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return {
    artists,
    loading,
    error,
    refresh: fetchArtists,
  };
}

interface UseArtistReturn {
  artist: Artist | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * 获取单个艺人详情
 */
export function useArtist(artistId: string | undefined): UseArtistReturn {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArtist = useCallback(async () => {
    if (!artistId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getArtist(artistId);
      setArtist(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch artist'));
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchArtist();
  }, [fetchArtist]);

  return {
    artist,
    loading,
    error,
    refresh: fetchArtist,
  };
}
