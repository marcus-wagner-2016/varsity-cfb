import { useState, useEffect } from 'react'

function useFeedAPI() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchScoreboard = () => {
      fetch('/espn-api/apis/site/v2/sports/football/college-football/scoreboard?groups=80')
        .then((response) => response.json())
        .then((data) => setData(data))
    }

    fetchScoreboard()
    const interval = setInterval(fetchScoreboard, 30000)
    return () => clearInterval(interval)
  }, [])

  return data
}

export default useFeedAPI
