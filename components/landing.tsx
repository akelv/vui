/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/z7WbqOGPNJA
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ["latin"],
  display: "swap",
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function landing() {
  return (
    <div className="grid grid-cols-2 gap-6 h-screen">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Chat with AI</h2>
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage alt="AI Assistant" src="/placeholder-avatar.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">Hello, how can I assist you today?</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>AI Assistant</span> • <span>Just now</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage alt="You" src="/placeholder-avatar.jpg" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">Hi there, I have a few tasks Id like to discuss.</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>You</span> • <span>Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Input className="w-full" placeholder="Type your message..." />
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Task Output</h2>
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <p className="text-sm">Task 1: Completed</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Description of Task 1 and its output.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <p className="text-sm">Task 2: In Progress</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Description of Task 2 and its current status.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <p className="text-sm">Task 3: Pending</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Description of Task 3 and its current status.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg" />
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg" />
    </div>
  )
}
interface IconProps extends React.SVGProps<SVGSVGElement> {}

function SettingsIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function XIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
