"use client"
import { useState, useEffect } from 'react'
import { Edit, Trash2, Upload } from 'lucide-react'

type Program = {
  id: number
  title: string
  landingImage: string
  description: string
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    landingImage: '',
    description: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    const response = await fetch('/api/main/Programs')
    const data = await response.json()
    setPrograms(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = isEditing ? `/api/main/Programs/${currentProgram?.id}` : '/api/main/Programs'
    const method = isEditing ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    fetchPrograms()
    resetForm()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      await fetch(`/api/main/Programs/${id}`, { method: 'DELETE' })
      fetchPrograms()
    }
  }

  const handleEdit = (program: Program) => {
    setIsEditing(true)
    setCurrentProgram(program)
    setFormData({
      title: program.title,
      landingImage: program.landingImage,
      description: program.description
    })
  }

  const resetForm = () => {
    setIsEditing(false)
    setCurrentProgram(null)
    setFormData({ title: '', landingImage: '', description: '' })
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
            type: 'programs'
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
      <h1 className="text-3xl font-bold">Manage Programs</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.landingImage}
          onChange={(e) => setFormData({ ...formData, landingImage: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="file"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleFileChange}
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Update Program' : 'Add Program'}
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
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="px-6 py-4 whitespace-nowrap">{program.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={program.landingImage} 
                    alt={program.title} 
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{program.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(program)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
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
