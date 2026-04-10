import React, { useEffect, useMemo, useState } from 'react'
import '../styles/academy-dropdown.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import useAcademyNavigation from "../hooks/useAcademyNavigation";
import { useAuth } from '../context/AuthContext';
import { buildCoursePath } from '../utils/courseRoute';
import { getPublishedCourses } from '../utils/publishedCourses';

const CATEGORY_ALIASES = {
  Language: ['language', 'languages', 'swahili', 'maasai', 'kamba', 'yoruba', 'zulu', 'hausa', 'amharic'],
  Culture: ['culture', 'cultural', 'music', 'dance', 'cooking', 'history'],
  Woodwork: ['woodwork', 'wood work', 'wood-working'],
  Pottery: ['pottery'],
  Artisan: ['artisan', 'artisanal', 'craft', 'crafts'],
  Basketry: ['basketry', 'weaving']
}

const toTitleCase = (value = '') => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase())

const resolveCategoryTitle = (courseType = '') => {
  const normalized = String(courseType || '').trim().toLowerCase()
  if (!normalized) return 'General'

  const matchedEntry = Object.entries(CATEGORY_ALIASES)
    .find(([, aliases]) => aliases.includes(normalized))

  return matchedEntry ? matchedEntry[0] : toTitleCase(courseType)
}

const resolveColumnTone = (categoryTitle = '') => {
  const normalized = String(categoryTitle || '').trim().toLowerCase()
  if (normalized === 'language') return 'lang'
  if (['culture', 'cooking', 'history', 'music', 'dance'].includes(normalized)) return 'culture'
  return 'skills'
}

const truncateWords = (text = '', maxWords = 5) => {
  const normalizedText = String(text || '').trim()
  if (!normalizedText) return ''

  const words = normalizedText.split(/\s+/)
  if (words.length <= maxWords) return normalizedText
  return `${words.slice(0, maxWords).join(' ')}...`
}

const DropdownPanel = ({ header, columns, footerLink, footerTag, onFooterClick, onFooterTagClick, onItemClick, loading }) => (
  <div className='md-panel'>
    <div className='md-header'>{header}</div>
    <div className='md-grid'>
      {loading && (
        <div className='md-status'>Loading courses...</div>
      )}

      {!loading && columns.length === 0 && (
        <div className='md-status'>No published courses yet.</div>
      )}

      {!loading && columns.map((col) => (
        <div key={col.title} className={`md-col md-col--${col.col}`}>
          <div className='md-col-title'>{col.title}</div>
          {col.items.map((item) => (
            <div
              key={item.id}
              className='md-item'
              onClick={() => onItemClick(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onItemClick(item)
                }
              }}
              role='button'
              tabIndex={0}
            >
              <span className='md-dot' />
              <div>
                <div className='md-item-label'>{item.label}</div>
                <div className='md-item-sub'>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className='md-footer'>
      <span className='md-footer-link' onClick={onFooterClick}>{footerLink} →</span>
      <span className='md-footer-tag' onClick={onFooterTagClick}>{footerTag}</span>
    </div>
  </div>
)

const AcademyDropdown = () => {
  const navigate = useNavigate()
  const { t } = useTranslation();
  const { user, userData } = useAuth()
  const goToAcademy  = useAcademyNavigation();
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [dropdownCourses, setDropdownCourses] = useState([])

  const normalizeRole = (role) => {
    const value = String(role || '').trim().toLowerCase()
    if (!value) return ''
    if (value.includes('teacher') || value.includes('tutor') || value.includes('educator')) return 'teacher'
    if (value.includes('learner') || value.includes('student')) return 'learner'
    return ''
  }

  useEffect(() => {
    const fetchDropdownCourses = async () => {
      setCoursesLoading(true)
      try {
        setDropdownCourses(await getPublishedCourses(4))
      } catch (error) {
        console.log('Failed to load academy dropdown courses:', error)
        setDropdownCourses([])
      } finally {
        setCoursesLoading(false)
      }
    }

    fetchDropdownCourses()
  }, [])

  const courseColumns = useMemo(() => {
    const grouped = dropdownCourses.reduce((acc, course) => {
      const categoryTitle = resolveCategoryTitle(course.courseType)
      if (!acc[categoryTitle]) {
        acc[categoryTitle] = []
      }
      acc[categoryTitle].push(course)
      return acc
    }, {})

    return Object.entries(grouped)
      .sort(([, aCourses], [, bCourses]) => bCourses.length - aCourses.length)
      .slice(0, 3)
      .map(([title, courses]) => ({
        col: resolveColumnTone(title),
        title,
        items: courses.slice(0, 3).map((course) => ({
          id: course.id,
          label: truncateWords(course.title || 'Untitled Course', 4),
          sub: truncateWords(course.description || `Explore ${title} lessons`, 5),
          title: course.title || 'Untitled Course'
        }))
      }))
  }, [dropdownCourses])

  const handleCourseClick = (course) => {
    if (!course?.id) return

    if (!user) {
      navigate('/academy-signIn')
      return
    }

    const resolvedRole = normalizeRole(userData?.role)
    if (resolvedRole === 'teacher' || String(userData?.subject || '').trim()) {
      goToAcademy()
      return
    }

    navigate(buildCoursePath(course.id, course.title, { preview: true }))
  }

  const handleOpenCoursesPage = () => {
    navigate('/academy', { state: { scrollTo: 'courses', requestedAt: Date.now() } })
  }

  return (
    <div className='md-wrapper'>

      {/* Academy only */}
      <div className='md-trigger'>
         <NavLink
    to='/academy'
    className={({ isActive }) => `md-nav-label ${isActive ? 'active-link' : ''}`}
  >
   {t('sideMenu.academy')}
  </NavLink>
        <DropdownPanel
          header='Learn Our Courses'
          columns={courseColumns}
          footerLink='Browse all courses'
          footerTag='New courses every week'
          onFooterClick={goToAcademy}
          onFooterTagClick={handleOpenCoursesPage}
          onItemClick={handleCourseClick}
          loading={coursesLoading}
        />
      </div>

    </div>
  )
}

export default AcademyDropdown