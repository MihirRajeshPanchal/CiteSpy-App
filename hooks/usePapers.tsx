import { useState, useEffect, useCallback } from 'react';
import { Paper } from '~/types/paper';

const S2_API_KEY = process.env.EXPO_PUBLIC_S2_API_KEY;
const PAPERS_PER_PAGE = 10;

export function usePapers(selectedInterest: string, interests: string[]) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPapers = useCallback(async (reset: boolean = false) => {
    if (!selectedInterest && (!interests || interests.length === 0)) {
      setPapers([]);
      return;
    }

    if (!hasMore && !reset) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const queryInterest = selectedInterest || interests[Math.floor(Math.random() * interests.length)];
      const currentOffset = reset ? 0 : offset;
      
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search?${
          new URLSearchParams({
            query: queryInterest,
            fields: 'paperId,title,url,venue,year,authors,abstract,citationCount,publicationTypes,citationStyles,externalIds,openAccessPdf',
            limit: PAPERS_PER_PAGE.toString(),
            offset: currentOffset.toString()
          })
        }`,
        {
          headers: {
            'x-api-key': S2_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch papers');
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }

      if (data.data.length < PAPERS_PER_PAGE) {
        setHasMore(false);
      }

      setPapers(prev => reset ? data.data : [...prev, ...data.data]);
      if (!reset) {
        setOffset(currentOffset + PAPERS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error loading papers:', error);
      setError('Unable to load papers. Please try again later.');
      if (reset) {
        setPapers([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedInterest, interests, offset, hasMore]);

  // Reset and load new papers when interest changes
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    loadPapers(true);
  }, [selectedInterest, interests]);

  return { 
    papers, 
    setPapers, 
    isLoading, 
    error, 
    loadMore: () => loadPapers(false),
    hasMore 
  };
}