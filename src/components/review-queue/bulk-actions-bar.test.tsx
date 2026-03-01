/**
 * Unit tests for BulkActionsBar - empty selection, disabled state
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BulkActionsBar } from './bulk-actions-bar'

describe('BulkActionsBar', () => {
  it('returns null when no items selected', () => {
    const { container } = render(
      <BulkActionsBar
        selectedIds={[]}
        onClearSelection={vi.fn()}
        onAccept={vi.fn()}
        onAssign={vi.fn()}
        onExport={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('handles empty selectedIds - bar is hidden', () => {
    const { container } = render(
      <BulkActionsBar
        selectedIds={[]}
        onClearSelection={vi.fn()}
        onAccept={vi.fn()}
        onAssign={vi.fn()}
        onExport={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when items are selected', () => {
    render(
      <BulkActionsBar
        selectedIds={['id-1', 'id-2']}
        onClearSelection={vi.fn()}
        onAccept={vi.fn()}
        onAssign={vi.fn()}
        onExport={vi.fn()}
      />
    )
    expect(screen.getByText('2 items selected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /assign/i })).toBeInTheDocument()
  })

  it('calls onClearSelection when Clear is clicked', async () => {
    const onClear = vi.fn()
    const user = userEvent.setup()
    render(
      <BulkActionsBar
        selectedIds={['id-1']}
        onClearSelection={onClear}
        onAccept={vi.fn()}
        onAssign={vi.fn()}
        onExport={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
