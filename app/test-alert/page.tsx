import { Alert } from "@/components/Alert"

export default function TestAlertPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Alert Component Test</h1>
      
      <div className="space-y-4">
        <Alert message="This is a red alert message" type="red" />
        <Alert message="This is a blue alert message" type="blue" />
        <Alert message="This is a green alert message" type="green" />
      </div>
      
      <p className="mt-8 text-gray-600">
        Try clicking the X buttons to close the alerts!
      </p>
    </div>
  )
} 