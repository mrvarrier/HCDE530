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
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl scale-105'
            : error
            ? 'border-red-400 bg-red-50 shadow-lg'
            : selectedFile
            ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50/30 hover:to-purple-50/30'
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
              <Upload className="h-10 w-10 text-blue-600" />
            </div>
            <div className="mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-lg font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4 decoration-blue-400 transition-colors"
              >
                Click to browse
              </button>
              <span className="text-lg text-gray-700"> or drag and drop your HTML file here</span>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span>.html, .htm files only</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Maximum 5MB</span>
              </div>
            </div>
          </div>
        )}

        {selectedFile && !error && (
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl">
                <File className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{selectedFile.name}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ready to analyze
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-3 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}

        {error && (
          <div className="text-center animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg text-red-800 font-semibold mb-6">{error}</p>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-lg"
            >
              Try Another File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
