import React, { useEffect, useRef, useState } from 'react'

import SelectPosition from './select-position'
import SelectOption from './select-option'

const Select = (props) => {
  const { defaultValue, onChange, getContainer } = props

  const [visible, setVisible] = useState(false)

  const [data, setData] = useState({ value: defaultValue, label: '' })

  const [defaultValueState, setDefaultValueState] = useState(true)

  const inputRef = useRef(null)

  useEffect(() => {
    if (!defaultValueState) return

    if (props.children && props.children.length) {
      const i = props.children.findIndex((n) => n.props.value === defaultValue)
      if (i > -1) {
        setData(props.children[i].props)
        setDefaultValueState(true)
      }
    } else if (
      props.children &&
      props.children.props &&
      props.children.props.value !== undefined
    ) {
      const _data = {
        value: props.children.props.value,
        label: props.children.props.label || props.children.props.value,
      }
      setData(_data)
      setDefaultValueState(true)
    }
  }, [defaultValue, props.children, defaultValueState])

  function handleSelect(data) {
    setData(data)
    onChange && onChange(data)
    setVisible(false)
  }

  function bindBodyClick(e) {
    if (e.target === inputRef.current) return
    setVisible(false)
  }

  useEffect(() => {
    document.addEventListener('click', bindBodyClick, false)

    return () => {
      document.removeEventListener('click', bindBodyClick, false)
    }
  }, [visible])

  return (
    <React.Fragment>
      <div className='brv-select-input'>
        <input
          defaultValue={data.label}
          onClick={() => setVisible(true)}
          readOnly
          ref={inputRef}
        />
      </div>

      {visible ? (
        <SelectPosition
          onNotVisibleArea={() => setVisible(false)}
          getContainer={getContainer}
          targetRef={inputRef}
        >
          {React.Children.map(props.children, (child) =>
            React.cloneElement(child, {
              defaultValue: data.value,
              handleSelect,
            })
          )}
        </SelectPosition>
      ) : null}
    </React.Fragment>
  )
}

Select.Option = SelectOption
export default Select
