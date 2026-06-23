import { useEffect } from 'react'

interface SeoOptions {
  /** Page <title>. */
  title: string
  /** Meta description (~150-160 chars). */
  description: string
  /** Absolute canonical URL for this page, e.g. https://mediciro.ro/clinici */
  canonical: string
}

/**
 * Per-route SEO: updates <title>, meta description, canonical and the matching Open Graph /
 * Twitter tags when a page mounts. The SPA serves one index.html for every route, so without
 * this each page would share the homepage's title/canonical — bad for ranking. Dependency-free
 * (no react-helmet) to keep the landing light; Googlebot renders JS and picks up the changes.
 */
export function useSeo({ title, description, canonical }: SeoOptions) {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setLink('canonical', canonical)
  }, [title, description, canonical])
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
