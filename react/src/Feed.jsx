import { useState } from 'react'
import useFeedAPI from './FeedAPI.jsx'
import './App.css'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const CONFERENCES = {
  '151': 'American',
  '1': 'ACC',
  '4': 'Big 12',
  '5': 'Big Ten',
  '12': 'Conference USA',
  '18': 'FBS Independents',
  '15': 'MAC',
  '17': 'Mountain West',
  '9': 'Pac-12',
  '8': 'SEC',
  '37': 'Sun Belt',
}

function Feed() {
  const data = useFeedAPI()
  const events = data?.events ?? []
  const [conference, setConference] = useState('')

  const visibleEvents = events.filter((event) => {
    const isFinal = event.competitions[0].status.type.completed
    if (isFinal && Date.now() - new Date(event.date).getTime() >= ONE_DAY_MS) return false

    if (!conference) return true
    const competitors = event.competitions[0].competitors
    return competitors.some((c) => c.team.conferenceId === conference)
  })

  const sortedEvents = [...visibleEvents].sort((a, b) => {
    const aFinal = a.competitions[0].status.type.completed
    const bFinal = b.competitions[0].status.type.completed
    if (aFinal !== bFinal) return aFinal ? 1 : -1
    return new Date(a.date) - new Date(b.date)
  })

  return (
    <section id="center">
      <div className="varsity-cfb-header">
        <div className="app-title">
          <h1>Varsity CFB</h1>
        </div>
        <div className="conference-filter">
          <select value={conference} onChange={(e) => setConference(e.target.value)}>
            <option value="">All Conferences</option>
            {Object.entries(CONFERENCES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {data === null && <p>Loading...</p>}
      {sortedEvents.map((event) => {
        const competition = event.competitions[0]
        const home = competition.competitors.find((c) => c.homeAway === 'home')
        const away = competition.competitors.find((c) => c.homeAway === 'away')

        const homeLogo = competition.competitors.find((c) => c.homeAway === 'home').team.logo
        const awayLogo = competition.competitors.find((c) => c.homeAway === 'away').team.logo

        const odds = competition.odds?.[0]
        const spread = odds ? Math.abs(odds.spread) : 0
        const homeIsFavorite = odds?.homeTeamOdds?.favorite

        return (
          <div className="game-score-container" key={event.id}>
            <div className="game-status">
              {competition.status.type.shortDetail}
            </div>

            <div className="team-identity-away">
              <div className="team-logo-name">
                <img width="30" height="30" src={awayLogo} alt="Team Logo" />
                {away.team.location}
                {odds && !homeIsFavorite && spread > 0 && ` -${spread}`}
              </div>

              <div className="team-score">
                {away.score}
              </div>

            </div>


            <div className="team-identity-home">
              <div className="team-logo-name">
                <img width="30" height="30" src={homeLogo} alt="Team Logo" />
                {home.team.location}
                {odds && homeIsFavorite && spread > 0 && ` -${spread}`}
              </div>

              <div className="team-score">
                {home.score}
              </div>
          </div>

            
          </div>
        )
      })}
    </section>
  )
}

export default Feed
