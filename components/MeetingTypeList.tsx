'use client'

import Image from "next/image"
import HomeCard from "./HomeCard"
import { useState } from "react"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import ReactDatePicker from "react-datepicker";

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
    if (!values.datetime) {
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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Paste the link here:"
        className="text-center"
        buttonText="Join"
        handleClick={() => {
          router.push(values.link)
        }}
      >
        <Input
          placeholder="Meeting Link..."
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => {
            setValues({ ...values, link: e.target.value })
          }}
        />
      </MeetingModal>

      {
        !callDetails ? (
          <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Schedule a meeting"
            className="text-center"
            buttonText="Start Meeting"
            handleClick={createMeeting}
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-2">Add a Description</label>
              <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => setValues({ ...values, desc: e.target.value })} />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-2">Select data and time</label>
              <ReactDatePicker
                selected={values.datetime}
                onChange={(date) => setValues({ ...values, datetime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
            </div>
          </MeetingModal>
        ) : (
          <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Schedule a meeting"
            className="text-center"
            buttonText="Copy Meeting Link"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink)
              toast({ title: "Link compied" })
            }}
            image="/icons/checked.svg"
            buttonIcon="/icons/copy.svg"
          />
        )
      }
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