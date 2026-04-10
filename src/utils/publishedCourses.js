import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '../context/AuthContext'

const publishedCoursesCache = new Map()
const pendingPublishedCoursesRequests = new Map()

export const getPublishedCourses = async (limitCount = 4) => {
  if (publishedCoursesCache.has(limitCount)) {
    return publishedCoursesCache.get(limitCount)
  }

  if (pendingPublishedCoursesRequests.has(limitCount)) {
    return pendingPublishedCoursesRequests.get(limitCount)
  }

  const request = getDocs(
    query(
      collection(db, 'courses'),
      where('status', '==', 'Published'),
      limit(limitCount)
    )
  )
    .then((snapshot) => {
      const courses = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }))
      publishedCoursesCache.set(limitCount, courses)
      return courses
    })
    .finally(() => {
      pendingPublishedCoursesRequests.delete(limitCount)
    })

  pendingPublishedCoursesRequests.set(limitCount, request)
  return request
}

export const clearPublishedCoursesCache = (limitCount) => {
  if (typeof limitCount === 'number') {
    publishedCoursesCache.delete(limitCount)
    pendingPublishedCoursesRequests.delete(limitCount)
    return
  }

  publishedCoursesCache.clear()
  pendingPublishedCoursesRequests.clear()
}
