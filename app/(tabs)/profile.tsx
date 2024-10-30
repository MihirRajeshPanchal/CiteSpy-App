import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native';
import { Stack } from 'expo-router';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';

import { InterestBubble } from '~/components/profile/InterestBubble';
import { UserInfo } from '~/components/profile/UserInfo';
import { TopicInput } from '~/components/profile/TopicInput';
import { PasswordChangeModal } from '~/components/profile/PasswordChangeModal';
import { AccountActions } from '~/components/profile/AccountActions';

export default function Profile() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password change states
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        router.replace('/landing');
        return;
      }

      setUserEmail(auth.currentUser?.email || '');
      
      const userInterestsDoc = await getDoc(doc(db, 'user_interests', userId));
      if (userInterestsDoc.exists()) {
        setInterests(userInterestsDoc.data().interests || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const addTopic = () => {
    const trimmedTopic = newTopic.trim();
    
    if (!trimmedTopic) {
      return;
    }

    if (trimmedTopic.length > 50) {
      Alert.alert('Error', 'Topic name must be less than 50 characters');
      return;
    }

    if (interests.includes(trimmedTopic)) {
      Alert.alert('Error', 'This topic already exists');
      return;
    }

    if (interests.length >= 20) {
      Alert.alert('Error', 'Maximum 20 topics allowed');
      return;
    }

    setInterests(prev => [...prev, trimmedTopic]);
    setNewTopic('');
  };

  const deleteTopic = (topic: string) => {
    setInterests(prev => prev.filter(t => t !== topic));
  };

  const handleSave = async () => {
    if (interests.length === 0) {
      Alert.alert('Error', 'Please add at least one research interest');
      return;
    }

    setIsSaving(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await updateDoc(doc(db, 'user_interests', userId), {
        interests: interests,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Your interests have been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update interests');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      Alert.alert('Success', 'Password updated successfully');
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Current password is incorrect');
      } else {
        Alert.alert('Error', 'Failed to update password');
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: () => {
            auth.signOut().then(() => {
              router.replace('/landing');
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'My Profile' }} />
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          <UserInfo email={userEmail} />

          <View className="mb-6">
            <Text className="text-lg font-medium mb-4">Research Interests</Text>
            
            <TopicInput
              value={newTopic}
              onChangeText={setNewTopic}
              onSubmit={addTopic}
              topicsCount={interests.length}
            />

            <View className="flex-row flex-wrap justify-start mb-4">
              {interests.map((topic) => (
                <InterestBubble
                  key={topic}
                  label={topic}
                  isSelected={true}
                  onToggle={() => {}}
                  onDelete={() => deleteTopic(topic)}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className={`rounded-xl py-4 px-6 ${
                isSaving ? 'bg-gray-400' : 'bg-gray-900'
              }`}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>

          <AccountActions
            onChangePassword={() => setPasswordModalVisible(true)}
            onSignOut={handleSignOut}
          />
        </View>
      </ScrollView>

      <PasswordChangeModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onChangeCurrentPassword={setCurrentPassword}
        onChangeNewPassword={setNewPassword}
        onChangeConfirmPassword={setConfirmPassword}
        onSubmit={handleChangePassword}
      />
    </>
  );
}

