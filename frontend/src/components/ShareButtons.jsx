import { useState } from 'react'
import './ShareButtons.css'

export default function ShareButtons({ title, url, text }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Check this out!'
  const shareText = text || shareTitle

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
        }
      }
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedInUrl, 'linkedin-share', 'width=600,height=600')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, 'facebook-share', 'width=600,height=600')
  }

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, 'twitter-share', 'width=600,height=600')
  }

  const shareOnInstagram = () => {
    const instagramUrl = `https://instagram.com`
    window.open(instagramUrl, 'instagram-share', 'width=600,height=600')
  }

  return (
    <div className="share-buttons-container">
      <div className="share-buttons-label">Share:</div>
      <div className="share-buttons-group">
        {navigator.share && (
          <button
            type="button"
            className="share-btn share-native"
            onClick={handleNativeShare}
            title="Share"
            aria-label="Share"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.15c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.56 9.31 6.88 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.88 0 1.56-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
          </button>
        )}

        <button
          type="button"
          className="share-btn share-linkedin"
          onClick={shareOnLinkedIn}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        </button>

        <button
          type="button"
          className="share-btn share-facebook"
          onClick={shareOnFacebook}
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        <button
          type="button"
          className="share-btn share-twitter"
          onClick={shareOnTwitter}
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 002.856-3.596 10 10 0 01-2.866.769 4.997 4.997 0 002.191-2.75 10 10 0 01-3.161 1.207 4.993 4.993 0 00-8.503 4.55A14.975 14.975 0 011.07 3.615a4.996 4.996 0 001.547 6.675 4.985 4.985 0 01-2.26-.566v.063a4.995 4.995 0 003.998 4.888 5 5 0 01-2.26.088 4.995 4.995 0 004.66 3.468 10.01 10.01 0 01-6.177 2.128c-.398 0-.798-.023-1.17-.068a14.995 14.995 0 008.134 2.383c9.76 0 15.074-8.087 15.074-15.073 0-.23-.006-.457-.016-.68A10.696 10.696 0 0024 4.57z" />
          </svg>
        </button>

        <button
          type="button"
          className="share-btn share-instagram"
          onClick={shareOnInstagram}
          title="Share on Instagram"
          aria-label="Share on Instagram"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.354c-.857 1.409-2.665 2.31-4.521 2.31H10c-1.856 0-3.664-.901-4.521-2.31-.429-.713-.666-1.551-.666-2.448V8.448c0-.897.237-1.735.666-2.448C6.336 4.547 8.144 3.646 10 3.646h7c1.856 0 3.664.901 4.521 2.31.429.713.666 1.551.666 2.448v8.448c0 .897-.237 1.735-.666 2.448" />
            <circle cx="11.97" cy="5.528" r="1.574" />
            <circle cx="15.158" cy="5.487" r="1.574" />
            <circle cx="12" cy="12" r="3.863" />
          </svg>
        </button>

        <button
          type="button"
          className={`share-btn share-copy ${copied ? 'copied' : ''}`}
          onClick={copyToClipboard}
          title="Copy link"
          aria-label="Copy link to clipboard"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="copy-label">Copied!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              <span className="copy-label">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
