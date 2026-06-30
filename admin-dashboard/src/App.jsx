import React, { useState, useEffect } from 'react'

// Connect to backend server running on localhost:3000
const API_URL = 'http://localhost:3000/api'

// ─── Categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  'all', 'world', 'politics', 'business', 'technology', 'startups',
  'entertainment', 'sports', 'science', 'health', 'automobile',
  'travel', 'fashion', 'education', 'miscellaneous'
]

const CATEGORY_ICONS = {
  all: '🔥', world: '🌍', politics: '⚖️', business: '💼', technology: '⚡',
  startups: '🚀', entertainment: '🎬', sports: '🏆', science: '🔬',
  health: '❤️‍🩹', automobile: '🚗', travel: '✈️', fashion: '👠',
  education: '📚', miscellaneous: '🔮'
}

// ─── Main App ──────────────────────────────────────────────────────
function App() {
  const [stories, setStories] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingStory, setEditingStory] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedStories, setSelectedStories] = useState([])

  // Fetch stories and stats
  useEffect(() => {
    fetchStories()
    fetchStats()
  }, [])

  const fetchStories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: filterStatus,
        category: filterCategory,
        search: searchQuery
      })
      
      const response = await fetch(`${API_URL}/stories/admin?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  // Apply filters
  useEffect(() => {
    fetchStories()
  }, [filterStatus, filterCategory, searchQuery])

  // Toggle story selection for bulk actions
  const toggleSelectStory = (storyId) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    )
  }

  // Select all stories on current view
  const selectAllStories = () => {
    if (selectedStories.length === stories.length) {
      setSelectedStories([])
    } else {
      setSelectedStories(stories.map(s => s.id))
    }
  }

  // Bulk actions
  const bulkAction = async (action) => {
    if (selectedStories.length === 0) return
    
    try {
      const response = await fetch(`${API_URL}/stories/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyIds: selectedStories, action })
      })

      if (response.ok) {
        setSelectedStories([])
        fetchStories()
        fetchStats()
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
    }
  }

  // Update story status
  const updateStatus = async (storyId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/stories/${storyId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchStories()
        fetchStats()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  // Delete story
  const deleteStory = async (storyId) => {
    if (!confirm('Are you sure you want to delete this story?')) return
    
    try {
      const response = await fetch(`${API_URL}/stories/${storyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin123' }
      })

      if (response.ok) {
        fetchStories()
        fetchStats()
      }
    } catch (error) {
      console.error('Failed to delete story:', error)
    }
  }

  // Open edit modal
  const openEditModal = (story) => {
    setEditingStory({ ...story })
    setShowCreateModal(false)
  }

  // Open create modal
  const openCreateModal = () => {
    setEditingStory({
      id: `story-${Date.now()}`,
      headline: '',
      summary: '',
      extendedSummary: [],
      hindiHeadline: '',
      hindiSummary: '',
      hindiExtendedSummary: [],
      category: 'world',
      source: '',
      link: '',
      regions: ['global'],
      status: 'pending'
    })
    setShowCreateModal(true)
  }

  // Save story (create or update)
  const saveStory = async () => {
    if (!editingStory.headline || !editingStory.summary || !editingStory.category) {
      alert('Headline, summary, and category are required')
      return
    }

    try {
      const isEdit = !!stories.find(s => s.id === editingStory.id)
      const method = isEdit ? 'PUT' : 'POST'
      const url = isEdit 
        ? `${API_URL}/stories/${editingStory.id}`
        : `${API_URL}/stories`

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify(editingStory)
      })

      if (response.ok) {
        setShowCreateModal(false)
        setEditingStory(null)
        fetchStories()
        fetchStats()
      } else {
        const error = await response.json()
        alert(`Failed to save story: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to save story:', error)
      alert('Failed to save story')
    }
  }

  // Update editing story field
  const updateEditingField = (field, value) => {
    setEditingStory(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              NewsPulse Admin Dashboard
            </h1>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              + Create Story
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <p className="text-sm text-gray-400 mb-2">Total Stories</p>
              <p className="text-3xl font-bold">{stats.totalStories}</p>
            </div>
            <div className="bg-green-900/30 p-6 rounded-xl border border-green-800">
              <p className="text-sm text-green-400 mb-2">Approved</p>
              <p className="text-3xl font-bold">{stats.approvedStories}</p>
            </div>
            <div className="bg-yellow-900/30 p-6 rounded-xl border border-yellow-800">
              <p className="text-sm text-yellow-400 mb-2">Pending</p>
              <p className="text-3xl font-bold">{stats.pendingStories}</p>
            </div>
            <div className="bg-red-900/30 p-6 rounded-xl border border-red-800">
              <p className="text-sm text-red-400 mb-2">Rejected</p>
              <p className="text-3xl font-bold">{stats.rejectedStories}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
            />

            {selectedStories.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => bulkAction('approve')}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                >
                  Approve ({selectedStories.length})
                </button>
                <button
                  onClick={() => bulkAction('reject')}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                >
                  Reject ({selectedStories.length})
                </button>
                <button
                  onClick={() => bulkAction('delete')}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
                >
                  Delete ({selectedStories.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stories Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No stories found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStories.length === stories.length && stories.length > 0}
                        onChange={selectAllStories}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Headline</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {stories.map(story => (
                    <tr key={story.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedStories.includes(story.id)}
                          onChange={() => toggleSelectStory(story.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-800">
                          {CATEGORY_ICONS[story.category] || '📰'}
                          {story.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="font-semibold text-sm mb-1">{story.headline}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{story.summary}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          story.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                          story.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                          'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {story.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {story.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(story.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                            >
                              Approve
                            </button>
                          )}
                          {story.status !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(story.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(story)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteStory(story.id)}
                            className="bg-gray-700 hover:bg-red-600 px-3 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingStory) && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingStory && stories.find(s => s.id === editingStory.id) ? 'Edit Story' : 'Create New Story'}
                </h2>
                <button
                  onClick={() => { setShowCreateModal(false); setEditingStory(null) }}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <select
                      value={editingStory.category}
                      onChange={(e) => updateEditingField('category', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                    >
                      {CATEGORIES.filter(c => c !== 'all').map(cat => (
                        <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Status</label>
                    <select
                      value={editingStory.status}
                      onChange={(e) => updateEditingField('status', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Headline *</label>
                  <input
                    type="text"
                    value={editingStory.headline}
                    onChange={(e) => updateEditingField('headline', e.target.value)}
                    placeholder="Enter headline..."
                    className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Summary *</label>
                  <textarea
                    value={editingStory.summary}
                    onChange={(e) => updateEditingField('summary', e.target.value)}
                    placeholder="Enter summary..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                  />
                </div>

                {/* Extended Summary (Bullets) */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Bullet Points (one per line)</label>
                  <textarea
                    value={Array.isArray(editingStory.extendedSummary) ? editingStory.extendedSummary.join('\n') : ''}
                    onChange={(e) => updateEditingField('extendedSummary', e.target.value.split('\n').filter(b => b.trim()))}
                    placeholder="Enter bullet points..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                  />
                </div>

                {/* Hindi Translation */}
                <div className="border-t border-gray-800 pt-4">
                  <h3 className="text-lg font-semibold mb-3">Hindi Translation</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Hindi Headline</label>
                      <input
                        type="text"
                        value={editingStory.hindiHeadline}
                        onChange={(e) => updateEditingField('hindiHeadline', e.target.value)}
                        placeholder="हिंदी शीर्षक..."
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Hindi Summary</label>
                      <textarea
                        value={editingStory.hindiSummary}
                        onChange={(e) => updateEditingField('hindiSummary', e.target.value)}
                        placeholder="हिंदी सारांश..."
                        rows={4}
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Hindi Bullet Points (one per line)</label>
                      <textarea
                        value={Array.isArray(editingStory.hindiExtendedSummary) ? editingStory.hindiExtendedSummary.join('\n') : ''}
                        onChange={(e) => updateEditingField('hindiExtendedSummary', e.target.value.split('\n').filter(b => b.trim()))}
                        placeholder="बुलेट पॉइंट..."
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="border-t border-gray-800 pt-4">
                  <h3 className="text-lg font-semibold mb-3">Metadata</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Source</label>
                      <input
                        type="text"
                        value={editingStory.source}
                        onChange={(e) => updateEditingField('source', e.target.value)}
                        placeholder="e.g., Reuters, BBC..."
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Link</label>
                      <input
                        type="text"
                        value={editingStory.link}
                        onChange={(e) => updateEditingField('link', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Regions (comma-separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(editingStory.regions) ? editingStory.regions.join(', ') : ''}
                        onChange={(e) => updateEditingField('regions', e.target.value.split(',').map(r => r.trim()))}
                        placeholder="global, us, in..."
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => { setShowCreateModal(false); setEditingStory(null) }}
                    className="px-6 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveStory}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    {editingStory && stories.find(s => s.id === editingStory.id) ? 'Update Story' : 'Create Story'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
