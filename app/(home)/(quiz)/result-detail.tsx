
import { Colors } from '@/constants/Colors';
import { MAIN_URL } from '@/constants/Url';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const ResultDetailScreen = () => {
  const { results } = useLocalSearchParams<{ results: string }>();
  const resultData = JSON.parse(results!);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const router = useRouter()
  const toggleQuestion = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <LinearGradient colors={[Colors.light.background, Colors.light.primary]} style={styles.detailContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.detailTitle}>Résultats détaillés</Text>
        
        {resultData.questions.map((question:any, index:number) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.questionCard,
              question.isCorrect ? styles.correctCard : styles.incorrectCard
            ]}
            onPress={() => toggleQuestion(index)}
          >
            <View style={styles.questionHeader}>
              <MaterialIcons 
                name={question.isCorrect ? 'check-circle' : 'cancel'} 
                size={24} 
                color={question.isCorrect ? Colors.light.success : Colors.light.error} 
              />
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              {question.hasImage && <MaterialIcons name="image" size={20} color={Colors.light.text} />}
            </View>

            {(expandedQuestion === index || true) && (
              <View style={styles.questionDetails}>
                <Text style={styles.questionText}>{question.text}</Text>

                {question.image && (
                  <Image
                    source={{ uri: `${MAIN_URL}${question.image}` }}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                )}

                <View style={styles.answerSection}>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>Votre Réponse:</Text>
                    <Text style={[
                      styles.answerText,
                      !question.isCorrect && styles.wrongAnswerText
                    ]}>
                      {question.userAnswer}
                    </Text>
                  </View>

                  {!question.isCorrect && (
                    <View style={styles.answerRow}>
                      <Text style={styles.answerLabel}>Bonne réponse :</Text>
                      <Text style={[styles.answerText, styles.correctAnswerText]}>
                        {question.correctAnswer}
                      </Text>
                    </View>
                  )}
                </View>

                {question.answerImage && (
                  <Image
                    source={{ uri: `${MAIN_URL}${question.answerImage}` }}
                    style={styles.answerImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>retour au Sommaire</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};


// Add these styles
const styles = StyleSheet.create({
  // ... existing styles
  
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  correctCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.success,
  },
  incorrectCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  questionDetails: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.background,
    paddingTop: 15,
  },
  questionText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 10,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  answerSection: {
    marginTop: 10,
    gap: 8,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  answerLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  answerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  correctAnswerText: {
    color: Colors.light.success,
  },
  wrongAnswerText: {
    color: Colors.light.error,
    textDecorationLine: 'line-through',
  },
  answerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultDetailScreen;