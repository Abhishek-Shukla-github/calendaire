import { MeetingType } from "@/types/types"

export type meetingType = {
  loading: boolean,
  data: MeetingType[],
  fn: () => Promise<null>
}