import { Colors } from '@/constants/Colors';
import { formatTime } from '@/services/utils.service';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Text } from 'react-native-paper';


// Add these new components
const ResultScreen = () => {
  const { results } = useLocalSearchParams<{ results: string }>();
  console.log(results);
  
  const resultData = results ? JSON.parse(results!) : null
  const [fireConfetti, setFireConfetti] = useState(false);
  const router = useRouter()
  useEffect(() => {
    if (resultData.scorePercentage >= 70) {
      setFireConfetti(true);
    }
  }, []);


  return (
    <LinearGradient colors={[Colors.light.background, Colors.light.primary]} style={styles.resultContainer}>
       {fireConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -20, y: 0 }}
          explosionSpeed={500}
          fallSpeed={3000}
          colors={[
            Colors.light.primary,
            Colors.light.success,
            Colors.light.error,
            Colors.light.purple,
            Colors.light.orange,
          ]}
          fadeOut
          autoStart
          style={styles.confetti}
        />
      )}
      
      <View style={styles.resultCard}>
        <MaterialIcons
          name={resultData.scorePercentage >= 70 ? 'celebration' : 'sentiment-dissatisfied'} 
          size={80} 
          color={resultData.scorePercentage >= 70 ? Colors.light.success : Colors.light.error} 
        />
        
        <Text style={styles.resultTitle}>
          {resultData.scorePercentage >= 70 ? 'Félicitations!' : 'Continuez à vous entraîner !'}
        </Text>
        
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{resultData.scorePercentage}%</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="check-circle" size={24} color={Colors.light.success} />
            <Text style={styles.statText}>{resultData.correctAnswers} Correct</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="highlight-off" size={24} color={Colors.light.error} />
            <Text style={styles.statText}>{resultData.totalQuestions - resultData.correctAnswers} Incorrect</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="timer" size={24} color={Colors.light.primary} />
            {/*<Text style={styles.statText}>{formatTime(resultData.timeTaken)}</Text>*/}
          </View>
        </View>

        <ScrollView style={styles.questionsList}>
          {resultData.questions.map((question: any, index: number) => (
            <View key={index} style={styles.questionItem}>
              <MaterialIcons 
                name={question.isCorrect ? 'check' : 'close'} 
                size={20} 
                color={question.isCorrect ? Colors.light.success : Colors.light.error} 
              />
              <Text style={styles.questionText}>Question {index + 1}</Text>
              {question.hasImage && <MaterialIcons name="image" size={20} color={Colors.light.text} />}
            </View>
          ))}
        </ScrollView>

        <View style={styles.actionButtons}>
          {/* Add this button */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.light.primary }]}
            onPress={() => router.push({ pathname: '/(home)/(quiz)/result-detail', params: { results: JSON.stringify(resultData) } })}
          >
            <MaterialIcons name='lightbulb' size={35} color={Colors.light.background} />
          </TouchableOpacity>

          {/* Existing buttons */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.light.primary }]}
            onPress={() => router.push('/')}
          >
            <MaterialIcons name='home' size={35} color={Colors.light.background} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.light.success }]}
            onPress={() => router.push({ pathname: '/(home)/(quiz)/train', params: { categorie: JSON.stringify(resultData.categorie) } })}
          >
            <MaterialIcons name='arrow-back' size={35} color={Colors.light.background} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// Add these new styles
const styles = StyleSheet.create({
  detailButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: Colors.light.text,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: 5,
    borderColor: Colors.light.primary,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    marginTop: 5,
    color: Colors.light.text,
    textAlign: 'center',
  },
  questionsList: {
    maxHeight: 200,
    marginVertical: 10,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
  },
  questionText: {
    marginLeft: 10,
    color: Colors.light.text,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResultScreen