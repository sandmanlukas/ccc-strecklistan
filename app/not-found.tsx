import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mt-10 w-full flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-red-500 mb-4">Sidan finns ej!</h2>
      <p className="text-xl text-gray-700 mb-8">Den här sidan finns ej, ska du inte strecka en öl istälet?</p>
      <Link href="/" className='text-blue-500 hover:underline'>
        Hem igen
      </Link>
    </div>
  )
}