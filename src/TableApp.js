import React from 'react'
import { useTable, useColumnOrder, useResizeColumns } from 'react-table'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import update from 'immutability-helper'


import makeData from './makeData'
import styles from './TableApp.css'

// const Styles = styled.div` //no longer used
let reportVisibleColumns = '?'
let reportFlatHeaders = '?' //Table.getHeaderGroupProps.flatHeaders

const Table = ({ columns, data }) => {
	const [records, setRecords] = React.useState(data)

	const getRowId = React.useCallback((row) => {
		return row.id
	}, [])

	// const dataWithID=(records.map(row=>(row, row.id=getRowId(row))))
	// console.log(data)
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
    prepareRow,
    resetResizing,
		setColumnOrder,
		visibleColumns,
		
	} = useTable(
		{
			data: records,
			// data: dataWithID,
			columns,
			getRowId,
		},
    useResizeColumns,
    useColumnOrder
    
	)

	const myTableRef = React.useRef({})

	const moveRow = (dragIndex, hoverIndex) => {
		const dragRecord = records[dragIndex]
		setRecords(
			update(records, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragRecord],
				],
			})
		)
	}
const resetColumnOrder = () => {
	setColumnOrder([])
			console.log('visible Columns have been reset')
		}
	const moveColumns = ({ fromIndex, toIndex }) => {
		if (fromIndex === toIndex) {
			console.log(
				'Error move target is same as start target - no move made',
				fromIndex
			)
			return
		}
		const prevColOrder = visibleColumns.map((cc) => {
			return cc.id
		})

		console.log(
			'Existing visibleColumns ids: ',
			prevColOrder,
			' fromIndex:',
			fromIndex,
			' hoverIndex:',
			toIndex
		)
		if (fromIndex < 0 || toIndex < 0) return // return if not a valid index
		console.log(
			'from index',
			fromIndex,
			'id: ',
			visibleColumns[fromIndex].id,
			' to index: ',
			toIndex,
			'id: ',
			visibleColumns[toIndex].id
		)

		// console.log("prevColOrder: ", prevColOrder);
		var newColOrder = update(prevColOrder, {
			$splice: [
				[fromIndex, 1],
				[toIndex, 0, visibleColumns[fromIndex].id],
			],
		})

		console.log('new visibleColumns are to be: ', newColOrder)
		setColumnOrder(newColOrder)
		console.log('after reorder visibleColumns are', visibleColumns)
	}
	//console.log('getHeaderProps', myTableRef)


	const DragCell = (column, index) => {
		const dropRefCol = React.useRef(null)
		const dragRefCol = React.useRef(null)
		const tbProps = getTableProps
		const dragIndex = index
		// it appears that the columnorder is stored in visible columns when using useColumnReordering Hook
		// const colId = visibleColumns.indexOf(column.id)
		const colIndex = index // using an index obtained from columns but this gives original positions not current display

		// const cloHover=(item,colId)=>{console.log(item,' hovering  over',colId)}

		const [{  isOver, canDropCol }, drop] = useDrop({
      accept: DND_COL_TYPE,
      	collect: (monitor) => ({
          canDropCol: monitor.canDrop,
          isOver:monitor.isOver()
        }),
			hover(item, monitor) {
				// tannerlinsley example for row puts reorder action into hover
				const dragIndex = item.colIndex
				const hoverIndex = colIndex // index of this column
				if (!dragRefCol) return // return if destination not defined
				if (dragIndex === hoverIndex) return // retrun if target is same as start
				// Determine rectangle on screen
				const hoverBoundingRect = dropRefCol.current.getBoundingClientRect()
				// Get horiz middle
				const hoverMiddleX =
					(hoverBoundingRect.right - hoverBoundingRect.left) / 2
				// Determine mouse position
				const clientOffset = monitor.getClientOffset()
				// Get pixels to the top
				const hoverClientX = clientOffset.x - hoverBoundingRect.left
				// Only perform the move when the mouse has crossed half of the items width
				// When dragging downwards, only move when the cursor is below 50%
				// When dragging upwards, only move when the cursor is above 50%
				// Dragging left
				if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
					//console.log('drag right is less than half col' ,dragIndex,'to',hoverIndex)
					return
				}
				// Dragging right
				if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
					// console.log('drag left has not reached halfway yet' ,dragIndex,'to',hoverIndex)
					return
				}
				// Time to actually perform the action
				console.log('item dropped from ', dragIndex, ' to ', hoverIndex)
				var fromColID = visibleColumns[dragIndex].id
				var toColId = visibleColumns[hoverIndex].id
				console.log(
					'moving indexes from ',
					dragIndex,
					fromColID,
					' to',
					hoverIndex,
					toColId
				)
				moveColumns({ fromIndex: dragIndex, toIndex: hoverIndex })
				// Note: we're mutating the monitor item here!
				// Generally it's better to avoid mutations,
				// but it's good here for the sake of performance
				// to avoid expensive index searches.
				item.colIndex = hoverIndex
			},
			//hover(item,monitor,colId){cloHover(item)},

			//   drop: (item )=>{
			//     console.log("item dropped from ",item,dragRefCol.current,' to ' ,colId)
			//     var fromColID = visibleColumns[item.colId].id
			//     var toColId = colId.Id
			//     console.log ('moving indexes to',colId ,toColId, 'from ',item.colId, fromColID)
			//     moveColumns({fromIndex:item.colId,toIndex:colId})

			//  }
		})

