import { useState } from 'react'
import '../styles/accordian-principles.css'

const items = [
  {
    subtitle: 'Pan-African by Design',
    title: 'Built for all 54 nations and the global diaspora',
    detail: 'Everything we build serves the full breadth of the African continent — no single culture, language, or region takes priority over another. From East to West, North to South, and across diaspora communities in Europe, the Americas, and beyond, Magical Africa is designed to represent and celebrate every corner of African heritage. Our content strategy, language support, and community features are all built with this pan-African lens at their core.'
  },
  {
    subtitle: 'Community Ownership',
    title: 'Creators and communities own their heritage',
    detail: 'The communities whose languages and stories we preserve retain full ownership and sovereignty over their content. We are custodians, not owners. Every elder, artist, and storyteller who contributes to the platform earns directly from their work through transparent revenue sharing models. We will never sell community data, license cultural knowledge without consent, or extract value from heritage without giving back to the people it belongs to.'
  },
  {
    subtitle: 'Ethical AI Stewardship',
    title: 'AI that serves culture, not the other way around',
    detail: 'Our AI models are built with community consent, cultural sensitivity, and continuous bias auditing at every stage. We reject the extractive model of data collection that has historically harmed marginalized communities. Every dataset we use is sourced ethically and with explicit permission. Communities are partners in training the models that represent their languages — and they benefit directly from the AI products built on their knowledge.'
  },
  {
    subtitle: 'Sustainable Long-Term Impact',
    title: 'Building for generations, not quarters',
    detail: 'We measure success not in monthly active users or quarterly revenue, but in languages preserved, elders recorded, and children who grow up knowing their heritage. Every product decision, partnership, and business model is evaluated through the lens of long-term cultural impact. We are playing a 50-year game — ensuring that the wisdom held by today\'s elders is accessible to the grandchildren of tomorrow.'
  },
  {
    subtitle: 'Digital Preservation',
    title: 'Saving languages before they disappear forever',
    detail: 'Over 600 African languages are currently classified as endangered. Without urgent digital intervention, they will vanish within a generation. Magical Africa works directly with linguistic experts, community elders, and local schools to record, transcribe, and teach these languages at scale — creating permanent digital archives that ensure no African language is lost to time, urbanization, or neglect.'
  },
  {
    subtitle: 'Radical Accessibility',
    title: 'Heritage should never be locked behind a paywall',
    detail: 'We believe every African — regardless of income, location, or technical literacy — deserves access to their own cultural heritage. That is why our core learning content is free, our platform works on low-bandwidth connections, and our mobile experience is optimized for the devices most commonly used across the continent. Premium features exist to fund the free tier, not to restrict it.'
  },
]

const AccordionPrinciples = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i)

  return (
    <div className='ap-wrap'>
      {items.map((item, i) => (
        <div
          key={i}
          className={`ap-item ${openIndex === i ? 'ap-item--open' : ''}`}
          onClick={() => toggle(i)}
        >
          <div className='ap-row'>
            <div className='ap-left'>
              <span className='ap-subtitle'>{item.subtitle}</span>
              <p className='ap-title'>{item.title}</p>
            </div>
            <button
              className={`ap-btn ${openIndex === i ? 'ap-btn--open' : ''}`}
              type='button'
              aria-label={openIndex === i ? 'Collapse' : 'Expand'}
            >
              <i className={`fa-solid ${openIndex === i ? 'fa-minus' : 'fa-plus'}`}></i>
            </button>
          </div>

          {openIndex === i && (
            <p className='ap-detail'>{item.detail}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default AccordionPrinciples