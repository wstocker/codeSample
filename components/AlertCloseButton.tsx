"use client"

interface AlertCloseButtonProps {
  type: "red" | "blue" | "green"
  onClose?: () => void
}

export function AlertCloseButton({ type, onClose }: AlertCloseButtonProps) {
  const handleClick = () => {
    onClose?.()
  }

  return (
    <button 
      type="button" 
      className={`ms-auto -mx-1.5 -my-1.5 bg-white text-${type}-500 rounded-lg focus:ring-2 focus:ring-${type}-400 p-1.5 hover:bg-${type}-50 border border-${type}-200 inline-flex items-center justify-center h-8 w-8`} 
      onClick={handleClick}
      aria-label="Close"
    >
      <span className="sr-only">Close</span>
      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  )
} 