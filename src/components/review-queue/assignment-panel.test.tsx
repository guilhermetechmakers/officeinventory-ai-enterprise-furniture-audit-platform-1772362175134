/**
 * Unit tests for AssignmentPanel - validation (assignee + SLA notes required)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AssignmentPanel } from './assignment-panel'

const mockAssignees = [
  { id: 'user-1', name: 'Jane Reviewer', type: 'user' as const },
  { id: 'team-1', name: 'Review Team Alpha', type: 'team' as const },
]

describe('AssignmentPanel', () => {
  it('disables submit when assignee not selected', () => {
    render(
      <AssignmentPanel
        open={true}
        onOpenChange={vi.fn()}
        itemIds={['id-1']}
        assignees={mockAssignees}
        onSubmit={vi.fn()}
      />
    )
    const submitBtn = screen.getByRole('button', { name: /assign/i })
    expect(submitBtn).toBeDisabled()
  })

  it('disables submit when SLA notes empty (assignee + SLA both required)', () => {
    render(
      <AssignmentPanel
        open={true}
        onOpenChange={vi.fn()}
        itemIds={['id-1']}
        assignees={mockAssignees}
        onSubmit={vi.fn()}
      />
    )
    const submitBtn = screen.getByRole('button', { name: /assign/i })
    expect(submitBtn).toBeDisabled()
  })

  it('shows SLA Notes as required', () => {
    render(
      <AssignmentPanel
        open={true}
        onOpenChange={vi.fn()}
        itemIds={['id-1']}
        assignees={mockAssignees}
        onSubmit={vi.fn()}
      />
    )
    expect(screen.getByLabelText(/sla notes \(required\)/i)).toBeInTheDocument()
  })

  it('handles empty itemIds safely', () => {
    render(
      <AssignmentPanel
        open={true}
        onOpenChange={vi.fn()}
        itemIds={[]}
        assignees={mockAssignees}
        onSubmit={vi.fn()}
      />
    )
    const submitBtn = screen.getByRole('button', { name: /assign/i })
    expect(submitBtn).toBeDisabled()
  })

  it('handles empty assignees array safely', () => {
    render(
      <AssignmentPanel
        open={true}
        onOpenChange={vi.fn()}
        itemIds={['id-1']}
        assignees={[]}
        onSubmit={vi.fn()}
      />
    )
    const submitBtn = screen.getByRole('button', { name: /assign/i })
    expect(submitBtn).toBeDisabled()
  })
})
