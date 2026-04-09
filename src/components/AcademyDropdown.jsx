import React from 'react'

import '../styles/academy-dropdown.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const academyData = [
  {
    col: 'lang',
    icon: '🌍',
    title: 'Language',
    items: [
      { label: 'Swahili', sub: 'East Africa' },
      { label: 'Maasai', sub: 'Kenya & Tanzania' },
      { label: 'Kamba', sub: 'Kenya' },
    ]
  },
  {
    col: 'skills',
    icon: '🏺',
    title: 'Skills',
    items: [
      { label: 'Pottery', sub: 'Traditional craft' },
      { label: 'Woodwork', sub: 'Carving & joinery' },
      { label: 'Basketry', sub: 'Weaving tradition' },
    ]
  },
  {
    col: 'culture',
    icon: '🎭',
    title: 'Culture',
    items: [
      { label: 'Music', sub: 'Rhythms & instruments' },
      { label: 'Dance', sub: 'Movement & ceremony' },
      { label: 'Cooking', sub: 'Traditional cuisine' },
    ]
  }
]

const marketData = [
  {
    col: 'lang',
    icon: '🌍',
    title: 'Language',
    items: [
      { label: 'Swahili', sub: 'Books & audio' },
      { label: 'Maasai', sub: 'Learning guides' },
      { label: 'Kamba', sub: 'Resources' },
    ]
  },
  {
    col: 'skills',
    icon: '🏺',
    title: 'Skills',
    items: [
      { label: 'Pottery', sub: 'Handmade pieces' },
      { label: 'Woodwork', sub: 'Carved goods' },
      { label: 'Basketry', sub: 'Woven items' },
    ]
  },
  {
    col: 'culture',
    icon: '🎭',
    title: 'Culture',
    items: [
      { label: 'Music', sub: 'Instruments & more' },
      { label: 'Dance', sub: 'Attire & props' },
      { label: 'Cooking', sub: 'Spices & utensils' },
    ]
  }
]

const DropdownPanel = ({ header, columns, footerLink, footerTag, onFooterClick }) => (
  <div className='md-panel'>
    <div className='md-header'>{header}</div>
    <div className='md-grid'>
      {columns.map((col) => (
        <div key={col.title} className={`md-col md-col--${col.col}`}>
          <div className='md-col-title'>{col.title}</div>
          {col.items.map((item) => (
            <div key={item.label} className='md-item'>
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
      <span className='md-footer-tag'>{footerTag}</span>
    </div>
  </div>
)

const AcademyDropdown = () => {
  const navigate = useNavigate()
   const { t } = useTranslation();

  return (
    <div className='md-wrapper'>

      {/* Academy only */}
      <div className='md-trigger'>
         <NavLink
    to='/academy-page'
    className={({ isActive }) => `md-nav-label ${isActive ? 'active-link' : ''}`}
  >
   {t('sideMenu.academy')}
  </NavLink>
        <DropdownPanel
          header='Learn Our Courses'
          columns={academyData}
          footerLink='Browse all courses'
          footerTag='New courses weekly'
          onFooterClick={() => navigate('/academy-page')}
        />
      </div>

    </div>
  )
}

export default AcademyDropdown