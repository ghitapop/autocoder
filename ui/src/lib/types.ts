/**
 * TypeScript types for the Autonomous Coding UI
 */

// Project types
export interface ProjectStats {
  passing: number
  total: number
  percentage: number
}

export interface ProjectSummary {
  name: string
  has_spec: boolean
  stats: ProjectStats
}

export interface ProjectDetail extends ProjectSummary {
  prompts_dir: string
}

export interface ProjectPrompts {
  app_spec: string
  initializer_prompt: string
  coding_prompt: string
}

// Feature types
export interface Feature {
  id: number
  priority: number
  category: string
  name: string
  description: string
  steps: string[]
  passes: boolean
}

export interface FeatureListResponse {
  pending: Feature[]
  in_progress: Feature[]
  done: Feature[]
}

export interface FeatureCreate {
  category: string
  name: string
  description: string
  steps: string[]
  priority?: number
}

// Agent types
export type AgentStatus = 'stopped' | 'running' | 'paused' | 'crashed'

export interface AgentStatusResponse {
  status: AgentStatus
  pid: number | null
  started_at: string | null
}

export interface AgentActionResponse {
  success: boolean
  status: AgentStatus
  message: string
}

// Setup types
export interface SetupStatus {
  claude_cli: boolean
  credentials: boolean
  node: boolean
  npm: boolean
}

// WebSocket message types
export type WSMessageType = 'progress' | 'feature_update' | 'log' | 'agent_status' | 'pong'

export interface WSProgressMessage {
  type: 'progress'
  passing: number
  total: number
  percentage: number
}

export interface WSFeatureUpdateMessage {
  type: 'feature_update'
  feature_id: number
  passes: boolean
}

export interface WSLogMessage {
  type: 'log'
  line: string
  timestamp: string
}

export interface WSAgentStatusMessage {
  type: 'agent_status'
  status: AgentStatus
}

export interface WSPongMessage {
  type: 'pong'
}

export type WSMessage =
  | WSProgressMessage
  | WSFeatureUpdateMessage
  | WSLogMessage
  | WSAgentStatusMessage
  | WSPongMessage
