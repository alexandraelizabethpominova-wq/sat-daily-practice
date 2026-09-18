import AlexRichText from '../atoms/AlexRichText'
import type {ReadingTableSpec} from '../../lib/readingTables'

export default function ReadingDataTable({table}:{table:ReadingTableSpec}){
  return <figure className="reading-data-table">
    <figcaption><AlexRichText text={table.title}/></figcaption>
    <div className="reading-data-table-scroll">
      <table>
        <thead><tr>{table.headers.map((header,index)=><th scope="col" key={`header-${index}`}><AlexRichText text={header}/></th>)}</tr></thead>
        <tbody>{table.rows.map((row,rowIndex)=><tr key={`row-${rowIndex}`}>{row.map((cell,columnIndex)=><td key={`cell-${rowIndex}-${columnIndex}`}><AlexRichText text={cell}/></td>)}</tr>)}</tbody>
      </table>
    </div>
  </figure>
}
