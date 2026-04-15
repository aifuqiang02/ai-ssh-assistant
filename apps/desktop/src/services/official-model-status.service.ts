import apiService from './api.service'

export async function fetchOfficialModelStatus() {
  const response = await apiService.getOfficialModelStatus()
  return response.data || null
}
