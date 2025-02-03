"use client"

import { useGetCalls } from "@/hooks/useGetCalls"
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "@/hooks/use-toast";

const CallList = ({ type }: { type: 'upcoming' | 'ended' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, isLoading, CallRecordings } = useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([])
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    setLoading(isLoading);
  },[isLoading])

  const { toast } = useToast()

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'You do not have any previous calls';
      case 'recordings':
        return 'You do not have any calls recorded';
      case 'upcoming':
        return 'You do not have any upcoming calls';
      default:
        return '';
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      setLoading(true)
      try {
        const callData = await Promise.all(CallRecordings.map((meeting) => meeting.queryRecordings()))
        const recordings = callData
          .filter(call => call.recordings.length > 0)
          .flatMap(call => call.recordings);

        setRecordings(recordings)
      } catch (e: any) {
        toast({ title: 'There was an error. Try again later.' })
      } finally {
        setLoading(false)
      }
    }

    if (type === 'recordings') fetchRecordings()
  }, [type, CallRecordings])

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (loading || isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {
        calls && calls.length > 0 ? (calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : '/icons/recordings.svg'
            }
            title={(meeting as Call).state?.custom?.description?.substring(0, 26) || (meeting as CallRecording).filename?.substring(0, 26) || 'No description'}
            date={(meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time.toLocaleString()}
            isPreviousMeeting={type === 'ended'}
            buttonIcon={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Download' : 'Start'}
            link={type === 'recordings' ? (meeting as CallRecording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`}
            handleClick={type === 'recordings' ? () => router.push(`${(meeting as CallRecording).url}`) : () => router.push(`/meeting/${(meeting as Call).id}`)}
          />
        ))) : (
          <h1>{noCallsMessage}</h1>
        )
      }
    </div>
  )
}

export default CallList