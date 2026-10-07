import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function useSiteContent() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    api.request('/content')
      .then((result) => setContent(result.content))
      .catch(() => setContent(null))
  }, [])

  return content
}