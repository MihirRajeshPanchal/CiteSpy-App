import { useState, useEffect, useCallback } from "react";
import { Paper } from "~/types/paper";

const S2_API_KEY = process.env.EXPO_PUBLIC_S2_API_KEY;
const INITIAL_LIMIT = 10;
const LOAD_MORE_LIMIT = 20;
const MIN_PAPERS_THRESHOLD = 5;

export function usePapers(selectedInterest: string, interests: string[]) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentInterest, setCurrentInterest] = useState("");
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const loadPapers = useCallback(
    async (reset: boolean = false) => {
      if (!selectedInterest && (!interests || interests.length === 0)) {
        setPapers([]);
        setIsLoadingInitial(false);
        return;
      }

      if (!hasMore && !reset) return;

      if (reset) {
        setIsLoading(true);
        setOffset(0);
      } else {
        setIsLoadingMore(true);
      }
      setError("");

      try {
        const queryInterest =
          selectedInterest ||
          interests[Math.floor(Math.random() * interests.length)];
        const currentOffset = reset ? 0 : offset;

        const response = await fetch(
          `https://api.semanticscholar.org/graph/v1/paper/search?${new URLSearchParams(
            {
              query: queryInterest,
              fields:
                "paperId,title,url,venue,year,authors,abstract,citationCount,publicationTypes,citationStyles,externalIds,openAccessPdf",
              limit: (reset ? INITIAL_LIMIT : LOAD_MORE_LIMIT).toString(),
              offset: currentOffset.toString(),
            },
          )}`,
          {
            headers: {
              "x-api-key": S2_API_KEY || "",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch papers");
        }

        const data = await response.json();

        if (!Array.isArray(data.data)) {
          throw new Error("Invalid response format");
        }

        const validPapers = data.data.filter(
          (paper: Paper) => paper.abstract && paper.abstract.trim() !== "",
        );

        const newPapers = validPapers.map((paper: Paper, index: number) => ({
          ...paper,
          uniqueId: `${paper.paperId}-${currentOffset + index}`,
        }));

        if (reset) {
          setPapers(newPapers);
        } else {
          setPapers((prev) => [...prev, ...newPapers]);
        }

        setOffset(currentOffset + data.data.length);
        setHasMore(
          data.data.length === (reset ? INITIAL_LIMIT : LOAD_MORE_LIMIT),
        );
        setCurrentInterest(queryInterest);
      } catch (error) {
        console.error("Error loading papers:", error);
        setError("Unable to load papers. Please try again later.");
        if (reset) {
          setPapers([]);
        }
      } finally {
        if (reset) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
        setIsLoadingInitial(false);
      }
    },
    [selectedInterest, interests, offset, hasMore],
  );

  const loadMoreIfNeeded = useCallback(async () => {
    if (
      papers.length <= MIN_PAPERS_THRESHOLD &&
      hasMore &&
      !isLoading &&
      !isLoadingMore
    ) {
      await loadPapers(false);
    }
  }, [papers.length, hasMore, isLoading, isLoadingMore, loadPapers]);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setIsLoadingInitial(true);
    loadPapers(true);
  }, [selectedInterest, interests]);

  return {
    papers,
    setPapers,
    isLoading,
    isLoadingMore,
    isLoadingInitial,
    error,
    loadMore: loadPapers,
    loadMoreIfNeeded,
    hasMore,
    currentInterest,
  };
}
