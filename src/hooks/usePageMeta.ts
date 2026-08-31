import { useEffect } from 'react'

type PageMeta = {
  title: string
  description: string
  image?: string
}

export const usePageMeta = ({ title, description, image }: PageMeta) => {
  useEffect(() => {
    document.title = title
    const upsert = (selector: string, attribute: string, value: string) => {
      const element = document.querySelector<HTMLMetaElement>(selector)
      element?.setAttribute(attribute, value)
    }
    upsert('meta[name="description"]', 'content', description)
    upsert('meta[property="og:title"]', 'content', title)
    upsert('meta[property="og:description"]', 'content', description)
    upsert('meta[name="twitter:title"]', 'content', title)
    upsert('meta[name="twitter:description"]', 'content', description)
    if (image) {
      const origin = (import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin
      const absoluteImage = new URL(image, origin).toString()
      upsert('meta[property="og:image"]', 'content', absoluteImage)
      upsert('meta[name="twitter:image"]', 'content', absoluteImage)
    }
  }, [description, image, title])
}
