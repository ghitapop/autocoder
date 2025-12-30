import { Play, Pause, Square, Loader2 } from 'lucide-react'
import {
  useStartAgent,
  useStopAgent,
  usePauseAgent,
  useResumeAgent,
} from '../hooks/useProjects'
import type { AgentStatus } from '../lib/types'

interface AgentControlProps {
  projectName: string
  status: AgentStatus
}

export function AgentControl({ projectName, status }: AgentControlProps) {
  const startAgent = useStartAgent(projectName)
  const stopAgent = useStopAgent(projectName)
  const pauseAgent = usePauseAgent(projectName)
  const resumeAgent = useResumeAgent(projectName)

  const isLoading =
    startAgent.isPending ||
    stopAgent.isPending ||
    pauseAgent.isPending ||
    resumeAgent.isPending

  const handleStart = () => startAgent.mutate()
  const handleStop = () => stopAgent.mutate()
  const handlePause = () => pauseAgent.mutate()
  const handleResume = () => resumeAgent.mutate()

  return (
    <div className="flex items-center gap-2">
      {/* Status Indicator */}
      <StatusIndicator status={status} />

      {/* Control Buttons */}
      <div className="flex gap-1">
        {status === 'stopped' || status === 'crashed' ? (
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="neo-btn neo-btn-success text-sm py-2 px-3"
            title="Start Agent"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Play size={18} />
            )}
          </button>
        ) : status === 'running' ? (
          <>
            <button
              onClick={handlePause}
              disabled={isLoading}
              className="neo-btn neo-btn-warning text-sm py-2 px-3"
              title="Pause Agent"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Pause size={18} />
              )}
            </button>
            <button
              onClick={handleStop}
              disabled={isLoading}
              className="neo-btn neo-btn-danger text-sm py-2 px-3"
              title="Stop Agent"
            >
              <Square size={18} />
            </button>
          </>
        ) : status === 'paused' ? (
          <>
            <button
              onClick={handleResume}
              disabled={isLoading}
              className="neo-btn neo-btn-success text-sm py-2 px-3"
              title="Resume Agent"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Play size={18} />
              )}
            </button>
            <button
              onClick={handleStop}
              disabled={isLoading}
              className="neo-btn neo-btn-danger text-sm py-2 px-3"
              title="Stop Agent"
            >
              <Square size={18} />
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

function StatusIndicator({ status }: { status: AgentStatus }) {
  const statusConfig = {
    stopped: {
      color: 'var(--color-neo-text-secondary)',
      label: 'Stopped',
      pulse: false,
    },
    running: {
      color: 'var(--color-neo-done)',
      label: 'Running',
      pulse: true,
    },
    paused: {
      color: 'var(--color-neo-pending)',
      label: 'Paused',
      pulse: false,
    },
    crashed: {
      color: 'var(--color-neo-danger)',
      label: 'Crashed',
      pulse: true,
    },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[var(--color-neo-border)]">
      <span
        className={`w-3 h-3 rounded-full ${config.pulse ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: config.color }}
      />
      <span
        className="font-display font-bold text-sm uppercase"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </div>
  )
}
