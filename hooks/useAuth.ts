import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { validateLoginForm, type ValidationErrors } from "@/lib/validation"

interface LoginFormData {
  username: string
  password: string
}

interface UseAuthReturn {
  formData: LoginFormData
  errors: ValidationErrors
  isLoading: boolean
  authError: string | null
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  handleTestLogin: () => void
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setIsLoading(true)

    // Validate form
    const validation = validateLoginForm(formData)
    if (!validation.success) {
      setErrors(validation.errors)
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("drupal", {
        username: validation.data.username,
        password: validation.data.password,
        redirect: false,
        callbackUrl: "/"
      })

      if (result?.error) {
        setAuthError("Invalid username or password")
        console.error("Sign in error:", result.error)
      } else if (result?.ok) {
        router.push("/")
      }
    } catch (error) {
      setAuthError("An error occurred during login")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestLogin = async () => {
    setAuthError(null)
    setIsLoading(true)
    
    try {
      const result = await signIn("drupal", {
        username: "testuser",
        password: "testuser",
        redirect: false,
        callbackUrl: "/"
      })

      if (result?.error) {
        setAuthError("Test login failed: " + result.error)
        console.error("Test sign in error:", result.error)
      } else if (result?.ok) {
        router.push("/")
      }
    } catch (error) {
      setAuthError("Test login error: " + error)
      console.error("Test login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    errors,
    isLoading,
    authError,
    handleInputChange,
    handleSubmit,
    handleTestLogin,
  }
} 