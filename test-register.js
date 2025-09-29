/**
 * 简单的注册API测试脚本
 */

const API_BASE_URL = 'http://localhost:3000/api/v1'

async function testRegister() {
  console.log('🧪 Testing user registration API...')

  const testUser = {
    email: 'test@example.com',
    username: '测试用户',
    password: 'test123456'
  }

  try {
    console.log('📤 Sending registration request...')
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    })

    const data = await response.json()

    console.log('📥 Response status:', response.status)
    console.log('📥 Response data:', JSON.stringify(data, null, 2))

    if (response.ok && data.success) {
      console.log('✅ Registration successful!')

      // 测试登录
      console.log('\n🔐 Testing login with registered user...')
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      })

      const loginData = await loginResponse.json()
      console.log('📥 Login response:', JSON.stringify(loginData, null, 2))

      if (loginResponse.ok && loginData.success) {
        console.log('✅ Login successful!')
      } else {
        console.log('❌ Login failed!')
      }
    } else {
      console.log('❌ Registration failed!')
    }
  } catch (error) {
    console.error('💥 Test failed:', error.message)
    console.log('💡 Make sure the server is running on port 3001')
  }
}

// 运行测试
testRegister()
