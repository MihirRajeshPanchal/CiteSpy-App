import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, View } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { FollowData } from '~/types/author';
import { useAuthorFollow } from '../../contexts/AuthorFollowContext';

interface FollowButtonProps {
  authorId: string;
  authorName: string;
  className?: string;
}

export const FollowButton = ({ authorId, authorName, className = '' }: FollowButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIfFollowing, setFollowStatus } = useAuthorFollow();
  const auth = getAuth();
  const db = getFirestore();

  const isFollowing = checkIfFollowing(authorId);

  const toggleFollow = async () => {
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid;
      const userEmail = auth.currentUser?.email;

      if (!userId || !userEmail) {
        Alert.alert('Error', 'Please sign in to follow authors');
        return;
      }

      const followRef = doc(db, `user_follows/${userId}/authors/${authorId}`);

      if (isFollowing) {
        await deleteDoc(followRef);
        setFollowStatus(authorId, false);
      } else {
        const followData: FollowData = {
          authorId,
          authorName,
          userEmail,
          followedAt: new Date().toISOString(),
        };
        await setDoc(followRef, followData);
        setFollowStatus(authorId, true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className={`px-4 py-2 ${className}`}>
        <ActivityIndicator size="small" color="#4B5563" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={toggleFollow}
      className={`px-4 py-2 rounded-full ${
        isFollowing ? 'bg-gray-200' : 'bg-gray-900'
      } ${className}`}
    >
      <Text
        className={`text-sm font-medium ${
          isFollowing ? 'text-gray-900' : 'text-white'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  );
};