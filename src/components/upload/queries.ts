import axios from 'axios'

export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await axios.post<{ uploadedUrl: string }>('/api/media', formData)
  return data
}
