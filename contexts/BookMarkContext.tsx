import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import type { Paper } from "~/types/paper";

interface BookmarkCollection {
  id: string;
  name: string;
  createdAt: string;
  paperCount: number;
}

interface BookmarkContextType {
  collections: BookmarkCollection[];
  papers: Record<string, Paper[]>;
  loading: boolean;
  error: string | null;
  createCollection: (name: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  addPaperToCollection: (collectionId: string, paper: Paper) => Promise<void>;
  removePaperFromCollection: (
    collectionId: string,
    paperId: string,
  ) => Promise<void>;
  refreshCollections: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [papers, setPapers] = useState<Record<string, Paper[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  const refreshCollections = async () => {
    if (!auth.currentUser || loading) return;

    try {
      setLoading(true);
      setError(null);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        setCollections([]);
        setPapers({});
        return;
      }

      const collectionsRef = collection(
        db,
        `user_collections/${userId}/collections`,
      );
      const collectionsSnapshot = await getDocs(collectionsRef);

      const collectionsData: BookmarkCollection[] = [];
      const papersData: Record<string, Paper[]> = {};

      for (const collectionDoc of collectionsSnapshot.docs) {
        const collectionData = collectionDoc.data() as BookmarkCollection;
        collectionsData.push({ ...collectionData, id: collectionDoc.id });

        const papersRef = collection(
          db,
          `user_collections/${userId}/collections/${collectionDoc.id}/papers`,
        );
        const papersSnapshot = await getDocs(papersRef);
        papersData[collectionDoc.id] = papersSnapshot.docs.map(
          (doc) => doc.data() as Paper,
        );
      }

      setCollections(collectionsData);
      setPapers(papersData);
      setInitialized(true);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError("Failed to load bookmark collections");
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (name: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");
  
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error("Collection name cannot be empty");
      }
  
      const existingCollection = collections.find(
        (collection) => collection.name.toLowerCase() === trimmedName.toLowerCase()
      );
  
      if (existingCollection) {
        throw new Error("A collection with this name already exists");
      }
  
      const collectionData: Omit<BookmarkCollection, "id"> = {
        name: trimmedName,
        createdAt: new Date().toISOString(),
        paperCount: 0,
      };
  
      const collectionRef = doc(
        collection(db, `user_collections/${userId}/collections`)
      );
      await setDoc(collectionRef, collectionData);
      await refreshCollections();
    } catch (err) {
      throw err;
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const collectionRef = doc(
        db,
        `user_collections/${userId}/collections/${collectionId}`,
      );
      await deleteDoc(collectionRef);
      await refreshCollections();
    } catch (err) {
      console.error("Error deleting collection:", err);
      throw new Error("Failed to delete collection");
    }
  };

  const addPaperToCollection = async (collectionId: string, paper: Paper) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      if (!initialized) {
        await refreshCollections();
      }

      const paperRef = doc(
        db,
        `user_collections/${userId}/collections/${collectionId}/papers/${paper.paperId}`,
      );
      await setDoc(paperRef, paper);

      const collectionRef = doc(
        db,
        `user_collections/${userId}/collections/${collectionId}`,
      );
      const collectionDoc = await getDoc(collectionRef);
      const collectionData = collectionDoc.data() as BookmarkCollection;
      await setDoc(collectionRef, {
        ...collectionData,
        paperCount: (collectionData.paperCount || 0) + 1,
      });

      await refreshCollections();
    } catch (err) {
      console.error("Error adding paper to collection:", err);
      throw new Error("Failed to add paper to collection");
    }
  };

  const removePaperFromCollection = async (
    collectionId: string,
    paperId: string,
  ) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const paperRef = doc(
        db,
        `user_collections/${userId}/collections/${collectionId}/papers/${paperId}`,
      );
      await deleteDoc(paperRef);

      const collectionRef = doc(
        db,
        `user_collections/${userId}/collections/${collectionId}`,
      );
      const collectionDoc = await getDoc(collectionRef);
      const collectionData = collectionDoc.data() as BookmarkCollection;
      await setDoc(collectionRef, {
        ...collectionData,
        paperCount: Math.max(0, (collectionData.paperCount || 1) - 1),
      });

      await refreshCollections();
    } catch (err) {
      console.error("Error removing paper from collection:", err);
      throw new Error("Failed to remove paper from collection");
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      refreshCollections();
    } else {
      setLoading(false);
      setCollections([]);
      setPapers({});
    }
  }, [auth.currentUser]);

  return (
    <BookmarkContext.Provider
      value={{
        collections,
        papers,
        loading,
        error,
        createCollection,
        deleteCollection,
        addPaperToCollection,
        removePaperFromCollection,
        refreshCollections,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
