import { useState } from 'react'
import { ChevronDown, Plus, FolderOpen, Loader2 } from 'lucide-react'
import { useCreateProject } from '../hooks/useProjects'
import type { ProjectSummary } from '../lib/types'

interface ProjectSelectorProps {
  projects: ProjectSummary[]
  selectedProject: string | null
  onSelectProject: (name: string | null) => void
  isLoading: boolean
}

export function ProjectSelector({
  projects,
  selectedProject,
  onSelectProject,
  isLoading,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const createProject = useCreateProject()

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      const project = await createProject.mutateAsync({
        name: newProjectName.trim(),
        specMethod: 'manual',
      })
      onSelectProject(project.name)
      setNewProjectName('')
      setShowCreate(false)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const selectedProjectData = projects.find(p => p.name === selectedProject)

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neo-btn bg-white text-[var(--color-neo-text)] min-w-[200px] justify-between"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : selectedProject ? (
          <>
            <span className="flex items-center gap-2">
              <FolderOpen size={18} />
              {selectedProject}
            </span>
            {selectedProjectData && selectedProjectData.stats.total > 0 && (
              <span className="neo-badge bg-[var(--color-neo-done)] ml-2">
                {selectedProjectData.stats.percentage}%
              </span>
            )}
          </>
        ) : (
          <span className="text-[var(--color-neo-text-secondary)]">
            Select Project
          </span>
        )}
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-full neo-dropdown z-50 min-w-[280px]">
            {projects.length > 0 ? (
              <div className="max-h-[300px] overflow-auto">
                {projects.map(project => (
                  <button
                    key={project.name}
                    onClick={() => {
                      onSelectProject(project.name)
                      setIsOpen(false)
                    }}
                    className={`w-full neo-dropdown-item flex items-center justify-between ${
                      project.name === selectedProject
                        ? 'bg-[var(--color-neo-pending)]'
                        : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen size={16} />
                      {project.name}
                    </span>
                    {project.stats.total > 0 && (
                      <span className="text-sm font-mono">
                        {project.stats.passing}/{project.stats.total}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[var(--color-neo-text-secondary)]">
                No projects yet
              </div>
            )}

            {/* Divider */}
            <div className="border-t-3 border-[var(--color-neo-border)]" />

            {/* Create New */}
            {showCreate ? (
              <form onSubmit={handleCreateProject} className="p-3">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="project-name"
                  className="neo-input text-sm mb-2"
                  pattern="^[a-zA-Z0-9_-]+$"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="neo-btn neo-btn-success text-xs flex-1"
                    disabled={createProject.isPending || !newProjectName.trim()}
                  >
                    {createProject.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      'Create'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreate(false)
                      setNewProjectName('')
                    }}
                    className="neo-btn neo-btn-ghost text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="w-full neo-dropdown-item flex items-center gap-2 font-bold"
              >
                <Plus size={16} />
                New Project
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
