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

  const { papers, setPapers, isLoading, error, loadMore, hasMore } = usePapers(
    selectedInterest,
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
        if (userInterests.length > 0 && !selectedInterest) {
          setSelectedInterest(userInterests[0]);
        }
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
    }, [])
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
    setPapers((prev) => prev?.filter((p) => p.paperId !== paperId) || []);

    if (papers.length <= 3 && hasMore && !isLoading) {
      try {
        console.log("Loading more papers...");
        await loadMore();
      } catch (error) {
        console.error("Error loading more papers:", error);
      }
    }
  };

  const handleInterestChange = (newInterest: string) => {
    setSelectedInterest(newInterest);
    setPapers([]);
  };
  const renderContent = () => {
    if (loadingInterests) {
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
          Loading papers for {selectedInterest}...
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
            <Text className="text-blue-500 mt-4" onPress={() => loadMore()}>
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
            key={paper.paperId}
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
              opacity: 1 - index * 0.2,
            }}
          />
        ))}
        {isLoading && papers.length > 0 && (
          <Text className="absolute bottom-4 left-4 text-gray-600">
            Loading more papers...
          </Text>
        )}
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
