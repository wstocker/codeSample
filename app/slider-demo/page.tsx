import { ArticleSliderContainer } from "@/components/drupal/ArticleSliderContainer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Article Slider Demo - State Lifting",
  description: "Demonstration of React state lifting with ArticleSlider component",
}

export default function SliderDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article Slider Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This demonstrates <strong>lifting state up</strong> in React. 
            When you focus on a slide, the title color changes to match the slide's background color.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How State Lifting Works:
          </h2>
          <ul className="text-gray-600 space-y-2">
            <li>• <strong>Child Component (ArticleSlide):</strong> Receives focus state and color as props</li>
            <li>• <strong>Parent Component (ArticleSliderContainer):</strong> Manages the focused slide index</li>
            <li>• <strong>State Lifting:</strong> When a slide is focused, it calls the parent's handler</li>
            <li>• <strong>Color Coordination:</strong> The title color updates to match the focused slide's background</li>
          </ul>
        </div>

        <ArticleSliderContainer title="Latest Articles" />
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Try hovering or focusing on different slides to see the state lifting in action!
          </p>
        </div>
      </div>
    </div>
  )
} 