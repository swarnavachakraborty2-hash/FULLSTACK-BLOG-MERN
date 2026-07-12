import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import './uploadProfile.css'

const MAX_SIZE_MB = 8

function UploadProfile() {
  const { id } = useParams()
  const fileInputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle') // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  // Clean up the object URL when it changes or the component unmounts,
  // otherwise each new preview leaks memory.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const acceptFile = (candidate) => {
    if (!candidate) return
    if (!candidate.type.startsWith('image/')) {
      setStatus('error')
      setErrorMsg('That file isn\u2019t an image. Choose a JPG or PNG.')
      return
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      setStatus('error')
      setErrorMsg(`That photo is too large. Keep it under ${MAX_SIZE_MB}MB.`)
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setFile(candidate)
    setPreview(URL.createObjectURL(candidate))
    setStatus('idle')
    setErrorMsg('')
  }

  const onInputChange = (e) => acceptFile(e.target.files?.[0])

  const onDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    acceptFile(e.dataTransfer.files?.[0])
  }

  const onUpload = async () => {
    if (!file) return
    setStatus('uploading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      // Don't set Content-Type manually — the browser fills in the
      // multipart boundary automatically when the body is a FormData.
      const res = await api.post(`/api/auth/uploadProfile/${id}`, formData)
      setPreview(res.data?.user?.uri || preview)
      setFile(null)
      setStatus('success')
      navigate("/")
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err.response?.data?.message || 'Couldn\u2019t save that photo. Try again.'
      )
    }
  }

  const hintText = {
    idle: file ? 'Ready to save' : 'PNG or JPG, up to 8MB',
    uploading: 'Saving your photo\u2026',
    success: 'Profile photo updated',
    error: errorMsg || 'Something went wrong',
  }[status]

  return (
    <div className="auth-section">
      <div className="auth-card avatar-upload-card">
        <p className="eyebrow">Profile photo</p>
        <h1>Update your photo</h1>

        <div
          className={
            'avatar-ring-upload' +
            (dragActive ? ' is-drag' : '') +
            (status === 'uploading' ? ' is-uploading' : '')
          }
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
          }}
          aria-label={preview ? 'Choose a different photo' : 'Choose a photo'}
        >
          {preview ? (
            <img src={preview} alt="Your profile preview" className="profile-avatar" />
          ) : (
            <span className="profile-avatar-fallback">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 9.8 3.5h4.4a1 1 0 0 1 .83.45l.94 1.4a1 1 0 0 0 .83.45H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onInputChange}
            className="upload-hidden-input"
          />
        </div>

        <div className="avatar-upload-actions">
          <button type="button" onClick={onUpload} disabled={!file || status === 'uploading'}>
            {status === 'uploading' ? 'Saving\u2026' : 'Save photo'}
          </button>
          {preview && status !== 'uploading' && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose a different photo
            </button>
          )}
        </div>

        <p
          className={
            'auth-hint' +
            (status === 'error' ? ' is-error' : '') +
            (status === 'success' ? ' is-success' : '')
          }
        >
          {hintText}
        </p>
      </div>
    </div>
  )
}

export default UploadProfile
