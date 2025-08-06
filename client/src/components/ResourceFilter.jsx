import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";

export default function ResourceFilter({
  resources,
  onFilteredResults,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values from resources
  const categories = [...new Set(resources.map((r) => r.category))].sort();
  const difficulties = [
    ...new Set(resources.map((r) => r.difficulty).filter(Boolean)),
  ].sort();
  const durations = ["Short (<15 min)", "Medium (15-60 min)", "Long (>60 min)"];

  const getDurationCategory = (duration) => {
    if (!duration) return null;
    if (duration < 15) return "Short (<15 min)";
    if (duration <= 60) return "Medium (15-60 min)";
    return "Long (>60 min)";
  };

  // Filter logic
  const filterResources = () => {
    let filtered = resources.filter((resource) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(resource.category);

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(resource.difficulty);

      // Duration filter
      const resourceDurationCategory = getDurationCategory(resource.duration);
      const matchesDuration =
        selectedDurations.length === 0 ||
        selectedDurations.includes(resourceDurationCategory);

      // Rating filter
      const matchesRating = !resource.rating || resource.rating >= minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesDuration &&
        matchesRating
      );
    });

    onFilteredResults(filtered);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    filterResources();
  }, [
    searchTerm,
    selectedCategories,
    selectedDifficulties,
    selectedDurations,
    minRating,
    resources,
  ]);

  const handleCategoryToggle = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
  };

  const handleDifficultyToggle = (difficulty) => {
    const updated = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter((d) => d !== difficulty)
      : [...selectedDifficulties, difficulty];
    setSelectedDifficulties(updated);
  };

  const handleDurationToggle = (duration) => {
    const updated = selectedDurations.includes(duration)
      ? selectedDurations.filter((d) => d !== duration)
      : [...selectedDurations, duration];
    setSelectedDurations(updated);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedDurations([]);
    setMinRating(0);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategories.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedDurations.length > 0 ||
    minRating > 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 ${className}`}
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search resources by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-200">
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          {difficulties.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Difficulty</h4>
              <div className="space-y-2">
                {difficulties.map((difficulty) => (
                  <label
                    key={difficulty}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDifficulties.includes(difficulty)}
                      onChange={() => handleDifficultyToggle(difficulty)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {difficulty}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Duration Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Duration</h4>
            <div className="space-y-2">
              {durations.map((duration) => (
                <label
                  key={duration}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDurations.includes(duration)}
                    onChange={() => handleDurationToggle(duration)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{duration}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Minimum Rating</h4>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0</span>
                <span className="font-medium">{minRating} stars & up</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {category}
                <button onClick={() => handleCategoryToggle(category)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedDifficulties.map((difficulty) => (
              <span
                key={difficulty}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {difficulty}
                <button onClick={() => handleDifficultyToggle(difficulty)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedDurations.map((duration) => (
              <span
                key={duration}
                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                {duration}
                <button onClick={() => handleDurationToggle(duration)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                {minRating}+ stars
                <button onClick={() => setMinRating(0)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
