import React, { useState } from 'react'
import '../styles/quiz.css'

const Quiz = ({ quiz = [], topicTitle = '', onSubmitResult }) => {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  if (quiz.length === 0) return null

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmit = () => {
    let correct = 0
    quiz.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++
    })
    setScore(correct)
    setSubmitted(true)
    if (onSubmitResult) {
      onSubmitResult({ score: correct, total: quiz.length })
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const allAnswered = quiz.every(q => answers[q.id] !== undefined)

  return (
    <div className='quiz-page'>

      <div className='quiz-header'>
        <h2>📝 Topic Quiz</h2>
        {topicTitle && <p className='quiz-topic-name'>{topicTitle}</p>}
      </div>

      <div className='quiz-questions'>
        {quiz.map((q, qi) => (
          <div key={q.id} className={`quiz-q-block ${submitted ? 'quiz-submitted' : ''}`}>

            <p className='quiz-q-text'>
              <span className='quiz-q-number'>Q{qi + 1}.</span> {q.question}
            </p>

            <div className='quiz-options-list'>
              {q.options.map((opt, oi) => {
                const isSelected = answers[q.id] === oi
                const isCorrect = oi === q.correctIndex
                const isWrong = submitted && isSelected && !isCorrect

                let optClass = 'quiz-option-item'
                if (submitted && isCorrect) optClass += ' quiz-option-correct'
                if (isWrong) optClass += ' quiz-option-wrong'
                if (!submitted && isSelected) optClass += ' quiz-option-selected'

                return (
                  <label key={oi} className={optClass} onClick={() => handleSelect(q.id, oi)}>
                    <input
                      type='radio'
                      name={`q-${q.id}`}
                      checked={isSelected}
                      onChange={() => handleSelect(q.id, oi)}
                      disabled={submitted}
                    />
                    <span>{opt}</span>
                    {submitted && isCorrect && <span className='quiz-tick'>✅</span>}
                    {isWrong && <span className='quiz-cross'>❌</span>}
                  </label>
                )
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Submit / Score */}
      {!submitted ? (
        <div className='quiz-submit-row'>
          <button
            className='quiz-submit-btn'
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Quiz
          </button>
          {!allAnswered && (
            <p className='quiz-warning'>Please answer all questions before submitting.</p>
          )}
        </div>
      ) : (
        <div className='quiz-result'>
          <div className='quiz-score-box'>
            <h3>🎉 You scored: <span>{score}/{quiz.length}</span></h3>
            <p>
              {score === quiz.length
                ? 'Perfect score! Excellent work! 🌟'
                : score >= quiz.length / 2
                  ? 'Good job! Keep it up! 💪'
                  : 'Keep practicing, you\'ll get there! 📚'}
            </p>
          </div>
          <button className='quiz-retry-btn' onClick={handleRetry}>
            🔄 Try Again
          </button>
        </div>
      )}

    </div>
  )
}

export default Quiz