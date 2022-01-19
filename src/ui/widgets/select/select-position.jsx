import { useEffect } from 'react'
import ReactDOM from 'react-dom'

let instance = null

const SelectPosition = (props) => {
  const { targetRef, children, getContainer, onNotVisibleArea } = props

  const container = getContainer && getContainer()

  if (!instance) {
    instance = document.createElement('div')
    instance.className = 'brv-select-wrapper'
    document.body.appendChild(instance)
  }

  useEffect(() => {
    function setInstanceStyle() {
      const { top, left, width, height } =
        targetRef.current.getBoundingClientRect()
      const pos = {
        top: document.documentElement.scrollTop + top + height + 2 + 'px',
        left: document.documentElement.scrollLeft + left + 'px',
        width: width + 'px',
      }

      instance.style.top = pos.top
      instance.style.left = pos.left
      instance.style.width = pos.width

      return { top, left, height }
    }

    setInstanceStyle()

    function handleScroll() {
      const { top, height } = setInstanceStyle()

      if (container.offsetTop > top) {
        onNotVisibleArea()
      }

      if (top - container.offsetTop + height > container.offsetHeight) {
        onNotVisibleArea()
      }
    }

    if (container) {
      container.addEventListener('scroll', handleScroll, false)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll, false)
      }
    }
  }, [targetRef])

  return instance && ReactDOM.createPortal(children, instance)
}

export default SelectPosition
