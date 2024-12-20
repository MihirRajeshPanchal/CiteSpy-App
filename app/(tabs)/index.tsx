import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { InterestSlider } from "~/components/home/InterestSlider";
import { PaperCard } from "~/components/home/PaperCard";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { usePapers } from "~/hooks/usePapers";
import { router } from "expo-router";

export default function Home() {
  const [interests, setInterests] = React.useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = React.useState<string>("");
  const [loadingInterests, setLoadingInterests] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string>("");
  const [changingInterest, setChangingInterest] = React.useState(false);

  const {
    papers,
    setPapers,
    isLoading,
    isLoadingMore,
    isLoadingInitial,
    error,
    loadMore,
    loadMoreIfNeeded,
    hasMore,
    currentInterest,
  } = usePapers(
    interests.includes(selectedInterest)
      ? selectedInterest
      : interests[0] || "",
    interests,
  );

  const db = getFirestore();
  const auth = getAuth();

  const loadUserData = async () => {
    setLoadError("");
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        router.replace("/landing");
        return;
      }

      const userInterestsRef = doc(db, "user_interests", userId);
      const userInterestsDoc = await getDoc(userInterestsRef);

      if (userInterestsDoc.exists()) {
        const userInterests = userInterestsDoc.data().interests || [];
        setInterests(userInterests);

        const newSelectedInterest = userInterests.includes(selectedInterest)
          ? selectedInterest
          : userInterests[0] || "";

        setSelectedInterest(newSelectedInterest);
      } else {
        await setDoc(userInterestsRef, {
          interests: [],
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setLoadError("Failed to load user data");
    } finally {
      setLoadingInterests(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, []),
  );

  React.useEffect(() => {
    if (selectedInterest) {
      setChangingInterest(true);
      const timer = setTimeout(() => {
        setChangingInterest(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedInterest]);

  const handleSwipe = async (paperId: string, direction: "left" | "right") => {
    setPapers((prev) => {
      const newPapers = prev?.filter((p) => p.paperId !== paperId) || [];
      return newPapers;
    });

    setTimeout(() => {
      loadMoreIfNeeded();
    }, 0);
  };

  const handleInterestChange = (newInterest: string) => {
    setSelectedInterest(newInterest);
    setPapers([]);
  };

  const renderContent = () => {
    if (loadingInterests || isLoadingInitial) {
      return <Text className="text-gray-600">Loading interests...</Text>;
    }

    if (loadError) {
      return <Text className="text-gray-600">{loadError}</Text>;
    }

    if (!interests || interests.length === 0) {
      return (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-4">
            No research interests found
          </Text>
          <Text
            className="text-blue-500 text-center"
            onPress={() => router.push("/profile")}
          >
            Tap here to add research interests in your profile
          </Text>
        </View>
      );
    }

    if (changingInterest || (isLoading && !papers.length)) {
      return (
        <Text className="text-gray-600">
          Loading papers for {currentInterest}...
        </Text>
      );
    }

    if (error) {
      return (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-4">{error}</Text>
          <Text
            className="text-blue-500 text-center"
            onPress={() => router.push("/profile")}
          >
            Try adding more research interests
          </Text>
        </View>
      );
    }

    if (!papers || papers.length === 0) {
      return (
        <View className="items-center">
          <Text className="text-gray-600">No more papers to show</Text>
          {hasMore && (
            <Text
              className="text-blue-500 mt-4"
              onPress={() => loadMore(false)}
            >
              Load more papers
            </Text>
          )}
        </View>
      );
    }

    return (
      <View className="relative w-full min-h-[550px]">
        {papers.slice(0, 3).map((paper, index) => (
          <PaperCard
            key={paper.uniqueId || paper.paperId}
            paper={paper}
            onSwipe={(direction) => handleSwipe(paper.paperId, direction)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: papers.length - index,
              transform: [
                { scale: 1 - index * 0.05 },
                { translateY: index * 20 },
              ],
            }}
            isLoadingMore={isLoadingMore && index === 0}
          />
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1">
          {interests && interests.length > 0 && (
            <View className="z-10">
              <InterestSlider
                interests={interests}
                selectedInterest={selectedInterest}
                onInterestChange={handleInterestChange}
              />
            </View>
          )}

          <View className="flex-1 justify-center items-center px-4">
            {renderContent()}
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
