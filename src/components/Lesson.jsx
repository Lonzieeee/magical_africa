import React, { useEffect, useMemo, useRef, useState } from 'react'
import '../styles/lesson.css'
import '../styles/teacher-dashboard.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { db, auth } from '../context/AuthContext'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { FaChevronLeft } from 'react-icons/fa'

const MIN_TOPIC_TITLE = 3
const MIN_TOPIC_DESC = 10
const DURATION_PRESETS = ['3 min', '5 min', '10 min', '15 min', '20 min', '30 min', '45 min', '60 min']

const createDefaultAssessmentSettings = () => ({
  passMark: 70,
  timeLimitMinutes: '',
  attemptsAllowed: 3,
  randomizeQuestions: false,
  feedbackMode: 'after-submit'
})

const Lesson = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const stateId = location.state?.courseId
  const storedId = localStorage.getItem('currentCourseId')
  const courseId = stateId || storedId
  const draftKey = courseId ? `lessonDraft:${courseId}` : ''

  const [topics, setTopics] = useState([
    {
      id: Date.now(),
      title: '',
      description: '',
      showDesc: true,
      lessons: [],
      quiz: [],
      assessmentSettings: createDefaultAssessmentSettings(),
      showQuizBuilder: false
    }
  ])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [courseInfo, setCourseInfo] = useState({})
  const [authReady, setAuthReady] = useState(false)
  const [saveAttempted, setSaveAttempted] = useState(false)
  const [lessonErrors, setLessonErrors] = useState({})
  const [questionErrors, setQuestionErrors] = useState({})
  const [assessmentErrors, setAssessmentErrors] = useState({})
  const [draftSavedAt, setDraftSavedAt] = useState(0)
  const [quizPulseTopicId, setQuizPulseTopicId] = useState('')

  const hasHydrated = useRef(false)

  const normalizeQuestion = (question) => ({
    id: question?.id || Date.now() + Math.random(),
    question: question?.question || '',
    options: Array.isArray(question?.options) && question.options.length === 4
      ? question.options
      : ['', '', '', ''],
    correctIndex: Number.isInteger(question?.correctIndex) ? question.correctIndex : 0,
    editing: false
  })

  const normalizeLesson = (lesson) => ({
    id: lesson?.id || Date.now() + Math.random(),
    title: lesson?.title || '',
    type: lesson?.type === 'notes' ? 'notes' : 'video',
    duration: lesson?.duration || '',
    videoURL: lesson?.videoURL || '',
    fileData: lesson?.fileData || '',
    fileName: lesson?.fileName || '',
    editingTitle: false
  })

  const normalizeTopic = (topic) => ({
    id: topic?.id || Date.now() + Math.random(),
    title: topic?.title || '',
    description: topic?.description || '',
    showDesc: false,
    lessons: Array.isArray(topic?.lessons) ? topic.lessons.map(normalizeLesson) : [],
    quiz: Array.isArray(topic?.quiz) ? topic.quiz.map(normalizeQuestion) : [],
    assessmentSettings: {
      ...createDefaultAssessmentSettings(),
      ...(topic?.assessmentSettings || {})
    },
    showQuizBuilder: false
  })

  const lessonKey = (topicId, lessonId) => `${topicId}:${lessonId}`
  const questionKey = (topicId, questionId) => `${topicId}:${questionId}`

  const scrollToField = (fieldId) => {
    if (!fieldId) {
      const firstError = document.querySelector('.lesson-inline-error')
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const target = document.getElementById(fieldId)
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (typeof target.focus === 'function') {
      target.focus()
    }
  }

  const validateLesson = (lesson) => {
    const errors = {}
    if (!lesson.title?.trim()) errors.title = 'Lesson title is required.'
    if (!lesson.duration?.trim()) errors.duration = 'Duration is required.'
    if (lesson.type === 'video' && !lesson.videoURL?.trim()) errors.videoURL = 'Video URL is required for video lessons.'
    if (lesson.type === 'notes' && !lesson.fileName?.trim()) errors.file = 'Upload a notes file for this lesson.'
    return errors
  }

  const validateQuestion = (question) => {
    const errors = {}
    if (!question.question?.trim()) errors.question = 'Question text is required.'

    const optionErrors = question.options.map(opt => (!opt?.trim() ? 'Option cannot be empty.' : ''))
    if (optionErrors.some(Boolean)) errors.options = optionErrors

    if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
      errors.correctIndex = 'Pick the correct answer.'
    }

    return errors
  }

  const validateAssessmentSettings = (settings, quizActive) => {
    if (!quizActive) return {}

    const errors = {}
    const passMark = Number(settings?.passMark)
    const attemptsAllowed = Number(settings?.attemptsAllowed)
    const hasTimeLimit = String(settings?.timeLimitMinutes ?? '').trim() !== ''
    const timeLimitMinutes = Number(settings?.timeLimitMinutes)
    const feedbackMode = settings?.feedbackMode

    if (!Number.isFinite(passMark) || passMark < 10 || passMark > 100) {
      errors.passMark = 'Pass mark should be between 10 and 100.'
    }

    if (!Number.isFinite(attemptsAllowed) || attemptsAllowed < 1 || attemptsAllowed > 20) {
      errors.attemptsAllowed = 'Attempts allowed should be between 1 and 20.'
    }

    if (hasTimeLimit && (!Number.isFinite(timeLimitMinutes) || timeLimitMinutes <= 0 || timeLimitMinutes > 300)) {
      errors.timeLimitMinutes = 'Time limit should be between 1 and 300 minutes.'
    }

    if (!['immediate', 'after-submit', 'after-pass'].includes(feedbackMode)) {
      errors.feedbackMode = 'Choose when learners should see feedback.'
    }

    return errors
  }

  const getTopicValidation = (topic) => {
    const titleValid = topic.title.trim().length >= MIN_TOPIC_TITLE
    const descValid = topic.description.trim().length >= MIN_TOPIC_DESC
    const basicsValid = titleValid && descValid

    const lessonsValid = topic.lessons.length > 0 && topic.lessons.every((lesson) => Object.keys(validateLesson(lesson)).length === 0)

    const quizActive = topic.showQuizBuilder || (topic.quiz || []).length > 0
    const quizSettingsValid = Object.keys(validateAssessmentSettings(topic.assessmentSettings || createDefaultAssessmentSettings(), quizActive)).length === 0
    const quizValid = !quizActive || ((topic.quiz || []).length > 0 && (topic.quiz || []).every((q) => Object.keys(validateQuestion(q)).length === 0))

    const hasEditingRows = topic.lessons.some(lesson => lesson.editingTitle) || (topic.quiz || []).some(question => question.editing)
    const complete = basicsValid && lessonsValid && quizValid && quizSettingsValid && !hasEditingRows

    return {
      basicsValid,
      lessonsValid,
      quizActive,
      quizSettingsValid,
      quizValid,
      hasEditingRows,
      complete
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => setAuthReady(true))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (stateId) localStorage.setItem('currentCourseId', stateId)
  }, [stateId])

  useEffect(() => {
    if (!authReady || !courseId) return

    const loadData = async () => {
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId))

        const draftRaw = draftKey ? localStorage.getItem(draftKey) : null
        const draft = draftRaw ? JSON.parse(draftRaw) : null

        if (courseDoc.exists()) {
          const data = courseDoc.data()
          setCourseInfo(data)

          const remoteTopics = Array.isArray(data.topics) ? data.topics.map(normalizeTopic) : []
          const draftTopics = Array.isArray(draft?.topics) ? draft.topics.map(normalizeTopic) : []

          const remoteTime = new Date(data.updatedAt || data.createdAt || 0).getTime()
          const draftTime = new Date(draft?.updatedAt || 0).getTime()

          if (draftTopics.length > 0 && draftTime > remoteTime) {
            setTopics(draftTopics)
            setSaveMsg('Recovered your latest local draft changes.')
          } else if (remoteTopics.length > 0) {
            setTopics(remoteTopics)
          } else if (draftTopics.length > 0) {
            setTopics(draftTopics)
            setSaveMsg('Recovered your latest local draft changes.')
          }
        } else if (Array.isArray(draft?.topics) && draft.topics.length > 0) {
          setTopics(draft.topics.map(normalizeTopic))
          setSaveMsg('Recovered your latest local draft changes.')
        }
      } catch (err) {
        console.log('Error loading course:', err)
      } finally {
        hasHydrated.current = true
      }
    }

    loadData()
  }, [authReady, courseId, draftKey])

  useEffect(() => {
    if (!draftKey || !hasHydrated.current) return

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({
          topics,
          updatedAt: new Date().toISOString()
        }))
        setDraftSavedAt(Date.now())
      } catch (err) {
        console.log('Draft save error:', err)
      }
    }, 1200)

    return () => clearTimeout(timeout)
  }, [topics, draftKey])

  useEffect(() => {
    if (!quizPulseTopicId) return

    const timeout = setTimeout(() => {
      setQuizPulseTopicId('')
    }, 2600)

    return () => clearTimeout(timeout)
  }, [quizPulseTopicId])

  // Topic actions
  const addTopic = () => {
    setTopics([...topics, {
      id: Date.now(),
      title: '',
      description: '',
      showDesc: true,
      lessons: [],
      quiz: [],
      assessmentSettings: createDefaultAssessmentSettings(),
      showQuizBuilder: false
    }])
  }

  const updateTopic = (id, field, value) => {
    setTopics(topics.map(t => {
      if (t.id !== id) return t

      // As soon as a title is typed, reveal description so the next step is obvious.
      if (field === 'title') {
        return {
          ...t,
          [field]: value,
          showDesc: value.trim().length > 0 ? true : t.showDesc
        }
      }

      return { ...t, [field]: value }
    }))
  }

  const toggleDesc = (id) => {
    setTopics(topics.map(t => t.id === id ? { ...t, showDesc: !t.showDesc } : t))
  }

  const deleteTopic = (id) => {
    setTopics(topics.filter(t => t.id !== id))
  }

  const handleTopicContinue = (topicId) => {
    const topic = topics.find(t => t.id === topicId)
    if (!topic) return

    const titleValid = topic.title.trim().length >= MIN_TOPIC_TITLE
    const descValid = topic.description.trim().length >= MIN_TOPIC_DESC

    if (!titleValid || !descValid) {
      setSaveAttempted(true)
      setSaveMsg('Add a clear topic title and description before continuing to lessons.')
      setTimeout(() => {
        scrollToField(!titleValid ? `topic-title-${topic.id}` : `topic-desc-${topic.id}`)
      }, 80)
      return
    }

    const shouldCreateFirstLesson = topic.lessons.length === 0
    const firstLessonId = Date.now()

    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t

      const next = { ...t, showDesc: false, showQuizBuilder: false }
      if (shouldCreateFirstLesson) {
        next.lessons = [...t.lessons, {
          id: firstLessonId,
          title: '',
          type: 'video',
          duration: '',
          videoURL: '',
          fileData: '',
          fileName: '',
          editingTitle: true
        }]
      }

      return next
    }))

    setSaveMsg(shouldCreateFirstLesson ? 'Great. Start with your first lesson below.' : 'Great. Continue refining your lessons below.')

    if (shouldCreateFirstLesson) {
      setTimeout(() => {
        scrollToField(`lesson-title-${topicId}-${firstLessonId}`)
      }, 120)
    } else {
      setTimeout(() => {
        scrollToField(`lesson-stage-${topicId}`)
      }, 120)
    }
  }

  const duplicateTopic = (id) => {
    const topic = topics.find(t => t.id === id)
    const index = topics.indexOf(topic)
    const copy = {
      ...topic,
      id: Date.now(),
      showDesc: false,
      showQuizBuilder: false,
      lessons: (topic?.lessons || []).map(lesson => ({ ...lesson, id: Date.now() + Math.random(), editingTitle: false })),
      quiz: (topic?.quiz || []).map(question => ({ ...question, id: Date.now() + Math.random(), editing: false })),
      assessmentSettings: {
        ...createDefaultAssessmentSettings(),
        ...(topic?.assessmentSettings || {})
      }
    }
    const updated = [...topics]
    updated.splice(index + 1, 0, copy)
    setTopics(updated)
  }

  // Lesson actions
  const addLesson = (topicId) => {
    const topic = topics.find(t => t.id === topicId)
    const validation = topic ? getTopicValidation(topic) : null
    if (!validation?.basicsValid) {
      setSaveMsg('Add topic title and description before creating lessons.')
      return
    }

    setTopics(topics.map(t => {
      if (t.id !== topicId || t.lessons.length >= 5) return t
      return {
        ...t,
        showQuizBuilder: false,
        lessons: [...t.lessons, {
          id: Date.now(),
          title: '',
          type: 'video',
          duration: '',
          videoURL: '',
          fileData: '',
          fileName: '',
          editingTitle: true
        }]
      }
    }))

    setQuizPulseTopicId('')
  }

  const updateLesson = (topicId, lessonId, field, value) => {
    setLessonErrors(prev => {
      const key = lessonKey(topicId, lessonId)
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

    setTopics(topics.map(t =>
      t.id === topicId
        ? {
            ...t,
            showQuizBuilder: field === 'editingTitle' && value === true ? false : t.showQuizBuilder,
            lessons: t.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
          }
        : t
    ))

    if (field === 'editingTitle' && value === true) {
      setQuizPulseTopicId('')
    }
  }

  const deleteLesson = (topicId, lessonId) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, lessons: t.lessons.filter(l => l.id !== lessonId) }
        : t
    ))

    setLessonErrors(prev => {
      const key = lessonKey(topicId, lessonId)
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const confirmLesson = (topicId, lessonId) => {
    const topic = topics.find(t => t.id === topicId)
    const lesson = topic?.lessons.find(l => l.id === lessonId)
    if (!lesson) return

    const validationErrors = validateLesson(lesson)
    const key = lessonKey(topicId, lessonId)

    if (Object.keys(validationErrors).length > 0) {
      setLessonErrors(prev => ({ ...prev, [key]: validationErrors }))
      setSaveMsg('Complete all required lesson fields before saving the lesson.')
      return
    }

    setLessonErrors(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, lessons: t.lessons.map(l => l.id === lessonId ? { ...l, editingTitle: false } : l) }
        : t
    ))

    setQuizPulseTopicId(String(topicId))
    setSaveMsg('Lesson saved. Next step: add a quiz or continue with another lesson.')
  }

  const handleNotesUpload = (topicId, lessonId, file) => {
    if (!file) return

    if (file.size > 500 * 1024) {
      setSaveMsg(`File too large (${(file.size / 1024).toFixed(0)}KB). Upload a file under 500KB.`)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setTopics(prev => prev.map(t =>
        t.id === topicId
          ? {
              ...t,
              lessons: t.lessons.map(l =>
                l.id === lessonId
                  ? { ...l, fileData: reader.result, fileName: file.name }
                  : l
              )
            }
          : t
      ))

      setLessonErrors(prev => {
        const key = lessonKey(topicId, lessonId)
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  // Quiz actions
  const updateAssessmentSetting = (topicId, field, value) => {
    setAssessmentErrors(prev => {
      if (!prev[topicId]) return prev
      const next = { ...prev }
      const topicErrors = { ...(next[topicId] || {}) }
      delete topicErrors[field]
      if (Object.keys(topicErrors).length === 0) {
        delete next[topicId]
      } else {
        next[topicId] = topicErrors
      }
      return next
    })

    setTopics(topics.map(t => {
      if (t.id !== topicId) return t
      return {
        ...t,
        assessmentSettings: {
          ...createDefaultAssessmentSettings(),
          ...(t.assessmentSettings || {}),
          [field]: value
        }
      }
    }))
  }

  const toggleQuizBuilder = (topicId) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? {
            ...t,
            assessmentSettings: {
              ...createDefaultAssessmentSettings(),
              ...(t.assessmentSettings || {})
            },
            showQuizBuilder: !t.showQuizBuilder
          }
        : t
    ))
  }

  const addQuestion = (topicId) => {
    setTopics(topics.map(t => {
      if (t.id !== topicId) return t
      if ((t.quiz || []).length >= 5) return t
      return {
        ...t,
        quiz: [...(t.quiz || []), {
          id: Date.now(),
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          editing: true
        }]
      }
    }))
  }

  const updateQuestion = (topicId, questionId, field, value) => {
    setQuestionErrors(prev => {
      const key = questionKey(topicId, questionId)
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

    setTopics(topics.map(t =>
      t.id === topicId
        ? {
            ...t,
            quiz: t.quiz.map(q => q.id === questionId ? { ...q, [field]: value } : q)
          }
        : t
    ))
  }

  const updateOption = (topicId, questionId, optionIndex, value) => {
    setQuestionErrors(prev => {
      const key = questionKey(topicId, questionId)
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

    setTopics(topics.map(t =>
      t.id === topicId
        ? {
            ...t,
            quiz: t.quiz.map(q => {
              if (q.id !== questionId) return q
              const newOptions = [...q.options]
              newOptions[optionIndex] = value
              return { ...q, options: newOptions }
            })
          }
        : t
    ))
  }

  const confirmQuestion = (topicId, questionId) => {
    const topic = topics.find(t => t.id === topicId)
    const question = topic?.quiz.find(q => q.id === questionId)
    if (!question) return

    const validationErrors = validateQuestion(question)
    const key = questionKey(topicId, questionId)

    if (Object.keys(validationErrors).length > 0) {
      setQuestionErrors(prev => ({ ...prev, [key]: validationErrors }))
      setSaveMsg('Complete all question fields before saving.')
      return
    }

    setQuestionErrors(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, quiz: t.quiz.map(q => q.id === questionId ? { ...q, editing: false } : q) }
        : t
    ))
  }

  const deleteQuestion = (topicId, questionId) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, quiz: t.quiz.filter(q => q.id !== questionId) }
        : t
    ))

    setQuestionErrors(prev => {
      const key = questionKey(topicId, questionId)
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const topicValidations = useMemo(() => topics.map(getTopicValidation), [topics])

  const completedTopics = useMemo(
    () => topicValidations.filter(item => item.complete).length,
    [topicValidations]
  )

  const completedLessons = useMemo(() => (
    topics.reduce((sum, topic) => {
      const validLessonCount = topic.lessons.filter(lesson => Object.keys(validateLesson(lesson)).length === 0).length
      return sum + validLessonCount
    }, 0)
  ), [topics])

  const totalLessons = useMemo(
    () => topics.reduce((sum, topic) => sum + topic.lessons.length, 0),
    [topics]
  )

  const totalQuizQuestions = useMemo(
    () => topics.reduce((sum, topic) => sum + (topic.quiz || []).length, 0),
    [topics]
  )

  const validQuizQuestions = useMemo(
    () => topics.reduce((sum, topic) => (
      sum + (topic.quiz || []).filter(question => Object.keys(validateQuestion(question)).length === 0).length
    ), 0),
    [topics]
  )

  const saveBlockReason = useMemo(() => {
    if (!courseId) return 'No active course found. Go back and create/select a course first.'
    if (topics.length === 0) return 'Add at least one topic.'

    const invalidTopicIndex = topicValidations.findIndex(item => !item.complete)
    if (invalidTopicIndex >= 0) {
      const topicNumber = invalidTopicIndex + 1
      const validation = topicValidations[invalidTopicIndex]

      if (!validation.basicsValid) return `Topic ${topicNumber} needs a stronger title and description.`
      if (!validation.lessonsValid) return `Topic ${topicNumber} needs at least one valid lesson.`
      if (!validation.quizSettingsValid) return `Topic ${topicNumber} has invalid assessment settings.`
      if (!validation.quizValid) return `Topic ${topicNumber} has incomplete quiz content.`
      if (validation.hasEditingRows) return `Topic ${topicNumber} has unsaved lesson/quiz edits.`
      return `Topic ${topicNumber} is incomplete.`
    }

    return ''
  }, [courseId, topics.length, topicValidations])

  const handleSave = async () => {
    setSaveAttempted(true)

    if (saveBlockReason) {
      const generatedLessonErrors = {}
      const generatedQuestionErrors = {}
      const generatedAssessmentErrors = {}
      let firstInvalidFieldId = ''

      for (const topic of topics) {
        const topicTitleValid = topic.title.trim().length >= MIN_TOPIC_TITLE
        const topicDescValid = topic.description.trim().length >= MIN_TOPIC_DESC

        if (!firstInvalidFieldId && !topicTitleValid) {
          firstInvalidFieldId = `topic-title-${topic.id}`
        } else if (!firstInvalidFieldId && !topicDescValid) {
          firstInvalidFieldId = `topic-desc-${topic.id}`
        }

        for (const lesson of topic.lessons) {
          const errors = validateLesson(lesson)
          if (Object.keys(errors).length > 0) {
            const key = lessonKey(topic.id, lesson.id)
            generatedLessonErrors[key] = errors

            if (!firstInvalidFieldId) {
              if (errors.title) firstInvalidFieldId = `lesson-title-${topic.id}-${lesson.id}`
              else if (errors.duration) firstInvalidFieldId = `lesson-duration-${topic.id}-${lesson.id}`
              else if (errors.videoURL) firstInvalidFieldId = `lesson-video-${topic.id}-${lesson.id}`
              else if (errors.file) firstInvalidFieldId = `lesson-file-${topic.id}-${lesson.id}`
            }
          }
        }

        for (const question of (topic.quiz || [])) {
          const errors = validateQuestion(question)
          if (Object.keys(errors).length > 0) {
            const key = questionKey(topic.id, question.id)
            generatedQuestionErrors[key] = errors

            if (!firstInvalidFieldId) {
              if (errors.question) firstInvalidFieldId = `question-text-${topic.id}-${question.id}`
              else if (errors.options) firstInvalidFieldId = `question-option-${topic.id}-${question.id}-0`
            }
          }
        }

        const quizActive = topic.showQuizBuilder || (topic.quiz || []).length > 0
        const assessmentValidationErrors = validateAssessmentSettings(topic.assessmentSettings || createDefaultAssessmentSettings(), quizActive)
        if (Object.keys(assessmentValidationErrors).length > 0) {
          generatedAssessmentErrors[topic.id] = assessmentValidationErrors

          if (!firstInvalidFieldId) {
            if (assessmentValidationErrors.passMark) firstInvalidFieldId = `assessment-pass-${topic.id}`
            else if (assessmentValidationErrors.timeLimitMinutes) firstInvalidFieldId = `assessment-time-${topic.id}`
            else if (assessmentValidationErrors.attemptsAllowed) firstInvalidFieldId = `assessment-attempts-${topic.id}`
            else if (assessmentValidationErrors.feedbackMode) firstInvalidFieldId = `assessment-feedback-${topic.id}`
          }
        }
      }

      setLessonErrors(generatedLessonErrors)
      setQuestionErrors(generatedQuestionErrors)
      setAssessmentErrors(generatedAssessmentErrors)
      setSaveMsg(`Cannot save yet: ${saveBlockReason}`)

      setTimeout(() => {
        scrollToField(firstInvalidFieldId)
      }, 80)

      return
    }

    setSaving(true)
    setSaveMsg('')

    try {
      const cleanTopics = topics.map(topic => ({
        id: topic.id,
        title: topic.title.trim(),
        description: topic.description.trim(),
        lessons: topic.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title.trim(),
          type: lesson.type,
          duration: lesson.duration.trim(),
          videoURL: lesson.videoURL || '',
          fileData: lesson.fileData || '',
          fileName: lesson.fileName || ''
        })),
        quiz: (topic.quiz || []).map(question => ({
          id: question.id,
          question: question.question.trim(),
          options: question.options.map(option => option.trim()),
          correctIndex: question.correctIndex
        })),
        assessmentSettings: {
          ...createDefaultAssessmentSettings(),
          ...(topic.assessmentSettings || {}),
          passMark: Number(topic.assessmentSettings?.passMark || 70),
          timeLimitMinutes: String(topic.assessmentSettings?.timeLimitMinutes || '').trim(),
          attemptsAllowed: Number(topic.assessmentSettings?.attemptsAllowed || 3),
          randomizeQuestions: Boolean(topic.assessmentSettings?.randomizeQuestions),
          feedbackMode: topic.assessmentSettings?.feedbackMode || 'after-submit'
        }
      }))

      await setDoc(doc(db, 'courses', courseId), {
        ...courseInfo,
        topics: cleanTopics,
        updatedAt: new Date().toISOString()
      })

      if (draftKey) localStorage.removeItem(draftKey)
      setSaveMsg('Curriculum saved successfully!')

      setTimeout(() => {
        navigate('/teacher-dashboard')
      }, 1200)
    } catch (err) {
      console.log('Save error:', err)
      setSaveMsg('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='td-dashboard lesson-dashboard'>
      <div className='td-layout'>
        <aside className='td-sidebar'>
          <button className='td-back-btn' onClick={() => navigate('/teacher-dashboard')} type='button'>
            <FaChevronLeft aria-hidden='true' />
            <span>Back to Tutor Dashboard</span>
          </button>

          <div className='td-sidebar-brand'>
            <img src='/images/magicaal-logo1-removebg-preview.png' alt='Magical Africa logo' />
            <h2>Tutor Dashboard</h2>
          </div>

          <div className='td-nav-groups'>
            <div className='td-nav-group'>
              <button className='td-nav-group-title expanded' type='button' aria-expanded='true'>
                Teaching Hub
              </button>
              <div className='td-nav-submenu'>
                <button className='td-nav-subitem' onClick={() => navigate('/teacher-dashboard')} type='button'>
                  Courses
                </button>
                <button className='td-nav-subitem' onClick={() => navigate('/curriculum')} type='button'>
                  Curriculum
                </button>
                <button className='td-nav-subitem active' type='button'>
                  Lesson Builder
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className='td-main lesson-main'>
          <section className='td-panel td-view-stage lesson-panel'>
            <h1>Lesson Builder</h1>
            <p className='lesson-lead'>Create lessons topic by topic, validate quickly, and save only when everything is complete.</p>

            <div className='lesson-context'>
              <div>
                <p className='lesson-context-label'>Course</p>
                <h2>{courseInfo.title || 'Untitled course'}</h2>
                <p className='lesson-context-sub'>Work through each topic in order for a smoother publishing flow.</p>
              </div>
              <div className='lesson-progress'>
                <div className='lesson-progress-item'>
                  <span>Topics Complete</span>
                  <strong>{completedTopics}/{topics.length}</strong>
                </div>
                <div className='lesson-progress-item'>
                  <span>Lessons Valid</span>
                  <strong>{completedLessons}/{totalLessons}</strong>
                </div>
                <div className='lesson-progress-item'>
                  <span>Quiz Questions Ready</span>
                  <strong>{validQuizQuestions}/{totalQuizQuestions}</strong>
                </div>
              </div>
            </div>

            {saveMsg && (
              <div className={`lesson-save-msg ${saveMsg.includes('successfully') || saveMsg.includes('Recovered') ? 'ok' : 'err'}`}>
                {saveMsg}
              </div>
            )}

            {draftSavedAt > 0 && (
              <p className='lesson-draft-note'>Draft autosaved locally.</p>
            )}

            <div className='lesson-page'>
              <div className='lesson-div'>
                <div className='lesson-body'>
                  {topics.map((topic, index) => {
                    const validation = topicValidations[index]
                    const isLessonEditing = topic.lessons.some(lesson => lesson.editingTitle)
                    const topicAssessmentErrors = assessmentErrors[topic.id] || {}

                    return (
                      <div key={topic.id} className={`lesson-topic-block ${validation.complete ? 'is-complete' : ''}`}>
                        <div className='lesson-topic-topbar'>
                          <span className='drag-icon'>&#8942;&#8942;</span>
                          <input
                            id={`topic-title-${topic.id}`}
                            type='text'
                            className='lesson-topic-title'
                            placeholder='Topic title...'
                            value={topic.title}
                            onChange={e => updateTopic(topic.id, 'title', e.target.value)}
                          />
                          <span className={`lesson-topic-chip ${validation.complete ? 'complete' : (validation.basicsValid ? 'ready' : 'incomplete')}`}>
                            {validation.complete ? 'Complete' : (validation.basicsValid ? 'Ready' : 'Incomplete')}
                          </span>
                          <div className='lesson-topic-actions'>
                            <button title='Duplicate' onClick={() => duplicateTopic(topic.id)} type='button'>&#10697;</button>
                            <button title='Delete' onClick={() => deleteTopic(topic.id)} type='button'>&#128465;</button>
                            <button title='Toggle description' onClick={() => toggleDesc(topic.id)} type='button'>
                              {topic.showDesc ? '∧' : '∨'}
                            </button>
                          </div>
                        </div>

                        {(saveAttempted && !validation.basicsValid) && (
                          <p className='lesson-inline-error lesson-topic-error'>
                            Topic title needs at least {MIN_TOPIC_TITLE} characters and description needs at least {MIN_TOPIC_DESC}.
                          </p>
                        )}

                        {topic.showDesc && (
                          <div className='lesson-topic-body'>
                            <textarea
                              id={`topic-desc-${topic.id}`}
                              className='lesson-textarea'
                              placeholder='Add a description for this topic...'
                              value={topic.description}
                              onChange={e => updateTopic(topic.id, 'description', e.target.value)}
                            />
                            <div className='lesson-topic-ok-row'>
                              <button className='lesson-cancel-btn' onClick={() => updateTopic(topic.id, 'showDesc', false)} type='button'>Hide</button>
                              <button className='lesson-ok-btn lesson-continue-btn' onClick={() => handleTopicContinue(topic.id)} type='button'>Continue to Lesson</button>
                            </div>
                          </div>
                        )}

                        {validation.basicsValid && (
                          <div id={`lesson-stage-${topic.id}`} className={`lesson-builder-stage ${isLessonEditing ? 'is-pinned' : ''}`}>
                            <div className='lesson-builder-stage-head'>
                              <h3>Lesson Section</h3>
                              <p>
                                {isLessonEditing
                                  ? 'You are editing a lesson. Finish and save it here before moving on.'
                                  : 'Add clear lesson content for this topic before moving to quiz.'}
                              </p>
                            </div>

                            {topic.lessons.length === 0 && (
                              <button
                                className='lesson-start-lesson-btn'
                                onClick={() => addLesson(topic.id)}
                                type='button'
                              >
                                + Add First Lesson
                              </button>
                            )}

                            {topic.lessons.length > 0 && (
                              <div className='lesson-items-list'>
                                {topic.lessons.map((lesson, li) => {
                                  const rowErrors = lessonErrors[lessonKey(topic.id, lesson.id)] || {}
                                  const durationSelection = lesson.durationChoice || (
                                    DURATION_PRESETS.includes(lesson.duration) ? lesson.duration : (lesson.duration ? 'custom' : '')
                                  )

                                  return (
                                    <div key={lesson.id} className='lesson-item-row'>
                                      <span className='lesson-item-icon'>{lesson.type === 'video' ? '▶' : '📄'}</span>
                                      {lesson.editingTitle ? (
                                        <div className='lesson-item-edit'>
                                          <select
                                            className='lesson-type-select'
                                            value={lesson.type}
                                            onChange={e => updateLesson(topic.id, lesson.id, 'type', e.target.value)}
                                          >
                                            <option value='video'>Video</option>
                                            <option value='notes'>Notes / Article</option>
                                          </select>

                                          <input
                                            id={`lesson-title-${topic.id}-${lesson.id}`}
                                            type='text'
                                            className='lesson-item-input'
                                            placeholder='Lesson title...'
                                            value={lesson.title}
                                            onChange={e => updateLesson(topic.id, lesson.id, 'title', e.target.value)}
                                          />
                                          {rowErrors.title && <span className='lesson-inline-error'>{rowErrors.title}</span>}

                                          <select
                                            id={`lesson-duration-${topic.id}-${lesson.id}`}
                                            className='lesson-type-select lesson-duration-select'
                                            value={durationSelection}
                                            onChange={(e) => {
                                              const nextValue = e.target.value
                                              if (nextValue === 'custom') {
                                                updateLesson(topic.id, lesson.id, 'durationChoice', 'custom')
                                                if (DURATION_PRESETS.includes(lesson.duration)) {
                                                  updateLesson(topic.id, lesson.id, 'duration', '')
                                                }
                                                return
                                              }

                                              updateLesson(topic.id, lesson.id, 'durationChoice', nextValue)
                                              updateLesson(topic.id, lesson.id, 'duration', nextValue)
                                            }}
                                          >
                                            <option value=''>Select duration...</option>
                                            {DURATION_PRESETS.map((durationOption) => (
                                              <option key={durationOption} value={durationOption}>{durationOption}</option>
                                            ))}
                                            <option value='custom'>Custom...</option>
                                          </select>

                                          {durationSelection === 'custom' && (
                                            <input
                                              type='text'
                                              className='lesson-item-input lesson-item-duration-custom'
                                              placeholder='Custom duration e.g. 5:30'
                                              value={lesson.duration}
                                              onChange={e => updateLesson(topic.id, lesson.id, 'duration', e.target.value)}
                                            />
                                          )}
                                          {rowErrors.duration && <span className='lesson-inline-error'>{rowErrors.duration}</span>}

                                          {lesson.type === 'video' && (
                                            <>
                                              <input
                                                id={`lesson-video-${topic.id}-${lesson.id}`}
                                                type='text'
                                                className='lesson-item-input lesson-item-url'
                                                placeholder='Paste YouTube or Vimeo URL...'
                                                value={lesson.videoURL}
                                                onChange={e => updateLesson(topic.id, lesson.id, 'videoURL', e.target.value)}
                                              />
                                              {rowErrors.videoURL && <span className='lesson-inline-error'>{rowErrors.videoURL}</span>}
                                            </>
                                          )}

                                          {lesson.type === 'notes' && (
                                            <div className='lesson-notes-upload'>
                                              <input
                                                id={`lesson-file-${topic.id}-${lesson.id}`}
                                                type='file'
                                                accept='.pdf,.doc,.docx,.txt'
                                                className='lesson-item-input'
                                                onChange={e => handleNotesUpload(topic.id, lesson.id, e.target.files[0])}
                                              />
                                              {lesson.fileName && (
                                                <span className='lesson-notes-filename'>📄 {lesson.fileName}</span>
                                              )}
                                              {rowErrors.file && <span className='lesson-inline-error'>{rowErrors.file}</span>}
                                            </div>
                                          )}

                                          <button className='lesson-item-ok' onClick={() => confirmLesson(topic.id, lesson.id)} type='button'>Save</button>
                                          <button className='lesson-item-cancel' onClick={() => deleteLesson(topic.id, lesson.id)} type='button'>&#128465;</button>
                                        </div>
                                      ) : (
                                        <div className='lesson-item-confirmed'>
                                          <span className='lesson-item-name'>{lesson.title || `Lesson ${li + 1}`}</span>
                                          <span className='lesson-item-dur'>{lesson.duration}</span>
                                          {lesson.videoURL && lesson.type === 'video' && (
                                            <span className='lesson-item-video-tag'>Video linked</span>
                                          )}
                                          {lesson.fileName && lesson.type === 'notes' && (
                                            <span className='lesson-item-video-tag'>Notes linked</span>
                                          )}
                                          <button
                                            className='lesson-item-edit-btn'
                                            onClick={() => updateLesson(topic.id, lesson.id, 'editingTitle', true)}
                                            type='button'
                                          >
                                            Edit
                                          </button>
                                          <button className='lesson-item-del' onClick={() => deleteLesson(topic.id, lesson.id)} type='button'>&#128465;</button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                                {topic.lessons.length >= 5 && (
                                  <p className='lesson-max-note'>Maximum 5 lessons reached for this topic.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {topic.showQuizBuilder && !isLessonEditing && (
                          <div className='quiz-builder'>
                            <div className='quiz-builder-header'>
                              <span>Quiz Builder - {topic.title || 'This Topic'}</span>
                              <span className='quiz-count'>{(topic.quiz || []).length}/5 questions</span>
                            </div>

                            <div className='quiz-settings-panel'>
                              <h4>Assessment Settings</h4>

                              <div className='quiz-settings-grid'>
                                <label htmlFor={`assessment-pass-${topic.id}`}>Pass Mark (%)</label>
                                <input
                                  id={`assessment-pass-${topic.id}`}
                                  type='number'
                                  min='10'
                                  max='100'
                                  className='quiz-setting-input'
                                  value={topic.assessmentSettings?.passMark ?? 70}
                                  onChange={(e) => updateAssessmentSetting(topic.id, 'passMark', e.target.value)}
                                />
                                {topicAssessmentErrors.passMark && <span className='lesson-inline-error'>{topicAssessmentErrors.passMark}</span>}

                                <label htmlFor={`assessment-time-${topic.id}`}>Time Limit (minutes, optional)</label>
                                <input
                                  id={`assessment-time-${topic.id}`}
                                  type='number'
                                  min='1'
                                  max='300'
                                  className='quiz-setting-input'
                                  value={topic.assessmentSettings?.timeLimitMinutes ?? ''}
                                  placeholder='No limit'
                                  onChange={(e) => updateAssessmentSetting(topic.id, 'timeLimitMinutes', e.target.value)}
                                />
                                {topicAssessmentErrors.timeLimitMinutes && <span className='lesson-inline-error'>{topicAssessmentErrors.timeLimitMinutes}</span>}

                                <label htmlFor={`assessment-attempts-${topic.id}`}>Attempts Allowed</label>
                                <input
                                  id={`assessment-attempts-${topic.id}`}
                                  type='number'
                                  min='1'
                                  max='20'
                                  className='quiz-setting-input'
                                  value={topic.assessmentSettings?.attemptsAllowed ?? 3}
                                  onChange={(e) => updateAssessmentSetting(topic.id, 'attemptsAllowed', e.target.value)}
                                />
                                {topicAssessmentErrors.attemptsAllowed && <span className='lesson-inline-error'>{topicAssessmentErrors.attemptsAllowed}</span>}

                                <label htmlFor={`assessment-feedback-${topic.id}`}>Feedback Mode</label>
                                <select
                                  id={`assessment-feedback-${topic.id}`}
                                  className='quiz-setting-select'
                                  value={topic.assessmentSettings?.feedbackMode || 'after-submit'}
                                  onChange={(e) => updateAssessmentSetting(topic.id, 'feedbackMode', e.target.value)}
                                >
                                  <option value='immediate'>Show answers immediately</option>
                                  <option value='after-submit'>Show answers after submit</option>
                                  <option value='after-pass'>Show answers after pass</option>
                                </select>
                                {topicAssessmentErrors.feedbackMode && <span className='lesson-inline-error'>{topicAssessmentErrors.feedbackMode}</span>}
                              </div>

                              <label className='quiz-setting-toggle'>
                                <input
                                  type='checkbox'
                                  checked={Boolean(topic.assessmentSettings?.randomizeQuestions)}
                                  onChange={(e) => updateAssessmentSetting(topic.id, 'randomizeQuestions', e.target.checked)}
                                />
                                <span>Randomize question order for each attempt</span>
                              </label>
                            </div>

                            {(topic.quiz || []).map((q, qi) => {
                              const qErrors = questionErrors[questionKey(topic.id, q.id)] || {}

                              return (
                                <div key={q.id} className='quiz-question-block'>
                                  {q.editing ? (
                                    <>
                                      <div className='quiz-question-row'>
                                        <span className='quiz-q-num'>Q{qi + 1}.</span>
                                        <input
                                          id={`question-text-${topic.id}-${q.id}`}
                                          type='text'
                                          className='quiz-question-input'
                                          placeholder='Type your question here...'
                                          value={q.question}
                                          onChange={e => updateQuestion(topic.id, q.id, 'question', e.target.value)}
                                        />
                                      </div>
                                      {qErrors.question && <span className='lesson-inline-error'>{qErrors.question}</span>}

                                      <div className='quiz-options'>
                                        {q.options.map((opt, oi) => (
                                          <div key={oi} className='quiz-option-row'>
                                            <input
                                              type='radio'
                                              name={`correct-${q.id}`}
                                              checked={q.correctIndex === oi}
                                              onChange={() => updateQuestion(topic.id, q.id, 'correctIndex', oi)}
                                            />
                                            <input
                                              id={`question-option-${topic.id}-${q.id}-${oi}`}
                                              type='text'
                                              className='quiz-option-input'
                                              placeholder={`Option ${oi + 1}...`}
                                              value={opt}
                                              onChange={e => updateOption(topic.id, q.id, oi, e.target.value)}
                                            />
                                            {q.correctIndex === oi && (
                                              <span className='quiz-correct-tag'>Correct</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      {qErrors.options && <span className='lesson-inline-error'>All options are required.</span>}

                                      <div className='quiz-question-actions'>
                                        <button className='lesson-cancel-btn' onClick={() => deleteQuestion(topic.id, q.id)} type='button'>Delete</button>
                                        <button className='lesson-ok-btn' onClick={() => confirmQuestion(topic.id, q.id)} type='button'>Save Question</button>
                                      </div>
                                    </>
                                  ) : (
                                    <div className='quiz-confirmed-row'>
                                      <span className='quiz-confirmed-text'>Q{qi + 1}. {q.question || 'Untitled question'}</span>
                                      <div className='quiz-confirmed-actions'>
                                        <button className='lesson-item-edit-btn' onClick={() => updateQuestion(topic.id, q.id, 'editing', true)} type='button'>Edit</button>
                                        <button className='lesson-item-del' onClick={() => deleteQuestion(topic.id, q.id)} type='button'>&#128465;</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}

                            {(topic.quiz || []).length < 5 && (
                              <button className='quiz-add-question-btn' onClick={() => addQuestion(topic.id)} type='button'>
                                + Add Question
                              </button>
                            )}
                            {(topic.quiz || []).length >= 5 && (
                              <p className='lesson-max-note'>Maximum 5 questions reached for this topic.</p>
                            )}
                          </div>
                        )}

                        <div className='lesson-topic-footer'>
                          {validation.basicsValid && topic.lessons.length === 0 && (
                            <p className='lesson-next-step-hint'>
                              Next step: click + Lesson to add your first lesson for this topic.
                            </p>
                          )}

                          <div className='lesson-footer-left'>
                            <button
                              className={`lesson-action-btn ${validation.basicsValid && topic.lessons.length === 0 ? 'is-next-action' : ''}`}
                              onClick={() => addLesson(topic.id)}
                              disabled={!validation.basicsValid || topic.lessons.length >= 5}
                              type='button'
                            >
                              + Lesson
                            </button>
                            <button
                              className={`lesson-action-btn ${topic.showQuizBuilder ? 'quiz-btn-active' : ''} ${(!isLessonEditing && quizPulseTopicId === String(topic.id)) ? 'is-next-quiz is-mobile-sticky-next' : ''}`}
                              onClick={() => toggleQuizBuilder(topic.id)}
                              disabled={isLessonEditing}
                              type='button'
                            >
                              + Quiz {topic.quiz && topic.quiz.length > 0 ? `(${topic.quiz.length})` : ''}
                              {!isLessonEditing && quizPulseTopicId === String(topic.id) && (
                                <span className='lesson-next-pill'>Next</span>
                              )}
                            </button>
                          </div>
                          <div className='lesson-footer-right'>
                            <span className='lesson-topic-hint'>
                              {isLessonEditing
                                ? 'Save the current lesson first, then continue to quiz.'
                                : (validation.complete ? 'Topic complete' : 'Complete title, description, and one valid lesson')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <button className='lesson-add-topic-btn' onClick={addTopic} type='button'>+ Add Topic</button>
                </div>

                <div className='lesson-footer-nav'>
                  <button className='lesson-prev-btn' onClick={() => navigate('/curriculum')} type='button'>Back</button>
                  <button className='lesson-next-btn' onClick={handleSave} disabled={saving || Boolean(saveBlockReason)} type='button'>
                    {saving ? 'Saving...' : 'Save & Return'}
                  </button>
                </div>
                <p className='lesson-save-hint'>
                  {saveBlockReason || 'Everything looks complete. You can save now.'}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Lesson
