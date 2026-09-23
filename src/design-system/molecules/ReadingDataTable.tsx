import AlexRichText from '../atoms/AlexRichText'
import type {ReadingTableSpec} from '../../lib/readingTables'

export default function ReadingDataTable({table}:{table:ReadingTableSpec}){
  const fitClass=table.fitToPane?' reading-data-table--fit':''
  return <figure className={`reading-data-table${fitClass}`}>
    <figcaption><AlexRichText text={table.title}/></figcaption>
    <div className="reading-data-table-scroll">
      <table>
        {table.columnWidths?.length===table.headers.length&&<colgroup>{table.columnWidths.map((width,index)=><col key={`column-${index}`} style={{width}}/>)}</colgroup>}
        <thead><tr>{table.headers.map((header,index)=><th scope="col" key={`header-${index}`}><AlexRichText text={header}/></th>)}</tr></thead>
        <tbody>{table.rows.map((row,rowIndex)=><tr key={`row-${rowIndex}`}>{row.map((cell,columnIndex)=><td key={`cell-${rowIndex}-${columnIndex}`}><AlexRichText text={cell}/></td>)}</tr>)}</tbody>
      </table>
    </div>
  </figure>
}
