"use client"
import { useState, useEffect } from 'react'
import { Edit, Trash2, Upload } from 'lucide-react'

type News = {
  id: number
  title: string
  landingImage: string
  description: string
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentNews, setCurrentNews] = useState<News | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    landingImage: '',
    description: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const response = await fetch('/api/main/News')
    const data = await response.json()
    setNews(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = isEditing ? `/api/main/News/${currentNews?.id}` : '/api/main/News'
    const method = isEditing ? 'PUT' : 'POST'

    const imageUrl = formData.landingImage
    if (imageUrl) {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, landingImage: imageUrl })
      })

      fetchNews()
      resetForm()
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      await fetch(`/api/main/News/${id}`, { method: 'DELETE' })
      fetchNews()
    }
  }

  const handleEdit = (news: News) => {
    setIsEditing(true)
    setCurrentNews(news)
    setFormData({
      title: news.title,
      landingImage: news.landingImage,
      description: news.description
    })
  }

  const resetForm = () => {
    setIsEditing(false)
    setCurrentNews(null)
    setFormData({ title: '', landingImage: '', description: '' })
    setSelectedFile(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        const response = await fetch('/api/main/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64String,
            type: 'news'
          }),
        })
        const data = await response.json()
        if (data.url) {
          setFormData(prev => ({ ...prev, landingImage: data.url }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage News</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
            </label>
            {formData.landingImage && (
              <div className="flex items-center space-x-2">
                <img
                  src={formData.landingImage}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm text-gray-500">Uploaded</span>
              </div>
            )}
          </div>
        </div>
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Update News' : 'Add News'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={item.landingImage} 
                    alt={item.title} 
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
