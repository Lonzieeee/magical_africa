const escapeXml = (value) => {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export const buildCourseCertificateSvg = ({ learnerName, courseTitle, completedAt, tutorName }) => {
  const safeName = escapeXml(learnerName || 'Learner')
  const safeCourse = escapeXml(courseTitle || 'Course')
  const safeTutorName = escapeXml(tutorName || 'Tutor')
  const safeAuthorityName = 'Kombo Steve'
  const logoHref = `${window.location.origin}/images/magicaal-logo1-removebg-preview.png`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1130" viewBox="0 0 1600 1130">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8f4ea" />
      <stop offset="100%" stop-color="#e7f0e8" />
    </linearGradient>
    <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d4a24f" />
      <stop offset="100%" stop-color="#b18233" />
    </linearGradient>
  </defs>
  <rect width="1600" height="1130" fill="url(#bg)" />
  <rect x="34" y="34" width="1532" height="1062" fill="none" stroke="#1f6f43" stroke-width="4" />
  <rect x="58" y="58" width="1484" height="1014" fill="none" stroke="#d4a24f" stroke-width="2" />
  <image href="${logoHref}" x="700" y="70" width="200" height="116" preserveAspectRatio="xMidYMid meet" />
  <text x="800" y="242" text-anchor="middle" font-family="Georgia, serif" font-size="68" letter-spacing="6" fill="#1f6f43">CERTIFICATE</text>
  <text x="800" y="292" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="25" letter-spacing="7" fill="#485047">OF COMPLETION</text>
  <text x="800" y="354" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="28" fill="#5a6058">proudly presented to</text>
  <line x1="430" y1="450" x2="1170" y2="450" stroke="#9a9f97" stroke-width="1.5" />
  <text x="800" y="438" text-anchor="middle" font-family="Brush Script MT, Segoe Script, cursive" font-size="88" fill="#2f3f36">${safeName}</text>
  <text x="800" y="520" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="30" fill="#4f564f">for successfully completing</text>
  <text x="800" y="594" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="#a3070c">${safeCourse}</text>
  <text x="800" y="650" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="25" fill="#596159">offered by ${safeTutorName}</text>
  <text x="800" y="706" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="24" fill="#596159">Completion date: ${completedAt}</text>
  <line x1="210" y1="894" x2="650" y2="894" stroke="#8b918a" stroke-width="1.8" />
  <text x="430" y="872" text-anchor="middle" font-family="Brush Script MT, Segoe Script, cursive" font-size="54" fill="#1f6f43">${safeAuthorityName}</text>
  <text x="430" y="938" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="21" fill="#555d55">Magical Africa Academy</text>
  <line x1="950" y1="894" x2="1390" y2="894" stroke="#8b918a" stroke-width="1.8" />
  <text x="1170" y="872" text-anchor="middle" font-family="Brush Script MT, Segoe Script, cursive" font-size="54" fill="#1f6f43">${safeTutorName}</text>
  <text x="1170" y="938" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="21" fill="#555d55">Course Tutor</text>
  <text x="130" y="1012" text-anchor="start" font-family="Poppins, Arial, sans-serif" font-size="19" fill="#667065">Certificate ID: MA-${Date.now()}</text>
</svg>`
}

export const downloadCourseCertificate = ({ learnerName, courseTitle, completedAt, tutorName }) => {
  const certificateSvg = buildCourseCertificateSvg({
    learnerName,
    courseTitle,
    completedAt,
    tutorName
  })

  const blob = new Blob([certificateSvg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${(courseTitle || 'course').replace(/\s+/g, '-').toLowerCase()}-certificate.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
