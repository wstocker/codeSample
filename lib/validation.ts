// XSS protection: Sanitize input strings
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 255) // Limit length
}

// Validation types
export interface LoginFormData {
  username: string
  password: string
}

export interface ProfileFormData {
  name: string
  email: string
  bio?: string
}

// Validation errors
export interface ValidationErrors {
  [key: string]: string
}

// Login form validation
export function validateLoginForm(data: any): { success: true; data: LoginFormData } | { success: false; errors: ValidationErrors } {
  const errors: ValidationErrors = {}

  // Username validation
  if (!data.username || typeof data.username !== 'string') {
    errors.username = "Username is required"
  } else if (data.username.length > 50) {
    errors.username = "Username must be less than 50 characters"
  } else {
    data.username = sanitizeString(data.username)
  }

  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    errors.password = "Password is required"
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return { 
    success: true, 
    data: {
      username: data.username,
      password: data.password
    }
  }
}

// Profile form validation
export function validateProfileForm(data: any): { success: true; data: ProfileFormData } | { success: false; errors: ValidationErrors } {
  const errors: ValidationErrors = {}

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.name = "Name is required"
  } else if (data.name.length > 100) {
    errors.name = "Name must be less than 100 characters"
  } else {
    data.name = sanitizeString(data.name)
  }

  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.email = "Email is required"
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email address"
    } else {
      data.email = sanitizeString(data.email)
    }
  }

  // Bio validation (optional)
  if (data.bio && typeof data.bio === 'string') {
    if (data.bio.length > 500) {
      errors.bio = "Bio must be less than 500 characters"
    } else {
      data.bio = sanitizeString(data.bio)
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return { 
    success: true, 
    data: {
      name: data.name,
      email: data.email,
      bio: data.bio || ''
    }
  }
} 