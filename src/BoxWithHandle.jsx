import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
// import ItemTypes from './ItemTypes'
const ItemTypes=[{BOX:'box'}]
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  width: '20rem',
}
const handleStyle = {
  backgroundColor: 'green',
  width: '1rem',
  height: '1rem',
  display: 'inline-block',
  marginRight: '0.75rem',
  cursor: 'move',
}
const BoxWithHandleRaw = ({
  isDragging,
  connectDragSource,
  connectDragPreview,
  connectDropTarget,
},inputText) => {
 // put a default value in cas of blanks
if(inputText===undefined) inputText='inputText' 

const opacity = isDragging ? 0.4 : 1
  return connectDropTarget(
    connectDragPreview(
      <div style={{ ...style, opacity }}>
        {connectDragSource(<div style={handleStyle} />)}
        inputText
      </div>,
    ),
  )
}


export const BoxWithHandle = DragSource(
  ItemTypes.BOX,
  {
    beginDrag: () => ({}),
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(
  DropTarget(ItemTypes.BOX, {}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isDraggingHover: monitor.isOver({ shallow: true }),
    isOver: monitor.isOver(),
  }))(BoxWithHandleRaw),
)
