export interface WeddingEvent {
  name: string
  date: string
  time: string
  venue: string
}

export interface WeddingConfig {
  partners: [string, string]
  families: string[]
  date: string
  time: string
  timezone: string
  venue: { name: string; address: string; mapUrl: string; travel: string }
  dressCode: string
  rsvpDeadline: string
  contacts: { name: string; phone: string }[]
  schedule: WeddingEvent[]
  audio: { src: string; title: string }
  messages: { english: string; hindi: string; family: string }
}

export const wedding: WeddingConfig = {
  partners: ['Sandeep Rai', 'Khushi Rai'],
  families: [],
  date: '2026-11-25',
  time: '',
  timezone: 'Asia/Kolkata',
  venue: { name: 'Haveli Seva Kunj', address: 'Haveli Seva Kunj, Mavaia, Varanasi', mapUrl: '', travel: '' },
  dressCode: '',
  rsvpDeadline: '',
  contacts: [],
  schedule: [],
  audio: { src: '', title: '' },
  messages: {
    english: 'With the blessings of Mahadev and the love of our families, we invite you to celebrate the beginning of our forever.',
    hindi: 'महादेव के आशीर्वाद एवं अपने परिवारों के स्नेह के साथ, हम आपको अपने विवाह के शुभ अवसर पर सादर आमंत्रित करते हैं।',
    family: '',
  },
}