import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { QuestionPage } from '../components'
import { parseDifficulty, parseRegion } from '../lib/countries'

const Question: NextPage = () => {
  const router = useRouter()
  const region = parseRegion(router.query.region)
  const difficulty = parseDifficulty(router.query.mode)

  // Old links or a missing region go back to the picker
  useEffect(() => {
    if (router.isReady && !region) router.replace('/')
  }, [router, region])

  if (!router.isReady || !region) return <div className="flex-1" />

  // The key restarts the game if the region or difficulty in the URL changes
  return <QuestionPage key={`${region}-${difficulty}`} region={region} difficulty={difficulty} />
}

export default Question
