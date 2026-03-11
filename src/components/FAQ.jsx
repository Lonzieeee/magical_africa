
{/* 

import { useState } from 'react';
import '../styles/faq.css';

const faqData = [
  {
    question: 'What is Magical Africa?',
    answer: 'Magical Africa is a platform dedicated to preserving, celebrating, and sharing the rich cultural heritage of Africa with the world. We connect people with authentic African cultures, languages, traditions, and communities.'
  },
  {
    question: 'How can I contribute to Magical Africa?',
    answer: 'You can contribute by sharing stories, photos, or knowledge about your community. Simply sign up and use our contribution tools to add content about your tribe\'s traditions, language, and heritage.'
  },
  {
    question: 'Is the content on Magical Africa authentic?',
    answer: 'Yes! All our content is sourced directly from community members and cultural experts. We work closely with local communities to ensure accuracy and authenticity in everything we share.'
  },
  {
    question: 'How do I learn an African language on this platform?',
    answer: 'We offer language learning resources including common phrases, audio pronunciations from native speakers, and cultural context to help you understand and appreciate African languages.'
  },
  {
    question: 'Can I purchase authentic African products?',
    answer: 'Yes! Our marketplace features authentic cultural merchandise handcrafted by African artisans. Every purchase supports local communities and helps preserve traditional craftsmanship.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="FAQ">
      <h1>Frequently Asked Questions</h1>

      <div className="questions-section">
        {faqData.map((item, index) => (
          <div className="question" key={index}>
            <div className="question1" onClick={() => toggleQuestion(index)}>
              <span>{item.question}</span>
              <i 
                className="fa-solid fa-chevron-down"
                style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
              ></i>
            </div>
            <div 
              className="answer1"
              style={{ display: openIndex === index ? 'block' : 'none' }}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
*/}


import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/faq.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('faq.items.whatIs.question'),
      answer: t('faq.items.whatIs.answer')
    },
    {
      question: t('faq.items.contribute.question'),
      answer: t('faq.items.contribute.answer')
    },
    {
      question: t('faq.items.authentic.question'),
      answer: t('faq.items.authentic.answer')
    },
    {
      question: t('faq.items.learnLanguage.question'),
      answer: t('faq.items.learnLanguage.answer')
    },
    {
      question: t('faq.items.purchase.question'),
      answer: t('faq.items.purchase.answer')
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="FAQ" >
      <h1>{t('faq.title')}</h1>

      <div className="questions-section">
        {faqData.map((item, index) => (
          <div className="question" key={index}>
            <div className="question1" onClick={() => toggleQuestion(index)}>
              <span>{item.question}</span>
              <i 
                className="fa-solid fa-chevron-down"
                style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
              ></i>
            </div>
            <div 
              className="answer1"
              style={{ display: openIndex === index ? 'block' : 'none' }}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;