//prevent drag on designated cells
//let  isDraggingCol =false // set default pointer false, and reset if dragging
		const [ {isDraggingCol },  drag, preview] = useDrag({
			item: { type: DND_COL_TYPE, colIndex },
			collect: (monitor) => ({
				// isOver: monitor.isOver(),
				isDraggingCol: monitor.isDragging()&& (monitor.getItemType()===DND_COL_TYPE),		   
			}),
    });
  
 
    
		console.log('isDraggingCol, index', isDraggingCol, index)
		// const opacity = isDraggingCol ? 0.3:1
		console.log('isDragging', isDraggingCol)
		const isActive = canDropCol && isDraggingCol && isOver
		console.log(' canDropCol && isDraggingCol && isOver', canDropCol, isDraggingCol, isOver)

		let backgroundColor = ''
		
    
    preview(drop(dropRefCol))
    // only allow drag if column is draggable:
  const isDraggable=column.draggable 
		if( isDraggable ) drag(dragRefCol)
		// const newstyle = {...this.style, backgroundColor: backgroundColor }
		// console.log('this.props', this.props)

		let backColor=''
		if (isDraggingCol&& !canDropCol) {
			backColor = 'red'
    }else
    {backColor=''}

		return (
      <div>
			 <div className='mythDiv' ref={dropRefCol} style={{...styles, backgroundColor: backColor, }}>
				{column.Header}
				<div 
					style={{
						fontStyle: 'italic',
						fontSize: '0.8em',
            fontWeight: 'normal',
            justifySelf:'flex-start'
					}}
				>
					 {isDraggable?"Can Drag":"No Drag"}
				</div>
				<div
					style={{
						fontStyle: 'italic',
						fontSize: '0.8em',
						fontWeight: 'normal',
					}}
				>
					Index: {colIndex} IsOver{isOver}
				</div>
				<div
					ref={dragRefCol}
					type={DND_COL_TYPE}
					// style={styles.colDragHandle}
          className={isDraggable?'colDragHandle colMoveCursor':'colDragHandle' }
          isdraggable={isDraggable}
          disabled= {!isDraggable}
				>
					 {column.draggable?"Can Drag":"No Drag"}'
				</div>
			</div>
      {/* Use column.getResizerProps to hook up the events correctly */}
      <div
       {...column.getResizerProps()}
       className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
        ></div>
       </div>
      
            
)
		
	}

	return (
		<>
			<button onClick={() => moveColumns(2, 3)}>
				Randomly Reorder Columns
			</button>
      <button onClick={() => resetColumnOrder()}>
				Reset Column  Order
			</button>
      <button onClick={resetResizing}>Reset Resizing</button>
			<table
				style={styles}
				{...getTableProps()}
				ref={myTableRef}
				className='table'
			>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							<th />
							{headerGroup.headers.map((column, index) => (
								<th
									{...column.getHeaderProps()}
									noparent={column.parent ? 'true' : null}
								>
									{column.parent
										? column.render(DragCell(column, index))
										: column.render('Header')}
								</th>
							))}
						</tr>
					))}
				</thead>
				{/* <thead>
          
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th />
                {headerGroup.headers.map((column,index) => (
                 <th {...column.getHeaderProps() } 
                dragabble= "true"
                
                 type={DND_COL_TYPE} 
                 >
                 {column.render("Header" ) }
                 </th>
                ))}
             </tr>
             ))} 
          </thead> */}
				<tbody {...getTableBodyProps()}>
					{rows.map(
						(row, index) =>
							prepareRow(row) || (
								<Row
									index={index}
									row={row}
									moveRow={moveRow}
									height='20px'
									{...row.getRowProps()}
								/>
							)
					)}
				</tbody>
			</table>
			<pre>
			
				<p>Table has visible column order of:</p>
        <p>    {visibleColumns.map(item=>item.id).join(',')}</p>
				{/* <code>{JSON.stringify(state, null, 2)}</code> */}
			
			</pre>
		</>
	)
}

const DND_ROW_TYPE = 'row'
const DND_COL_TYPE = 'col'

