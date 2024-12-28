import React, { forwardRef } from 'react'
import { Select as AntSelect, SelectProps } from 'antd'

export const CustomSelect = forwardRef<any, SelectProps>((props, ref) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div onMouseDown={handleMouseDown}>
      <AntSelect ref={ref} {...props} />
    </div>
  )
})

CustomSelect.displayName = 'CustomSelect'

