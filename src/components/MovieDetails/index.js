import {Component} from 'react'
import {Link} from 'react-router-dom'
// import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import MovieInfo from '../MovieInfo'
import LoadingView from '../LoadingView'
import FailureView from '../FailureView'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'
// import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class MovieDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetails: [],
    similarMovies: [],
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  onClickTryAgain = () => {
    this.getMovieDetails()
  }

  getMovieDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = [data.movie_details].map(each => ({
        // data.movie_details.genres
        // data.movie_details.similar_movies
        //  data.movie_details.spoken_languages
        id: each.id,
        backdropPath: each.backdrop_path,
        budget: each.budget,
        title: each.title,
        overview: each.overview,
        genres: each.genres,
        originalLanguage: each.original_language,
        releaseDate: each.release_date,
        count: each.vote_count,
        rating: each.vote_average,
        runtime: each.runtime,
        posterPath: each.poster_path,
      }))
      const updatedSimilarData = data.movie_details.similar_movies.map(
        each => ({
          id: each.id,
          posterPath: each.poster_path,
          title: each.title,
        }),
      )
      console.log(updatedSimilarData)

      this.setState({
        movieDetails: updatedData,
        similarMovies: updatedSimilarData.slice(0, 6),
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderFailureView = () => (
    <div className="detail-loader">
      <FailureView onClickTryAgain={this.onClickTryAgain} />
    </div>
  )

  renderLoadingView = () => (
    <div className="detail-loader">
      <LoadingView style={{height: '100vh'}} />
    </div>
  )

  renderSuccessView = () => {
    const {movieDetails, similarMovies} = this.state
    return (
      <>
        <div>
          {movieDetails.map(each => (
            <MovieInfo movieInfoDetails={each} key={each.id} />
          ))}
        </div>
        <div className="similar-container">
          <h1 className="more-heading">More Like This</h1>
          <ul className="popular-container">
            {similarMovies.map(each => (
              <Link to={`/movies/${each.id}`}>
                <div className="popular-item" key={each.id}>
                  <img
                    className="popular-poster"
                    src={each.posterPath}
                    alt={each.originalTitle}
                  />
                </div>
              </Link>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-bg-container">
        <Header />
        {this.renderMovies()}
        <Footer />
      </div>
    )
  }
}

export default MovieDetails
