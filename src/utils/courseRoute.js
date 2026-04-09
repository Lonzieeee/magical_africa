export const slugifyCourseTitle = (title = '') => {
  const normalized = String(title || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'course'
}

export const buildCoursePath = (courseId, title = '', options = {}) => {
  if (!courseId) return '/course-content'

  const slug = slugifyCourseTitle(title)
  const params = new URLSearchParams()

  if (options.preview) params.set('preview', '1')
  if (options.fromResume) params.set('resume', '1')

  const query = params.toString()
  return `/course/${encodeURIComponent(courseId)}/${slug}${query ? `?${query}` : ''}`
}