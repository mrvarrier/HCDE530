import { useState, useRef } from 'react'
import { Upload, File, X } from 'lucide-react'

export default function FileUpload({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file) => {
    // Check file type
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      return 'Please upload an HTML file (.html or .htm)'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 5MB'
    }

    // Check if empty
    if (file.size === 0) {
      return 'File is empty or corrupted'
    }

    return null
  }

  const handleFile = (file) => {
    setError(null)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)

    // Read file content
    const reader = new FileReader()
    reader.onload = (e) => {
      const html = e.target.result
      if (!html || html.trim().length === 0) {
        setError('File is empty or corrupted')
        return
      }
      onFileUpload(html, file.name)
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsText(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : selectedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".html,.htm"
          onChange={handleChange}
        />

        {!selectedFile && !error && (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Click to browse
              </button>
              <span className="text-gray-600"> or drag and drop</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              HTML files only (max 5MB)
            </p>
          </div>
        )}

        {selectedFile && !error && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {error && (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <p className="mt-4 text-red-800 font-medium">{error}</p>
            <button
              onClick={handleClear}
              className="mt-4 text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Try another file
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
