import { useState, useEffect } from 'react'

// In dev, Vite proxies /espn-api past ESPN's bot blocking; real browsers
// can hit the API directly, so production builds skip the proxy.
const ESPN_BASE = import.meta.env.DEV ? '/espn-api' : 'https://site.api.espn.com'

function useFeedAPI() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchScoreboard = () => {
      fetch(`${ESPN_BASE}/apis/site/v2/sports/football/college-football/scoreboard?groups=80`)
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