const Row = ({ row, index, moveRow }) => {
	const dropRefRow = React.useRef(null)
	const dragRefRow = React.useRef(null)

	const [, drop] = useDrop({
		accept: DND_ROW_TYPE,
		hover(item, monitor) {
			if (!dropRefRow.current) {
				return
			}
			const dragIndex = item.index
			const hoverIndex = index
			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return
			}
			// Determine rectangle on screen
			const hoverBoundingRect = dropRefRow.current.getBoundingClientRect()
			// Get vertical middle
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
			// Determine mouse position
			const clientOffset = monitor.getClientOffset()
			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top
			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return
			}
			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return
			}
			// Time to actually perform the action
			moveRow(dragIndex, hoverIndex)
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex
		},
	})

	const [{ isDraggingRow, isOver, canDrop }, drag, preview] = useDrag({
		//console.log('drag index is',index);
		item: { type: DND_ROW_TYPE, index },
		collect: (monitor) => ({
			isDraggingRow: monitor.isDragging () && (monitor.getItemType()===DND_ROW_TYPE),
			isOver: monitor.isOver,
			canDrop: monitor.canDrop,
		}),
	})
	// console.log('dragging', isDragging,dropRefRow,dragRefRow)
	const opacity = isDraggingRow ? 0 : 1

	preview(drop(dropRefRow))
	drag(dragRefRow)

	return (
		<tr ref={dropRefRow} style={{ opacity }}>
			<td ref={dragRefRow} ><div className ='rowDragHandle canDrag'>Drag</div></td>
			{row.cells.map((cell) => {
				return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
			})}
		</tr>
	)
}

// prepare headers
const prepareMyHeaders = (headerGroups) => {
	return headerGroups.map((headerGroup) => {
		let thRow = (
			<tr {...headerGroup.getHeaderGroupProps()}>
				<th />
				{headerGroup.headers.map((column, index) => (
					<th {...column.getHeaderProps()} mycolindex={index}>
						{column.render('Header')}
					</th>
				))}
			</tr>
		)
		console.log('(thRow)', thRow)

		return thRow
	})
}

// console.log('PrepareMyHeaders', prepareMyHeaders)

const TableApp = () => {
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				// Cell: getRowId()
			},
			{
				Header: 'Name',
				columns: [
					{
						Header: 'First Name',
						accessor: 'firstName',
						draggable: true,
					},
					{
						Header: 'Last Name',
						accessor: 'lastName',
						draggable: true,
					},
				],
			},
			{
				Header: 'Info',
				columns: [
					{
						Header: 'Age (draggable)',
						accessor: 'age',
						draggable: true,
					},
					{
						Header: 'Visits (draggable)',
						accessor: 'visits',
						draggable: true,
					},
					{
						Header: 'Status (not draggable)',
						accessor: 'status',
					},
					{
						Header: 'Profile Progress (not draggable)',
						accessor: 'progress',
					},
				],
			},
		],
		[]
	)

	const importdata = React.useMemo(() => makeData(4), [])
	// console.log('importdata ',data)

	// const data= makeData(4)
	const data = importdata.map((row, index) => {
		row.id = index
		return row
	})
	// console.log('data ',data, '/data')

	// let   MyTable=  (columns={columns} ,data={data} )=>Table({columns{columns},data={data}})
	// const printVisCols=MyTable.visibleColumns

	return (
		<DndProvider backend={HTML5Backend}>
			<>
      
       <div className='Notes' >
      <p ><strong>Notes:</strong> <br></br></p>
       <p>An example of React-Table with both Row drag and Column drag based on react table v7 examples found here:.<br></br></p>
        <a  href='https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/column-ordering'>react-table example Column-ordering</a><br></br>
        <a href='https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/row-dnd'>react-table example Row DND</a><br></br>
       <br></br>
        I am not yet happy with styling of column Headers as I wanted the 
        Column drag handle to stay at bottom of cell, but resizing of
        window to a narrower view currently gives a messy layout where the drag handles are not bottom aligned.<br></br>
<br></br>
        It turned out to be a bit tricky to get both row and colun drag playing nicely, but
        by adding drag handles, it seems to play better.
        <br></br><br></br>
        It took a little while to work out as  colum ordering has internal columnOrder state which 
        is not accessible, but was showing in the original React-Table example of column ordering.
        the accesible value is table.visibleColumns.<br></br>
        <br></br>
        ColumnDnd needs an index item for dragging,  For this you must used the visibleColumns
        property to get the column you are dragging, not the original column order.<br></br>
        <br></br>
        Col Drag cursor style is now hooked up and depends on column.draggable property.<br></br>
        React-DND is browser level grabbing, and will so you have to specify which items<br></br>
        can drag - I chose to keep consistent cell styles and change the cursor rather than hide the drag handle.<br></br>
        <br></br>
       <strong>To Do:</strong><br></br> fix Column Resize to example<br></br>
       The grey column resize blocks currently are active, but the drag is being captured by Column Dnd and therefore not working.  Solution hints welcomed

     </div>
				<Table
					// style={styles.Table}
					columns={columns}
					data={data}
					reportVisibleColumns={reportVisibleColumns}
					FlatHeaders={reportFlatHeaders}
				/>
				<p>visible:columns: {reportVisibleColumns}</p>
				<p>FlatHeaders: {reportFlatHeaders}</p>
			</>
		</DndProvider>
	)
}

export default TableApp
