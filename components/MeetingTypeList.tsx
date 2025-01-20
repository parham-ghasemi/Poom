'use client'

import Image from "next/image"
import HomeCard from "./HomeCard"
import { useState } from "react"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "@/hooks/use-toast"

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isInstantMeeting' | 'isJoiningMeeting' | undefined>()
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState<{ datetime: Date, desc: string, link: string }>({
    datetime: new Date(),
    desc: '',
    link: ''
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const { toast } = useToast()

  const createMeeting = async () => {
    if(!values.datetime) {
      toast({ title: "Please select a date and time" })
    }
    if (!client || !user) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create call');

      const startsAt = values.datetime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.desc || 'Instant meeting'

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })

      setCallDetails(call);

      if (!values.desc) {
        router.push(`/meeting/${call.id}`)
      }

      toast({ title: "Meeting Created" })
    } catch (err: any) {
      console.log(err, 'In MEETINGTYPELIST')
      toast({
        title: "Failed to create meeting"
      })
    }
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img='/icons/add-meeting.svg'
        title='New Meeting'
        desc='Start a new meeting'
        color='bg-orange-1'
        onClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img='/icons/schedule.svg'
        title='Schedule Meeting'
        desc='Plan a new meeting'
        color='bg-blue-1'
        onClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        desc='Join a meeting via an invitation link'
        color='bg-purple-1'
        onClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img='/icons/recordings.svg'
        title='View Recordings'
        desc='See your recorded meetings'
        color='bg-yellow-1'
        onClick={() => router.push('/recordings')}
      />

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="start an instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList