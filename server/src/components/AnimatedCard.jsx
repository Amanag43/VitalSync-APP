import { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

export default function AnimatedCard({ children, delay = 0 }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);
  const scale = useSharedValue(0.98);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 450 });
    translateY.value = withTiming(0, { duration: 450 });
    scale.value = withSpring(1, { damping: 14 });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
