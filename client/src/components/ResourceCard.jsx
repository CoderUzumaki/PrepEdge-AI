import { Link } from "react-router-dom"

const getCategoryColor = (category) => {
  switch (category) {
    case "Book":
      return "bg-blue-100 text-blue-800"
    case "Guides":
      return "bg-green-100 text-green-800"
    case "Course":
      return "bg-purple-100 text-purple-800"
    case "Technical":
      return "bg-indigo-100 text-indigo-800"
    case "Behavioral":
      return "bg-yellow-100 text-yellow-800"
    case "Tools":
      return "bg-pink-100 text-pink-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ResourceCard({
  id,
  title,
  description,
  category,
  image,
  link,
  featured = false,
}) {
  const cardContent = (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
        featured ? "h-full" : ""
      }`}
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          crossOrigin="anonymous"
        />
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>

        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
          <span>Learn More</span>
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  )

  if (link) {
    return (

      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
         {cardContent}
      </a>

    )
  }

  return cardContent
}
