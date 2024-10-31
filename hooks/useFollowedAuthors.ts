import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import type { FollowData } from "~/types/author";

export const useFollowedAuthors = () => {
  const [followedAuthors, setFollowedAuthors] = useState<FollowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const db = getFirestore();

  const fetchFollowedAuthors = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        setFollowedAuthors([]);
        return;
      }

      const followsRef = collection(db, `user_follows/${userId}/authors`);
      const followsSnapshot = await getDocs(followsRef);

      const authors = followsSnapshot.docs.map(
        (doc) => doc.data() as FollowData,
      );
      setFollowedAuthors(authors);
    } catch (err) {
      console.error("Error fetching followed authors:", err);
      setError("Failed to load followed authors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowedAuthors();
  }, []);

  return { followedAuthors, loading, error, refresh: fetchFollowedAuthors };
};
