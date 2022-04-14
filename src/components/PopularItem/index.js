import {Link} from 'react-router-dom'

const PopularItem = props => {
  const {each} = props
  return (
    <li className="popular-item">
      <Link to={`/movies/${each.id}`}>
        <img
          className="popular-poster"
          src={each.posterPath}
          alt={each.title}
        />
      </Link>
    </li>
  )
}
export default PopularItem
