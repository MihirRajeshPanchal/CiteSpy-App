import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface AuthorFollowContextType {
  followedAuthors: Set<string>;
  checkIfFollowing: (authorId: string) => boolean;
  setFollowStatus: (authorId: string, isFollowing: boolean) => void;
  refreshFollowStatus: () => Promise<void>;
}

const AuthorFollowContext = createContext<AuthorFollowContextType | undefined>(undefined);

export const useAuthorFollow = () => {
  const context = useContext(AuthorFollowContext);
  if (context === undefined) {
    throw new Error('useAuthorFollow must be used within an AuthorFollowProvider');
  }
  return context;
};

export const AuthorFollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [followedAuthors, setFollowedAuthors] = useState<Set<string>>(new Set());
  const auth = getAuth();
  const db = getFirestore();

  const refreshFollowStatus = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setFollowedAuthors(new Set());
        return;
      }

      const followsRef = doc(db, `user_follows/${userId}/authors`);
      const followsDoc = await getDoc(followsRef);
      
      if (followsDoc.exists()) {
        const followData = followsDoc.data();
        setFollowedAuthors(new Set(Object.keys(followData)));
      } else {
        setFollowedAuthors(new Set());
      }
    } catch (error) {
      console.error('Error refreshing follow status:', error);
    }
  };

  useEffect(() => {
    refreshFollowStatus();
  }, []);

  const checkIfFollowing = (authorId: string): boolean => {
    return followedAuthors.has(authorId);
  };

  const setFollowStatus = (authorId: string, isFollowing: boolean) => {
    setFollowedAuthors(prev => {
      const newSet = new Set(prev);
      if (isFollowing) {
        newSet.add(authorId);
      } else {
        newSet.delete(authorId);
      }
      return newSet;
    });
  };

  return (
    <AuthorFollowContext.Provider 
      value={{ 
        followedAuthors, 
        checkIfFollowing, 
        setFollowStatus,
        refreshFollowStatus 
      }}
    >
      {children}
    </AuthorFollowContext.Provider>
  );
};