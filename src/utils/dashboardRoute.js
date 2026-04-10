export const LEARNER_SECTIONS = new Set([
  'store',
  'courses',
  'progress',
  'achievements',
  'my-art',
  'notifications',
  'profile',
  'settings'
])

export const TEACHER_SECTIONS = new Set([
  'courses',
  'builder',
  'quizzes',
  'students',
  'messages',
  'reviews',
  'analytics',
  'earnings',
  'culture',
  'language',
  'profile',
  'settings'
])

export const normalizeLearnerSection = (value = '') => {
  const normalized = String(value || '').trim().toLowerCase()
  return LEARNER_SECTIONS.has(normalized) ? normalized : 'store'
}

export const normalizeLearnerView = (section, value = '') => {
  const normalizedSection = normalizeLearnerSection(section)
  const normalizedView = String(value || '').trim().toLowerCase()

  if (normalizedSection === 'courses') {
    return ['all', 'in-progress', 'completed'].includes(normalizedView) ? normalizedView : 'all'
  }

  if (normalizedSection === 'store') {
    return ['all', 'free', 'paid', 'published'].includes(normalizedView) ? normalizedView : 'all'
  }

  return ''
}

export const buildLearnerDashboardPath = (section = 'store', view = '') => {
  const normalizedSection = normalizeLearnerSection(section)
  const normalizedView = normalizeLearnerView(normalizedSection, view)

  if (normalizedSection === 'store' && normalizedView === 'all') return '/learner/store'
  if (normalizedSection === 'courses' && normalizedView === 'all') return '/learner/courses'
  if (normalizedSection === 'store' || normalizedSection === 'courses') {
    return `/learner/${normalizedSection}/${normalizedView}`
  }

  return `/learner/${normalizedSection}`
}

export const normalizeTeacherSection = (value = '') => {
  const normalized = String(value || '').trim().toLowerCase()
  return TEACHER_SECTIONS.has(normalized) ? normalized : 'courses'
}

export const buildTeacherDashboardPath = (section = 'courses') => {
  const normalizedSection = normalizeTeacherSection(section)
  return `/teacher-dashboard/${normalizedSection}`
}
